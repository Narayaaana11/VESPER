import { ipcMain, BrowserWindow, app, desktopCapturer } from 'electron'
import { getActiveWindowContext } from './context-detector'
import { executeAction } from './action-executor'
import { registerGlobalShortcuts } from './hotkey'
import { getHoldToTalkManager, showDashboard, hideDashboard, getDashboardWindow, getCapsuleWindow } from './index'
import fs from 'fs'
import path from 'path'

export interface AppSettings {
  hotkey: string
  holdKey?: string
  aiProvider: 'local' | 'groq' | 'ollama' | 'openai' | 'anthropic' | 'gemini'
  ollamaModel: string
  ollamaEndpoint: string
  apiKey: string
  whisperModel?: 'whisper-large-v3' | 'whisper-large-v3-turbo'
  whisperLanguage?: string
  dictationMode?: 'direct' | 'smart_assistant'
  aiPolishing?: boolean
  englishLettersOnly?: boolean
  autoPaste: boolean
  soundFeedback: boolean
  privacyMode: 'strict_local' | 'hybrid' | 'cloud_allowed'
}

function getSettingsFilePath(): string {
  try {
    return path.join(app.getPath('userData'), 'qevra-settings.json')
  } catch {
    // Fallback if app is not ready yet
    const baseDir = process.env.APPDATA || process.env.HOME || process.cwd()
    return path.join(baseDir, '.qevra', 'qevra-settings.json')
  }
}

function loadPersistedSettings(): AppSettings {
  let envKey = process.env.GROQ_API_KEY || ''
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      const match = envContent.match(/GROQ_API_KEY\s*=\s*(["']?)([^"'\r\n]+)\1/)
      if (match && match[2] && match[2].trim()) {
        envKey = match[2].trim()
      }
    }
  } catch (e) {}

  const defaults: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'groq',
    whisperModel: 'whisper-large-v3',
    whisperLanguage: 'auto',
    dictationMode: 'direct',
    aiPolishing: true,
    englishLettersOnly: true,
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: envKey,
    autoPaste: true,
    soundFeedback: true,
    privacyMode: 'strict_local'
  }

  try {
    const filePath = getSettingsFilePath()
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      const merged = { ...defaults, ...data }
      if (!merged.apiKey || !merged.apiKey.trim()) {
        merged.apiKey = envKey
      }
      return merged
    }
  } catch (err) {
    console.warn('[QEVRA] Failed to load persisted settings:', err)
  }

  return defaults
}

function savePersistedSettings(settings: AppSettings): void {
  try {
    const filePath = getSettingsFilePath()
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[QEVRA] Failed to save settings to disk:', err)
  }
}

import { ContextManager } from './context/context-manager'
import { ContextStore } from './context/context-store'
import { PrivacyShield } from './context/privacy-shield'

let currentSettings: AppSettings = loadPersistedSettings()

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  // 1. Get live active window context via Central Context Engine
  ipcMain.handle('qevra:get-context', async () => {
    return await ContextManager.getInstance().getCurrentContext()
  })

  // 1b. Query context history, project context & chaining matches
  ipcMain.handle('qevra:query-context', async (_, query) => {
    return await ContextManager.getInstance().queryContext(query)
  })

  // 1c. Record created/completed task in SQLite context store
  ipcMain.handle('qevra:record-task', async (_, task) => {
    ContextManager.getInstance().recordTask(task)
    return { success: true }
  })

  // 1d. Pre-flight context revalidation before action execution
  ipcMain.handle('qevra:revalidate-context', async (_, targetContext) => {
    return await ContextManager.getInstance().revalidateBeforeAction(targetContext)
  })

  // 1e. Clear context history upon user request
  ipcMain.handle('qevra:clear-context', async () => {
    ContextStore.getInstance().pruneOldRecords(0)
    return { success: true }
  })

  // 1f. Get context store metrics and statistics for verification & audit
  ipcMain.handle('qevra:get-context-stats', async () => {
    return ContextStore.getInstance().getStats()
  })

  // 1g. Get recent events for audit inspection
  ipcMain.handle('qevra:get-context-events', async (_, limit = 20) => {
    return ContextStore.getInstance().getRecentEvents(limit)
  })

  // 1h. Toggle context collection pause (Phase K)
  ipcMain.handle('qevra:pause-context', async (_, paused: boolean) => {
    PrivacyShield.setPaused(paused)
    return { success: true, isPaused: PrivacyShield.isPaused() }
  })

  // 1i. Set user privacy exclusions (apps, folders, domains)
  ipcMain.handle('qevra:set-privacy-exclusions', async (_, payload: { apps?: string[]; folders?: string[]; domains?: string[] }) => {
    if (payload.apps) PrivacyShield.setExclusions(payload.apps)
    if (payload.folders) PrivacyShield.setExcludedFolders(payload.folders)
    if (payload.domains) PrivacyShield.setExcludedDomains(payload.domains)
    return {
      success: true,
      exclusions: {
        apps: PrivacyShield.getExclusions(),
        folders: PrivacyShield.getExcludedFolders(),
        domains: PrivacyShield.getExcludedDomains()
      }
    }
  })

  // 1j. Get privacy status
  ipcMain.handle('qevra:get-privacy-status', async () => {
    return {
      isPaused: PrivacyShield.isPaused(),
      excludedApps: PrivacyShield.getExclusions(),
      excludedFolders: PrivacyShield.getExcludedFolders(),
      excludedDomains: PrivacyShield.getExcludedDomains()
    }
  })

  // 1k. Ambient context search (Littlebird search_user_context parity)
  ipcMain.handle('qevra:search-user-context', async (_, options) => {
    return ContextManager.getInstance().searchUserContext(options)
  })

  // 1l. Day reconstruction (Littlebird day-reconstructor routine parity)
  ipcMain.handle('qevra:get-day-reconstruction', async (_, targetDateMs) => {
    return ContextManager.getInstance().getDayReconstruction(targetDateMs)
  })

  // 1m. Ambient screen tracking status & control (Screenpipe/Littlebird parity)
  ipcMain.handle('qevra:get-screen-tracking-status', async () => {
    return {
      enabled: ContextManager.getInstance().isScreenTrackerEnabled(),
      recentActivities: ContextManager.getInstance().getScreenActivities(20)
    }
  })

  ipcMain.handle('qevra:toggle-screen-tracking', async (_, enable?: boolean) => {
    const isEnabled = ContextManager.getInstance().toggleScreenTracker(enable)
    return {
      enabled: isEnabled,
      recentActivities: ContextManager.getInstance().getScreenActivities(20)
    }
  })

  ipcMain.handle('qevra:get-recent-screen-activities', async (_, limit = 20) => {
    return ContextManager.getInstance().getScreenActivities(limit)
  })

  // 2. Execute target action (paste into active window or clipboard with pre-flight check)
  ipcMain.handle('qevra:execute-action', async (_, { content, autoPaste, targetContext }) => {
    const result = await executeAction(content, autoPaste, targetContext)
    return result
  })

  // 3. Window sizing and visibility management
  ipcMain.on('qevra:resize-window', (event, { width, height }: { width: number; height: number }) => {
    const targetWin = BrowserWindow.fromWebContents(event.sender) || getCapsuleWindow() || mainWindow
    if (targetWin && !targetWin.isDestroyed()) {
      const targetW = Math.round(width)
      const targetH = Math.round(height)
      const currentBounds = targetWin.getBounds()

      if (currentBounds.width === targetW && currentBounds.height === targetH) {
        return
      }

      // Preserve window position where the user dragged it, clamping to screen workArea
      const { screen } = require('electron')
      const display = screen.getDisplayNearestPoint({ x: currentBounds.x, y: currentBounds.y })
      const { workArea } = display

      let newX = currentBounds.x
      let newY = currentBounds.y

      if (targetW > 700) {
        // Center large dashboard smoothly on display workArea
        newX = Math.round(workArea.x + (workArea.width - targetW) / 2)
        newY = Math.round(workArea.y + (workArea.height - targetH) / 2)
      } else {
        // If returning from dashboard to compact pill, position at top center
        if (currentBounds.width > 700) {
          newX = Math.round(workArea.x + (workArea.width - targetW) / 2)
          newY = workArea.y + 45
        } else {
          if (newX + targetW > workArea.x + workArea.width) {
            newX = Math.max(workArea.x, workArea.x + workArea.width - targetW - 10)
          }
          if (newY + targetH > workArea.y + workArea.height) {
            newY = Math.max(workArea.y, workArea.y + workArea.height - targetH - 10)
          }
        }
      }

      targetWin.setBounds({
        x: newX,
        y: newY,
        width: targetW,
        height: targetH
      })
    }
  })

  ipcMain.on('qevra:hide-hud', () => {
    const capsule = getCapsuleWindow()
    if (capsule && !capsule.isDestroyed()) {
      capsule.hide()
    }
  })

  ipcMain.on('qevra:minimize-hud', (event) => {
    const targetWin = BrowserWindow.fromWebContents(event.sender) || mainWindow
    if (targetWin && !targetWin.isDestroyed()) {
      targetWin.minimize()
    }
  })

  ipcMain.on('qevra:show-dashboard', () => {
    showDashboard()
  })

  ipcMain.on('qevra:hide-dashboard', () => {
    hideDashboard()
  })

  ipcMain.on('qevra:quit-app', () => {
    (app as any).isQuitting = true
    app.quit()
  })

  // 4. Settings read/write
  ipcMain.handle('qevra:get-settings', () => {
    return currentSettings
  })

  ipcMain.handle('qevra:save-settings', (_, newSettings: Partial<AppSettings>) => {
    currentSettings = { ...currentSettings, ...newSettings }
    savePersistedSettings(currentSettings)

    if (newSettings.holdKey) {
      getHoldToTalkManager()?.setTargetKey(newSettings.holdKey)
    }
    if (newSettings.hotkey) {
      registerGlobalShortcuts(newSettings.hotkey, () => {
        const capsule = getCapsuleWindow()
        if (capsule && !capsule.isDestroyed()) {
          if (capsule.isVisible()) {
            capsule.webContents.send('qevra:hotkey-triggered')
          } else {
            capsule.setAlwaysOnTop(true, 'screen-saver')
            capsule.show()
            capsule.moveTop()
            capsule.webContents.send('qevra:hotkey-triggered')
          }
        }
      })
    }
    return currentSettings
  })

  // 5. Capture screen thumbnail for Multimodal AI Screen Agent
  ipcMain.handle('qevra:capture-screen', async () => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1280, height: 720 }
      })
      if (sources.length > 0) {
        return sources[0].thumbnail.toDataURL()
      }
    } catch (err) {
      console.warn('[QEVRA Vision] Screen capture error:', err)
    }
    return null
  })

  // 6. Save raw debug audio recording for inspection
  ipcMain.handle('qevra:save-debug-recording', async (_, { base64Data, filename }: { base64Data: string; filename?: string }) => {
    try {
      const debugDir = path.join(process.cwd(), 'debug-recordings')
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true })
      }
      const fname = filename || `recording-${Date.now()}.webm`
      const targetPath = path.join(debugDir, fname)
      const buffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(targetPath, buffer)
      console.log(`[DEBUG REC] Raw audio saved: ${fname} (${buffer.length} bytes)`)
      return { success: true, path: targetPath }
    } catch (err: any) {
      console.warn('[DEBUG REC] Failed to save debug recording:', err)
      return { success: false, error: err.message }
    }
  })
}
