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
  const [startupEnabled, setStartupEnabled] = useState(true)
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [lastKeyDetected, setLastKeyDetected] = useState<string | null>(null)

  useEffect(() => {
    window.electronAPI?.getStartupSetting?.().then((res: boolean) => {
      if (typeof res === 'boolean') setStartupEnabled(res)
    })
    window.electronAPI?.getSystemDiagnostics?.().then(setDiagnostics).catch(console.warn)

    const unsubKey = window.electronAPI?.onKeyDiagnosticEvent?.((evt: any) => {
      setLastKeyDetected(`${evt.name || 'Key'} (code: ${evt.vKey}) [${evt.state}]`)
    })

    return () => {
      unsubKey?.()
    }
  }, [])

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
        background: 'rgba(12, 14, 19, 0.98)',
        border: '1px solid var(--wf-border)',
        borderRadius: 'var(--wf-radius-md)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '6px',
        boxShadow: 'var(--wf-shadow-overlay)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 600, color: 'var(--wf-text-primary)' }}>
          <Sliders size={13} strokeWidth={1.75} style={{ color: 'var(--wf-text-muted)' }} />
          <span>Core Settings</span>
        </div>
        <button className="wf-icon-btn" onClick={onClose} title="Close settings" style={{ width: 24, height: 24 }}>
          <X size={13} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Hold-to-Talk Key */}
        <div>
          <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)', display: 'block', marginBottom: '3px' }}>
            Hold-to-Talk Key
          </label>
          <select
            value={settings.holdKey || 'ANY ALT'}
            onChange={(e) => {
              const key = e.target.value
              onSave({ holdKey: key })
              window.electronAPI?.setHoldKey(key)
            }}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="ANY ALT">Any Alt Key (Left or Right Alt) — Recommended</option>
            <option value="RIGHT ALT">Right Alt (AltGr)</option>
            <option value="LEFT ALT">Left Alt</option>
            <option value="FN">Fn (Hardware Key)</option>
            <option value="RIGHT CTRL">Right Ctrl</option>
            <option value="CAPS LOCK">Caps Lock</option>
            <option value="F8">F8 Key</option>
          </select>
        </div>

        {/* AI Provider */}
        <div>
          <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)', display: 'block', marginBottom: '3px' }}>
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

      {/* Cloud API Key Configuration */}
      {(settings.aiProvider === 'groq' || settings.aiProvider === 'openai' || settings.aiProvider === 'anthropic' || settings.aiProvider === 'gemini') && (
        <div style={{ display: 'grid', gridTemplateColumns: settings.aiProvider === 'groq' ? '1.4fr 1fr' : '1fr', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
              <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)' }}>
                {settings.aiProvider === 'groq' ? 'Groq API Key' : `${settings.aiProvider.toUpperCase()} Key`}
              </label>
              {settings.aiProvider === 'groq' && (
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '9.5px', color: 'var(--wf-text-secondary)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                  title="Get key at console.groq.com"
                >
                  console.groq.com ↗
                </a>
              )}
            </div>
            <div>
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
                    ? 'rgba(16, 185, 129, 0.4)'
                    : keyStatus === 'invalid'
                      ? 'rgba(244, 63, 94, 0.4)'
                      : undefined
                }}
              />
            </div>

            {keyStatus === 'valid' && (
              <span style={{ fontSize: '9.5px', color: 'var(--wf-success)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <CheckCircle2 size={11} />
                Key verified
              </span>
            )}

            {keyStatus === 'invalid' && (
              <span style={{ fontSize: '9.5px', color: '#fda4af', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <AlertCircle size={11} />
                {keyError ? `Error: ${keyError}` : 'Invalid API Key'}
              </span>
            )}

            {keyStatus === 'checking' && (
              <span style={{ fontSize: '9.5px', color: 'var(--wf-text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <RefreshCw size={10} className="animate-spin" />
                Verifying...
              </span>
            )}
          </div>

          {settings.aiProvider === 'groq' && (
            <div>
              <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)', display: 'block', marginBottom: '3px' }}>
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
          <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)', display: 'block', marginBottom: '3px' }}>
            Dictation Mode
          </label>
          <select
            value={settings.dictationMode || 'direct'}
            onChange={(e) => onSave({ dictationMode: e.target.value as any })}
            className="wfd-select"
            style={{ width: '100%' }}
          >
            <option value="direct">Direct Dictation (VESPER Flow)</option>
            <option value="smart_assistant">Smart Assistant (Prompt Engineer)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '10px', color: 'var(--wf-text-muted)', display: 'block', marginBottom: '3px' }}>
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
          border: '1px solid var(--wf-border)',
          borderRadius: 'var(--wf-radius-sm)',
          padding: '8px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 550, color: 'var(--wf-text-primary)' }}>
            <ShieldCheck size={12} style={{ color: 'var(--wf-success)' }} />
            <span>Local Context Memory</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {settings.aiProvider === 'ollama' ? 'Local Ollama' : (settings.apiKey ? 'Groq Whisper' : 'Local Fallback')}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px', flexWrap: 'wrap', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
            <input
              type="checkbox"
              checked={settings.autoPaste}
              onChange={(e) => onSave({ autoPaste: e.target.checked })}
            />
            <span>Auto-paste</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
            <input
              type="checkbox"
              checked={startupEnabled}
              onChange={(e) => {
                setStartupEnabled(e.target.checked)
                window.electronAPI?.setStartupSetting?.(e.target.checked)
              }}
            />
            <span>Start on Boot</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
            <input
              type="checkbox"
              checked={settings.soundFeedback !== false}
              onChange={(e) => onSave({ soundFeedback: e.target.checked })}
            />
            <span>Audio Cues</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
            <input
              type="checkbox"
              checked={settings.aiPolishing !== false}
              onChange={(e) => onSave({ aiPolishing: e.target.checked })}
            />
            <span>AI Polish</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '10.5px', color: 'var(--wf-text-secondary)' }}>
            <input
              type="checkbox"
              checked={settings.englishLettersOnly !== false}
              onChange={(e) => onSave({ englishLettersOnly: e.target.checked })}
            />
            <span>English (A-Z)</span>
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--wf-success)', fontFamily: 'var(--font-mono)' }}>
          <ShieldCheck size={11} />
          <span>Local Mode Active</span>
        </div>
      </div>

      {/* System Diagnostics & Permissions Section */}
      <div
        style={{
          marginTop: '6px',
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.025)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--wf-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={12} color="#10b981" />
            <span>Windows Enterprise Permissions & System Status</span>
          </div>
          <span style={{ fontSize: '9px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
            {diagnostics?.isProgramFilesInstalled ? 'Program Files (Secure)' : 'Local Install'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px' }}>
          <div style={{ padding: '5px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#71717a', fontSize: '9px' }}>Install Path</div>
            <div style={{ color: '#e4e4e7', fontFamily: 'var(--font-mono)', fontSize: '9.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {diagnostics?.installPath || 'C:\\Program Files\\VESPER\\VESPER.exe'}
            </div>
          </div>

          <div style={{ padding: '5px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#71717a', fontSize: '9px' }}>Auto-Start at Login</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1px' }}>
              <span style={{ color: startupEnabled ? '#34d399' : '#f87171', fontWeight: 500 }}>
                {startupEnabled ? 'Enabled (Background Tray)' : 'Disabled'}
              </span>
              <button
                type="button"
                onClick={async () => {
                  const res = await window.electronAPI?.toggleAutostart?.()
                  if (res && typeof res.enabled === 'boolean') {
                    setStartupEnabled(res.enabled)
                  }
                }}
                className="wfd-btn-subtle"
                style={{ fontSize: '9px', padding: '1px 6px' }}
              >
                Toggle
              </button>
            </div>
          </div>

          <div style={{ padding: '5px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#71717a', fontSize: '9px' }}>Win32 Keystroke Injector</div>
            <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} />
              <span>send-input.exe (Native C++)</span>
            </div>
          </div>

          <div style={{ padding: '5px 8px', borderRadius: '5px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: '#71717a', fontSize: '9px' }}>Window Context Detector</div>
            <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} />
              <span>detect-window.exe (Native C++)</span>
            </div>
          </div>
        </div>

        {/* Live Key Detection Monitor */}
        <div
          style={{
            padding: '6px 8px',
            borderRadius: '5px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '9.5px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: lastKeyDetected ? '#10b981' : '#6b7280' }} />
            <span style={{ color: '#d1d5db' }}>Global Key Hook ({settings.holdKey || 'ANY ALT'}):</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', color: lastKeyDetected ? '#34d399' : '#9ca3af' }}>
            {lastKeyDetected || 'WinKeyServer Active (Press key to test)'}
          </span>
        </div>
      </div>
    </div>
  )
}
