import { describe, it, expect, beforeEach } from 'vitest'
import { TokenUsageService } from '../../src/renderer/src/core/token-usage-service'

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

describe('TokenUsageService', () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  it('initializes with zero tokens for the current day', () => {
    const today = TokenUsageService.getTodayTokens()
    expect(today.totalTokensUsed).toBe(0)
    expect(today.promptTokens).toBe(0)
    expect(today.completionTokens).toBe(0)
    expect(today.callsCount).toBe(0)
    expect(today.sessions).toEqual([])
  })

  it('records Groq token usage and calculates costs accurately', () => {
    const session = TokenUsageService.recordUsage({
      model: 'llama-3.3-70b-versatile',
      provider: 'groq',
      promptTokens: 1200,
      completionTokens: 300,
      targetApp: 'Cursor'
    })

    expect(session.promptTokens).toBe(1200)
    expect(session.completionTokens).toBe(300)
    expect(session.totalTokens).toBe(1500)
    expect(session.provider).toBe('groq')
    expect(session.targetApp).toBe('Cursor')

    const today = TokenUsageService.getTodayTokens()
    expect(today.totalTokensUsed).toBe(1500)
    expect(today.promptTokens).toBe(1200)
    expect(today.completionTokens).toBe(300)
    expect(today.callsCount).toBe(1)
    expect(today.sessions.length).toBe(1)
  })

  it('records zero cost for Ollama local compute mode', () => {
    const session = TokenUsageService.recordUsage({
      model: 'llama3.2:3b',
      provider: 'ollama',
      promptTokens: 800,
      completionTokens: 250
    })

    expect(session.estimatedCostUsd).toBe(0.0)
    expect(TokenUsageService.calculateCost('ollama', 10000, 5000)).toBe(0.0)
  })

  it('accumulates multiple sessions across the day', () => {
    TokenUsageService.recordUsage({
      model: 'llama-3.1-8b-instant',
      provider: 'groq',
      promptTokens: 400,
      completionTokens: 100
    })

    TokenUsageService.recordUsage({
      model: 'whisper-large-v3-turbo',
      provider: 'groq',
      promptTokens: 600,
      completionTokens: 200
    })

    const today = TokenUsageService.getTodayTokens()
    expect(today.totalTokensUsed).toBe(1300)
    expect(today.promptTokens).toBe(1000)
    expect(today.completionTokens).toBe(300)
    expect(today.callsCount).toBe(2)
  })

  it('resets token metrics when requested', () => {
    TokenUsageService.recordUsage({
      model: 'llama-3.3-70b-versatile',
      provider: 'groq',
      promptTokens: 500,
      completionTokens: 200
    })

    TokenUsageService.resetTokensForToday()
    const today = TokenUsageService.getTodayTokens()
    expect(today.totalTokensUsed).toBe(0)
    expect(today.callsCount).toBe(0)
  })
})
