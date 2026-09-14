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
  resizeWindow: (dimensions: { width: number; height: number }) => void
  hideHUD: () => void
  minimizeHUD: () => void
  showDashboard: () => void
  hideDashboard: () => void
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
}

const electronAPI: IElectronAPI = {
  getContext: () => ipcRenderer.invoke('qevra:get-context'),
  queryContext: (query) => ipcRenderer.invoke('qevra:query-context', query),
  recordTask: (task) => ipcRenderer.invoke('qevra:record-task', task),
  revalidateContext: (targetContext) => ipcRenderer.invoke('qevra:revalidate-context', targetContext),
  clearContext: () => ipcRenderer.invoke('qevra:clear-context'),
  getContextStats: () => ipcRenderer.invoke('qevra:get-context-stats'),
  getContextEvents: (limit) => ipcRenderer.invoke('qevra:get-context-events', limit),
  pauseContext: (paused) => ipcRenderer.invoke('qevra:pause-context', paused),
  setPrivacyExclusions: (payload) => ipcRenderer.invoke('qevra:set-privacy-exclusions', payload),
  getPrivacyStatus: () => ipcRenderer.invoke('qevra:get-privacy-status'),
  executeAction: (params) => ipcRenderer.invoke('qevra:execute-action', params),
  resizeWindow: (dimensions) => ipcRenderer.send('qevra:resize-window', dimensions),
  hideHUD: () => ipcRenderer.send('qevra:hide-hud'),
  minimizeHUD: () => ipcRenderer.send('qevra:minimize-hud'),
  showDashboard: () => ipcRenderer.send('qevra:show-dashboard'),
  hideDashboard: () => ipcRenderer.send('qevra:hide-dashboard'),
  quitApp: () => ipcRenderer.send('qevra:quit-app'),
  getSettings: () => ipcRenderer.invoke('qevra:get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('qevra:save-settings', settings),
  onHotkeyTriggered: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('qevra:hotkey-triggered', handler)
    return () => {
      ipcRenderer.removeListener('qevra:hotkey-triggered', handler)
    }
  },
  onHoldStart: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('qevra:hold-start', handler)
    return () => {
      ipcRenderer.removeListener('qevra:hold-start', handler)
    }
  },
  onHoldEnd: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('qevra:hold-end', handler)
    return () => {
      ipcRenderer.removeListener('qevra:hold-end', handler)
    }
  },
  onSingleTap: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('qevra:single-tap', handler)
    return () => {
      ipcRenderer.removeListener('qevra:single-tap', handler)
    }
  },
  onDoubleTap: (callback) => {
    const handler = (): void => callback()
    ipcRenderer.on('qevra:double-tap-persistent-mode', handler)
    return () => {
      ipcRenderer.removeListener('qevra:double-tap-persistent-mode', handler)
    }
  },
  setHoldKey: (key: string) => ipcRenderer.send('qevra:set-hold-key', key),
  captureScreen: () => ipcRenderer.invoke('qevra:capture-screen'),
  saveDebugRecording: (params) => ipcRenderer.invoke('qevra:save-debug-recording', params),
  searchUserContext: (options) => ipcRenderer.invoke('qevra:search-user-context', options),
  getDayReconstruction: (targetDateMs) => ipcRenderer.invoke('qevra:get-day-reconstruction', targetDateMs),
  getScreenTrackingStatus: () => ipcRenderer.invoke('qevra:get-screen-tracking-status'),
  toggleScreenTracking: (enable) => ipcRenderer.invoke('qevra:toggle-screen-tracking', enable),
  getRecentScreenActivities: (limit) => ipcRenderer.invoke('qevra:get-recent-screen-activities', limit),
  generateEmbedding: (text) => ipcRenderer.invoke('qevra:generate-embedding', text)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

