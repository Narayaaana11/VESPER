import { GlobalKeyboardListener, IGlobalKeyEvent } from 'node-global-key-listener'
import { BrowserWindow, app } from 'electron'
import path from 'path'
import fs from 'fs'

export type PushToTalkKey = 'RIGHT ALT' | 'LEFT ALT' | 'RIGHT CTRL' | 'LEFT CTRL' | 'CAPS LOCK' | 'FN' | 'F8'

function resolveWinKeyServer(): string | undefined {
  if (process.platform !== 'win32') return undefined

  try {
    // 1. node_modules in workspace
    const p1 = path.join(process.cwd(), 'node_modules', 'node-global-key-listener', 'bin', 'WinKeyServer.exe')
    if (fs.existsSync(p1)) return p1

    // 2. resolve from module
    const modDir = path.dirname(require.resolve('node-global-key-listener'))
    const p2 = path.join(modDir, '..', 'bin', 'WinKeyServer.exe')
    if (fs.existsSync(p2)) return p2

    // 3. app path
    if (app) {
      const p3 = path.join(app.getAppPath(), 'node_modules', 'node-global-key-listener', 'bin', 'WinKeyServer.exe')
      if (fs.existsSync(p3)) return p3
    }

    // 4. out/bin
    const p4 = path.join(__dirname, '..', '..', 'bin', 'WinKeyServer.exe')
    if (fs.existsSync(p4)) return p4
  } catch (err) {
    console.warn('[QEVRA] resolveWinKeyServer error:', err)
  }
  return undefined
}

export class HoldToTalkManager {
  private listener: GlobalKeyboardListener | null = null
  private isHolding = false
  private targetKey = 'RIGHT ALT'
  private mainWindow: BrowserWindow | null = null

  private lastReleaseTimestamp = 0
  private pressTimestamp = 0
  private holdTimer: NodeJS.Timeout | null = null
  private singleTapTimer: NodeJS.Timeout | null = null
  private isDoubleTapActive = false

  private readonly DOUBLE_TAP_THRESHOLD_MS = 380
  private readonly HOLD_MIN_DURATION_MS = 180

  constructor(mainWindow: BrowserWindow, key = 'RIGHT ALT') {
    this.mainWindow = mainWindow
    this.targetKey = key.toUpperCase()
    this.initListener()
  }

  public setTargetKey(newKey: string): void {
    this.targetKey = newKey.toUpperCase()
  }

  private isKeyMatch(e: IGlobalKeyEvent): boolean {
    const keyName = (e.name || e.rawKey?.name || '').toUpperCase().trim()
    const target = this.targetKey.toUpperCase().trim()
    const vKey = e.vKey

    // 1. Direct virtual key code checks (Win32 API standard)
    // 0xA5 = 165 (VK_RMENU / Right Alt), 0x12 = 18 (VK_MENU / Alt)
    if (target === 'RIGHT ALT' || target === 'FN') {
      if (vKey === 165 || vKey === 18) return true
    }
    // 0xA4 = 164 (VK_LMENU / Left Alt)
    if (target === 'LEFT ALT' && (vKey === 164 || vKey === 18)) return true
    // 0xA3 = 163 (VK_RCONTROL / Right Ctrl)
    if (target === 'RIGHT CTRL' && (vKey === 163 || vKey === 17)) return true
    // 0xA2 = 162 (VK_LCONTROL / Left Ctrl)
    if (target === 'LEFT CTRL' && (vKey === 162 || vKey === 17)) return true
    // 0x14 = 20 (VK_CAPITAL / Caps Lock)
    if (target === 'CAPS LOCK' && vKey === 20) return true
    // 0x77 = 119 (VK_F8)
    if (target === 'F8' && vKey === 119) return true

    // 2. Direct string name match
    if (keyName === target) return true
    if (keyName === 'RALT' || keyName === 'RIGHT ALT' || keyName === 'ALT GR') {
      if (target === 'RIGHT ALT' || target === 'FN') return true
    }
    if (keyName.includes('FN') || keyName.includes('FUNCTION')) return true

    return false
  }

  private initListener(): void {
    try {
      const serverPath = resolveWinKeyServer()
      console.log(`[QEVRA] Initializing GlobalKeyboardListener with serverPath: ${serverPath}`)

      this.listener = new GlobalKeyboardListener({
        windows: serverPath ? { serverPath } : {}
      })

      this.listener.addListener((e: IGlobalKeyEvent) => {
        if (this.isKeyMatch(e)) {
          if (e.state === 'DOWN' && !this.isHolding) {
            this.isHolding = true
            this.handleKeyDown()
          } else if (e.state === 'UP' && this.isHolding) {
            this.isHolding = false
            this.handleKeyUp()
          }
        }
      })
      console.log(`[QEVRA] Hold/Double-tap listening on key: ${this.targetKey}`)
    } catch (err) {
      console.warn('[QEVRA] GlobalKeyboardListener init error:', err)
    }
  }


  private handleKeyDown(): void {
    const now = Date.now()
    this.pressTimestamp = now

    // 1. Check for Double-Tap: two presses within DOUBLE_TAP_THRESHOLD_MS
    if (now - this.lastReleaseTimestamp <= this.DOUBLE_TAP_THRESHOLD_MS) {
      if (this.singleTapTimer) {
        clearTimeout(this.singleTapTimer)
        this.singleTapTimer = null
      }
      if (this.holdTimer) {
        clearTimeout(this.holdTimer)
        this.holdTimer = null
      }
      this.isDoubleTapActive = true
      this.lastReleaseTimestamp = 0
      this.triggerDoubleTapMode()
      return
    }

    this.isDoubleTapActive = false

    // 2. Start Hold Timer: after 120ms of holding down, trigger hold recording
    this.holdTimer = setTimeout(() => {
      if (this.isHolding && !this.isDoubleTapActive) {
        this.triggerHoldStart()
      }
    }, 120)
  }

  private handleKeyUp(): void {
    const now = Date.now()
    const holdDuration = now - this.pressTimestamp

    if (this.holdTimer) {
      clearTimeout(this.holdTimer)
      this.holdTimer = null
    }

    // If we just triggered double-tap, do not end recording on release!
    if (this.isDoubleTapActive) {
      this.isDoubleTapActive = false
      this.lastReleaseTimestamp = 0
      return
    }

    // If held for longer than HOLD_MIN_DURATION_MS, user was holding to talk
    if (holdDuration >= this.HOLD_MIN_DURATION_MS) {
      this.lastReleaseTimestamp = 0
      this.triggerHoldEnd()
    } else {
      // Short tap: record release time to detect potential second tap for double-tap
      this.lastReleaseTimestamp = now
      if (this.singleTapTimer) {
        clearTimeout(this.singleTapTimer)
      }
      this.singleTapTimer = setTimeout(() => {
        this.lastReleaseTimestamp = 0
        this.triggerSingleTap()
      }, this.DOUBLE_TAP_THRESHOLD_MS)
    }
  }

  private triggerHoldStart(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    console.log('[QEVRA Main] [REC] Hold-to-Talk recording STARTED (Key down)')
    // Show window WITHOUT stealing focus so user's cursor remains in the target input
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
    this.mainWindow.showInactive()
    this.mainWindow.moveTop()
    this.mainWindow.webContents.send('qevra:hold-start')
  }

  private triggerHoldEnd(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    console.log('[QEVRA Main] [STOP] Hold-to-Talk recording STOPPED (Key released -> Processing speech)')
    this.mainWindow.webContents.send('qevra:hold-end')
  }

  private triggerSingleTap(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    console.log('[QEVRA Main] [TAP] Single-tap detected')
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
    this.mainWindow.showInactive()
    this.mainWindow.moveTop()
    this.mainWindow.webContents.send('qevra:single-tap')
  }

  private triggerDoubleTapMode(): void {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return

    console.log('[QEVRA Main] [DOUBLE-TAP] Double-tap persistent mode activated')
    // Double-tap opens persistent overlay with Record, Pause, Stop, Cancel controls
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
    this.mainWindow.show()
    this.mainWindow.moveTop()
    this.mainWindow.focus()
    this.mainWindow.webContents.send('qevra:double-tap-persistent-mode')
  }

  public destroy(): void {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer)
      this.holdTimer = null
    }
    if (this.singleTapTimer) {
      clearTimeout(this.singleTapTimer)
      this.singleTapTimer = null
    }
    if (this.listener) {
      try {
        this.listener.kill()
      } catch (err) {
        // ignore
      }
      this.listener = null
    }
  }
}

