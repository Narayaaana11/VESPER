import React, { useState, useEffect } from 'react'
import { X, ShieldCheck, Cpu, Sliders, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'
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
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hud)',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginTop: '6px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
          <Sliders size={16} />
          <span>QEVRA Core Settings</span>
        </div>
        <button className="icon-btn" onClick={onClose} title="Close settings">
          <X size={15} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Hold-to-Talk Key */}
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Hold-to-Talk Key (Wispr Flow)
          </label>
          <select
            value={settings.holdKey || 'RIGHT ALT'}
            onChange={(e) => {
              const key = e.target.value
              onSave({ holdKey: key })
              window.electronAPI?.setHoldKey(key)
            }}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '11px'
            }}
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
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Inference Engine
          </label>
          <select
            value={settings.aiProvider}
            onChange={(e) => onSave({ aiProvider: e.target.value as any })}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '11px'
            }}
          >
            <option value="groq">⚡ Groq Cloud (Whisper-large-v3 + Llama 3.3) - Recommended</option>
            <option value="local">Built-in Local (Zero-Latency Rule Core)</option>
            <option value="ollama">Ollama (Local Llama 3.2 / Qwen 2.5)</option>
            <option value="openai">OpenAI (Whisper + GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
            <option value="gemini">Google Gemini 2.0</option>
          </select>
        </div>
      </div>

      {/* Groq / Cloud API Key Configuration */}
      {(settings.aiProvider === 'groq' || settings.aiProvider === 'openai' || settings.aiProvider === 'anthropic' || settings.aiProvider === 'gemini') && (
        <div style={{ display: 'grid', gridTemplateColumns: settings.aiProvider === 'groq' ? '1.4fr 1fr' : '1fr', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {settings.aiProvider === 'groq' ? 'Groq API Key (starts with gsk_)' : `${settings.aiProvider.toUpperCase()} API Key`}
              </label>
              {settings.aiProvider === 'groq' && (
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '10px', color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600 }}
                  title="Get your free API key at console.groq.com"
                >
                  ⚡ Get Free Key ↗
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
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: keyStatus === 'valid'
                    ? '1px solid #10b981'
                    : keyStatus === 'invalid'
                      ? '1px solid #f43f5e'
                      : !settings.apiKey
                        ? '1px solid rgba(244, 63, 94, 0.5)'
                        : '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px'
                }}
              />
            </div>

            {keyStatus === 'valid' && (
              <span style={{ fontSize: '10px', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <CheckCircle2 size={12} />
                Groq API Key verified & ready for Whisper STT
              </span>
            )}

            {keyStatus === 'invalid' && (
              <span style={{ fontSize: '10px', color: '#f87171', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <AlertCircle size={12} />
                {keyError ? `Error: ${keyError}. Create a new key at console.groq.com/keys` : 'Invalid API Key. Please generate a new key.'}
              </span>
            )}

            {keyStatus === 'checking' && (
              <span style={{ fontSize: '10px', color: '#93c5fd', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={11} />
                Verifying key with Groq Cloud...
              </span>
            )}

            {keyStatus === 'idle' && !settings.apiKey && (
              <span style={{ fontSize: '9.5px', color: '#f87171', marginTop: '3px', display: 'block' }}>
                Required for Whisper STT. Free forever at console.groq.com (no credit card needed).
              </span>
            )}
          </div>

          {settings.aiProvider === 'groq' && (
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Whisper Model
              </label>
              <select
                value={settings.whisperModel || 'whisper-large-v3'}
                onChange={(e) => onSave({ whisperModel: e.target.value as any })}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '11px'
                }}
              >
                <option value="whisper-large-v3">whisper-large-v3 (Accurate & Whispers)</option>
                <option value="whisper-large-v3-turbo">whisper-large-v3-turbo (Ultra Fast)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {settings.aiProvider === 'ollama' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Ollama Endpoint
            </label>
            <input
              type="text"
              value={settings.ollamaEndpoint}
              onChange={(e) => onSave({ ollamaEndpoint: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Model Tag
            </label>
            <input
              type="text"
              value={settings.ollamaModel}
              onChange={(e) => onSave({ ollamaModel: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '11px'
              }}
            />
          </div>
        </div>
      )}

      {/* Dictation Mode & Language Configuration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Dictation Mode
          </label>
          <select
            value={settings.dictationMode || 'direct'}
            onChange={(e) => onSave({ dictationMode: e.target.value as any })}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '11px'
            }}
          >
            <option value="direct">🎙️ Direct Dictation (Wispr Flow Style)</option>
            <option value="smart_assistant">✨ Smart AI Assistant (Prompt Engineering)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Speech Language
          </label>
          <select
            value={settings.whisperLanguage || 'auto'}
            onChange={(e) => onSave({ whisperLanguage: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '11px'
            }}
          >
            <option value="auto">🌐 Auto-Detect (99+ Languages)</option>
            <option value="en">English</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
            <option value="de">German (Deutsch)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="ja">Japanese (日本語)</option>
            <option value="ru">Russian (Русский)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="it">Italian (Italiano)</option>
          </select>
        </div>
      </div>

      {/* Private Local Context Controls (Phase K) */}
      <div
        style={{
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            <ShieldCheck size={14} />
            <span>Private Local Context</span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
            Engine: {settings.aiProvider === 'ollama' ? '🟢 Local (Ollama)' : (settings.apiKey ? '⚡ Cloud (Groq)' : '🟡 Local Deterministic Fallback')}
          </div>
        </div>

        <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          Context is stored strictly on your device in a private local SQLite database. Passwords, auth tokens, banking apps, and sensitive folders are automatically redacted.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'var(--text-primary)' }}>
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
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              padding: '4px 10px',
              color: 'var(--text-primary)',
              fontSize: '10.5px',
              cursor: 'pointer'
            }}
          >
            Clear Context History
          </button>
        </div>
      </div>

      {/* Auto paste checkbox, AI Polish checkbox & Privacy badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px' }}>
            <input
              type="checkbox"
              checked={settings.autoPaste}
              onChange={(e) => onSave({ autoPaste: e.target.checked })}
            />
            <span>Auto-paste (Ctrl+V)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px' }}>
            <input
              type="checkbox"
              checked={settings.aiPolishing !== false}
              onChange={(e) => onSave({ aiPolishing: e.target.checked })}
            />
            <span>AI Polish</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11.5px' }} title="Automatically detects all languages and formats output strictly in English letters">
            <input
              type="checkbox"
              checked={settings.englishLettersOnly !== false}
              onChange={(e) => onSave({ englishLettersOnly: e.target.checked })}
            />
            <span>English Letters (A-Z)</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--accent-green)' }}>
          <ShieldCheck size={13} />
          <span>Local Privacy Guard Active</span>
        </div>
      </div>
    </div>
  )
}
