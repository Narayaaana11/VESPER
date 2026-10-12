import { AppCategory, DeviceContext } from './context-types'
import { PrivacyShield } from './privacy-shield'

export class ContextNormalizer {
  private static appMap: Record<string, string> = {
    code: 'VS Code',
    cursor: 'Cursor',
    chrome: 'Google Chrome',
    msedge: 'Microsoft Edge',
    brave: 'Brave Browser',
    firefox: 'Firefox',
    slack: 'Slack',
    teams: 'Microsoft Teams',
    discord: 'Discord',
    outlook: 'Outlook',
    thunderbird: 'Thunderbird',
    notepad: 'Notepad',
    windowsterminal: 'Windows Terminal',
    powershell: 'PowerShell',
    cmd: 'Command Prompt',
    notion: 'Notion',
    sublime_text: 'Sublime Text',
    webstorm: 'WebStorm',
    pycharm: 'PyCharm',
    rider: 'Rider',
    devenv: 'Visual Studio'
  }

  public static formatAppName(rawProcess: string): string {
    const p = (rawProcess || '').toLowerCase().trim()
    return this.appMap[p] || (p ? p.charAt(0).toUpperCase() + p.slice(1) : 'Desktop')
  }

  public static categorize(processName: string, windowTitle: string): AppCategory {
    const p = (processName || '').toLowerCase()
    const title = (windowTitle || '').toLowerCase()

    if (
      ['code', 'cursor', 'webstorm', 'pycharm', 'sublime_text', 'rider', 'devenv'].includes(p) ||
      title.includes('visual studio code') ||
      title.includes('cursor')
    ) {
      return 'code'
    }

    if (['windowsterminal', 'powershell', 'cmd', 'bash'].includes(p)) {
      return 'terminal'
    }

    if (
      ['slack', 'teams', 'discord', 'outlook', 'thunderbird'].includes(p) ||
      title.includes('gmail') ||
      title.includes('inbox') ||
      title.includes('mail') ||
      title.includes('whatsapp') ||
      title.includes('telegram')
    ) {
      return 'communication'
    }

    if (['chrome', 'msedge', 'brave', 'firefox'].includes(p)) {
      if (
        title.includes('github') ||
        title.includes('gitlab') ||
        title.includes('stack overflow') ||
        title.includes('localhost')
      ) {
        return 'code'
      }
      return 'browser'
    }

    if (['notion', 'winword', 'excel', 'powerpnt', 'notepad', 'obsidian'].includes(p)) {
      return 'document'
    }

    return 'general'
  }

  public static extractWorkspaceAndFile(
    category: AppCategory,
    title: string
  ): { workspace?: string; file?: string } {
    if (!title || title.trim().length === 0) return {}

    // Handle VS Code / Cursor title format: "● filename.ext - workspaceName - AppName" or "filename.ext - AppName"
    if (category === 'code') {
      const cleaned = title.replace(/^[●*]\s*/, '').trim()
      const segments = cleaned.split(' - ').map((s) => s.trim())

      if (segments.length >= 3) {
        // [file, workspace, editor]
        return {
          file: segments[0],
          workspace: segments[1]
        }
      } else if (segments.length === 2) {
        return {
          file: segments[0],
          workspace: segments[0].includes('.') ? undefined : segments[0]
        }
      }
    }

    // Handle Document editors
    if (category === 'document') {
      const segments = title.split(' - ').map((s) => s.trim())
      if (segments.length >= 1 && segments[0]) {
        return { file: segments[0] }
      }
    }

    return {}
  }

  public static normalize(raw: {
    processName: string
    windowTitle: string
    clipboardText?: string
    confidence?: number
    hwnd?: number
  }): DeviceContext {
    const activeApp = this.formatAppName(raw.processName)
    const windowTitle = (raw.windowTitle || '').trim()
    const category = this.categorize(raw.processName, windowTitle)
    const { workspace, file } = this.extractWorkspaceAndFile(category, windowTitle)

    const rawContext: DeviceContext = {
      activeApp,
      windowTitle,
      category,
      projectWorkspace: workspace,
      activeFile: file,
      clipboardContent: raw.clipboardText ? raw.clipboardText.slice(0, 500) : undefined,
      timestamp: Date.now(),
      confidence: raw.confidence ?? 0.95,
      hwnd: raw.hwnd,
      sourceInfo: {
        available: true,
        confidence: raw.confidence ?? 0.95,
        timestamp: Date.now(),
        source: 'native_window'
      }
    }

    return PrivacyShield.sanitizeContext(rawContext)
  }
}
