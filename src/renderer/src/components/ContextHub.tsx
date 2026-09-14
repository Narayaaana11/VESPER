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
      console.warn('[QEVRA ContextHub] Load data warning:', err)
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
      console.warn('[QEVRA ContextHub] Toggle error:', err)
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
      console.warn('[QEVRA ContextHub] Search error:', err)
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
      console.warn('[QEVRA ContextHub] Day reconstruction error:', err)
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
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 10,
          padding: '12px 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: trackerEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: trackerEnabled ? '#10b981' : '#64748b'
            }}
          >
            <Activity size={17} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                Ambient Screen & Context Engine
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  background: trackerEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                  color: trackerEnabled ? '#34d399' : '#94a3b8'
                }}
              >
                {trackerEnabled ? 'Active' : 'Paused'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: 1 }}>
              Passive window tracking, OCR receipts, and local context events.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleToggleTracker}
            className="wfd-btn-subtle"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {trackerEnabled ? 'Pause Tracker' : 'Resume Tracker'}
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            className="wfd-tb-btn"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="ch-kpi-grid">
        <div className="ch-kpi-card">
          <span className="ch-kpi-label">Active App</span>
          <span className="ch-kpi-value" style={{ fontSize: '15px' }}>{activeApp}</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
        {/* Left Column: Search & Day Reconstructor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Deep Ambient Search */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 10,
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Search size={14} color="#818cf8" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>Search Ambient Memory</span>
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
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 6,
                  padding: '6px 10px',
                  color: '#f8fafc',
                  fontSize: '11.5px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                className="wfd-btn-primary"
                style={{ fontSize: '11px', padding: '5px 12px' }}
              >
                {isSearching ? '...' : 'Search'}
              </button>
            </form>

            {/* Search Results Display */}
            {searchResults && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                  Found {searchResults.results?.length || 0} matches ({searchResults.totalEventsScanned} scanned)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                  {searchResults.results?.map((res: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        fontSize: '11.5px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span className="ch-receipt-pill">{res.receipt}</span>
                        <span style={{ color: '#818cf8', fontSize: '10px' }}>Match</span>
                      </div>
                      <div style={{ color: '#cbd5e1', lineHeight: 1.4 }}>{res.matchedSnippet}</div>
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
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 10,
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="#34d399" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>Day Reconstructor</span>
              </div>
              <button
                onClick={handleGenerateDayReconstruction}
                disabled={isGeneratingReconstruction}
                className="wfd-btn-subtle"
                style={{ fontSize: '10.5px', padding: '3px 8px' }}
              >
                {isGeneratingReconstruction ? 'Synthesizing...' : 'Generate Log'}
              </button>
            </div>

            {dayReconstruction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>
                    Coverage: {dayReconstruction.eventsAnalyzed} events · {dayReconstruction.uniqueAppsEngaged?.length || 0} apps
                  </span>
                  <button
                    onClick={() => handleCopy(dayReconstruction.markdownSummary, 'day_log')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedReceipt === 'day_log' ? '#34d399' : '#94a3b8',
                      fontSize: '10.5px',
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
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#cbd5e1',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 180,
                    overflowY: 'auto',
                    margin: 0
                  }}
                >
                  {dayReconstruction.markdownSummary}
                </pre>
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                Synthesizes today's screen snapshots, edited files, and window switches into an automated standup report.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Screen Activity Stream */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 10,
            padding: '14px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} color="#818cf8" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>Activity Receipts</span>
            </div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>{activities.length} snapshots</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 460, paddingRight: 2 }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: '#64748b', fontSize: '11.5px' }}>
                <Activity size={20} style={{ opacity: 0.4, marginBottom: 6 }} />
                <div>Recording initial screen activities...</div>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '1px 5px',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: '#cbd5e1'
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
                        color: copiedReceipt === act.id ? '#34d399' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedReceipt === act.id ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#f1f5f9' }}>{act.activitySummary}</div>
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
