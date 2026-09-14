import { desktopCapturer } from 'electron'
import { ContextCollector } from './context-collector'
import { ContextStore } from './context-store'
import { DeviceContext } from './context-types'

export interface ScreenActivityRecord {
  id: string
  timestamp: number
  activeApp: string
  windowTitle: string
  projectWorkspace?: string
  activitySummary: string
  receipt: string
  thumbnailUrl?: string
}

export class ScreenTracker {
  private static instance: ScreenTracker | null = null
  private isRunning = false
  private pollInterval: NodeJS.Timeout | null = null
  private lastSignature = ''
  private recentActivities: ScreenActivityRecord[] = []
  private readonly MAX_RECENT_IN_MEMORY = 50
  private intervalMs = 20000 // Every 20s

  private constructor() {}

  public static getInstance(): ScreenTracker {
    if (!ScreenTracker.instance) {
      ScreenTracker.instance = new ScreenTracker()
    }
    return ScreenTracker.instance
  }

  public start(intervalMs = 20000): void {
    if (this.isRunning) return
    this.intervalMs = intervalMs
    this.isRunning = true
    console.log(`[QEVRA ScreenTracker] [SCREEN] Ambient screen tracker started (every ${this.intervalMs / 1000}s)`)

    // Initial capture
    this.captureActivityTick().catch((err) => {
      console.warn('[QEVRA ScreenTracker] Initial capture warning:', err)
    })

    this.pollInterval = setInterval(() => {
      this.captureActivityTick().catch((err) => {
        console.warn('[QEVRA ScreenTracker] Periodic capture error:', err)
      })
    }, this.intervalMs)
  }

  public stop(): void {
    this.isRunning = false
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    console.log('[QEVRA ScreenTracker] Ambient screen tracker stopped')
  }

  public isEnabled(): boolean {
    return this.isRunning
  }

  public getRecentActivities(limit = 20): ScreenActivityRecord[] {
    return this.recentActivities.slice(0, limit)
  }

  public async captureActivityTick(): Promise<ScreenActivityRecord | null> {
    if (!this.isRunning) return null

    try {
      const context = await ContextCollector.collect()
      const signature = `${context.activeApp}|${context.windowTitle}`

      // Perceptual deduplication: if user hasn't switched window or app, skip duplicate entry
      if (signature === this.lastSignature && this.recentActivities.length > 0) {
        return null
      }
      this.lastSignature = signature

      // Capture desktop thumbnail
      let thumbnailUrl: string | undefined = undefined
      try {
        const sources = await desktopCapturer.getSources({
          types: ['screen'],
          thumbnailSize: { width: 640, height: 360 }
        })
        if (sources.length > 0) {
          thumbnailUrl = sources[0].thumbnail.toDataURL()
        }
      } catch (capErr) {
        // Silently handle headless / non-display contexts
      }

      const summary = this.generateActivitySummary(context)
      const now = Date.now()
      const receipt = this.formatLittlebirdReceipt(now, context.activeApp, context.windowTitle)

      const record: ScreenActivityRecord = {
        id: `scr_${now}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: now,
        activeApp: context.activeApp,
        windowTitle: context.windowTitle,
        projectWorkspace: context.projectWorkspace,
        activitySummary: summary,
        receipt,
        thumbnailUrl
      }

      // Add to memory list
      this.recentActivities.unshift(record)
      if (this.recentActivities.length > this.MAX_RECENT_IN_MEMORY) {
        this.recentActivities.pop()
      }

      // Store in SQLite database
      ContextStore.getInstance().insertEvent({
        id: record.id,
        type: 'SCREEN_ACTIVITY_RECORDED',
        timestamp: now,
        context,
        payload: {
          activitySummary: summary,
          receipt,
          hasThumbnail: !!thumbnailUrl
        }
      })

      return record
    } catch (err) {
      console.warn('[QEVRA ScreenTracker] captureActivityTick failed:', err)
      return null
    }
  }

  private generateActivitySummary(context: DeviceContext): string {
    const app = context.activeApp || 'Desktop'
    const title = context.windowTitle || ''

    if (context.detectedCategory === 'code' || app.toLowerCase().includes('cursor') || app.toLowerCase().includes('code')) {
      const fileMatch = title.match(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/)
      const file = fileMatch ? fileMatch[1] : title
      return `Working on ${file} in ${app}`
    }

    if (context.detectedCategory === 'browser') {
      return `Browsing "${title.substring(0, 60)}" in ${app}`
    }

    if (context.detectedCategory === 'communication') {
      return `Communicating on ${app} (${title.substring(0, 40)})`
    }

    return `Active in ${app}${title ? ` - ${title.substring(0, 50)}` : ''}`
  }

  private formatLittlebirdReceipt(timestamp: number, app: string, title: string): string {
    const d = new Date(timestamp)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dayName = days[d.getDay()]
    const monthName = months[d.getMonth()]
    const date = d.getDate()
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')

    const cleanTitle = (title || 'Workspace').trim().replace(/[\r\n]+/g, ' ')
    const truncatedTitle = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle
    return `[${dayName}, ${monthName} ${date}, ${year} ${hours}:${mins} | ${app || 'Desktop'} | ${truncatedTitle}]`
  }
}
