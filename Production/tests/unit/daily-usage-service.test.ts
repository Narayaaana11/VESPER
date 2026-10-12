import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DailyUsageService } from '../../src/renderer/src/core/daily-usage-service'
import { SubscriptionService } from '../../src/renderer/src/core/subscription-service'

// In-memory localStorage mock for Node environment
const store: Record<string, string> = {}
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = String(value)
  },
  removeItem: (key: string) => {
    delete store[key]
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k]
  }
}

if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage) {
  ;(globalThis as any).localStorage = mockLocalStorage
}

describe('DailyUsageService', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
    SubscriptionService.resetToFree()
  })

  it('initializes with 0 seconds for today on free tier', () => {
    const usage = DailyUsageService.getDailyUsage()
    expect(usage.totalSecondsUsed).toBe(0)
    expect(usage.limitSeconds).toBe(1800)
    expect(usage.isPro).toBe(false)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(false)
    expect(DailyUsageService.getRemainingSeconds()).toBe(1800)
  })

  it('accumulates usage accurately and tracks remaining seconds', () => {
    DailyUsageService.addUsage(120, { recording: 100, processing: 20 })
    let usage = DailyUsageService.getDailyUsage()
    expect(usage.totalSecondsUsed).toBe(120)
    expect(usage.recordingSeconds).toBe(100)
    expect(usage.processingSeconds).toBe(20)
    expect(DailyUsageService.getRemainingSeconds()).toBe(1680)

    DailyUsageService.addUsage(300, { recording: 250, processing: 50 })
    usage = DailyUsageService.getDailyUsage()
    expect(usage.totalSecondsUsed).toBe(420)
    expect(DailyUsageService.getRemainingSeconds()).toBe(1380)
  })

  it('detects when 30-minute daily limit is exceeded', () => {
    DailyUsageService.addUsage(1800)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(true)
    expect(DailyUsageService.getRemainingSeconds()).toBe(0)

    DailyUsageService.addUsage(50)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(true)
    expect(DailyUsageService.getRemainingSeconds()).toBe(0)
  })

  it('allows unlimited usage when Pro license is active', async () => {
    DailyUsageService.addUsage(2000)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(true)

    // Activate Pro license
    await SubscriptionService.activateLicense('VESPER-PRO-UNLIMITED')
    const usage = DailyUsageService.getDailyUsage()
    expect(usage.isPro).toBe(true)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(false)
    expect(DailyUsageService.getRemainingSeconds()).toBe(Infinity)
  })

  it('automatically resets usage when date changes to a new day', () => {
    // Simulate past day usage
    localStorage.setItem(
      'vesper_daily_usage',
      JSON.stringify({
        date: '2026-01-01',
        totalSecondsUsed: 1750,
        recordingSeconds: 1500,
        processingSeconds: 250,
        limitSeconds: 1800,
        isPro: false
      })
    )

    const usage = DailyUsageService.getDailyUsage()
    expect(usage.date).toBe(DailyUsageService.getTodayDateString())
    expect(usage.totalSecondsUsed).toBe(0)
    expect(usage.recordingSeconds).toBe(0)
    expect(usage.processingSeconds).toBe(0)
    expect(DailyUsageService.isDailyLimitExceeded()).toBe(false)
  })

  it('formats reset countdown string', () => {
    const countdown = DailyUsageService.getResetCountdown()
    expect(countdown).toMatch(/^\d+h \d+m$/)
  })
})
