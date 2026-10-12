import { GlobalKeyboardListener, IGlobalKeyEvent } from 'node-global-key-listener'
import { BrowserWindow } from 'electron'
import { resolveBinary } from './binary-resolver'

export type PushToTalkKey = 'ANY ALT' | 'RIGHT ALT' | 'LEFT ALT' | 'RIGHT CTRL' | 'LEFT CTRL' | 'CAPS LOCK' | 'FN' | 'F8'

export class HoldToTalkManager {
  private listener: GlobalKeyboardListener | null = null
  private isHolding = false
  private targetKey = 'RIGHT ALT'
  private mainWindow: BrowserWindow | null = null
  public isListenerReady = false

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
    this.targetKey = (newKey || 'RIGHT ALT').toUpperCase()
    console.log(`[VESPER] Target Push-to-Talk key updated to: ${this.targetKey}`)
  }

  public getTargetKey(): string {
    return this.targetKey
  }

  private isKeyMatch(e: IGlobalKeyEvent): boolean {
    const keyName = (e.name || e.rawKey?.name || '').toUpperCase().trim()
    const target = this.targetKey.toUpperCase().trim()
    const vKey = e.vKey

    // 0. ANY ALT mode (default & recommended): matches any Alt press (Left Alt, Right Alt, AltGr)
    if (target === 'ANY ALT' || target === 'ALT') {
      if (vKey === 165 || vKey === 164 || vKey === 18) return true
      if (keyName.includes('ALT') || keyName.includes('MENU')) return true
    }

    // 1. Direct virtual key code checks (Win32 API standard)
    // 0xA5 = 165 (VK_RMENU / Right Alt), 0x12 = 18 (VK_MENU / Alt)
    if (target === 'RIGHT ALT' || target === 'FN') {
      if (vKey === 165) return true
      if (vKey === 18 && (keyName.includes('RIGHT') || keyName.includes('RALT') || keyName.includes('GR'))) return true
    }
    // 0xA4 = 164 (VK_LMENU / Left Alt)
    if (target === 'LEFT ALT') {
      if (vKey === 164) return true
      if (vKey === 18 && (keyName.includes('LEFT') || keyName.includes('LALT'))) return true
    }
    // 0xA3 = 163 (VK_RCONTROL / Right Ctrl)
    if (target === 'RIGHT CTRL' && (vKey === 163 || (vKey === 17 && keyName.includes('RIGHT')))) return true
    // 0xA2 = 162 (VK_LCONTROL / Left Ctrl)
    if (target === 'LEFT CTRL' && (vKey === 162 || (vKey === 17 && keyName.includes('LEFT')))) return true
    // 0x14 = 20 (VK_CAPITAL / Caps Lock)
    if (target === 'CAPS LOCK' && vKey === 20) return true
    // 0x77 = 119 (VK_F8)
    if (target === 'F8' && vKey === 119) return true

    // 2. Direct string name match
    if (keyName === target) return true
    if (keyName === 'RALT' || keyName === 'RIGHT ALT' || keyName === 'ALT GR') {
      if (target === 'RIGHT ALT' || target === 'FN' || target === 'ANY ALT') return true
    }
    if (keyName === 'LALT' || keyName === 'LEFT ALT') {
      if (target === 'LEFT ALT' || target === 'ANY ALT') return true
    }
    if (keyName.includes('FN') || keyName.includes('FUNCTION')) return true

    return false
  }

  private broadcast(channel: string, ...args: any[]): void {
    try {
      for (const win of BrowserWindow.getAllWindows()) {
        if (!win.isDestroyed()) {
          win.webContents.send(channel, ...args)
        }
      }
    } catch {}
  }

  private initListener(): void {
    try {
      const serverPath = resolveBinary('WinKeyServer.exe')
      console.log(`[VESPER] Initializing GlobalKeyboardListener with serverPath: "${serverPath}"`)

      this.listener = new GlobalKeyboardListener({
        windows: {
          serverPath: serverPath || undefined,
          onError: (errorCode) => {
            console.warn(`[VESPER WinKeyServer] Exited with code: ${errorCode}`)
          },
          onInfo: (info) => {
            console.log(`[VESPER WinKeyServer Info]: ${info}`)
          }
        }
      })

      const attachPromise = this.listener.addListener((e: IGlobalKeyEvent) => {
        // Broadcast key events to all windows for live system diagnostic indicator
        this.broadcast('vesper:key-diagnostic-event', {
          name: e.name,
          state: e.state,
          vKey: e.vKey
        })

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

      if (attachPromise && typeof attachPromise.then === 'function') {
        attachPromise
          .then(() => {
            this.isListenerReady = true
            console.log(`[VESPER] GlobalKeyboardListener hooked successfully. Active key: ${this.targetKey}`)
          })
          .catch((err) => {
            this.isListenerReady = false
            console.error('[VESPER] GlobalKeyboardListener hook attachment error:', err)
          })
      } else {
        this.isListenerReady = true
        console.log(`[VESPER] Hold/Double-tap listening on key: ${this.targetKey}`)
      }
    } catch (err) {
      this.isListenerReady = false
      console.warn('[VESPER] GlobalKeyboardListener init error:', err)
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

  private positionBelowCamera(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      try {
        const { screen } = require('electron')
        const primaryDisplay = screen.getPrimaryDisplay()
        const { bounds } = primaryDisplay
        const currentBounds = this.mainWindow.getBounds()
        const centerX = bounds.x + Math.round((bounds.width - currentBounds.width) / 2)
        this.mainWindow.setPosition(centerX, bounds.y + 12)
      } catch {}
    }
  }

  private triggerHoldStart(): void {
    console.log('[VESPER Main] [REC] Hold-to-Talk recording STARTED (Key down)')
    // Show capsule window WITHOUT stealing focus so user's cursor remains in the target input
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.positionBelowCamera()
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      this.mainWindow.showInactive()
      this.mainWindow.moveTop()
    }
    this.broadcast('vesper:hold-start')
  }

  private triggerHoldEnd(): void {
    console.log('[VESPER Main] [STOP] Hold-to-Talk recording STOPPED (Key released -> Processing speech)')
    this.broadcast('vesper:hold-end')
  }

  private triggerSingleTap(): void {
    console.log('[VESPER Main] [TAP] Single-tap detected')
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.positionBelowCamera()
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      this.mainWindow.showInactive()
      this.mainWindow.moveTop()
    }
    this.broadcast('vesper:single-tap')
  }

  private triggerDoubleTapMode(): void {
    console.log('[VESPER Main] [DOUBLE-TAP] Double-tap persistent mode activated')
    // Double-tap opens persistent overlay with Record, Pause, Stop, Cancel controls
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.positionBelowCamera()
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver')
      this.mainWindow.show()
      this.mainWindow.moveTop()
      this.mainWindow.focus()
    }
    this.broadcast('vesper:double-tap-persistent-mode')
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

