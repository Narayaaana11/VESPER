import { app, BrowserWindow, Notification, shell } from 'electron'
import { getAppIcon, showDashboard } from './index'

export interface AppVersionInfo {
  latestVersion: string
  minRequiredVersion: string
  mandatory: boolean
  downloadUrl: string
  directExeUrl: string
  webPortalUrl: string
  releaseNotes: string
  releaseDate: string
}

export interface UpdateState {
  isUpdateRequired: boolean
  currentVersion: string
  latestVersion: string
  minRequiredVersion: string
  mandatory: boolean
  downloadUrl: string
  webPortalUrl: string
  releaseNotes: string
  lastChecked: number
  error?: string | null
}

export class UpdateManager {
  private static instance: UpdateManager | null = null
  private state: UpdateState = {
    isUpdateRequired: false,
    currentVersion: app.getVersion() || '1.0.0',
    latestVersion: '1.0.0',
    minRequiredVersion: '1.0.0',
    mandatory: true,
    downloadUrl: 'https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/setup.exe',
    webPortalUrl: 'https://vesperflow-ai.vercel.app/#download',
    releaseNotes: 'VESPER Production Release',
    lastChecked: 0,
    error: null
  }
  private checkInterval: NodeJS.Timeout | null = null
  private lastNotificationTimestamp = 0

  private constructor() {
    this.state.currentVersion = app.getVersion() || '1.0.0'
  }

  public static getInstance(): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager()
    }
    return UpdateManager.instance
  }

  /**
   * Compares two dot-separated semantic versions.
   * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if v1 === v2
   */
  public compareVersions(v1: string, v2: string): number {
    const clean1 = (v1 || '').replace(/^v/i, '').trim()
    const clean2 = (v2 || '').replace(/^v/i, '').trim()
    const parts1 = clean1.split('.').map((p) => parseInt(p, 10) || 0)
    const parts2 = clean2.split('.').map((p) => parseInt(p, 10) || 0)
    const maxLen = Math.max(parts1.length, parts2.length)

    for (let i = 0; i < maxLen; i++) {
      const p1 = parts1[i] ?? 0
      const p2 = parts2[i] ?? 0
      if (p1 > p2) return 1
      if (p1 < p2) return -1
    }
    return 0
  }

  public getApiBaseUrl(): string {
    return (
      process.env['VITE_VESPER_API_URL'] ||
      process.env['VITE_LAUNCHPAD_URL'] ||
      'https://vesperflow-ai.vercel.app'
    ).replace(/\/$/, '')
  }

  public async checkForUpdates(): Promise<UpdateState> {
    const endpoint = `${this.getApiBaseUrl()}/api/app/version`
    try {
      console.log(`[VESPER Update] Checking for updates at: ${endpoint} (current v${this.state.currentVersion})`)
      const res = await fetch(endpoint, {
        headers: {
          'User-Agent': `VESPER-Desktop/${this.state.currentVersion}`,
          Accept: 'application/json'
        }
      })

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`)
      }

      const data = (await res.json()) as AppVersionInfo
      const latest = data.latestVersion || '1.0.0'
      const minRequired = data.minRequiredVersion || latest
      const mandatory = data.mandatory !== false

      const isNewer = this.compareVersions(latest, this.state.currentVersion) > 0
      const belowMin = this.compareVersions(this.state.currentVersion, minRequired) < 0
      const required = (isNewer && mandatory) || belowMin

      this.state = {
        isUpdateRequired: required,
        currentVersion: this.state.currentVersion,
        latestVersion: latest,
        minRequiredVersion: minRequired,
        mandatory,
        downloadUrl: data.downloadUrl || 'https://github.com/Narayaaana11/VESPER/releases/download/v1.0.0/setup.exe',
        webPortalUrl: data.webPortalUrl || 'https://vesperflow-ai.vercel.app/#download',
        releaseNotes: data.releaseNotes || 'VESPER Latest Update',
        lastChecked: Date.now(),
        error: null
      }

      console.log(
        `[VESPER Update] Check complete. Current: v${this.state.currentVersion}, Latest: v${this.state.latestVersion}, Update Required: ${this.state.isUpdateRequired}`
      )

      if (this.state.isUpdateRequired) {
        this.broadcastUpdateRequired()
      }

      return this.state
    } catch (err: any) {
      console.warn(`[VESPER Update] Failed to check for updates: ${err?.message || err}`)
      this.state.lastChecked = Date.now()
      this.state.error = err?.message || 'Update check failed'
      return this.state
    }
  }

  public isUpdateRequired(): boolean {
    return this.state.isUpdateRequired
  }

  public getState(): UpdateState {
    return { ...this.state }
  }

  public broadcastUpdateRequired(): void {
    try {
      for (const win of BrowserWindow.getAllWindows()) {
        if (!win.isDestroyed()) {
          win.webContents.send('vesper:update-required', this.state)
        }
      }
    } catch (err) {
      console.warn('[VESPER Update] Broadcast warning:', err)
    }
  }

  /**
   * Called when the user presses Right Alt (or uses push-to-talk/dictation).
   * If an update is required, blocks usage, triggers a native Windows notification,
   * focuses the dashboard, and displays the update dialog.
   * Returns true if blocked, false if clear to proceed.
   */
  public handleAltPressInterception(): boolean {
    if (!this.state.isUpdateRequired) {
      return false
    }

    const now = Date.now()
    // Throttle notifications to once every 4 seconds to avoid spamming the user
    if (now - this.lastNotificationTimestamp > 4000) {
      this.lastNotificationTimestamp = now

      // 1. Show Windows Native Notification Toast
      try {
        if (Notification.isSupported()) {
          const notif = new Notification({
            title: 'VESPER Update Required',
            body: `A new update (v${this.state.latestVersion}) has arrived. You need to update to use VESPER features.`,
            icon: getAppIcon() || undefined
          })
          notif.on('click', () => {
            showDashboard()
            if (this.state.downloadUrl) {
              shell.openExternal(this.state.downloadUrl)
            }
          })
          notif.show()
        }
      } catch (err) {
        console.warn('[VESPER Update] Windows notification error:', err)
      }
    }

    // 2. Bring Dashboard to front and display the update modal
    showDashboard()
    this.broadcastUpdateRequired()

    return true
  }

  public startPeriodicCheck(intervalMs = 300000): void {
    // Initial check after 3 seconds
    setTimeout(() => {
      this.checkForUpdates().catch(() => {})
    }, 3000)

    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    this.checkInterval = setInterval(() => {
      this.checkForUpdates().catch(() => {})
    }, intervalMs)
  }

  public destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }
}
