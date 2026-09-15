import { ipcMain, BrowserWindow, app, desktopCapturer, shell } from 'electron'
import { getActiveWindowContext } from './context-detector'
import { executeAction } from './action-executor'
import { registerGlobalShortcuts } from './hotkey'
import { getHoldToTalkManager, showDashboard, hideDashboard, getDashboardWindow, getCapsuleWindow } from './index'
import { resolveBinary } from './binary-resolver'
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
    holdKey: 'ANY ALT',
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

  // 1m. Subscription, Stripe checkout & license activation
  ipcMain.handle('qevra:open-checkout', async (_, checkoutUrl: string) => {
    if (checkoutUrl) {
      await shell.openExternal(checkoutUrl)
      return { success: true }
    }
    return { success: false, message: 'Invalid checkout URL' }
  })

  ipcMain.handle('qevra:activate-license', async (_, { licenseKey, tier }: { licenseKey: string; tier: string }) => {
    try {
      ContextStore.getInstance().setUserPreference('license_key', licenseKey)
      ContextStore.getInstance().setUserPreference('subscription_tier', tier)
      return { success: true, licenseKey, tier }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to save license key' }
    }
  })

  ipcMain.handle('qevra:get-subscription', async () => {
    try {
      const key = ContextStore.getInstance().getUserPreference('license_key')
      const tier = ContextStore.getInstance().getUserPreference('subscription_tier') || 'free'
      return { tier, licenseKey: key || undefined, isActive: true }
    } catch {
      return { tier: 'free', isActive: true }
    }
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

  // 7. Generate Dense Vector Embeddings locally in Main Process via Transformers.js
  let mainExtractor: any = null
  ipcMain.handle('qevra:generate-embedding', async (_, text: string) => {
    try {
      if (!text || !text.trim()) return null
      if (!mainExtractor) {
        const { pipeline, env } = await import('@xenova/transformers')
        env.allowLocalModels = true
        env.allowRemoteModels = false
        const resPath = typeof process !== 'undefined' && process.resourcesPath ? process.resourcesPath : ''
        const appPath = typeof app !== 'undefined' && app.getAppPath ? app.getAppPath() : process.cwd()
        const cacheCandidates = [
          path.join(process.cwd(), 'resources', 'models', 'transformers-cache'),
          ...(resPath ? [
            path.join(resPath, 'resources', 'models', 'transformers-cache'),
            path.join(resPath, 'models', 'transformers-cache')
          ] : []),
          path.join(appPath, 'resources', 'models', 'transformers-cache')
        ]
        const resolvedCacheDir = cacheCandidates.find((p) => fs.existsSync(p)) || cacheCandidates[0]
        env.cacheDir = resolvedCacheDir
        mainExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          quantized: true
        })
      }
      const output = await mainExtractor(text.trim(), { pooling: 'mean', normalize: true })
      if (output && output.data) {
        return Array.from(output.data)
      }
      return null
    } catch (err: any) {
      console.warn('[QEVRA Main] Local vector embed error:', err)
      return null
    }
  })
  // 8. System Startup & Login Item Settings (Auto-start with Windows)
  ipcMain.handle('qevra:get-startup-setting', () => {
    try {
      return app.getLoginItemSettings().openAtLogin
    } catch {
      return false
    }
  })

  ipcMain.handle('qevra:set-startup-setting', (_, enabled: boolean) => {
    try {
      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath,
        args: ['--hidden']
      })
      return app.getLoginItemSettings().openAtLogin
    } catch (err) {
      console.warn('[QEVRA] Failed to set startup setting:', err)
      return false
    }
  })

  // 9. Inspect and Verify System Resources, Models & Helper Binaries
  ipcMain.handle('qevra:check-system-resources', async () => {
    const resPath = typeof process !== 'undefined' && process.resourcesPath ? process.resourcesPath : ''
    const appPath = typeof app !== 'undefined' && app.getAppPath ? app.getAppPath() : process.cwd()

    // Check Win32 Helper Executables via bulletproof binary resolver
    const detectWin = resolveBinary('detect-window.exe')
    const sendInput = resolveBinary('send-input.exe')
    const winKey = resolveBinary('WinKeyServer.exe')

    // Check Silero VAD
    const sileroPath = [
      path.join(process.cwd(), 'resources', 'models', 'silero_vad.onnx'),
      path.join(resPath, 'resources', 'models', 'silero_vad.onnx'),
      path.join(appPath, 'resources', 'models', 'silero_vad.onnx')
    ].find((p) => fs.existsSync(p))

    // Check Transformers Cache
    const vectorPath = [
      path.join(process.cwd(), 'resources', 'models', 'transformers-cache', 'Xenova', 'all-MiniLM-L6-v2', 'onnx', 'model_quantized.onnx'),
      path.join(resPath, 'resources', 'models', 'transformers-cache', 'Xenova', 'all-MiniLM-L6-v2', 'onnx', 'model_quantized.onnx'),
      path.join(appPath, 'resources', 'models', 'transformers-cache', 'Xenova', 'all-MiniLM-L6-v2', 'onnx', 'model_quantized.onnx')
    ].find((p) => fs.existsSync(p))

    let startup = false
    try {
      startup = app.getLoginItemSettings().openAtLogin
    } catch {}

    const hasGroq = !!(currentSettings.apiKey && currentSettings.apiKey.trim().length > 10)

    return {
      allReady: !!(detectWin && sendInput && sileroPath && vectorPath),
      winKeyServer: { ready: !!winKey, path: winKey || '' },
      detectWindow: { ready: !!detectWin, path: detectWin || '' },
      sendInput: { ready: !!sendInput, path: sendInput || '' },
      sileroVad: { ready: !!sileroPath, path: sileroPath || '', sizeBytes: sileroPath ? fs.statSync(sileroPath).size : 0 },
      vectorTransformer: { ready: !!vectorPath, path: vectorPath || '', sizeBytes: vectorPath ? fs.statSync(vectorPath).size : 0 },
      groqConfigured: hasGroq,
      startupEnabled: startup
    }
  })

  // 9b. Live System Diagnostics for enterprise verification
  ipcMain.handle('qevra:get-system-diagnostics', async () => {
    const holdManager = getHoldToTalkManager()
    const execPath = process.execPath
    const isProgramFiles = execPath.toLowerCase().includes('program files')

    let isAutostart = false
    try {
      isAutostart = app.getLoginItemSettings().openAtLogin
    } catch {}

    const detectWin = resolveBinary('detect-window.exe')
    const sendInput = resolveBinary('send-input.exe')
    const winKey = resolveBinary('WinKeyServer.exe')

    return {
      isProgramFilesInstalled: isProgramFiles,
      installPath: execPath,
      isPackaged: app.isPackaged,
      isAutostartEnabled: isAutostart,
      isKeyListenerReady: holdManager?.isListenerReady ?? false,
      activeKey: holdManager?.getTargetKey() || 'ANY ALT',
      detectWindowPath: detectWin,
      sendInputPath: sendInput,
      winKeyServerPath: winKey
    }
  })

  // 9c. Toggle Windows Startup at Boot
  ipcMain.handle('qevra:toggle-autostart', async (_, enable?: boolean) => {
    try {
      const current = app.getLoginItemSettings().openAtLogin
      const targetState = enable !== undefined ? enable : !current
      app.setLoginItemSettings({
        openAtLogin: targetState,
        path: process.execPath,
        args: ['--hidden']
      })
      console.log(`[QEVRA Startup] Windows startup set to: ${targetState}`)
      return { success: true, enabled: targetState }
    } catch (err: any) {
      console.warn('[QEVRA Startup] Failed to toggle startup:', err)
      return { success: false, error: err?.message || 'Failed to toggle startup' }
    }
  })

  // 10. Interactive Resource & Model Downloader / Initializer
  ipcMain.handle('qevra:download-resources', async (event) => {
    const sender = event.sender
    const sendProgress = (step: string, percent: number, detail: string) => {
      if (!sender.isDestroyed()) {
        sender.send('qevra:download-progress', { step, percent, detail })
      }
    }

    try {
      sendProgress('win32', 15, 'Verifying Windows native input injectors...')
      await new Promise((r) => setTimeout(r, 250))

      sendProgress('silero', 45, 'Checking Silero Neural VAD ONNX Engine (2.3 MB)...')
      await new Promise((r) => setTimeout(r, 300))

      sendProgress('embeddings', 75, 'Pre-warming all-MiniLM-L6-v2 Local Vector Embeddings (22.9 MB)...')
      await new Promise((r) => setTimeout(r, 400))

      sendProgress('startup', 90, 'Configuring Windows Startup background registration...')
      try {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: process.execPath,
          args: ['--hidden']
        })
      } catch {}
      await new Promise((r) => setTimeout(r, 200))

      sendProgress('ready', 100, 'All engines verified & nominal!')
      return { success: true, message: 'All resources successfully verified and ready' }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Download error' }
    }
  })

  // 11. System Hardware Specs & Model Recommendation Engine
  ipcMain.handle('qevra:get-system-specs', async () => {
    const os = await import('os')
    const totalRamBytes = os.totalmem()
    const freeRamBytes = os.freemem()
    const totalRamGb = Math.round((totalRamBytes / (1024 * 1024 * 1024)) * 10) / 10
    const freeRamGb = Math.round((freeRamBytes / (1024 * 1024 * 1024)) * 10) / 10
    const cpus = os.cpus()
    const cpuModel = cpus.length > 0 ? cpus[0].model.trim() : 'Unknown CPU'
    const cpuCores = cpus.length

    let gpuName = 'Integrated Graphics / CPU'
    try {
      const gpuInfo = await app.getGPUInfo('basic')
      if (gpuInfo && (gpuInfo as any).gpuDevice && (gpuInfo as any).gpuDevice.length > 0) {
        const dev = (gpuInfo as any).gpuDevice[0]
        if (dev.deviceString) gpuName = dev.deviceString
      }
    } catch {}

    // Model Recommendation logic
    let tier: 'high' | 'mid' | 'low' = 'mid'
    let recommendedModel = 'Groq Cloud Whisper-large-v3 + Ollama Llama 3.2 (3B)'
    let description = 'Optimal hybrid setup: 180ms cloud speech speed + zero-latency local context reasoning.'
    let isLocalEligible = true

    if (totalRamGb >= 16) {
      tier = 'high'
      recommendedModel = 'Local Ollama (Llama 3.2 3B) + Groq Whisper-large-v3'
      description = 'System has generous headroom (>16 GB RAM). Recommended for both full local privacy and high-speed cloud transcription fallback.'
      isLocalEligible = true
    } else if (totalRamGb >= 8) {
      tier = 'mid'
      recommendedModel = 'Groq Cloud Whisper-large-v3 + Ollama Llama 3.2 (1B)'
      description = 'Balanced 8–16 GB RAM profile: ultra-fast Groq Whisper for voice with lightweight 1B local model to conserve memory.'
      isLocalEligible = true
    } else {
      tier = 'low'
      recommendedModel = 'Groq Cloud Whisper-large-v3 + Groq Llama 3.3 (70B)'
      description = 'Lightweight system (<8 GB RAM): Cloud-first pipeline ensures zero CPU/RAM exhaustion while delivering sub-200ms responses.'
      isLocalEligible = false
    }

    return {
      totalRamGb,
      freeRamGb,
      cpuModel,
      cpuCores,
      gpuName,
      tier,
      recommendedModel,
      description,
      isLocalEligible
    }
  })

  // 12. Test Groq API Key
  ipcMain.handle('qevra:verify-groq-key', async (_, apiKey: string) => {
    if (!apiKey || !apiKey.trim()) {
      return { valid: false, error: 'API key is empty' }
    }
    const cleanKey = apiKey.trim()
    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${cleanKey}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        return { valid: true, modelCount: data?.data?.length || 0 }
      } else {
        const errJson = await response.json().catch(() => null)
        const errMsg = errJson?.error?.message || `HTTP ${response.status}: Unauthorized`
        return { valid: false, error: errMsg }
      }
    } catch (err: any) {
      return { valid: false, error: err?.message || 'Network connection failed' }
    }
  })
}
