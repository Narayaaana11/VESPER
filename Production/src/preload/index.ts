import { contextBridge, ipcRenderer } from 'electron'

export interface IElectronAPI {
  getContext: () => Promise<any>
  queryContext: (query?: any) => Promise<any>
  recordTask: (task: any) => Promise<any>
  revalidateContext: (targetContext: any) => Promise<any>
  clearContext: () => Promise<any>
  getContextStats: () => Promise<{ eventCount: number; taskCount: number; projectCount: number; dbSizeBytes: number }>
  getContextEvents: (limit?: number) => Promise<any[]>
  pauseContext: (paused: boolean) => Promise<{ success: boolean; isPaused: boolean }>
  setPrivacyExclusions: (payload: { apps?: string[]; folders?: string[]; domains?: string[] }) => Promise<any>
  getPrivacyStatus: () => Promise<{ isPaused: boolean; excludedApps: string[]; excludedFolders: string[]; excludedDomains: string[] }>
  executeAction: (params: { content: string; autoPaste?: boolean; targetContext?: any }) => Promise<any>
  executeUniversalAction?: (payload: any) => Promise<any>
  undoLastAction?: () => Promise<any>
  resizeWindow: (dimensions: { width: number; height: number }) => void
  showHUD: () => void
  hideHUD: () => void
  minimizeHUD: () => void
  showDashboard: () => void
  hideDashboard: () => void
  minimizeDashboard: () => void
  maximizeDashboard: () => void
  closeDashboard: () => void
  quitApp: () => void
  getSettings: () => Promise<any>
  saveSettings: (settings: any) => Promise<any>
  onHotkeyTriggered: (callback: () => void) => () => void
  onHoldStart: (callback: () => void) => () => void
  onHoldEnd: (callback: () => void) => () => void
  onSingleTap: (callback: () => void) => () => void
  onDoubleTap: (callback: () => void) => () => void
  setHoldKey: (key: string) => void
  captureScreen: () => Promise<string | null>
  saveDebugRecording: (params: { base64Data: string; filename?: string }) => Promise<{ success: boolean; path?: string }>
  searchUserContext: (options?: any) => Promise<any>
  getDayReconstruction: (targetDateMs?: number) => Promise<any>
  getScreenTrackingStatus: () => Promise<{ enabled: boolean; recentActivities: any[] }>
  toggleScreenTracking: (enable?: boolean) => Promise<{ enabled: boolean; recentActivities: any[] }>
  getRecentScreenActivities: (limit?: number) => Promise<any[]>
  generateEmbedding: (text: string) => Promise<number[] | null>
  transcribeLocal: (audioSamples: Float32Array | number[], requestedModel?: string) => Promise<{ text: string; model?: string; error?: string }>
  openCheckout: (url: string) => Promise<any>
  activateLicense: (payload: { licenseKey: string; tier: string }) => Promise<any>
  getSubscription: () => Promise<any>
  getStartupSetting: () => Promise<boolean>
  setStartupSetting: (enabled: boolean) => Promise<boolean>
  checkSystemResources: () => Promise<any>
  downloadResources: () => Promise<any>
  onDownloadProgress: (callback: (data: any) => void) => () => void
  getSystemDiagnostics: () => Promise<any>
  toggleAutostart: (enable?: boolean) => Promise<any>
  onKeyDiagnosticEvent: (callback: (data: any) => void) => () => void
  getSystemSpecs: () => Promise<{
    totalRamGb: number
    freeRamGb: number
    cpuModel: string
    cpuCores: number
    gpuName: string
    tier: 'high' | 'mid' | 'low'
    recommendedModel: string
    description: string
    isLocalEligible: boolean
  }>
  verifyGroqKey: (apiKey: string) => Promise<{ valid: boolean; error?: string; modelCount?: number }>
  getHardwareInfo?: () => Promise<{ machineId: string; machineName: string; platform: string; arch: string }>
  focusWindow?: () => void
  writeClipboard?: (text: string) => Promise<boolean>
  openExternalUrl?: (url: string) => Promise<any>
  getUpdateStatus?: () => Promise<any>
  checkForUpdates?: () => Promise<any>
  onUpdateRequired?: (callback: (data: any) => void) => () => void
}

const electronAPI: IElectronAPI = {
  getContext: () => ipcRenderer.invoke('vesper:get-context'),
  queryContext: (query) => ipcRenderer.invoke('vesper:query-context', query),
  recordTask: (task) => ipcRenderer.invoke('vesper:record-task', task),
  revalidateContext: (targetContext) => ipcRenderer.invoke('vesper:revalidate-context', targetContext),
  clearContext: () => ipcRenderer.invoke('vesper:clear-context'),
  getContextStats: () => ipcRenderer.invoke('vesper:get-context-stats'),
  getContextEvents: (limit) => ipcRenderer.invoke('vesper:get-context-events', limit),
  pauseContext: (paused) => ipcRenderer.invoke('vesper:pause-context', paused),
  setPrivacyExclusions: (payload) => ipcRenderer.invoke('vesper:set-privacy-exclusions', payload),
  getPrivacyStatus: () => ipcRenderer.invoke('vesper:get-privacy-status'),
  executeAction: (params) => ipcRenderer.invoke('vesper:execute-action', params),
  executeUniversalAction: (payload) => ipcRenderer.invoke('vesper:execute-universal-action', payload),
  undoLastAction: () => ipcRenderer.invoke('vesper:undo-last-action'),
  resizeWindow: (dimensions) => ipcRenderer.send('vesper:resize-window', dimensions),
  showHUD: () => ipcRenderer.send('vesper:show-hud'),
  hideHUD: () => ipcRenderer.send('vesper:hide-hud'),
  minimizeHUD: () => ipcRenderer.send('vesper:minimize-hud'),
  showDashboard: () => ipcRenderer.send('vesper:show-dashboard'),
  hideDashboard: () => ipcRenderer.send('vesper:hide-dashboard'),
  minimizeDashboard: () => ipcRenderer.send('vesper:minimize-dashboard'),
  maximizeDashboard: () => ipcRenderer.send('vesper:maximize-dashboard'),
  closeDashboard: () => ipcRenderer.send('vesper:close-dashboard'),
  quitApp: () => ipcRenderer.send('vesper:quit-app'),
  getSettings: () => ipcRenderer.invoke('vesper:get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('vesper:save-settings', settings),
  onHotkeyTriggered: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('vesper:hotkey-triggered', handler)
    return () => {
      ipcRenderer.removeListener('vesper:hotkey-triggered', handler)
    }
  },
  onHoldStart: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('vesper:hold-start', handler)
    return () => {
      ipcRenderer.removeListener('vesper:hold-start', handler)
    }
  },
  onHoldEnd: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('vesper:hold-end', handler)
    return () => {
      ipcRenderer.removeListener('vesper:hold-end', handler)
    }
  },
  onSingleTap: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('vesper:single-tap', handler)
    return () => {
      ipcRenderer.removeListener('vesper:single-tap', handler)
    }
  },
  onDoubleTap: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('vesper:double-tap-persistent-mode', handler)
    return () => {
      ipcRenderer.removeListener('vesper:double-tap-persistent-mode', handler)
    }
  },
  setHoldKey: (key: string) => ipcRenderer.send('vesper:set-hold-key', key),
  captureScreen: () => ipcRenderer.invoke('vesper:capture-screen'),
  saveDebugRecording: (params) => ipcRenderer.invoke('vesper:save-debug-recording', params),
  searchUserContext: (options) => ipcRenderer.invoke('vesper:search-user-context', options),
  getDayReconstruction: (targetDateMs) => ipcRenderer.invoke('vesper:get-day-reconstruction', targetDateMs),
  getScreenTrackingStatus: () => ipcRenderer.invoke('vesper:get-screen-tracking-status'),
  toggleScreenTracking: (enable) => ipcRenderer.invoke('vesper:toggle-screen-tracking', enable),
  getRecentScreenActivities: (limit) => ipcRenderer.invoke('vesper:get-recent-screen-activities', limit),
  generateEmbedding: (text) => ipcRenderer.invoke('vesper:generate-embedding', text),
  transcribeLocal: (audioSamples, requestedModel) => ipcRenderer.invoke('vesper:transcribe-local', audioSamples, requestedModel),
  openCheckout: (url: string) => ipcRenderer.invoke('vesper:open-checkout', url),
  activateLicense: (payload: { licenseKey: string; tier: string }) => ipcRenderer.invoke('vesper:activate-license', payload),
  getSubscription: () => ipcRenderer.invoke('vesper:get-subscription'),
  getStartupSetting: () => ipcRenderer.invoke('vesper:get-startup-setting'),
  setStartupSetting: (enabled: boolean) => ipcRenderer.invoke('vesper:set-startup-setting', enabled),
  checkSystemResources: () => ipcRenderer.invoke('vesper:check-system-resources'),
  downloadResources: () => ipcRenderer.invoke('vesper:download-resources'),
  onDownloadProgress: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data)
    ipcRenderer.on('vesper:download-progress', handler)
    return () => {
      ipcRenderer.removeListener('vesper:download-progress', handler)
    }
  },
  getSystemDiagnostics: () => ipcRenderer.invoke('vesper:get-system-diagnostics'),
  toggleAutostart: (enable?: boolean) => ipcRenderer.invoke('vesper:toggle-autostart', enable),
  onKeyDiagnosticEvent: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data)
    ipcRenderer.on('vesper:key-diagnostic-event', handler)
    return () => {
      ipcRenderer.removeListener('vesper:key-diagnostic-event', handler)
    }
  },
  getSystemSpecs: () => ipcRenderer.invoke('vesper:get-system-specs'),
  verifyGroqKey: (apiKey: string) => ipcRenderer.invoke('vesper:verify-groq-key', apiKey),
  getHardwareInfo: () => ipcRenderer.invoke('vesper:get-hardware-info'),
  focusWindow: () => ipcRenderer.send('vesper:focus-window'),
  writeClipboard: (text: string) => ipcRenderer.invoke('vesper:write-clipboard', text),
  openExternalUrl: (url: string) => ipcRenderer.invoke('vesper:open-external-url', url),
  getUpdateStatus: () => ipcRenderer.invoke('vesper:get-update-status'),
  checkForUpdates: () => ipcRenderer.invoke('vesper:check-for-updates'),
  onUpdateRequired: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data)
    ipcRenderer.on('vesper:update-required', handler)
    return () => {
      ipcRenderer.removeListener('vesper:update-required', handler)
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
