import React, { useState, useEffect } from 'react'
import {
  Activity,
  Search,
  Calendar,
  Layers,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react'

interface ContextHubProps {
  activeApp?: string
}

export const ContextHub: React.FC<ContextHubProps> = ({ activeApp = 'Desktop' }) => {
  const [trackerEnabled, setTrackerEnabled] = useState(true)
  const [activities, setActivities] = useState<any[]>([])
  const [stats, setStats] = useState<{ eventCount: number; taskCount: number; dbSizeBytes: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null)
  const [dayReconstruction, setDayReconstruction] = useState<any | null>(null)
  const [isGeneratingReconstruction, setIsGeneratingReconstruction] = useState(false)

  const loadData = async () => {
    if (!window.electronAPI) return
    try {
      if ((window.electronAPI as any).getScreenTrackingStatus) {
        const status = await (window.electronAPI as any).getScreenTrackingStatus()
        setTrackerEnabled(status.enabled)
        setActivities(status.recentActivities || [])
      }
      if (window.electronAPI.getContextStats) {
        const s = await window.electronAPI.getContextStats()
        setStats(s)
      }
    } catch (err) {
      console.warn('[VESPER ContextHub] Load data warning:', err)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleTracker = async () => {
    if (!(window.electronAPI as any)?.toggleScreenTracking) return
    try {
      const res = await (window.electronAPI as any).toggleScreenTracking()
      setTrackerEnabled(res.enabled)
      setActivities(res.recentActivities || [])
    } catch (err) {
      console.warn('[VESPER ContextHub] Toggle error:', err)
    }
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchQuery.trim() || !window.electronAPI?.searchUserContext) return

    setIsSearching(true)
    try {
      const res = await window.electronAPI.searchUserContext({
        standaloneQuery: searchQuery.trim(),
        limit: 8
      })
      setSearchResults(res)
    } catch (err) {
      console.warn('[VESPER ContextHub] Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleGenerateDayReconstruction = async () => {
    if (!window.electronAPI?.getDayReconstruction) return
    setIsGeneratingReconstruction(true)
    try {
      const res = await window.electronAPI.getDayReconstruction(Date.now())
      setDayReconstruction(res)
    } catch (err) {
      console.warn('[VESPER ContextHub] Day reconstruction error:', err)
    } finally {
      setIsGeneratingReconstruction(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedReceipt(id)
    setTimeout(() => setCopiedReceipt(null), 1500)
  }

  return (
    <div className="ch-root">
      {/* Top Banner: Ambient Status & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--wf-border)',
          borderRadius: 'var(--wf-radius-md)',
          padding: '12px 14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--wf-radius-sm)',
              background: trackerEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: trackerEnabled ? 'var(--wf-success)' : 'var(--wf-text-muted)'
            }}
          >
            <Activity size={15} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
                Ambient Screen & Context Engine
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: trackerEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  color: trackerEnabled ? 'var(--wf-success)' : 'var(--wf-text-muted)'
                }}
              >
                {trackerEnabled ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--wf-text-muted)', marginTop: 1 }}>
              Passive window tracking, OCR receipts, and local SQLite memory events.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={handleToggleTracker}
            className="wfd-btn-subtle"
            style={{ fontSize: '10.5px', padding: '3px 8px' }}
          >
            {trackerEnabled ? 'Pause Tracker' : 'Resume Tracker'}
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="wfd-tb-btn"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="ch-kpi-grid">
        <div className="ch-kpi-card">
          <span className="ch-kpi-label">Active App</span>
          <span className="ch-kpi-value" style={{ fontSize: '14px' }}>{activeApp}</span>
        </div>
        <div className="ch-kpi-card">
          <span className="ch-kpi-label">Context Events</span>
          <span className="ch-kpi-value">{stats?.eventCount ?? activities.length}</span>
        </div>
        <div className="ch-kpi-card">
          <span className="ch-kpi-label">Local Memory DB</span>
          <span className="ch-kpi-value">
            {stats?.dbSizeBytes ? `${(stats.dbSizeBytes / (1024 * 1024)).toFixed(2)} MB` : '100% Local'}
          </span>
        </div>
      </div>

      {/* Main Grid: Search/Standup (Left) + Screen Activity Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
        {/* Left Column: Search & Day Reconstructor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Deep Ambient Search */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--wf-border)',
              borderRadius: 'var(--wf-radius-md)',
              padding: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Search size={13} style={{ color: 'var(--wf-text-muted)' }} />
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
                Search Ambient Memory
              </span>
            </div>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past activities, files, or topics..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--wf-border)',
                  borderRadius: 'var(--wf-radius-sm)',
                  padding: '5px 8px',
                  color: 'var(--wf-text-primary)',
                  fontSize: '11px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                className="wfd-btn-primary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            {/* Search Results Display */}
            {searchResults && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: '10px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Found {searchResults.results?.length || 0} matches ({searchResults.totalEventsScanned} scanned)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 200, overflowY: 'auto' }}>
                  {searchResults.results?.map((res: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--wf-border)',
                        borderRadius: 'var(--wf-radius-sm)',
                        padding: '7px 9px',
                        fontSize: '11px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span className="ch-receipt-pill">{res.receipt}</span>
                        <span style={{ color: 'var(--wf-text-muted)', fontSize: '9.5px', fontFamily: 'var(--font-mono)' }}>Match</span>
                      </div>
                      <div style={{ color: 'var(--wf-text-secondary)', lineHeight: 1.4 }}>{res.matchedSnippet}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Day Reconstruction / Standup Dev Log */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--wf-border)',
              borderRadius: 'var(--wf-radius-md)',
              padding: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={13} style={{ color: 'var(--wf-text-muted)' }} />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
                  Day Reconstructor
                </span>
              </div>
              <button
                onClick={handleGenerateDayReconstruction}
                disabled={isGeneratingReconstruction}
                className="wfd-btn-subtle"
                style={{ fontSize: '10px', padding: '2px 7px' }}
              >
                {isGeneratingReconstruction ? 'Synthesizing...' : 'Generate Log'}
              </button>
            </div>

            {dayReconstruction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9.5px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {dayReconstruction.eventsAnalyzed} events · {dayReconstruction.uniqueAppsEngaged?.length || 0} apps
                  </span>
                  <button
                    onClick={() => handleCopy(dayReconstruction.markdownSummary, 'day_log')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedReceipt === 'day_log' ? 'var(--wf-success)' : 'var(--wf-text-muted)',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedReceipt === 'day_log' ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedReceipt === 'day_log' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--wf-border)',
                    borderRadius: 'var(--wf-radius-sm)',
                    padding: '8px 10px',
                    fontSize: '10.5px',
                    color: 'var(--wf-text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 160,
                    overflowY: 'auto',
                    margin: 0
                  }}
                >
                  {dayReconstruction.markdownSummary}
                </pre>
              </div>
            ) : (
              <div style={{ fontSize: '10.5px', color: 'var(--wf-text-muted)', lineHeight: 1.4 }}>
                Synthesizes today's screen snapshots, edited files, and window switches into an automated standup dev log.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Screen Activity Stream */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--wf-border)',
            borderRadius: 'var(--wf-radius-md)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={13} style={{ color: 'var(--wf-text-muted)' }} />
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
                Activity Receipts
              </span>
            </div>
            <span style={{ fontSize: '9.5px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {activities.length} snapshots
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', maxHeight: 420, paddingRight: 2 }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: 'var(--wf-text-muted)', fontSize: '11px' }}>
                <Activity size={18} style={{ opacity: 0.3, marginBottom: 6 }} />
                <div>Recording initial screen activities...</div>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--wf-border)',
                    borderRadius: 'var(--wf-radius-sm)',
                    padding: '7px 9px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 500,
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--wf-text-secondary)'
                      }}
                    >
                      {act.activeApp}
                    </span>
                    <button
                      onClick={() => handleCopy(act.receipt, act.id)}
                      title="Copy Littlebird Receipt"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedReceipt === act.id ? 'var(--wf-success)' : 'var(--wf-text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedReceipt === act.id ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--wf-text-primary)' }}>{act.activitySummary}</div>
                  <div className="ch-receipt-pill" style={{ width: 'fit-content' }}>{act.receipt}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
