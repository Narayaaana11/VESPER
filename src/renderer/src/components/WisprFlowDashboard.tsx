import React, { useState, useEffect, useMemo } from 'react'
import {
  Clock,
  BookOpen,
  Zap,
  Sliders,
  Settings as SettingsIcon,
  Search,
  Copy,
  Check,
  Trash2,
  Plus,
  Key,
  Shield,
  Volume2,
  Mic,
  Minus,
  X,
  ExternalLink,
  Languages,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  Activity,
  MessageSquare
} from 'lucide-react'
import { AuditVerificationForm } from './AuditVerificationForm'
import { ContextHub } from './ContextHub'
import { ContextChat } from './ContextChat'
import {
  DictationHistoryItem,
  VoiceSnippet,
  CustomVocabularyItem,
  AppProfileStyle,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  getSnippets,
  saveSnippet,
  deleteSnippet,
  getVocabulary,
  addVocabularyWord,
  deleteVocabularyWord,
  getAppProfiles,
  updateAppProfile,
  syncChannel
} from '../types/dashboard'
import { AppSettings } from '../types/task'

interface WisprFlowDashboardProps {
  settings?: AppSettings
  onUpdateSettings?: (newSettings: AppSettings) => void
  onBackToPill?: () => void
  onRePasteText?: (text: string) => void
  activeApp?: string
  standalone?: boolean
}

type TabType = 'context' | 'chat' | 'history' | 'dictionary' | 'snippets' | 'style' | 'settings' | 'audit'

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

export const WisprFlowDashboard: React.FC<WisprFlowDashboardProps> = ({
  settings: propSettings,
  onUpdateSettings,
  onBackToPill,
  onRePasteText,
  activeApp = 'Desktop',
  standalone = false
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('context')

  // Local settings if running standalone
  const [localSettings, setLocalSettings] = useState<AppSettings>(() => {
    if (propSettings) return propSettings
    try {
      const raw = localStorage.getItem('qevra_settings')
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    } catch {}
    return DEFAULT_SETTINGS
  })

  const effectiveSettings = propSettings || localSettings

  // History, snippets, vocabulary, and profiles state
  const [history, setHistory] = useState<DictationHistoryItem[]>(() => getHistory())
  const [snippets, setSnippets] = useState<VoiceSnippet[]>(() => getSnippets())
  const [vocabulary, setVocabulary] = useState<CustomVocabularyItem[]>(() => getVocabulary())
  const [profiles, setProfiles] = useState<AppProfileStyle[]>(() => getAppProfiles())

  const [searchQuery, setSearchQuery] = useState('')
  const [appFilter, setAppFilter] = useState<string>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // New snippet drawer state
  const [newSnippetTrigger, setNewSnippetTrigger] = useState('')
  const [newSnippetExpansion, setNewSnippetExpansion] = useState('')
  const [newSnippetCategory, setNewSnippetCategory] = useState('Productivity')
  const [showAddSnippet, setShowAddSnippet] = useState(false)

  // New vocabulary word input
  const [newVocabTerm, setNewVocabTerm] = useState('')
  const [newVocabCategory, setNewVocabCategory] = useState('General')

  // Settings draft
  const [draftApiKey, setDraftApiKey] = useState(effectiveSettings.apiKey || '')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)

  // Cross-window sync listener: when dictation completes in capsule, update history in real-time
  useEffect(() => {
    const channel = syncChannel
    if (!channel) return

    const handleSyncMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || !data.type) return

      if (data.type === 'HISTORY_CHANGED') {
        setHistory(getHistory())
      } else if (data.type === 'SNIPPETS_CHANGED') {
        setSnippets(getSnippets())
      } else if (data.type === 'VOCABULARY_CHANGED') {
        setVocabulary(getVocabulary())
      } else if (data.type === 'PROFILES_CHANGED') {
        setProfiles(getAppProfiles())
      }
    }

    channel.addEventListener('message', handleSyncMessage)
    return () => channel.removeEventListener('message', handleSyncMessage)
  }, [])

  // Also poll settings on mount if standalone
  useEffect(() => {
    if (standalone && window.electronAPI?.getSettings) {
      window.electronAPI.getSettings().then((s: any) => {
        if (s) {
          setLocalSettings((prev) => ({ ...prev, ...s }))
          setDraftApiKey(s.apiKey || '')
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
        localStorage.setItem('qevra_settings', JSON.stringify(next))
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

  // Delete history item
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

  // Add snippet
  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSnippetTrigger.trim() || !newSnippetExpansion.trim()) return
    const created = saveSnippet({
      trigger: newSnippetTrigger.trim(),
      expansion: newSnippetExpansion.trim(),
      category: newSnippetCategory
    })
    setSnippets((prev) => [created, ...prev])
    setNewSnippetTrigger('')
    setNewSnippetExpansion('')
    setShowAddSnippet(false)
  }

  // Delete snippet
  const handleDeleteSnippet = (id: string) => {
    const updated = deleteSnippet(id)
    setSnippets(updated)
  }

  // Add vocab word
  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVocabTerm.trim()) return
    const created = addVocabularyWord(newVocabTerm.trim(), newVocabCategory)
    setVocabulary((prev) => {
      if (prev.some((v) => v.term.toLowerCase() === created.term.toLowerCase())) return prev
      return [created, ...prev]
    })
    setNewVocabTerm('')
  }

  // Delete vocab word
  const handleDeleteVocab = (id: string) => {
    const updated = deleteVocabularyWord(id)
    setVocabulary(updated)
  }

  // Toggle app profile
  const handleToggleProfile = (profile: AppProfileStyle) => {
    const updated = updateAppProfile({ ...profile, enabled: !profile.enabled })
    setProfiles(updated)
  }

  // Save API key
  const handleSaveApiKey = () => {
    updateSettings({ apiKey: draftApiKey.trim() })
    setSaveFeedback('Saved ✓')
    setTimeout(() => setSaveFeedback(null), 2200)
  }

  // Window close / hide
  const handleWindowClose = () => {
    if (standalone) {
      window.electronAPI?.hideDashboard?.()
    } else if (onBackToPill) {
      onBackToPill()
    }
  }

  const handleWindowMinimize = () => {
    window.electronAPI?.minimizeHUD?.()
  }

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.polishedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetApp.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesApp =
        appFilter === 'All' || item.targetApp.toLowerCase() === appFilter.toLowerCase()

      return matchesSearch && matchesApp
    })
  }, [history, searchQuery, appFilter])

  // Unique apps for filter chips
  const uniqueApps = useMemo(() => {
    const set = new Set(history.map((h) => h.targetApp))
    return ['All', ...Array.from(set)]
  }, [history])

  return (
    <div className={`wfd-root ${standalone ? 'is-standalone-window' : ''}`}>
      {/* Top Application Title Bar */}
      <header className="wfd-titlebar">
        <div className="wfd-tb-left">
          <div className="wfd-tb-brand">
            <div className="wfd-tb-logo-icon">
              <Mic size={14} />
            </div>
            <span className="wfd-tb-title">QEVRA Flow</span>
          </div>

          <div className="wfd-tb-status">
            <span className="wfd-tb-dot" />
            <span>Ready</span>
            <span className="wfd-tb-model">{effectiveSettings.whisperModel || 'whisper-large-v3'}</span>
          </div>

          <div className="wfd-tb-key-badge" title="Press & hold this key anywhere in Windows to dictate">
            <Key size={11} />
            <span>{effectiveSettings.holdKey || 'RIGHT ALT'}</span>
          </div>
        </div>

        {/* Global Search inside Titlebar */}
        <div className="wfd-tb-search">
          <Search size={13} className="wfd-tb-search-icon" />
          <input
            type="text"
            placeholder="Search transcripts, dictionary, or snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="wfd-tb-search-clear" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        {/* Window Controls (Minimize, Close) */}
        <div className="wfd-tb-controls">
          {standalone ? (
            <>
              <button
                className="wfd-tb-btn"
                onClick={handleWindowMinimize}
                title="Minimize window"
              >
                <Minus size={13} />
              </button>
              <button
                className="wfd-tb-btn wfd-tb-close"
                onClick={handleWindowClose}
                title="Close window (Dictation continues in background)"
              >
                <X size={13} />
              </button>
            </>
          ) : (
            <button
              className="wfd-tb-pill-back"
              onClick={onBackToPill}
              title="Return to compact voice capsule (Esc)"
            >
              <Minus size={12} />
              <span>Floating Capsule</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="wfd-main-layout">
        {/* Left Navigation Sidebar */}
        <aside className="wfd-nav-sidebar">
          <div className="wfd-nav-group">
            <button
              className={`wfd-nav-link ${currentTab === 'context' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('context')}
            >
              <Activity size={15} />
              <span>Context & Screen</span>
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'chat' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('chat')}
            >
              <MessageSquare size={15} />
              <span>AI Memory Chat</span>
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'history' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('history')}
            >
              <Clock size={15} />
              <span>History</span>
              {history.length > 0 && <span className="wfd-nav-badge">{history.length}</span>}
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'dictionary' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('dictionary')}
            >
              <BookOpen size={15} />
              <span>Dictionary</span>
              {vocabulary.length > 0 && <span className="wfd-nav-badge">{vocabulary.length}</span>}
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'snippets' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('snippets')}
            >
              <Zap size={15} />
              <span>Snippets</span>
              {snippets.length > 0 && <span className="wfd-nav-badge">{snippets.length}</span>}
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'style' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('style')}
            >
              <Sliders size={15} />
              <span>Style</span>
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'settings' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('settings')}
            >
              <SettingsIcon size={15} />
              <span>Settings</span>
            </button>

            <button
              className={`wfd-nav-link ${currentTab === 'audit' ? 'is-active' : ''}`}
              onClick={() => setCurrentTab('audit')}
            >
              <ClipboardCheck size={15} />
              <span>Audit & Verify</span>
            </button>
          </div>

          {/* Sidebar Bottom Shortcut Info */}
          <div className="wfd-sidebar-footer-hint">
            <div className="wfd-hint-card">
              <div className="wfd-hint-title">Voice Dictation</div>
              <div className="wfd-hint-body">
                Hold <code>{effectiveSettings.holdKey || 'RIGHT ALT'}</code> anywhere on your desktop to dictate into any app.
              </div>
            </div>
          </div>
        </aside>

        {/* Right Tab Content View */}
        <main className="wfd-tab-content">
          {/* TAB 0A: AMBIENT CONTEXT & SCREEN MEMORY */}
          {currentTab === 'context' && (
            <ContextHub activeApp={activeApp} />
          )}

          {/* TAB 0B: AI AMBIENT MEMORY CHAT */}
          {currentTab === 'chat' && (
            <ContextChat settings={effectiveSettings} activeApp={activeApp} />
          )}

          {/* TAB 1: HISTORY (Clean real transcripts only) */}
          {currentTab === 'history' && (
            <div className="wfd-tab-pane">
              <div className="wfd-pane-header">
                <div>
                  <h2>Dictation History</h2>
                  <p>All your voice dictations across applications. Click any text to copy.</p>
                </div>

                {history.length > 0 && (
                  <button className="wfd-btn-clear" onClick={handleClearAllHistory}>
                    <Trash2 size={13} />
                    <span>Clear history</span>
                  </button>
                )}
              </div>

              {/* Filter chips if multiple apps */}
              {uniqueApps.length > 2 && (
                <div className="wfd-filter-chips">
                  {uniqueApps.map((app) => (
                    <button
                      key={app}
                      className={`wfd-chip ${appFilter === app ? 'is-active' : ''}`}
                      onClick={() => setAppFilter(app)}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              )}

              {/* History list */}
              {filteredHistory.length === 0 ? (
                <div className="wfd-empty-history">
                  <div className="wfd-empty-icon-wrap">
                    <Clock size={28} />
                  </div>
                  <h3>No dictation history yet</h3>
                  <p>
                    Hold or tap <strong>{effectiveSettings.holdKey || 'RIGHT ALT'}</strong> in any application (Cursor, Slack, Chrome, Gmail) to start dictating. Your transcripts will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="wfd-history-feed">
                  {filteredHistory.map((item) => {
                    const timeAgo = formatTimeAgo(item.timestamp)
                    const isCopied = copiedId === item.id

                    return (
                      <div key={item.id} className="wfd-feed-card">
                        <div className="wfd-fc-header">
                          <div className="wfd-fc-meta">
                            <span className="wfd-fc-app">{item.targetApp}</span>
                            {item.windowTitle && (
                              <span className="wfd-fc-window" title={item.windowTitle}>
                                {item.windowTitle}
                              </span>
                            )}
                            <span className="wfd-fc-time">{timeAgo}</span>
                          </div>

                          <div className="wfd-fc-actions">
                            <button
                              className={`wfd-fc-copy ${isCopied ? 'is-copied' : ''}`}
                              onClick={() => handleCopy(item.id, item.polishedText)}
                              title="Copy text to clipboard"
                            >
                              {isCopied ? <Check size={13} /> : <Copy size={13} />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>

                            {onRePasteText && (
                              <button
                                className="wfd-fc-paste"
                                onClick={() => onRePasteText(item.polishedText)}
                                title="Paste directly into current active window"
                              >
                                <span>Re-Paste</span>
                              </button>
                            )}

                            <button
                              className="wfd-fc-del"
                              onClick={() => handleDeleteHistory(item.id)}
                              title="Delete entry"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="wfd-fc-body">
                          <p>{item.polishedText}</p>
                        </div>

                        {item.rawTranscript && item.rawTranscript !== item.polishedText && (
                          <div className="wfd-fc-raw">
                            <span className="wfd-fc-raw-label">Raw audio transcript:</span>
                            <span className="wfd-fc-raw-text">"{item.rawTranscript}"</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DICTIONARY (Custom Vocabulary) */}
          {currentTab === 'dictionary' && (
            <div className="wfd-tab-pane">
              <div className="wfd-pane-header">
                <div>
                  <h2>Custom Dictionary</h2>
                  <p>Add proper names, technical acronyms, and specialized jargon so Whisper spells them correctly.</p>
                </div>
              </div>

              {/* Add Word Input Bar */}
              <form className="wfd-vocab-bar" onSubmit={handleAddVocab}>
                <input
                  type="text"
                  placeholder="Add custom word or technical term (e.g. 'PostgreSQL', 'QEVRA', 'Anthropic')..."
                  value={newVocabTerm}
                  onChange={(e) => setNewVocabTerm(e.target.value)}
                />
                <select
                  value={newVocabCategory}
                  onChange={(e) => setNewVocabCategory(e.target.value)}
                >
                  <option value="General">General</option>
                  <option value="Tech">Tech</option>
                  <option value="Names">Names</option>
                  <option value="Acronyms">Acronyms</option>
                </select>
                <button type="submit" className="wfd-btn-primary">
                  <Plus size={14} />
                  <span>Add Word</span>
                </button>
              </form>

              {/* Words Chips Grid */}
              <div className="wfd-vocab-section">
                <div className="wfd-section-header-small">
                  <span>Custom Words ({vocabulary.length})</span>
                </div>

                {vocabulary.length === 0 ? (
                  <div className="wfd-empty-vocab">
                    <p>No custom words added yet. Add terms above that you frequently speak.</p>
                  </div>
                ) : (
                  <div className="wfd-vocab-chips">
                    {vocabulary.map((v) => (
                      <div key={v.id} className="wfd-vocab-chip">
                        <span className="wfd-vc-term">{v.term}</span>
                        {v.category && <span className="wfd-vc-cat">{v.category}</span>}
                        <button
                          className="wfd-vc-remove"
                          onClick={() => handleDeleteVocab(v.id)}
                          title="Remove word"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SNIPPETS (Voice Shortcuts) */}
          {currentTab === 'snippets' && (
            <div className="wfd-tab-pane">
              <div className="wfd-pane-header">
                <div>
                  <h2>Voice Snippets</h2>
                  <p>Voice shortcuts that automatically expand into full messages or templates when you speak the trigger.</p>
                </div>

                <button
                  className="wfd-btn-primary"
                  onClick={() => setShowAddSnippet((prev) => !prev)}
                >
                  <Plus size={14} />
                  <span>New Snippet</span>
                </button>
              </div>

              {/* Inline Snippet Creator Drawer */}
              {showAddSnippet && (
                <form className="wfd-snippet-form-box" onSubmit={handleCreateSnippet}>
                  <h4>Create Voice Expansion</h4>
                  <div className="wfd-sf-row">
                    <div>
                      <label>Voice Trigger Phrase</label>
                      <input
                        type="text"
                        placeholder="e.g. 'my zoom link' or 'meeting agenda'"
                        value={newSnippetTrigger}
                        onChange={(e) => setNewSnippetTrigger(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Category</label>
                      <select
                        value={newSnippetCategory}
                        onChange={(e) => setNewSnippetCategory(e.target.value)}
                      >
                        <option value="Productivity">Productivity</option>
                        <option value="Development">Development</option>
                        <option value="Communication">Communication</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <label>Expanded Content to Insert</label>
                    <textarea
                      rows={3}
                      placeholder="The full text that will be pasted when you say the trigger phrase..."
                      value={newSnippetExpansion}
                      onChange={(e) => setNewSnippetExpansion(e.target.value)}
                      required
                    />
                  </div>

                  <div className="wfd-sf-actions">
                    <button
                      type="button"
                      className="wfd-btn-subtle"
                      onClick={() => setShowAddSnippet(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="wfd-btn-primary">
                      Save Snippet
                    </button>
                  </div>
                </form>
              )}

              {/* Active Snippets List */}
              <div className="wfd-snippets-list">
                {snippets.length === 0 ? (
                  <div className="wfd-empty-snippets">
                    <p>No voice snippets yet. Click "+ New Snippet" to create your first voice shortcut.</p>
                  </div>
                ) : (
                  snippets.map((snip) => (
                    <div key={snip.id} className="wfd-snippet-item">
                      <div className="wfd-si-left">
                        <div className="wfd-si-trigger">
                          <Zap size={14} color="#8b5cf6" />
                          <span>"{snip.trigger}"</span>
                          <span className="wfd-si-tag">{snip.category}</span>
                        </div>
                        <div className="wfd-si-content">
                          <p>{snip.expansion}</p>
                        </div>
                      </div>

                      <div className="wfd-si-actions">
                        <button
                          className="wfd-fc-copy"
                          onClick={() => handleCopy(snip.id, snip.expansion)}
                          title="Copy expansion"
                        >
                          {copiedId === snip.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedId === snip.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          className="wfd-fc-del"
                          onClick={() => handleDeleteSnippet(snip.id)}
                          title="Delete snippet"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: STYLE (Formatting & Language) */}
          {currentTab === 'style' && (
            <div className="wfd-tab-pane">
              <div className="wfd-pane-header">
                <div>
                  <h2>Dictation Style & Language</h2>
                  <p>Fine-tune formatting, multilingual transliteration, and tone rules.</p>
                </div>
              </div>

              <div className="wfd-cards-stack">
                {/* Language Card */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Languages size={17} color="#8b5cf6" />
                    <div>
                      <h4>Language & Transliteration</h4>
                      <p>Support for multilingual speech with Romanized output.</p>
                    </div>
                  </div>

                  <div className="wfd-sg-body">
                    <div className="wfd-toggle-item">
                      <div>
                        <div className="wfd-ti-title">English Letters Only</div>
                        <div className="wfd-ti-desc">
                          When speaking in non-English languages (Hindi, Spanish, Telugu, Tamil, French, etc.), automatically output the text in English/Roman alphabet letters.
                        </div>
                      </div>
                      <label className="wfd-switch">
                        <input
                          type="checkbox"
                          checked={effectiveSettings.englishLettersOnly !== false}
                          onChange={(e) =>
                            updateSettings({ englishLettersOnly: e.target.checked })
                          }
                        />
                        <span className="wfd-slider" />
                      </label>
                    </div>

                    <div className="wfd-toggle-item">
                      <div>
                        <div className="wfd-ti-title">Smart Auto-Punctuation</div>
                        <div className="wfd-ti-desc">
                          Automatically formats sentences with clean commas, question marks, and capitalization based on natural speech pauses.
                        </div>
                      </div>
                      <label className="wfd-switch">
                        <input
                          type="checkbox"
                          checked={effectiveSettings.aiPolishing !== false}
                          onChange={(e) =>
                            updateSettings({ aiPolishing: e.target.checked })
                          }
                        />
                        <span className="wfd-slider" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Per-App Context Adaptation */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Sliders size={17} color="#06b6d4" />
                    <div>
                      <h4>Context-Adaptive Formatting</h4>
                      <p>Adapts dictation formatting depending on which application is active on your screen.</p>
                    </div>
                  </div>

                  <div className="wfd-profiles-list">
                    {profiles.map((p) => (
                      <div key={p.id} className="wfd-profile-row">
                        <div className="wfd-pr-info">
                          <div className="wfd-pr-name">
                            <span className="wfd-pr-dot" style={{ background: p.badgeColor }} />
                            <span>{p.appName}</span>
                          </div>
                          <span className="wfd-pr-tone">{p.tone}</span>
                          <p className="wfd-pr-guide">{p.formattingGuide}</p>
                        </div>

                        <label className="wfd-switch">
                          <input
                            type="checkbox"
                            checked={p.enabled}
                            onChange={() => handleToggleProfile(p)}
                          />
                          <span className="wfd-slider" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS (Hotkeys, Audio, API Keys) */}
          {currentTab === 'settings' && (
            <div className="wfd-tab-pane">
              <div className="wfd-pane-header">
                <div>
                  <h2>Settings & Preferences</h2>
                  <p>Manage hotkey triggers, speech models, audio feedback, and credentials.</p>
                </div>
              </div>

              <div className="wfd-cards-stack">
                {/* Hotkeys Section */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Key size={17} color="#10b981" />
                    <div>
                      <h4>Activation Hotkey</h4>
                      <p>Global key to hold or tap anywhere on your computer.</p>
                    </div>
                  </div>

                  <div className="wfd-sg-body">
                    <div className="wfd-field-row">
                      <label>Hold-to-Talk Key</label>
                      <select
                        value={effectiveSettings.holdKey || 'RIGHT ALT'}
                        onChange={(e) => updateSettings({ holdKey: e.target.value })}
                      >
                        <option value="RIGHT ALT">Right Alt (Recommended)</option>
                        <option value="LEFT ALT">Left Alt</option>
                        <option value="RIGHT CONTROL">Right Control</option>
                        <option value="LEFT CONTROL">Left Control</option>
                        <option value="F8">F8 Key</option>
                        <option value="CAPS LOCK">Caps Lock</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Groq API Key */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Shield size={17} color="#8b5cf6" />
                    <div>
                      <h4>Groq API Key</h4>
                      <p>High-speed Whisper-large-v3 and Llama-3.3-70b cloud inference. Saved securely on your device.</p>
                    </div>
                  </div>

                  <div className="wfd-sg-body">
                    <div className="wfd-api-bar">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="gsk_..."
                        value={draftApiKey}
                        onChange={(e) => setDraftApiKey(e.target.value)}
                      />
                      <button
                        type="button"
                        className="wfd-btn-subtle"
                        onClick={() => setShowApiKey((prev) => !prev)}
                      >
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        className="wfd-btn-primary"
                        onClick={handleSaveApiKey}
                      >
                        {saveFeedback || 'Save Key'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Models Configuration */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Sliders size={17} color="#06b6d4" />
                    <div>
                      <h4>Speech & Polishing Models</h4>
                      <p>Select speech recognition and context polishing models.</p>
                    </div>
                  </div>

                  <div className="wfd-sg-body">
                    <div className="wfd-field-row">
                      <label>Speech Recognition Model</label>
                      <select
                        value={effectiveSettings.whisperModel || 'whisper-large-v3'}
                        onChange={(e) => updateSettings({ whisperModel: e.target.value as any })}
                      >
                        <option value="whisper-large-v3">Whisper Large v3 (Most Accurate)</option>
                        <option value="whisper-large-v3-turbo">Whisper Large v3 Turbo (Ultra-Fast)</option>
                      </select>
                    </div>

                    <div className="wfd-field-row" style={{ marginTop: 12 }}>
                      <label>LLM Polishing Provider</label>
                      <select
                        value={effectiveSettings.aiProvider || 'groq'}
                        onChange={(e) => updateSettings({ aiProvider: e.target.value as any })}
                      >
                        <option value="groq">Groq Cloud (Llama 3.3 70B — ~300ms)</option>
                        <option value="ollama">Local Ollama (Llama 3.2 — 100% Private)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Behavior & Feedback */}
                <div className="wfd-setting-group">
                  <div className="wfd-sg-header">
                    <Volume2 size={17} color="#ec4899" />
                    <div>
                      <h4>Application Behavior</h4>
                      <p>Auto-paste and audio sound feedback preferences.</p>
                    </div>
                  </div>

                  <div className="wfd-sg-body">
                    <div className="wfd-toggle-item">
                      <div>
                        <div className="wfd-ti-title">Auto-Paste into Target App</div>
                        <div className="wfd-ti-desc">
                          Automatically pastes the final text directly into whichever text field had focus when you spoke.
                        </div>
                      </div>
                      <label className="wfd-switch">
                        <input
                          type="checkbox"
                          checked={effectiveSettings.autoPaste !== false}
                          onChange={(e) => updateSettings({ autoPaste: e.target.checked })}
                        />
                        <span className="wfd-slider" />
                      </label>
                    </div>

                    <div className="wfd-toggle-item">
                      <div>
                        <div className="wfd-ti-title">Audio Chimes Feedback</div>
                        <div className="wfd-ti-desc">
                          Play a subtle tone when recording starts and when transcription completes.
                        </div>
                      </div>
                      <label className="wfd-switch">
                        <input
                          type="checkbox"
                          checked={effectiveSettings.soundFeedback !== false}
                          onChange={(e) => updateSettings({ soundFeedback: e.target.checked })}
                        />
                        <span className="wfd-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT & VERIFICATION FORM (Full System Loop Check) */}
          {currentTab === 'audit' && (
            <AuditVerificationForm
              settings={effectiveSettings}
              activeApp={activeApp}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000)
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
