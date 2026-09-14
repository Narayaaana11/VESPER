import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, Sliders, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
import { AppSettings } from '../types/task'

interface SettingsModalProps {
  settings: AppSettings
  onSave: (newSettings: Partial<AppSettings>) => void
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [keyStatus, setKeyStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [keyError, setKeyError] = useState<string | null>(null)

  const verifyGroqKey = async (keyToTest: string) => {
    const key = keyToTest.trim()
    if (!key) {
      setKeyStatus('idle')
      setKeyError(null)
      return
    }
    setKeyStatus('checking')
    setKeyError(null)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` }
      })
      if (res.ok) {
        setKeyStatus('valid')
        setKeyError(null)
      } else {
        const errJson = await res.json().catch(() => ({}))
        setKeyStatus('invalid')
        setKeyError(errJson?.error?.message || 'Invalid API key')
      }
    } catch (e: any) {
      setKeyStatus('invalid')
      setKeyError(e.message || 'Network error')
    }
  }

  useEffect(() => {
    if (settings.apiKey && settings.apiKey.trim()) {
      verifyGroqKey(settings.apiKey)
    }
  }, [settings.apiKey])

  return (
    <div
      style={{
        background: 'rgba(14, 16, 22, 0.96)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '6px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.75)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 600, color: '#f8fafc' }}>
          <Sliders size={15} color="#818cf8" />
          <span>Core Settings</span>
        </div>
        <button className="wf-icon-btn" onClick={onClose} title="Close settings" style={{ width: 26, height: 26 }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Hold-to-Talk Key */}
        <div>
          <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
            Hold-to-Talk Key (Wispr Flow)
          </label>
          <select
            value={settings.holdKey || 'RIGHT ALT'}
            onChange={(e) => {
              const key = e.target.value
              onSave({ holdKey: key })
              window.electronAPI?.setHoldKey(key)
            }}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="RIGHT ALT">Right Alt (AltGr) - Recommended</option>
            <option value="FN">Fn (Hardware Key)</option>
            <option value="RIGHT CTRL">Right Ctrl</option>
            <option value="LEFT ALT">Left Alt</option>
            <option value="CAPS LOCK">Caps Lock</option>
            <option value="F8">F8 Key</option>
          </select>
        </div>

        {/* AI Provider */}
        <div>
          <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
            Inference Engine
          </label>
          <select
            value={settings.aiProvider}
            onChange={(e) => onSave({ aiProvider: e.target.value as any })}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="groq">Groq Cloud (Whisper-large-v3 + Llama 3.3)</option>
            <option value="local">Built-in Local (Deterministic)</option>
            <option value="ollama">Ollama (Local Llama 3.2)</option>
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
            <option value="gemini">Google Gemini 2.0</option>
          </select>
        </div>
      </div>

      {/* Groq / Cloud API Key Configuration */}
      {(settings.aiProvider === 'groq' || settings.aiProvider === 'openai' || settings.aiProvider === 'anthropic' || settings.aiProvider === 'gemini') && (
        <div style={{ display: 'grid', gridTemplateColumns: settings.aiProvider === 'groq' ? '1.4fr 1fr' : '1fr', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <label style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                {settings.aiProvider === 'groq' ? 'Groq API Key (starts with gsk_)' : `${settings.aiProvider.toUpperCase()} API Key`}
              </label>
              {settings.aiProvider === 'groq' && (
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '9.5px', color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}
                  title="Get your free API key at console.groq.com"
                >
                  Get Free Key ↗
                </a>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder={settings.aiProvider === 'groq' ? 'gsk_...' : 'sk-...'}
                value={settings.apiKey || ''}
                onChange={(e) => {
                  const val = e.target.value.trim()
                  onSave({ apiKey: val })
                  if (settings.aiProvider === 'groq') {
                    verifyGroqKey(val)
                  }
                }}
                className="wfd-input-text"
                style={{
                  width: '100%',
                  borderColor: keyStatus === 'valid'
                    ? '#10b981'
                    : keyStatus === 'invalid'
                      ? '#f43f5e'
                      : !settings.apiKey
                        ? 'rgba(244, 63, 94, 0.4)'
                        : undefined
                }}
              />
            </div>

            {keyStatus === 'valid' && (
              <span style={{ fontSize: '9.5px', color: '#34d399', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={11} />
                Groq API Key verified & ready
              </span>
            )}

            {keyStatus === 'invalid' && (
              <span style={{ fontSize: '9.5px', color: '#fda4af', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} />
                {keyError ? `Error: ${keyError}` : 'Invalid API Key'}
              </span>
            )}

            {keyStatus === 'checking' && (
              <span style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={10} className="animate-spin" />
                Verifying key...
              </span>
            )}
          </div>

          {settings.aiProvider === 'groq' && (
            <div>
              <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                Whisper Model
              </label>
              <select
                value={settings.whisperModel || 'whisper-large-v3'}
                onChange={(e) => onSave({ whisperModel: e.target.value as any })}
                className="wfd-select"
                style={{ width: '100%' }}
              >
                <option value="whisper-large-v3">whisper-large-v3 (Accurate)</option>
                <option value="whisper-large-v3-turbo">whisper-large-v3-turbo (Fast)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Dictation Mode & Language */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
            Dictation Mode
          </label>
          <select
            value={settings.dictationMode || 'direct'}
            onChange={(e) => onSave({ dictationMode: e.target.value as any })}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="direct">Direct Dictation (Wispr Flow)</option>
            <option value="smart_assistant">Smart AI Assistant (Prompt Engineering)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
            Speech Language
          </label>
          <select
            value={settings.whisperLanguage || 'auto'}
            onChange={(e) => onSave({ whisperLanguage: e.target.value })}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="auto">Auto-Detect (99+ Languages)</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      </div>

      {/* Local Context Redaction & Privacy */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '7px',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 550, color: '#f8fafc' }}>
            <ShieldCheck size={13} color="#10b981" />
            <span>Private Local Context</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b' }}>
            {settings.aiProvider === 'ollama' ? 'Local Ollama' : (settings.apiKey ? 'Groq Whisper' : 'Local Fallback')}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={(settings as any).pauseContextCollection || false}
              onChange={async (e) => {
                const paused = e.target.checked
                onSave({ pauseContextCollection: paused } as any)
                await window.electronAPI?.pauseContext?.(paused)
              }}
            />
            <span>Pause Context Collection</span>
          </label>

          <button
            type="button"
            onClick={async () => {
              try {
                await window.electronAPI?.clearContext?.()
                alert('Local context history cleared.')
              } catch (e) {
                console.warn('Failed to clear context:', e)
              }
            }}
            className="wfd-btn-subtle"
            style={{ fontSize: '10px', padding: '2px 7px' }}
          >
            Clear Context
          </button>
        </div>
      </div>

      {/* Checkbox Options */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={settings.autoPaste}
              onChange={(e) => onSave({ autoPaste: e.target.checked })}
            />
            <span>Auto-paste</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={settings.soundFeedback !== false}
              onChange={(e) => onSave({ soundFeedback: e.target.checked })}
            />
            <span>Audio Cues</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={settings.aiPolishing !== false}
              onChange={(e) => onSave({ aiPolishing: e.target.checked })}
            />
            <span>AI Polish</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={settings.englishLettersOnly !== false}
              onChange={(e) => onSave({ englishLettersOnly: e.target.checked })}
            />
            <span>English Letters (A-Z)</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#10b981' }}>
          <ShieldCheck size={12} />
          <span>Local Privacy Active</span>
        </div>
      </div>
    </div>
  )
}
