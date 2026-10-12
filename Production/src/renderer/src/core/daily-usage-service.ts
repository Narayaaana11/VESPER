import { SubscriptionService } from './subscription-service'

export interface DailyUsageData {
  date: string // "YYYY-MM-DD" local time
  totalSecondsUsed: number
  recordingSeconds: number
  processingSeconds: number
  limitSeconds: number
  isPro: boolean
}

export class DailyUsageService {
  private static STORAGE_KEY = 'vesper_daily_usage'
  public static DAILY_LIMIT_SECONDS = 30 * 60 // 30 minutes = 1800 seconds
  private static syncChannel: BroadcastChannel | null = null

  private static getChannel(): BroadcastChannel | null {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      if (!this.syncChannel) {
        this.syncChannel = new BroadcastChannel('vesper_usage_sync')
      }
      return this.syncChannel
    }
    return null
  }

  public static getTodayDateString(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  public static getDailyUsage(): DailyUsageData {
    const today = this.getTodayDateString()
    const subscription = SubscriptionService.getSubscription()
    const isPro = subscription.tier === 'pro' || subscription.tier === 'enterprise'

    let data: DailyUsageData = {
      date: today,
      totalSecondsUsed: 0,
      recordingSeconds: 0,
      processingSeconds: 0,
      limitSeconds: this.DAILY_LIMIT_SECONDS,
      isPro
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // If stored record is from a previous calendar day, reset for the new day
          if (parsed.date === today) {
            data = {
              ...data,
              totalSecondsUsed: parsed.totalSecondsUsed || 0,
              recordingSeconds: parsed.recordingSeconds || 0,
              processingSeconds: parsed.processingSeconds || 0,
              isPro
            }
          }
        }
      }
    } catch {}

    return data
  }

  public static addUsage(seconds: number, breakdown?: { recording?: number; processing?: number }): DailyUsageData {
    const current = this.getDailyUsage()
    const addedTotal = Math.max(0, Math.round(seconds))
    const addedRec = Math.max(0, Math.round(breakdown?.recording ?? addedTotal))
    const addedProc = Math.max(0, Math.round(breakdown?.processing ?? 0))

    const updated: DailyUsageData = {
      ...current,
      totalSecondsUsed: current.totalSecondsUsed + addedTotal,
      recordingSeconds: current.recordingSeconds + addedRec,
      processingSeconds: current.processingSeconds + addedProc
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
      }
      this.getChannel()?.postMessage({ type: 'USAGE_UPDATED', data: updated })
    } catch {}

    return updated
  }

  public static isDailyLimitExceeded(): boolean {
    const usage = this.getDailyUsage()
    if (usage.isPro) return false
    return usage.totalSecondsUsed >= usage.limitSeconds
  }

  public static getRemainingSeconds(): number {
    const usage = this.getDailyUsage()
    if (usage.isPro) return Infinity
    return Math.max(0, usage.limitSeconds - usage.totalSecondsUsed)
  }

  public static getResetCountdown(): string {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diffMs = midnight.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMins}m`
  }

  public static resetUsageForToday(): DailyUsageData {
    const today = this.getTodayDateString()
    const subscription = SubscriptionService.getSubscription()
    const isPro = subscription.tier === 'pro' || subscription.tier === 'enterprise'

    const resetData: DailyUsageData = {
      date: today,
      totalSecondsUsed: 0,
      recordingSeconds: 0,
      processingSeconds: 0,
      limitSeconds: this.DAILY_LIMIT_SECONDS,
      isPro
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData))
      }
      this.getChannel()?.postMessage({ type: 'USAGE_UPDATED', data: resetData })
    } catch {}

    return resetData
  }

  public static onUsageChange(callback: (data: DailyUsageData) => void): () => void {
    const channel = this.getChannel()
    if (!channel) return () => {}

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'USAGE_UPDATED' && event.data.data) {
        callback(event.data.data)
      }
    }

    channel.addEventListener('message', handler)
    return () => {
      channel.removeEventListener('message', handler)
    }
  }
}
