import { describe, it, expect } from 'vitest'
import { ContextRanker } from '../../src/renderer/src/core/context-ranker'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('Context Relevance Ranking & Compression (Phase 5)', () => {
  const codeContext: SystemContext = {
    activeApp: 'VS Code',
    windowTitle: 'intentClassifier.ts - VESPER',
    detectedCategory: 'code',
    clipboardContent: 'console.log("debug")'
  }

  it('ranks terminal error and active file highest for coding/debug requests', () => {
    const pkg = ContextRanker.rankAndCompress(
      'Why is this failing with a 401 error?',
      codeContext,
      {
        project: 'VESPER',
        currentFile: 'src/main/auth.ts',
        terminalError: '401 Unauthorized: Invalid API token'
      }
    )

    expect(pkg.confidence).toBeGreaterThan(0.85)
    expect(pkg.rankedItems.length).toBeGreaterThanOrEqual(3)

    const terminalItem = pkg.rankedItems.find((i) => i.id === 'terminal_error')
    expect(terminalItem).toBeDefined()
    expect(terminalItem!.relevanceScore).toBeGreaterThanOrEqual(0.95)

    const fileItem = pkg.rankedItems.find((i) => i.id === 'active_file')
    expect(fileItem).toBeDefined()
    expect(fileItem!.relevanceScore).toBeGreaterThanOrEqual(0.95)

    expect(pkg.compactSummary).toContain('Active Code File')
    expect(pkg.compactSummary).toContain('Recent Terminal Error')
    expect(pkg.selectionReason).toBeDefined()
  })

  it('ranks clipboard text highest for selection transformation requests', () => {
    const emailContext: SystemContext = {
      activeApp: 'Gmail',
      windowTitle: 'Compose - meeting update',
      detectedCategory: 'communication',
      clipboardContent: 'hey guys i cant make it today sorry'
    }

    const pkg = ContextRanker.rankAndCompress(
      'Make this professional',
      emailContext
    )

    const clipItem = pkg.rankedItems.find((i) => i.id === 'clipboard')
    expect(clipItem).toBeDefined()
    expect(clipItem!.relevanceScore).toBeGreaterThanOrEqual(0.95)
    expect(pkg.compactSummary).toContain('Clipboard Selection')
  })
})
