import { execFile } from 'child_process'
import { promisify } from 'util'
import { clipboard, app } from 'electron'
import { resolveBinary } from './binary-resolver'

const execFileAsync = promisify(execFile)

export interface SystemContext {
  activeApp: string
  windowTitle: string
  clipboardContent?: string
  detectedCategory: 'code' | 'communication' | 'browser' | 'document' | 'general'
  hwnd?: number
}

let lastContextCache: { context: SystemContext; timestamp: number } | null = null
const CACHE_TTL_MS = 400

/**
 * Ultra-fast native Windows foreground window detector (80ms latency)
 */
export async function getActiveWindowContext(): Promise<SystemContext> {
  const now = Date.now()
  if (lastContextCache && now - lastContextCache.timestamp < CACHE_TTL_MS) {
    return lastContextCache.context
  }

  let clipboardText = ''
  try {
    clipboardText = clipboard.readText().trim()
  } catch (e) {
    // ignore
  }

  try {
    const exePath = resolveBinary('detect-window.exe')

    if (exePath) {
      const { stdout } = await execFileAsync(exePath, [], { timeout: 1000 })

      if (stdout && stdout.trim()) {
        const match = stdout.match(/\{[\s\S]*\}/)
        if (match) {
          const data = JSON.parse(match[0])
          if (data.ProcessName) {
            const processName = (data.ProcessName || 'Unknown').toLowerCase()
            const windowTitle = data.MainWindowTitle || ''

            const result: SystemContext = {
              activeApp: formatAppName(processName),
              windowTitle,
              clipboardContent: clipboardText.length > 0 ? clipboardText.slice(0, 1000) : undefined,
              detectedCategory: categorizeProcess(processName, windowTitle),
              hwnd: typeof data.Hwnd === 'number' ? data.Hwnd : undefined
            }
            lastContextCache = { context: result, timestamp: now }
            return result
          }
        }
      }
    }
  } catch (err) {
    // Quiet fallback without spamming console
  }

  const fallback: SystemContext = {
    activeApp: 'Desktop',
    windowTitle: 'Active Workspace',
    clipboardContent: clipboardText.length > 0 ? clipboardText.slice(0, 1000) : undefined,
    detectedCategory: 'general'
  }
  lastContextCache = { context: fallback, timestamp: now }
  return fallback
}

function formatAppName(processName: string): string {
  const map: Record<string, string> = {
    code: 'VS Code',
    cursor: 'Cursor',
    chrome: 'Google Chrome',
    msedge: 'Microsoft Edge',
    brave: 'Brave Browser',
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
    pycharm: 'PyCharm'
  }
  return map[processName] || (processName.charAt(0).toUpperCase() + processName.slice(1))
}

function categorizeProcess(processName: string, windowTitle: string): SystemContext['detectedCategory'] {
  const p = processName.toLowerCase()
  const title = windowTitle.toLowerCase()

  if (['code', 'cursor', 'webstorm', 'pycharm', 'sublime_text', 'windowsterminal', 'powershell', 'cmd'].includes(p)) {
    return 'code'
  }
  if (['slack', 'teams', 'discord', 'outlook', 'thunderbird'].includes(p) || title.includes('gmail') || title.includes('inbox') || title.includes('mail')) {
    return 'communication'
  }
  if (['chrome', 'msedge', 'brave', 'firefox'].includes(p)) {
    if (title.includes('github') || title.includes('gitlab') || title.includes('stack overflow')) {
      return 'code'
    }
    return 'browser'
  }
  if (['notion', 'winword', 'excel', 'powerpnt', 'notepad'].includes(p)) {
    return 'document'
  }
  return 'general'
}
