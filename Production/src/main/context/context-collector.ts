import { execFile, exec } from 'child_process'
import { promisify } from 'util'
import { clipboard, app } from 'electron'
import { resolveBinary } from '../binary-resolver'
import { DeviceContext } from './context-types'
import { ContextNormalizer } from './context-normalizer'

const execFileAsync = promisify(execFile)
const execAsync = promisify(exec)

export class ContextCollector {
  private static lastCache: { context: DeviceContext; timestamp: number } | null = null
  private static readonly CACHE_TTL_MS = 400

  public static async collect(): Promise<DeviceContext> {
    const now = Date.now()
    if (this.lastCache && now - this.lastCache.timestamp < this.CACHE_TTL_MS) {
      return this.lastCache.context
    }

    let clipboardText = ''
    try {
      clipboardText = clipboard.readText().trim()
    } catch {
      // ignore
    }

    try {
      if (process.platform === 'win32') {
        const exePath = resolveBinary('detect-window.exe')

        if (exePath) {
          const { stdout } = await execFileAsync(exePath, [], { timeout: 1000 })
          if (stdout && stdout.trim()) {
            const match = stdout.match(/\{[\s\S]*\}/)
            if (match) {
              const data = JSON.parse(match[0])
              if (data.ProcessName) {
                const context = ContextNormalizer.normalize({
                  processName: (data.ProcessName || 'Unknown').toLowerCase(),
                  windowTitle: data.MainWindowTitle || '',
                  clipboardText,
                  confidence: 0.95,
                  hwnd: typeof data.Hwnd === 'number' ? data.Hwnd : undefined
                })

                this.lastCache = { context, timestamp: now }
                return context
              }
            }
          }
        }
      } else if (process.platform === 'darwin') {
        // macOS frontmost application query via AppleScript
        const script = `osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'`
        const { stdout } = await execAsync(script, { timeout: 1000 })
        const appName = (stdout || '').trim()
        if (appName) {
          const context = ContextNormalizer.normalize({
            processName: appName.toLowerCase(),
            windowTitle: `${appName} Active Session`,
            clipboardText,
            confidence: 0.9
          })
          this.lastCache = { context, timestamp: now }
          return context
        }
      } else if (process.platform === 'linux') {
        // Linux active window query via xdotool
        const { stdout } = await execAsync('xdotool getwindowfocus getwindowname', { timeout: 1000 })
        const winTitle = (stdout || '').trim()
        if (winTitle) {
          const context = ContextNormalizer.normalize({
            processName: 'desktop',
            windowTitle: winTitle,
            clipboardText,
            confidence: 0.85
          })
          this.lastCache = { context, timestamp: now }
          return context
        }
      }
    } catch {
      // Quiet fallback without spamming console
    }

    const fallback = ContextNormalizer.normalize({
      processName: 'desktop',
      windowTitle: 'Active Workspace',
      clipboardText,
      confidence: 0.5
    })

    this.lastCache = { context: fallback, timestamp: now }
    return fallback
  }

  public static invalidateCache(): void {
    this.lastCache = null
  }
}
