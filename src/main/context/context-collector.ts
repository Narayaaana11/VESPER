import { execFile } from 'child_process'
import { promisify } from 'util'
import { clipboard, app } from 'electron'
import { join } from 'path'
import { existsSync } from 'fs'
import { DeviceContext } from './context-types'
import { ContextNormalizer } from './context-normalizer'

const execFileAsync = promisify(execFile)

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
      const appPath = typeof app !== 'undefined' && app.getAppPath ? app.getAppPath() : process.cwd()
      const exePaths = [
        join(appPath, 'src/main/detect-window.exe'),
        join(appPath, 'out/main/detect-window.exe'),
        join(__dirname, 'detect-window.exe'),
        join(__dirname, '../detect-window.exe'),
        join(process.cwd(), 'src/main/detect-window.exe')
      ]

      const exePath = exePaths.find((p) => existsSync(p))

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
