import { SystemContext } from '../types/task'

export interface ContextItem {
  id: string
  type: 'app' | 'window' | 'clipboard' | 'file' | 'terminal_error' | 'git_diff' | 'screen_ocr' | 'memory'
  title: string
  content: string
  relevanceScore: number // 0.0 to 1.0
  source: string
}

export interface CompressedContextPackage {
  currentApp: string
  windowTitle: string
  project?: string
  currentFile?: string
  recentError?: string
  confidence: number // 0.0 to 1.0
  rankedItems: ContextItem[]
  compactSummary: string
  selectionReason: string
}

export class ContextRanker {
  /**
   * Ranks and compresses available context relative to user prompt and intent
   */
  public static rankAndCompress(
    prompt: string,
    context: SystemContext,
    extraContext?: {
      project?: string
      currentFile?: string
      terminalError?: string
      gitDiff?: string
      screenText?: string
      memorySnippets?: string[]
    }
  ): CompressedContextPackage {
    const p = prompt.toLowerCase()
    const app = context.activeApp.toLowerCase()
    const title = context.windowTitle.toLowerCase()
    const cat = context.detectedCategory

    const items: ContextItem[] = []

    // 1. Active Application (Always baseline anchor)
    items.push({
      id: 'active_app',
      type: 'app',
      title: context.activeApp,
      content: `${context.activeApp} (${context.windowTitle})`,
      relevanceScore: 1.0,
      source: 'Windows OS API'
    })

    // 2. Active Window
    items.push({
      id: 'active_window',
      type: 'window',
      title: context.windowTitle,
      content: context.windowTitle,
      relevanceScore: 0.95,
      source: 'detect-window.exe'
    })

    // 3. Clipboard Context
    if (context.clipboardContent && context.clipboardContent.trim().length > 0) {
      const clip = context.clipboardContent.trim()
      let clipScore = 0.5
      // If user asks to transform, rewrite, fix, or summarize
      if (
        p.includes('this') ||
        p.includes('make this') ||
        p.includes('summarize') ||
        p.includes('rewrite') ||
        p.includes('fix') ||
        p.includes('clean') ||
        p.includes('translate')
      ) {
        clipScore = 0.96
      } else if (p.split(/\s+/).some((w) => w.length > 3 && clip.toLowerCase().includes(w))) {
        clipScore = 0.82
      } else if (clip.length > 500) {
        clipScore = 0.35
      }

      items.push({
        id: 'clipboard',
        type: 'clipboard',
        title: 'Clipboard Selection',
        content: clip.length > 400 ? `${clip.substring(0, 400)}...` : clip,
        relevanceScore: clipScore,
        source: 'System Clipboard'
      })
    }

    // 4. Developer context (Active File, Terminal Error, Git Diff)
    const isCodingIntent =
      cat === 'code' ||
      app.includes('code') ||
      app.includes('cursor') ||
      p.includes('error') ||
      p.includes('bug') ||
      p.includes('fail') ||
      p.includes('test') ||
      p.includes('function')

    const activeFile = extraContext?.currentFile || context.currentFile
    if (activeFile) {
      items.push({
        id: 'active_file',
        type: 'file',
        title: 'Active Code File',
        content: activeFile,
        relevanceScore: isCodingIntent ? 0.98 : 0.4,
        source: 'IDE Workspace'
      })
    }

    const terminalErr = extraContext?.terminalError || context.terminalError
    if (terminalErr) {
      const errScore = p.includes('error') || p.includes('fail') || p.includes('why') || p.includes('fix') ? 0.99 : 0.75
      items.push({
        id: 'terminal_error',
        type: 'terminal_error',
        title: 'Recent Terminal Error',
        content: terminalErr,
        relevanceScore: errScore,
        source: 'Terminal Output'
      })
    }

    const gitDiff = extraContext?.gitDiff || context.gitDiff
    if (gitDiff) {
      const gitScore = p.includes('change') || p.includes('diff') || p.includes('commit') || p.includes('broke') ? 0.92 : 0.6
      items.push({
        id: 'git_diff',
        type: 'git_diff',
        title: 'Recent Git Changes',
        content: gitDiff,
        relevanceScore: gitScore,
        source: 'Git VCS'
      })
    }

    // 5. Screen OCR / Visible Text
    if (extraContext?.screenText && extraContext.screenText.trim().length > 0) {
      let screenScore = 0.55
      if (p.includes('screen') || p.includes('look at') || p.includes('see this') || p.includes('page')) {
        screenScore = 0.94
      }
      items.push({
        id: 'screen_ocr',
        type: 'screen_ocr',
        title: 'Visible Screen Text',
        content: extraContext.screenText.substring(0, 300),
        relevanceScore: screenScore,
        source: 'Screen Agent OCR'
      })
    }

    // Sort descending by relevance score
    items.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Filter out low-relevance noise (< 0.25)
    const filteredItems = items.filter((item) => item.relevanceScore >= 0.25)

    // Compute overall confidence score
    const topScores = filteredItems.slice(0, 3).map((i) => i.relevanceScore)
    const confidence = topScores.length > 0 ? topScores.reduce((acc, s) => acc + s, 0) / topScores.length : 0.85

    // Build compact text summary for LLM prompt package
    const summaryLines: string[] = [
      `Application: ${context.activeApp} (${context.windowTitle}) [Score: 1.0]`
    ]

    for (const item of filteredItems) {
      if (item.id !== 'active_app' && item.id !== 'active_window') {
        summaryLines.push(`${item.title}: ${item.content.replace(/\n+/g, ' ')} [Score: ${item.relevanceScore.toFixed(2)}]`)
      }
    }

    const selectionReason = `Prioritized ${filteredItems[0]?.title || context.activeApp} (relevance: ${(
      (filteredItems[0]?.relevanceScore || 1) * 100
    ).toFixed(0)}%) based on active window focus and matching prompt keywords.`

    return {
      currentApp: context.activeApp,
      windowTitle: context.windowTitle,
      project: extraContext?.project,
      currentFile: extraContext?.currentFile,
      recentError: extraContext?.terminalError,
      confidence: parseFloat(confidence.toFixed(2)),
      rankedItems: filteredItems,
      compactSummary: summaryLines.join('\n'),
      selectionReason
    }
  }
}
