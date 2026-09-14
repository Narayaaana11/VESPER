import React, { useState, useEffect } from 'react'
import {
  Activity,
  Search,
  Calendar,
  Layers,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '24px 28px', color: '#f4f4f5' }}>
      {/* Top Banner: Ambient Status & Metrics */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(30, 27, 46, 0.8) 0%, rgba(18, 19, 26, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 14,
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: trackerEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${trackerEnabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: trackerEnabled ? '#34d399' : '#f87171'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Ambient Screen & Context Engine</h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: trackerEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: trackerEnabled ? '#34d399' : '#f87171',
                  border: `1px solid ${trackerEnabled ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                }}
              >
                {trackerEnabled ? 'LIVE RECORDING' : 'PAUSED'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
              Passively tracking active window titles, screen activity, and code workspaces with Littlebird evidence receipts.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleToggleTracker}
            style={{
              background: trackerEnabled ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              border: `1px solid ${trackerEnabled ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              color: trackerEnabled ? '#f87171' : '#34d399',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {trackerEnabled ? 'Pause Tracker' : 'Resume Tracker'}
          </button>
          <button
            onClick={loadData}
            title="Refresh"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 8,
              color: '#d4d4d8',
              padding: '7px 10px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <div style={{ background: 'rgba(20, 21, 26, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Active App</div>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: 4, color: '#e4e4e7' }}>{activeApp}</div>
        </div>
        <div style={{ background: 'rgba(20, 21, 26, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Memory Events</div>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: 4, color: '#a78bfa' }}>{stats?.eventCount ?? activities.length} events</div>
        </div>
        <div style={{ background: 'rgba(20, 21, 26, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Completed Tasks</div>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: 4, color: '#38bdf8' }}>{stats?.taskCount ?? 0} tasks</div>
        </div>
        <div style={{ background: 'rgba(20, 21, 26, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '12px 16px' }}>
          <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Local SQLite DB</div>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: 4, color: '#34d399' }}>
            {stats?.dbSizeBytes ? `${(stats.dbSizeBytes / (1024 * 1024)).toFixed(2)} MB` : '100% Local'}
          </div>
        </div>
      </div>

      {/* Main Grid: Search & Day Reconstruction (Left) + Screen Activity Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
        {/* Left Column: Search & Day Reconstructor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Deep Ambient Search */}
          <div style={{ background: 'rgba(20, 21, 26, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Search size={16} color="#a78bfa" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Search Ambient Memory</h3>
            </div>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. JWT token, App.tsx, standup notes, error 401..."
                style={{
                  flex: 1,
                  background: 'rgba(10, 11, 14, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#ffffff',
                  padding: '0 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Search Results Display */}
            {searchResults && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600 }}>
                  Found {searchResults.results?.length || 0} matches ({searchResults.totalEventsScanned} scanned)
                </div>

                {searchResults.tableOfContents && (
                  <pre
                    style={{
                      background: 'rgba(10, 11, 14, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 8,
                      padding: 10,
                      fontSize: '11px',
                      color: '#c4b5fd',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      margin: 0
                    }}
                  >
                    {searchResults.tableOfContents}
                  </pre>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                  {searchResults.results?.map((res: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 8,
                        padding: 10,
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '11px' }}>{res.receipt}</span>
                        <span style={{ color: '#fbbf24', fontSize: '10px' }}>Relevance: {'★'.repeat(res.relevanceScore)}</span>
                      </div>
                      <div style={{ color: '#d4d4d8', lineHeight: 1.4 }}>{res.matchedSnippet}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Day Reconstruction / Standup Dev Log */}
          <div style={{ background: 'rgba(20, 21, 26, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="#34d399" />
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Day Reconstructor & Standup Dev Log</h3>
              </div>
              <button
                onClick={handleGenerateDayReconstruction}
                disabled={isGeneratingReconstruction}
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  color: '#34d399',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isGeneratingReconstruction ? 'Generating...' : 'Generate Today\'s Log'}
              </button>
            </div>

            {dayReconstruction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#a1a1aa' }}>
                    Coverage: {dayReconstruction.eventsAnalyzed} events across {dayReconstruction.uniqueAppsEngaged?.length || 0} apps
                  </span>
                  <button
                    onClick={() => handleCopy(dayReconstruction.markdownSummary, 'day_log')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedReceipt === 'day_log' ? '#34d399' : '#a1a1aa',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedReceipt === 'day_log' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedReceipt === 'day_log' ? 'Copied' : 'Copy Markdown'}
                  </button>
                </div>
                <pre
                  style={{
                    background: 'rgba(10, 11, 14, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: '11px',
                    color: '#e4e4e7',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    maxHeight: 220,
                    overflowY: 'auto',
                    margin: 0
                  }}
                >
                  {dayReconstruction.markdownSummary}
                </pre>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
                Click "Generate Today's Log" to automatically synthesize your active IDE files, window switches, and tasks into a clean developer standup report.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Live Screen Activity Stream */}
        <div
          style={{
            background: 'rgba(20, 21, 26, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={16} color="#38bdf8" />
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Live Ambient Stream</h3>
            </div>
            <span style={{ fontSize: '11px', color: '#71717a' }}>{activities.length} snapshots</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 520, paddingRight: 4 }}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#71717a', fontSize: '12px' }}>
                <Activity size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                <div>Recording initial screen activities...</div>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 10,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: 'rgba(139, 92, 246, 0.18)',
                        color: '#c4b5fd'
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
                        color: copiedReceipt === act.id ? '#34d399' : '#71717a',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedReceipt === act.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#f4f4f5' }}>{act.activitySummary}</div>

                  <div style={{ fontSize: '10px', color: '#71717a', fontFamily: 'monospace' }}>{act.receipt}</div>

                  {act.thumbnailUrl && (
                    <div style={{ marginTop: 4, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <img src={act.thumbnailUrl} alt="Screen Frame" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
