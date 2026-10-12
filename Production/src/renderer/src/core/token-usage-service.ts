export interface TokenSession {
  id: string
  timestamp: number
  model: string
  provider: 'groq' | 'ollama' | 'local' | 'mock' | 'gemini'
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostUsd: number
  targetApp?: string
}

export interface TokenDailyData {
  date: string // "YYYY-MM-DD"
  totalTokensUsed: number
  promptTokens: number
  completionTokens: number
  estimatedCostUsd: number
  callsCount: number
  sessions: TokenSession[]
}

export class TokenUsageService {
  private static STORAGE_KEY = 'vesper_token_usage'
  private static SESSIONS_KEY = 'vesper_token_sessions'
  private static syncChannel: BroadcastChannel | null = null

  private static getChannel(): BroadcastChannel | null {
    if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
      if (!this.syncChannel) {
        this.syncChannel = new BroadcastChannel('vesper_token_sync')
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

  /**
   * Estimated pricing per 1,000,000 tokens (for market rate savings context)
   */
  public static calculateCost(model: string, promptTokens: number, completionTokens: number, provider?: string): number {
    if (provider === 'ollama' || provider === 'local' || provider === 'gemini') return 0.0

    const lower = model.toLowerCase()
    if (lower.includes('ollama') || lower.includes('local')) {
      return 0.0
    }

    let promptRatePerMillion = 0.59
    let completionRatePerMillion = 0.79

    if (lower.includes('8b')) {
      promptRatePerMillion = 0.05
      completionRatePerMillion = 0.08
    } else if (lower.includes('whisper')) {
      promptRatePerMillion = 0.04
      completionRatePerMillion = 0.04
    }

    const cost = (promptTokens / 1_000_000) * promptRatePerMillion + (completionTokens / 1_000_000) * completionRatePerMillion
    return Math.round(cost * 10000) / 10000
  }

  public static getTodayTokens(): TokenDailyData {
    const today = this.getTodayDateString()
    let data: TokenDailyData = {
      date: today,
      totalTokensUsed: 0,
      promptTokens: 0,
      completionTokens: 0,
      estimatedCostUsd: 0,
      callsCount: 0,
      sessions: []
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.date === today) {
            data = {
              ...data,
              totalTokensUsed: parsed.totalTokensUsed || 0,
              promptTokens: parsed.promptTokens || 0,
              completionTokens: parsed.completionTokens || 0,
              estimatedCostUsd: parsed.estimatedCostUsd || 0,
              callsCount: parsed.callsCount || 0
            }
          }
        }

        const storedSessions = localStorage.getItem(this.SESSIONS_KEY)
        if (storedSessions) {
          const sessionsParsed: TokenSession[] = JSON.parse(storedSessions)
          const todayPrefix = today
          data.sessions = sessionsParsed.filter((s) => {
            const d = new Date(s.timestamp)
            const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            return dStr === todayPrefix
          })
        }
      }
    } catch {}

    return data
  }

  public static recordUsage(params: {
    model: string
    provider: 'groq' | 'ollama' | 'local' | 'mock'
    promptTokens: number
    completionTokens: number
    totalTokens?: number
    targetApp?: string
  }): TokenSession {
    const prompt = Math.max(0, Math.round(params.promptTokens))
    const completion = Math.max(0, Math.round(params.completionTokens))
    const total = Math.max(0, Math.round(params.totalTokens ?? prompt + completion))
    const cost = this.calculateCost(params.model, prompt, completion, params.provider)

    const session: TokenSession = {
      id: `tok-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      model: params.model,
      provider: params.provider,
      promptTokens: prompt,
      completionTokens: completion,
      totalTokens: total,
      estimatedCostUsd: cost,
      targetApp: params.targetApp
    }

    const current = this.getTodayTokens()
    const updated: TokenDailyData = {
      date: current.date,
      totalTokensUsed: current.totalTokensUsed + total,
      promptTokens: current.promptTokens + prompt,
      completionTokens: current.completionTokens + completion,
      estimatedCostUsd: Math.round((current.estimatedCostUsd + cost) * 10000) / 10000,
      callsCount: current.callsCount + 1,
      sessions: [session, ...current.sessions].slice(0, 100)
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
          date: updated.date,
          totalTokensUsed: updated.totalTokensUsed,
          promptTokens: updated.promptTokens,
          completionTokens: updated.completionTokens,
          estimatedCostUsd: updated.estimatedCostUsd,
          callsCount: updated.callsCount
        }))

        // Keep rolling 200 sessions in storage
        const storedSessions = localStorage.getItem(this.SESSIONS_KEY)
        const allSessions: TokenSession[] = storedSessions ? JSON.parse(storedSessions) : []
        const merged = [session, ...allSessions].slice(0, 200)
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(merged))
      }

      this.getChannel()?.postMessage({ type: 'TOKENS_UPDATED', data: updated, session })

      // Dispatch real-time telemetry to connected Launchpad / Cloud Admin Console
      this.syncTokenUsageToCloud(prompt, completion, total, params.model)
    } catch {}

    return session
  }

  private static syncTokenUsageToCloud(
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    model: string
  ): void {
    if (typeof fetch === 'undefined') return

    try {
      let licenseKey: string | undefined = undefined
      if (typeof localStorage !== 'undefined') {
        const storedSub = localStorage.getItem('vesper_subscription_cache')
        if (storedSub) {
          try {
            const parsed = JSON.parse(storedSub)
            if (parsed.licenseKey) licenseKey = parsed.licenseKey
          } catch {}
        }
        if (!licenseKey) {
          licenseKey = localStorage.getItem('vesper_license_key') || undefined
        }
      }

      const apiBase =
        (typeof localStorage !== 'undefined' && localStorage.getItem('vesper_api_url')) ||
        (typeof process !== 'undefined' && (process.env?.VITE_VESPER_API_URL || (process.env as any)?.REACT_APP_VESPER_API_URL)) ||
        'http://localhost:8080'

      fetch(`${apiBase}/api/telemetry/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey,
          promptTokens,
          completionTokens,
          totalTokens,
          model
        })
      }).catch(() => {
        // Silent fallback when running offline or disconnected from cloud
      })
    } catch {}
  }

  public static resetTokensForToday(): TokenDailyData {
    const today = this.getTodayDateString()
    const resetData: TokenDailyData = {
      date: today,
      totalTokensUsed: 0,
      promptTokens: 0,
      completionTokens: 0,
      estimatedCostUsd: 0,
      callsCount: 0,
      sessions: []
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resetData))
      }
      this.getChannel()?.postMessage({ type: 'TOKENS_UPDATED', data: resetData })
    } catch {}

    return resetData
  }

  public static onTokenChange(callback: (data: TokenDailyData, lastSession?: TokenSession) => void): () => void {
    const channel = this.getChannel()
    if (!channel) return () => {}

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'TOKENS_UPDATED' && event.data.data) {
        callback(event.data.data, event.data.session)
      }
    }

    channel.addEventListener('message', handler)
    return () => {
      channel.removeEventListener('message', handler)
    }
  }
}
