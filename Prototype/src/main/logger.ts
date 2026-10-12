/**
 * VESPER Central Terminal Logger
 * Formats every log message with high-resolution timestamps [HH:mm:ss.SSS]
 * and cleans ASCII/mojibake formatting for pristine terminal output.
 */

export function getTimestamp(): string {
  const d = new Date()
  const hours = String(d.getHours()).padStart(2, '0')
  const mins = String(d.getMinutes()).padStart(2, '0')
  const secs = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hours}:${mins}:${secs}.${ms}`
}

export function sanitizeLogText(msg: any): any {
  if (typeof msg !== 'string') return msg

  return msg
    // Clean Windows mojibake & corrupted emoji encodings
    .replace(/ƒôÀ/g, '[SCREEN]')
    .replace(/ƒÄÖ´©Å/g, '[REC]')
    .replace(/ƒøæ/g, '[STOP]')
    .replace(/Ô£ô/g, '[OK]')
    .replace(/ÔÜí/g, '[EXEC]')
    .replace(/Ôîÿ/g, '')
    .replace(/Ôùç/g, '*')
    .replace(/Ôîü/g, '*')
    // Replace raw unicode emojis with clean ASCII brackets to prevent Windows console corruption
    .replace(/📷/g, '[SCREEN]')
    .replace(/🎙️/g, '[REC]')
    .replace(/🛑/g, '[STOP]')
    .replace(/✓/g, '[OK]')
    .replace(/⚡/g, '[EXEC]')
    .replace(/📋/g, '[CLIPBOARD]')
    .replace(/👆/g, '[TAP]')
    .replace(/🔁/g, '[DOUBLE-TAP]')
    .replace(/💡/g, '[QUERY]')
    .replace(/⚠️/g, '[WARN]')
    .replace(/❌/g, '[FAIL]')
    .replace(/🔗/g, '[CHAIN]')
    .replace(/%c/g, '')
}

export class AppLogger {
  private static isInitialized = false

  public static initialize(): void {
    if (this.isInitialized) return
    this.isInitialized = true

    // Disable Electron security warning spam in dev console
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    const originalInfo = console.info

    console.log = (...args: any[]) => {
      const ts = `\x1b[90m[${getTimestamp()}]\x1b[0m`
      const cleaned = args.map(sanitizeLogText)
      originalLog.apply(console, [ts, ...cleaned])
    }

    console.warn = (...args: any[]) => {
      const ts = `\x1b[90m[${getTimestamp()}]\x1b[0m \x1b[33m[WARN]\x1b[0m`
      const cleaned = args.map(sanitizeLogText)
      originalWarn.apply(console, [ts, ...cleaned])
    }

    console.error = (...args: any[]) => {
      const ts = `\x1b[90m[${getTimestamp()}]\x1b[0m \x1b[31m[ERROR]\x1b[0m`
      const cleaned = args.map(sanitizeLogText)
      originalError.apply(console, [ts, ...cleaned])
    }

    console.info = (...args: any[]) => {
      const ts = `\x1b[90m[${getTimestamp()}]\x1b[0m \x1b[36m[INFO]\x1b[0m`
      const cleaned = args.map(sanitizeLogText)
      originalInfo.apply(console, [ts, ...cleaned])
    }

    console.log('\x1b[35m[VESPER Logger]\x1b[0m High-resolution timestamp logging initialized')
  }

  public static attachWindow(window: Electron.BrowserWindow, windowName: 'Capsule' | 'Dashboard'): void {
    window.webContents.on('console-message', (_event, level, message) => {
      // Filter out internal Chromium/Vite noise and uninformative debug spam
      if (
        message.includes('Download the React DevTools') ||
        message.includes('Autofill.enable') ||
        message.includes('was loaded over HTTPS') ||
        message.includes('Electron Security Warning') ||
        message.includes('[vite] connecting') ||
        message.includes('[vite] connected') ||
        message.includes('[DEBUG] [VESPER Recording Metrics]') ||
        message.includes('Saved raw audio for playback: undefined')
      ) {
        return
      }

      const prefix = `\x1b[34m[${windowName}]\x1b[0m`
      const cleaned = sanitizeLogText(message)

      if (level === 3) {
        console.error(`${prefix} ${cleaned}`)
      } else if (level === 2) {
        console.warn(`${prefix} ${cleaned}`)
      } else {
        console.log(`${prefix} ${cleaned}`)
      }
    })
  }
}
