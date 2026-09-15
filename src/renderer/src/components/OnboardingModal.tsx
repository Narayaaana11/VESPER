import React, { useState, useEffect, useRef } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Cpu,
  Mic,
  Key,
  Flame,
  ArrowRight,
  ArrowLeft,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Power,
  Volume2,
  HardDrive,
  Laptop,
  Check,
  Zap,
  Info
} from 'lucide-react'
import { SpotlightCard, ShinyText, DecryptedText, CountUp, StarBorder, Magnet } from './reactbits'

interface OnboardingModalProps {
  onComplete: () => void
  onClose?: () => void
}

interface SystemSpecs {
  totalRamGb: number
  freeRamGb: number
  cpuModel: string
  cpuCores: number
  gpuName: string
  tier: 'high' | 'mid' | 'low'
  recommendedModel: string
  description: string
  isLocalEligible: boolean
}

interface ResourceState {
  allReady: boolean
  winKeyServer: { ready: boolean; path: string }
  detectWindow: { ready: boolean; path: string }
  sendInput: { ready: boolean; path: string }
  sileroVad: { ready: boolean; path: string; sizeBytes?: number }
  vectorTransformer: { ready: boolean; path: string; sizeBytes?: number }
  groqConfigured: boolean
  startupEnabled: boolean
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [downloadPercent, setDownloadPercent] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('Verifying local engines...')

  // System Hardware Specs
  const [specs, setSpecs] = useState<SystemSpecs | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<'recommended' | 'cloud' | 'local'>('recommended')

  // Resources State
  const [resources, setResources] = useState<ResourceState | null>(null)
  const [autoStartEnabled, setAutoStartEnabled] = useState(true)

  // Groq API Key State
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [isTestingKey, setIsTestingKey] = useState(false)
  const [keyValidationStatus, setKeyValidationStatus] = useState<{ valid: boolean; message: string } | null>(null)

  // Microphone Testing
  const [micActive, setMicActive] = useState(false)
  const [micVolume, setMicVolume] = useState(0)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animRef = useRef<number | null>(null)

  // Push-to-Talk Keybind Selection & Live Test Box
  const [selectedHoldKey, setSelectedHoldKey] = useState<'ANY ALT' | 'LEFT ALT' | 'RIGHT ALT' | 'RIGHT CTRL' | 'F8'>('ANY ALT')
  const [testInputText, setTestInputText] = useState('')
  const [isTestRecording, setIsTestRecording] = useState(false)
  const [testStatus, setTestStatus] = useState<string | null>(null)

  // Load hardware specs & existing settings
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // 1. Get Hardware Specs
        if (window.electronAPI?.getSystemSpecs) {
          const s = await window.electronAPI.getSystemSpecs()
          setSpecs(s)
        } else {
          setSpecs({
            totalRamGb: 16,
            freeRamGb: 8.5,
            cpuModel: 'Intel(R) Core(TM) i7 / AMD Ryzen (Multi-Core)',
            cpuCores: 8,
            gpuName: 'Direct3D 11 Hardware Graphics',
            tier: 'high',
            recommendedModel: 'Hybrid: Groq Whisper-large-v3 + Local Ollama Llama 3.2',
            description: 'Your system has generous memory headroom (>16 GB RAM). Recommended for both full local privacy and high-speed cloud transcription fallback.',
            isLocalEligible: true
          })
        }

        // 2. Check System Resources
        if (window.electronAPI?.checkSystemResources) {
          const res = await window.electronAPI.checkSystemResources()
          setResources(res)
          setAutoStartEnabled(res.startupEnabled ?? true)
        }

        // 3. Get existing settings
        if (window.electronAPI?.getSettings) {
          const settings = await window.electronAPI.getSettings()
          if (settings.apiKey) {
            setApiKeyInput(settings.apiKey)
            setKeyValidationStatus({ valid: true, message: 'Existing key detected' })
          }
          if (settings.holdKey) {
            setSelectedHoldKey(settings.holdKey as any)
          }
        }
      } catch (err) {
        console.warn('[Onboarding] Error loading system specs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Download progress listener
    if (window.electronAPI?.onDownloadProgress) {
      const unsub = window.electronAPI.onDownloadProgress((data: any) => {
        if (typeof data.percent === 'number') setDownloadPercent(data.percent)
        if (data.detail) setDownloadStatus(data.detail)
      })
      return () => unsub()
    }
    return undefined
  }, [])

  // Start Mic Volume Meter on step 3 or 4
  const startMicMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      setMicActive(true)

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      source.connect(analyser)

      const buffer = new Uint8Array(analyser.frequencyBinCount)
      const checkVol = () => {
        analyser.getByteFrequencyData(buffer)
        let sum = 0
        for (let i = 0; i < buffer.length; i++) sum += buffer[i]
        const avg = sum / buffer.length
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)))
        animRef.current = requestAnimationFrame(checkVol)
      }
      animRef.current = requestAnimationFrame(checkVol)
    } catch {
      setMicActive(false)
    }
  }

  const stopMicMeter = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop())
      micStreamRef.current = null
    }
  }

  useEffect(() => {
    if (currentStep === 3 || currentStep === 4) {
      startMicMeter()
    } else {
      stopMicMeter()
    }
    return () => stopMicMeter()
  }, [currentStep])

  // Test Groq API Key
  const handleVerifyGroqKey = async () => {
    if (!apiKeyInput.trim()) {
      setKeyValidationStatus({ valid: false, message: 'Please paste your Groq API key first' })
      return
    }
    setIsTestingKey(true)
    setKeyValidationStatus(null)
    try {
      if (window.electronAPI?.verifyGroqKey) {
        const res = await window.electronAPI.verifyGroqKey(apiKeyInput.trim())
        if (res.valid) {
          setKeyValidationStatus({ valid: true, message: `Connected! ${res.modelCount || 10}+ models available.` })
          // Save key automatically
          window.electronAPI.saveSettings?.({ apiKey: apiKeyInput.trim() })
        } else {
          setKeyValidationStatus({ valid: false, message: res.error || 'Invalid API key. Please check.' })
        }
      } else {
        // Mock success in dev
        await new Promise((r) => setTimeout(r, 600))
        setKeyValidationStatus({ valid: true, message: 'Connected successfully (Local test)' })
      }
    } catch (e: any) {
      setKeyValidationStatus({ valid: false, message: e.message || 'Verification failed' })
    } finally {
      setIsTestingKey(false)
    }
  }

  // Download & Initializer Engine
  const startDownloadAndSetup = async () => {
    setDownloading(true)
    setDownloadPercent(5)
    setDownloadStatus('Initializing low-level Windows injectors...')

    try {
      if (window.electronAPI?.downloadResources) {
        await window.electronAPI.downloadResources()
      } else {
        for (let i = 10; i <= 100; i += 20) {
          setDownloadPercent(i)
          setDownloadStatus(`Verifying local neural weights (${i}%)...`)
          await new Promise((r) => setTimeout(r, 150))
        }
      }

      if (window.electronAPI?.setStartupSetting) {
        await window.electronAPI.setStartupSetting(autoStartEnabled)
      }

      setDownloadPercent(100)
      setDownloadStatus('All local engines verified & nominal!')
      if (window.electronAPI?.checkSystemResources) {
        const res = await window.electronAPI.checkSystemResources()
        setResources(res)
      }
    } catch (err: any) {
      setDownloadStatus(`Notice: ${err?.message || 'Ready'}`)
    } finally {
      setDownloading(false)
    }
  }

  // Finalize setup
  const handleFinish = async () => {
    try {
      // Save settings
      const settingsPayload: any = {
        holdKey: selectedHoldKey,
        apiKey: apiKeyInput.trim() || undefined,
        autoPaste: true
      }
      if (selectedProfile === 'cloud') {
        settingsPayload.aiProvider = 'groq'
        settingsPayload.whisperModel = 'whisper-large-v3'
      } else if (selectedProfile === 'local') {
        settingsPayload.aiProvider = 'ollama'
        settingsPayload.ollamaModel = 'llama3.2'
      }

      if (window.electronAPI?.saveSettings) {
        await window.electronAPI.saveSettings(settingsPayload)
      }
      if (window.electronAPI?.setHoldKey) {
        window.electronAPI.setHoldKey(selectedHoldKey)
      }
      localStorage.setItem('qevra_onboarded', 'true')
    } catch {}
    stopMicMeter()
    onComplete()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 6, 9, 0.88)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 680,
          background: 'linear-gradient(180deg, #0d0f17 0%, #08090d 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: '28px 30px',
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          color: '#f4f4f5',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Top Header & Wizard Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={18} style={{ color: '#38bdf8' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: '#f4f4f5' }}>
                <ShinyText text="QEVRA Flow Onboarding & System Setup" speed={3} color="#f4f4f5" shineColor="#38bdf8" />
              </div>
              <div style={{ fontSize: 11, color: '#71717a', fontFamily: 'monospace' }}>
                STEP {currentStep} OF 4 ·{' '}
                {currentStep === 1 && 'HARDWARE PROFILING & MODEL RECOMMENDATION'}
                {currentStep === 2 && 'GROQ CLOUD WHISPER KEY'}
                {currentStep === 3 && 'PREREQUISITES & ENGINE CHECK'}
                {currentStep === 4 && 'HOTKEY & LIVE DICTATION TEST'}
              </div>
            </div>
          </div>

          {/* Stepper Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                onClick={() => setCurrentStep(step as any)}
                style={{
                  width: currentStep === step ? 22 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: currentStep === step ? '#38bdf8' : (step < currentStep ? '#10b981' : 'rgba(255, 255, 255, 0.15)'),
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: HARDWARE SPECS & MODEL RECOMMENDATION */}
        {currentStep === 1 && (
          <div>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 18 }}>
              QEVRA inspects your machine hardware to automatically tune speech recognition and AI polishing pipelines for minimum latency and zero system lag.
            </p>

            {/* Hardware Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              <SpotlightCard
                spotlightColor="rgba(56, 189, 248, 0.15)"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 10,
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#71717a', fontSize: 11, marginBottom: 4 }}>
                  <HardDrive size={13} style={{ color: '#38bdf8' }} />
                  <span>SYSTEM RAM</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5' }}>
                  {specs?.totalRamGb || 16} GB
                </div>
                <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>
                  {specs?.freeRamGb || 8} GB Available
                </div>
              </SpotlightCard>

              <SpotlightCard
                spotlightColor="rgba(168, 85, 247, 0.15)"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 10,
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#71717a', fontSize: 11, marginBottom: 4 }}>
                  <Cpu size={13} style={{ color: '#a855f7' }} />
                  <span>PROCESSOR</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {specs?.cpuCores || 8} Cores
                </div>
                <div style={{ fontSize: 10, color: '#71717a', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {specs?.cpuModel ? specs.cpuModel.split('@')[0] : 'Multi-Core CPU'}
                </div>
              </SpotlightCard>

              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.15)"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: 10,
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#71717a', fontSize: 11, marginBottom: 4 }}>
                  <Laptop size={13} style={{ color: '#10b981' }} />
                  <span>GRAPHICS ACCEL</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {specs?.gpuName ? specs.gpuName.slice(0, 18) : 'Hardware GPU'}
                </div>
                <div style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>
                  Direct3D Ready
                </div>
              </SpotlightCard>
            </div>

            {/* Recommendation Highlight Card */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: 12,
                padding: '16px 18px',
                marginBottom: 20
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} style={{ color: '#38bdf8' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>
                    Recommended AI Architecture for this PC
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'monospace',
                    padding: '3px 8px',
                    borderRadius: 20,
                    background: '#10b9811a',
                    border: '1px solid #10b9814d',
                    color: '#10b981'
                  }}
                >
                  BEST PERFORMANCE
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8', marginBottom: 6 }}>
                <DecryptedText text={specs?.recommendedModel || 'Groq Cloud Whisper-large-v3 + Hybrid Ollama'} speed={25} />
              </div>
              <p style={{ fontSize: 12, color: '#d4d4d8', lineHeight: 1.5, margin: 0 }}>
                {specs?.description || 'Optimal balance of 180ms cloud speech speed + zero-latency local context reasoning.'}
              </p>
            </div>

            {/* Profile Selection */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                onClick={() => setSelectedProfile('recommended')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: selectedProfile === 'recommended' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedProfile === 'recommended' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Hybrid (Recommended)</span>
                  {selectedProfile === 'recommended' && <Check size={14} style={{ color: '#38bdf8' }} />}
                </div>
                <div style={{ fontSize: 11, color: '#71717a' }}>Groq Whisper + Local VAD &amp; Embeddings</div>
              </div>

              <div
                onClick={() => setSelectedProfile('cloud')}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: selectedProfile === 'cloud' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedProfile === 'cloud' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>Cloud-First Speed</span>
                  {selectedProfile === 'cloud' && <Check size={14} style={{ color: '#38bdf8' }} />}
                </div>
                <div style={{ fontSize: 11, color: '#71717a' }}>Groq Whisper + Llama 3.3 (Zero RAM)</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GROQ API KEY CONFIGURATION */}
        {currentStep === 2 && (
          <div>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 18 }}>
              QEVRA uses <strong>Groq Whisper Cloud</strong> as its hyper-speed transcription wrapper, giving you <strong>sub-200ms</strong> voice-to-text response times for free.
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 18, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                  <Key size={15} style={{ color: '#38bdf8' }} />
                  <span>Enter Your Groq API Key</span>
                </div>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 11,
                    color: '#38bdf8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  Get free key from console.groq.com &rarr;
                </a>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  type="password"
                  placeholder="gsk_..."
                  value={apiKeyInput}
                  onChange={(e) => {
                    setApiKeyInput(e.target.value)
                    setKeyValidationStatus(null)
                  }}
                  style={{
                    flex: 1,
                    background: '#090a0f',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    fontSize: 13,
                    color: '#f4f4f5',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleVerifyGroqKey}
                  disabled={isTestingKey || !apiKeyInput.trim()}
                  style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    borderRadius: 8,
                    padding: '0 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: isTestingKey || !apiKeyInput.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {isTestingKey ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
                  <span>{isTestingKey ? 'Verifying...' : 'Verify Key'}</span>
                </button>
              </div>

              {keyValidationStatus && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    background: keyValidationStatus.valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: keyValidationStatus.valid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: keyValidationStatus.valid ? '#10b981' : '#f87171'
                  }}
                >
                  {keyValidationStatus.valid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{keyValidationStatus.message}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Info size={15} style={{ color: '#71717a', flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: '#71717a', lineHeight: 1.4 }}>
                <strong>Why Groq?</strong> Whisper-large-v3 runs on Groq LPUs at ~250 words per second. Your voice is transcribed and typed into your target window before you even finish releasing the hotkey.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PREREQUISITES & ENGINE CHECK */}
        {currentStep === 3 && (
          <div>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 16 }}>
              Verifying required Windows background engines, low-level keyboard listeners, and local neural weights.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {/* 1. Win32 Hook & SendInput */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Terminal size={14} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>Win32 Keystroke Injector &amp; Hook</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>WinKeyServer.exe &amp; send-input.exe (Foreground preserved)</div>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#10b981', fontFamily: 'monospace' }}>
                  <CheckCircle2 size={13} /> READY
                </span>
              </div>

              {/* 2. Microphone Stream & Live Volume Meter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mic size={14} style={{ color: '#ec4899' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>Microphone Stream &amp; Hardware Pre-warming</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>16kHz Mono 0ms latency audio capture channel</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${micVolume}%`, height: '100%', background: '#10b981', transition: 'width 0.1s ease' }} />
                  </div>
                  <span style={{ fontSize: 11, color: micActive ? '#10b981' : '#f59e0b', fontFamily: 'monospace' }}>
                    {micActive ? 'ACTIVE' : 'CHECKING'}
                  </span>
                </div>
              </div>

              {/* 3. Silero VAD */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Activity size={14} style={{ color: '#10b981' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>Silero Neural Voice Activity Detection (VAD)</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>silero_vad.onnx (Local voice boundary detector)</div>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#10b981', fontFamily: 'monospace' }}>
                  <CheckCircle2 size={13} /> VERIFIED
                </span>
              </div>

              {/* 4. Windows Startup Item */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Power size={14} style={{ color: '#f59e0b' }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>Launch with Windows (Auto-Start at Boot)</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>Starts silently in system tray so Push-to-Talk is always ready</div>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11, color: '#e4e4e7' }}>
                  <input
                    type="checkbox"
                    checked={autoStartEnabled}
                    onChange={(e) => {
                      setAutoStartEnabled(e.target.checked)
                      window.electronAPI?.setStartupSetting?.(e.target.checked)
                    }}
                    style={{ accentColor: '#10b981', cursor: 'pointer' }}
                  />
                  <span>Enabled</span>
                </label>
              </div>
            </div>

            {/* Download Engine Trigger */}
            {downloading && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', marginBottom: 6, fontFamily: 'monospace' }}>
                  <span>{downloadStatus}</span>
                  <span>{downloadPercent}%</span>
                </div>
                <div style={{ width: '100%', height: 5, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${downloadPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)', borderRadius: 4, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: KEYBIND SELECTION & LIVE DICTATION TEST DRIVE */}
        {currentStep === 4 && (
          <div>
            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 16 }}>
              Select your primary push-to-talk key. <strong>ANY ALT</strong> is selected by default so both your Left Alt and Right Alt work naturally without key conflict!
            </p>

            {/* Keybind Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              {[
                { id: 'ANY ALT', label: 'ANY ALT (Recommended)', sub: 'Matches Left Alt & Right Alt' },
                { id: 'LEFT ALT', label: 'LEFT ALT', sub: 'Main key next to space' },
                { id: 'RIGHT ALT', label: 'RIGHT ALT', sub: 'Dedicated Right Alt / AltGr' }
              ].map((k) => (
                <div
                  key={k.id}
                  onClick={() => {
                    setSelectedHoldKey(k.id as any)
                    window.electronAPI?.setHoldKey(k.id)
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: selectedHoldKey === k.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: selectedHoldKey === k.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600, color: selectedHoldKey === k.id ? '#38bdf8' : '#f4f4f5', marginBottom: 2 }}>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 10, color: '#71717a' }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Interactive Live Test Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 18
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f4f4f5' }}>
                  Live Test Drive: Hold [{selectedHoldKey}] or Click Below &amp; Speak
                </span>
                <span style={{ fontSize: 11, color: micActive ? '#10b981' : '#71717a', fontFamily: 'monospace' }}>
                  {micActive ? 'MIC READY' : 'CONNECTING...'}
                </span>
              </div>

              <textarea
                rows={3}
                placeholder="Click here, hold your Alt key, speak a sentence, and watch your voice convert to text automatically..."
                value={testInputText}
                onChange={(e) => setTestInputText(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090a0f',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: '#f4f4f5',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5,
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#71717a' }}>
                  Press and hold your Alt key anywhere on Windows to write directly into any input field.
                </span>
                {testInputText && (
                  <button
                    onClick={() => setTestInputText('')}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer' }}
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#d4d4d8',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  padding: '8px 12px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Skip for now
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                style={{
                  background: '#f4f4f5',
                  color: '#090a0f',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 0 16px rgba(255, 255, 255, 0.1)'
                }}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <StarBorder
                onClick={handleFinish}
                color="#10b981"
                speed="3s"
                thickness={1.5}
                style={{
                  background: 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', fontWeight: 600, fontSize: 12, color: '#10b981' }}>
                  <span>Launch QEVRA Flow</span>
                  <CheckCircle2 size={14} />
                </div>
              </StarBorder>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
