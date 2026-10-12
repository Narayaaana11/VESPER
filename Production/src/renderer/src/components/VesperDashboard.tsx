import React, { useState, useEffect, useMemo } from 'react'
import {
  Clock,
  Copy,
  Check,
  Trash2,
  Minus,
  Square,
  X,
  CreditCard,
  ArrowUpRight,
  LayoutDashboard,
  User,
  Search,
  Filter
} from 'lucide-react'
import { PricingTable } from './PricingTable'
import { ProfileSection } from './ProfileSection'
import { AuthGateModal } from './AuthGateModal'
import { UpdateRequiredModal, UpdateInfo } from './UpdateRequiredModal'
import { VesperLogo } from './VesperLogo'
import { SpotlightCard, CountUp } from './reactbits'
import { DailyUsageService, DailyUsageData } from '../core/daily-usage-service'
import { TokenUsageService, TokenDailyData } from '../core/token-usage-service'
import { ProfileService, UserProfile } from '../core/profile-service'
import {
  DictationHistoryItem,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  syncChannel
} from '../types/dashboard'
import { AppSettings } from '../types/task'

interface VesperDashboardProps {
  settings?: AppSettings
  onUpdateSettings?: (newSettings: AppSettings) => void
  onBackToPill?: () => void
  onRePasteText?: (text: string) => void
  activeApp?: string
  standalone?: boolean
}

type TabType = 'control' | 'history' | 'pricing' | 'profile'

const DEFAULT_SETTINGS: AppSettings = {
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
  apiKey: '',
  autoPaste: true,
  soundFeedback: true,
  privacyMode: 'strict_local'
}

export const VesperDashboard: React.FC<VesperDashboardProps> = ({
  settings: propSettings,
  onUpdateSettings,
  onBackToPill,
  onRePasteText,
  standalone = false
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('control')

  // User Profile & Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ProfileService.getProfile())
  const [showAuthGate, setShowAuthGate] = useState<boolean>(() => !ProfileService.getProfile().isLoggedIn)

  // Local settings fallback
  const [localSettings, setLocalSettings] = useState<AppSettings>(() => {
    if (propSettings) return propSettings
    try {
      const raw = localStorage.getItem('vesper_settings')
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    } catch {}
    return DEFAULT_SETTINGS
  })

  const effectiveSettings = propSettings || localSettings

  const [dailyUsage, setDailyUsage] = useState<DailyUsageData>(() => DailyUsageService.getDailyUsage())
  const [resetCountdown, setResetCountdown] = useState<string>(() => DailyUsageService.getResetCountdown())
  const [tokenUsage, setTokenUsage] = useState<TokenDailyData>(() => TokenUsageService.getTodayTokens())

  // Mandatory App Update State
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)

  useEffect(() => {
    // 1. Initial update status poll from Electron Main
    if (window.electronAPI?.getUpdateStatus) {
      window.electronAPI
        .getUpdateStatus()
        .then((status) => {
          if (status && status.isUpdateRequired) {
            setUpdateInfo(status)
          }
        })
        .catch(() => {})
    }

    // 2. Listen for live update required broadcast
    if (window.electronAPI?.onUpdateRequired) {
      const unsub = window.electronAPI.onUpdateRequired((data) => {
        if (data && data.isUpdateRequired) {
          setUpdateInfo(data)
        }
      })
      return () => unsub()
    }
  }, [])

  useEffect(() => {
    setDailyUsage(DailyUsageService.getDailyUsage())
    setResetCountdown(DailyUsageService.getResetCountdown())
    setTokenUsage(TokenUsageService.getTodayTokens())

    const unsubscribe = DailyUsageService.onUsageChange((data) => {
      setDailyUsage(data)
    })

    const unsubTokens = TokenUsageService.onTokenChange((data) => {
      setTokenUsage(data)
    })

    const interval = setInterval(() => {
      setResetCountdown(DailyUsageService.getResetCountdown())
      setDailyUsage(DailyUsageService.getDailyUsage())
      setTokenUsage(TokenUsageService.getTodayTokens())
    }, 30000)

    return () => {
      unsubscribe()
      unsubTokens()
      clearInterval(interval)
    }
  }, [])

  // History state
  const [history, setHistory] = useState<DictationHistoryItem[]>(() => getHistory())
  const [searchQuery, setSearchQuery] = useState('')
  const [appFilter, setAppFilter] = useState<string>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [startupEnabled, setStartupEnabled] = useState(true)

  // Startup query
  useEffect(() => {
    window.electronAPI?.getStartupSetting?.().then((res: boolean) => {
      if (typeof res === 'boolean') setStartupEnabled(res)
    }).catch(() => {})
  }, [])

  // Sync listener across windows
  useEffect(() => {
    const channel = syncChannel
    if (!channel) return

    const handleSyncMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || !data.type) return

      if (data.type === 'HISTORY_CHANGED') setHistory(getHistory())
    }

    channel.addEventListener('message', handleSyncMessage)
    return () => channel.removeEventListener('message', handleSyncMessage)
  }, [])

  // Standalone settings poll
  useEffect(() => {
    if (standalone && window.electronAPI?.getSettings) {
      window.electronAPI.getSettings().then((s: any) => {
        if (s) {
          setLocalSettings((prev) => ({ ...prev, ...s }))
        }
      }).catch(console.warn)
    }
  }, [standalone])

  // Update settings dispatcher
  const updateSettings = (updated: Partial<AppSettings>) => {
    const next = { ...effectiveSettings, ...updated }
    if (onUpdateSettings) {
      onUpdateSettings(next)
    } else {
      setLocalSettings(next)
      try {
        localStorage.setItem('vesper_settings', JSON.stringify(next))
      } catch {}
      window.electronAPI?.saveSettings?.(next)
    }
  }

  // Copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  // Delete history
  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id)
    setHistory(updated)
  }

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm('Clear all your voice dictation history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  // Toggle Startup
  const handleToggleStartup = async (enabled: boolean) => {
    setStartupEnabled(enabled)
    if (window.electronAPI?.setStartupSetting) {
      await window.electronAPI.setStartupSetting(enabled)
    }
  }

  // Window Controls (Minimize, Maximize, Close)
  const handleWindowMinimize = () => {
    if (window.electronAPI?.minimizeDashboard) {
      window.electronAPI.minimizeDashboard()
    }
  }

  const handleWindowMaximize = () => {
    if (window.electronAPI?.maximizeDashboard) {
      window.electronAPI.maximizeDashboard()
    }
  }

  const handleWindowClose = () => {
    if (window.electronAPI?.closeDashboard) {
      window.electronAPI.closeDashboard()
    } else if (standalone) {
      window.electronAPI?.hideDashboard?.()
    } else if (onBackToPill) {
      onBackToPill()
    }
  }

  // Compute stats
  const uniqueApps = useMemo(() => {
    const set = new Set(history.map((h) => h.targetApp).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [history])

  const stats = useMemo(() => {
    const words = history.reduce(
      (sum, h) => sum + (h.wordCount || (h.polishedText ? h.polishedText.split(/\s+/).filter(Boolean).length : 0)),
      0
    )
    const minutesSaved = Math.round(words / 35)
    return {
      words,
      sessions: history.length,
      minutesSaved
    }
  }, [history])

  // Filtered history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesApp = appFilter === 'All' || (item.targetApp && item.targetApp.toLowerCase() === appFilter.toLowerCase())
      const matchesSearch =
        !searchQuery ||
        (item.polishedText && item.polishedText.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.rawTranscript && item.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesApp && matchesSearch
    })
  }, [history, appFilter, searchQuery])

  // 4 most recent dictation items for dashboard stream
  const recentHistory = useMemo(() => {
    return history.slice(0, 4)
  }, [history])

  // Free Tier Usage calculations
  const usedMinutes = Math.floor(dailyUsage.totalSecondsUsed / 60)
  const limitMinutes = Math.floor(dailyUsage.limitSeconds / 60) // 30
  const remainingSeconds = DailyUsageService.getRemainingSeconds()
  const remainingMinutes = Math.ceil(remainingSeconds / 60)
  const usagePercent = dailyUsage.isPro
    ? 100
    : Math.min(100, Math.round((dailyUsage.totalSecondsUsed / dailyUsage.limitSeconds) * 100))

  return (
    <div className={`wfd-root is-nextgen ${standalone ? 'is-standalone-window' : ''}`}>
      {/* 1. TITLEBAR: LOGO + TITLE ON LEFT, WINDOW CONTROLS ON RIGHT */}
      <header className="wfd-titlebar">
        <div className="wfd-tb-left">
          <div className="wfd-tb-brand" onClick={() => setCurrentTab('control')}>
            <VesperLogo size={22} />
            <span className="wfd-tb-title">VESPER</span>
            <span className="wfd-tb-version">v1.0 Light</span>
          </div>
        </div>

        {/* Window Controls: Minimize, Maximize, Close */}
        <div className="wfd-tb-controls">
          <button className="wfd-tb-btn" onClick={handleWindowMinimize} title="Minimize Window">
            <Minus size={14} />
          </button>
          <button className="wfd-tb-btn" onClick={handleWindowMaximize} title="Maximize Window">
            <Square size={12} />
          </button>
          <button className="wfd-tb-btn wfd-tb-close" onClick={handleWindowClose} title="Close Window">
            <X size={14} />
          </button>
        </div>
      </header>

      {/* 2. HORIZON NAVIGATION BAR */}
      <nav className="wfd-horizon-nav">
        <div className="wfd-nav-tabs-wrapper">
          <button
            className={`wfd-horizon-tab ${currentTab === 'control' ? 'is-active' : ''}`}
            onClick={() => setCurrentTab('control')}
          >
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </button>

          <button
            className={`wfd-horizon-tab ${currentTab === 'history' ? 'is-active' : ''}`}
            onClick={() => setCurrentTab('history')}
          >
            <Clock size={14} />
            <span>History & Feed</span>
            {history.length > 0 && <span className="wfd-tab-badge">{history.length}</span>}
          </button>

          <button
            className={`wfd-horizon-tab ${currentTab === 'pricing' ? 'is-active' : ''}`}
            onClick={() => setCurrentTab('pricing')}
          >
            <CreditCard size={14} />
            <span>Pro Plans</span>
          </button>

          <button
            className={`wfd-horizon-tab ${currentTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setCurrentTab('profile')}
          >
            <User size={14} />
            <span>Profile</span>
            {userProfile.isLoggedIn && <span className="wfd-tab-badge">Verified</span>}
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT ARENA */}
      <main className="wfd-viewport-arena">
        {/* TAB 1: DASHBOARD */}
        {currentTab === 'control' && (
          <div className="wfd-cockpit-view">
            {/* Top Metric Cards Ribbon */}
            <div className="wfd-metrics-grid">
              {/* 1. Words Dictated */}
              <SpotlightCard
                spotlightColor="rgba(255, 107, 0, 0.12)"
                className="wfd-stat-card"
              >
                <div className="wfd-sc-label">Words Dictated</div>
                <div className="wfd-sc-value text-orange-600">
                  <CountUp to={stats.words} duration={1.0} />
                </div>
                <div className="wfd-sc-sub">Sub-second voice insertion</div>
              </SpotlightCard>

              {/* 2. Time Saved */}
              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.12)"
                className="wfd-stat-card"
              >
                <div className="wfd-sc-label">Time Saved</div>
                <div className="wfd-sc-value text-emerald-600">
                  <CountUp to={stats.minutesSaved} duration={1.0} /> min
                </div>
                <div className="wfd-sc-sub">~165 WPM voice vs 45 WPM typing</div>
              </SpotlightCard>

              {/* 3. Daily Free Usage (30m Cap, resets at 12:00 AM) */}
              <SpotlightCard
                spotlightColor="rgba(245, 158, 11, 0.12)"
                className="wfd-stat-card"
              >
                <div className="wfd-sc-label">Daily Free Usage</div>
                <div className="wfd-sc-value">
                  {dailyUsage.isPro ? (
                    <span className="text-emerald-600">Unlimited</span>
                  ) : (
                    <span>{usedMinutes}m / {limitMinutes}m</span>
                  )}
                </div>
                {dailyUsage.isPro ? (
                  <div className="wfd-sc-sub text-emerald-600 font-medium">Pro license active · No daily cap</div>
                ) : (
                  <div className="wfd-usage-meter-box">
                    <div className="wfd-usage-progress-bg">
                      <div
                        className="wfd-usage-progress-bar"
                        style={{
                          width: `${usagePercent}%`,
                          background: usagePercent >= 90 ? '#ef4444' : usagePercent >= 70 ? '#f59e0b' : '#ff6b00'
                        }}
                      />
                    </div>
                    <div className="wfd-sc-sub">
                      {remainingMinutes > 0 ? `${remainingMinutes}m remaining` : 'Daily limit reached'} · Resets 12:00 AM ({resetCountdown})
                    </div>
                  </div>
                )}
              </SpotlightCard>

              {/* 4. Active Plan */}
              <SpotlightCard
                spotlightColor="rgba(255, 107, 0, 0.12)"
                className="wfd-stat-card"
              >
                <div className="wfd-sc-label">Active Plan</div>
                <div className="wfd-sc-val-text">
                  {dailyUsage.isPro ? (
                    <span className="text-emerald-600">Pro Unlimited</span>
                  ) : (
                    <span>Free Tier (30m)</span>
                  )}
                </div>
                {dailyUsage.isPro ? (
                  <div className="wfd-sc-sub">Cloud LPU acceleration active</div>
                ) : (
                  <button
                    className="wfd-upgrade-quick-btn"
                    onClick={() => setCurrentTab('pricing')}
                  >
                    <span>Upgrade with Stripe</span>
                    <ArrowUpRight size={11} />
                  </button>
                )}
              </SpotlightCard>

              {/* 5. Tokens Burned Today */}
              <SpotlightCard
                spotlightColor="rgba(255, 107, 0, 0.12)"
                className="wfd-stat-card"
              >
                <div className="wfd-sc-label">Tokens Burned Today</div>
                <div className="wfd-sc-value text-orange-600">
                  <CountUp to={tokenUsage.totalTokensUsed} duration={1.0} />
                </div>
                <div className="wfd-sc-sub">
                  In: {tokenUsage.promptTokens.toLocaleString()} · Out: {tokenUsage.completionTokens.toLocaleString()} · Free Tier
                </div>
              </SpotlightCard>
            </div>

            {/* Dashboard Recent Activity Feed */}
            <div className="wfd-recent-section">
              <div className="wfd-pane-header">
                <div>
                  <h3 className="wfd-section-title">Recent Dictation Activity</h3>
                  <p className="wfd-section-desc">
                    Real-time speech transcripts injected into your native applications.
                  </p>
                </div>
                {history.length > 0 && (
                  <button
                    className="wfd-btn-view-all"
                    onClick={() => setCurrentTab('history')}
                  >
                    <span>View all in History ({history.length})</span>
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>

              {recentHistory.length === 0 ? (
                <div className="wfd-empty-state">
                  <Clock size={28} className="text-slate-400 mb-2" />
                  <h4>No dictations recorded today</h4>
                  <p>
                    Press or hold <strong>{effectiveSettings.holdKey || 'RIGHT ALT'}</strong> in Cursor, Slack, or Chrome to start dictating. Transcripts will materialize here instantly.
                  </p>
                </div>
              ) : (
                <div className="wfd-recent-grid">
                  {recentHistory.map((item) => {
                    const isCopied = copiedId === item.id
                    return (
                      <div key={item.id} className="wfd-recent-card">
                        <div className="wfd-recent-top">
                          <div className="wfd-recent-meta">
                            <span className="wfd-recent-app">{item.targetApp || 'Desktop'}</span>
                            <span className="wfd-recent-time">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="wfd-recent-actions">
                            {onRePasteText && (
                              <button
                                className="wfd-btn-mini"
                                onClick={() => onRePasteText(item.polishedText || item.rawTranscript)}
                                title="Insert at current cursor"
                              >
                                <ArrowUpRight size={11} />
                                <span>Insert</span>
                              </button>
                            )}
                            <button
                              className="wfd-btn-mini"
                              onClick={() => handleCopy(item.id, item.polishedText || item.rawTranscript)}
                              title="Copy text"
                            >
                              {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                        <p className="wfd-recent-text">{item.polishedText || item.rawTranscript}</p>
                        <div className="wfd-recent-footer">
                          <span>{item.wordCount || item.polishedText?.split(/\s+/).length || 0} words</span>
                          <span>•</span>
                          <span>{item.durationMs ? `${(item.durationMs / 1000).toFixed(1)}s` : 'Real-time'}</span>
                          <span>•</span>
                          <span className="text-orange-600 font-semibold">⚡ {Math.round(((item.polishedText || item.rawTranscript || '').length) / 4)} tokens</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY & FEED */}
        {currentTab === 'history' && (
          <div className="wfd-history-arena">
            <div className="wfd-pane-header">
              <div>
                <h3 className="wfd-section-title">Dictation History & Usage Feed</h3>
                <p className="wfd-section-desc">Search and manage all recorded voice transcripts across your workflow.</p>
              </div>
              {history.length > 0 && (
                <button className="wfd-btn-view-all text-red-600 hover:text-red-700" onClick={handleClearAllHistory}>
                  <Trash2 size={12} />
                  <span>Clear All History</span>
                </button>
              )}
            </div>

            <div className="wfd-history-toolbar">
              <div className="wfd-history-search">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transcripts by keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="wfd-app-pills-row">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter size={11} /> Apps:
                </span>
                {uniqueApps.map((app) => (
                  <button
                    key={app}
                    className={`wfd-app-filter-pill ${appFilter === app ? 'is-active' : ''}`}
                    onClick={() => setAppFilter(app)}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="wfd-empty-state">
                <Clock size={28} className="text-slate-400 mb-2" />
                <h4>No dictations matched your search</h4>
                <p>Try clearing your search query or app filter.</p>
              </div>
            ) : (
              <div className="wfd-recent-grid">
                {filteredHistory.map((item) => {
                  const isCopied = copiedId === item.id
                  return (
                    <div key={item.id} className="wfd-recent-card">
                      <div className="wfd-recent-top">
                        <div className="wfd-recent-meta">
                          <span className="wfd-recent-app">{item.targetApp || 'Desktop'}</span>
                          <span className="wfd-recent-time">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="wfd-recent-actions">
                          {onRePasteText && (
                            <button
                              className="wfd-btn-mini"
                              onClick={() => onRePasteText(item.polishedText || item.rawTranscript)}
                              title="Insert at current cursor"
                            >
                              <ArrowUpRight size={11} />
                              <span>Insert</span>
                            </button>
                          )}
                          <button
                            className="wfd-btn-mini"
                            onClick={() => handleCopy(item.id, item.polishedText || item.rawTranscript)}
                            title="Copy text"
                          >
                            {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            className="wfd-btn-mini hover:text-red-600"
                            onClick={() => handleDeleteHistory(item.id)}
                            title="Delete item"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="wfd-recent-text">{item.polishedText || item.rawTranscript}</p>
                      <div className="wfd-recent-footer">
                        <span>{item.wordCount || item.polishedText?.split(/\s+/).length || 0} words</span>
                        <span>•</span>
                        <span>{item.durationMs ? `${(item.durationMs / 1000).toFixed(1)}s` : 'Real-time'}</span>
                        <span>•</span>
                        <span className="text-orange-600 font-semibold">⚡ {Math.round(((item.polishedText || item.rawTranscript || '').length) / 4)} tokens</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRO PLANS */}
        {currentTab === 'pricing' && (
          <PricingTable />
        )}

        {/* TAB 4: PROFILE */}
        {currentTab === 'profile' && (
          <ProfileSection
            settings={effectiveSettings}
            onUpdateSettings={updateSettings}
            userProfile={userProfile}
            onUpdateProfile={(p) => setUserProfile(p)}
            startupEnabled={startupEnabled}
            onToggleStartup={handleToggleStartup}
          />
        )}
      </main>

      {/* First-launch Authentication Gate Modal */}
      <AuthGateModal
        isOpen={showAuthGate}
        onAuthenticated={(profile) => {
          setUserProfile(profile)
          setShowAuthGate(false)
        }}
        onClose={() => setShowAuthGate(false)}
      />

      {/* Mandatory Version Update Modal */}
      <UpdateRequiredModal
        isOpen={Boolean(updateInfo?.isUpdateRequired)}
        updateInfo={updateInfo}
        onCheckAgain={async () => {
          if (window.electronAPI?.checkForUpdates) {
            const res = await window.electronAPI.checkForUpdates()
            if (res) setUpdateInfo(res)
          }
        }}
      />
    </div>
  )
}
