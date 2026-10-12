import React, { useState, useEffect, useRef } from 'react'
import { Mic, Square, Settings, X, Check, Pause, Play, MoreHorizontal, ArrowUpRight, Maximize2, Minimize2, LayoutDashboard, Activity, Terminal, ShieldCheck } from 'lucide-react'
import { SystemContext, DisambiguationQuestion, UniversalTaskObject, AppSettings } from './types/task'
import { AudioRecorder } from './core/audio-recorder'
import { validateWhisperTranscript, validatePolishedOutput } from './core/transcription-validator'
import { processIntent } from './core/intent-engine'
import { transcribeAudio, transcribeWithGroq, polishWithGroqLlama, polishWithOllama, polishWithLocalRules } from './core/groq-service'
import { executeScreenAgent, ScreenAgentResult } from './core/screen-agent'
import { AudioVisualizer } from './components/AudioVisualizer'
import { ContextBadge } from './components/ContextBadge'
import { SmartQAOverlay } from './components/SmartQAOverlay'
import { TaskPreviewCard } from './components/TaskPreviewCard'
import { AgentApprovalCard } from './components/AgentApprovalCard'
import { SettingsModal } from './components/SettingsModal'
import { VesperDashboard } from './components/VesperDashboard'
import { addHistoryItem, getSnippets, getVocabulary } from './types/dashboard'
import { audioChimes } from './core/audio-chimes'
import { SelectionTransformer } from './core/selection-transformer'
import { CommandBar } from './components/CommandBar'
import { AICursorOverlay, GuidanceStep } from './components/AICursorOverlay'
import { GuidanceEngine, GuidanceWorkflow } from './core/guidance-engine'
import { ContextInspector } from './components/ContextInspector'
import { ContextRanker, CompressedContextPackage } from './core/context-ranker'
import { ScreenNavigator } from './core/screen-navigator'
import { LangGraphAgentOrchestrator } from './core/agent-graph/langgraph-orchestrator'

import { DailyUsageService } from './core/daily-usage-service'

declare global {
  interface Window {
    electronAPI?: {
      getContext: () => Promise<SystemContext>
      clearContext?: () => Promise<{ success: boolean }>
      getContextStats?: () => Promise<{ eventCount: number; taskCount: number; projectCount: number; dbSizeBytes: number }>
      getContextEvents?: (limit?: number) => Promise<any[]>
      pauseContext?: (paused: boolean) => Promise<{ success: boolean; isPaused: boolean }>
      setPrivacyExclusions?: (payload: { apps?: string[]; folders?: string[]; domains?: string[] }) => Promise<any>
      getPrivacyStatus?: () => Promise<{ isPaused: boolean; excludedApps: string[]; excludedFolders: string[]; excludedDomains: string[] }>
      queryContext?: (query?: any) => Promise<any>
      recordTask?: (task: any) => Promise<any>
      revalidateContext?: (targetContext: any) => Promise<any>
      executeAction: (params: { content: string; autoPaste?: boolean; targetContext?: any }) => Promise<{ success: boolean; message: string; outcome?: string }>
      resizeWindow: (dimensions: { width: number; height: number }) => void
      showHUD?: () => void
      hideHUD: () => void
      minimizeHUD: () => void
      showDashboard?: () => void
      hideDashboard?: () => void
      minimizeDashboard?: () => void
      maximizeDashboard?: () => void
      closeDashboard?: () => void
      quitApp: () => void
      getSettings: () => Promise<AppSettings>
      saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>
      saveDebugRecording?: (params: { base64Data: string; filename?: string }) => Promise<{ success: boolean; filepath: string }>
      onHotkeyTriggered: (callback: () => void) => () => void
      onHoldStart: (callback: () => void) => () => void
      onHoldEnd: (callback: () => void) => () => void
      onSingleTap: (callback: () => void) => () => void
      onDoubleTap: (callback: () => void) => () => void
      searchUserContext?: (options?: any) => Promise<any>
      getDayReconstruction?: (targetDateMs?: number) => Promise<any>
      captureScreen?: () => Promise<string | null>
      setHoldKey: (key: string) => void
      getSystemSpecs?: () => Promise<any>
      verifyGroqKey?: (apiKey: string) => Promise<{ valid: boolean; error?: string; modelCount?: number }>
      checkSystemResources?: () => Promise<any>
      downloadResources?: () => Promise<any>
      setStartupSetting?: (enabled: boolean) => Promise<boolean>
      onDownloadProgress?: (callback: (data: any) => void) => () => void
      focusWindow?: () => void
      executeUniversalAction?: (action: any) => Promise<any>
      undoLastAction?: () => Promise<any>
      writeClipboard?: (text: string) => Promise<boolean>
      getStartupSetting?: () => Promise<boolean>
      minimizeDashboard?: () => void
      getSystemDiagnostics?: () => Promise<any>
      onKeyDiagnosticEvent?: (cb: (ev: any) => void) => () => void
      toggleAutostart?: (enabled: boolean) => Promise<boolean>
    }
  }
}

const getInitialApiKey = (): string => {
  try {
    const raw = localStorage.getItem('vesper_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.apiKey && typeof parsed.apiKey === 'string' && parsed.apiKey.trim().length > 0) {
        return parsed.apiKey.trim()
      }
    }
    const profileRaw = localStorage.getItem('vesper_user_profile')
    if (profileRaw) {
      const parsedProfile = JSON.parse(profileRaw)
      if (parsedProfile.cloudApiKey && typeof parsedProfile.cloudApiKey === 'string' && parsedProfile.cloudApiKey.trim().length > 0) {
        return parsedProfile.cloudApiKey.trim()
      }
    }
  } catch (e) {}
  const viteKey = (import.meta as any).env?.VITE_GROQ_API_KEY || ''
  return typeof viteKey === 'string' ? viteKey.trim() : ''
}

const getInitialSettings = (): AppSettings => {
  const envMode = ((import.meta as any).env?.VITE_DICTATION_MODE as any) || 'smart_assistant'
  const initialKey = getInitialApiKey()
  const defaults: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: initialKey ? 'groq' : 'local',
    whisperModel: 'whisper-large-v3-turbo',
    whisperLanguage: 'auto',
    dictationMode: envMode,
    aiPolishing: true,
    englishLettersOnly: true,
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: initialKey,
    autoPaste: true,
    soundFeedback: true,
    privacyMode: 'strict_local'
  }

  try {
    const raw = localStorage.getItem('vesper_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaults,
        ...parsed,
        apiKey: parsed.apiKey || defaults.apiKey,
        dictationMode: parsed.dictationMode || defaults.dictationMode
      }
    }
  } catch (e) {}

  return defaults
}

const SAMPLE_PRESETS: Array<{ label: string; text: string }> = [
  { label: 'Web Architecture', text: 'Create a website for a restaurant landing page. I need a prompt for that.' },
  { label: 'Auth Token Refresh', text: 'Fix the bug with the token refresh failing on 401 authorization requests.' },
  { label: 'React Custom Hook', text: 'Refit component to use React custom hook and clean up state management.' },
  { label: 'Responsive Layout', text: 'Make it responsive for mobile screens and add export to CSV button.' }
]

export const App: React.FC = () => {
  const [overlayMode, setOverlayMode] = useState<'compact' | 'expanded' | 'dashboard'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('dashboard')) {
      return 'dashboard'
    }
    return 'compact'
  })
  const [showMenu, setShowMenu] = useState(false)
  const [stage, setStage] = useState<'idle' | 'listening' | 'analyzing' | 'clarifying' | 'ready' | 'executed' | 'approving'>('idle')
  const [transcript, setTranscript] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState<DisambiguationQuestion | null>(null)
  const [clarifications, setClarifications] = useState<Record<string, string>>({})
  const [generatedTask, setGeneratedTask] = useState<UniversalTaskObject | null>(null)
  const [agentProposal, setAgentProposal] = useState<ScreenAgentResult | null>(null)
  const [queryResult, setQueryResult] = useState<{ question: string; answer: string } | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [executionStatus, setExecutionStatus] = useState<string | null>(null)
  const [isHoldMode, setIsHoldMode] = useState(false)
  const [isPersistentMode, setIsPersistentMode] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false)
  const [showInspector, setShowInspector] = useState(false)
  const [guidanceStep, setGuidanceStep] = useState<GuidanceStep | null>(null)
  const [guidanceWorkflow, setGuidanceWorkflow] = useState<GuidanceWorkflow | null>(null)
  const [guidanceStepIndex, setGuidanceStepIndex] = useState<number>(0)
  const [contextPackage, setContextPackage] = useState<CompressedContextPackage | null>(null)

  const [context, setContext] = useState<SystemContext>({
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - VESPER',
    detectedCategory: 'code'
  })

  const [settings, setSettings] = useState<AppSettings>(getInitialSettings)

  const audioRecorderRef = useRef<AudioRecorder>(new AudioRecorder())
  const lastCompletedTaskRef = useRef<{ task: UniversalTaskObject; timestamp: number } | null>(null)
  const recordingStartContextRef = useRef<SystemContext | null>(null)

  const stageRef = useRef(stage)
  stageRef.current = stage

  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const contextRef = useRef(context)
  contextRef.current = context

  const isRecordingRef = useRef(false)
  const isStoppingRef = useRef(false)
  const isPersistentModeRef = useRef(isPersistentMode)
  isPersistentModeRef.current = isPersistentMode

  const stopListeningRef = useRef<(autoPasteOnRelease?: boolean) => Promise<void>>(null as any)
  const startListeningRef = useRef<() => Promise<void>>(null as any)
  const toggleListeningRef = useRef<() => Promise<void>>(null as any)
  const sessionRecordStartMsRef = useRef<number>(0)
  const sessionProcStartMsRef = useRef<number>(0)

  const isApproving = stage === 'approving' && agentProposal !== null
  const isExpanded = activeQuestion !== null || (generatedTask !== null && stage === 'ready') || showSettings || isApproving

  // Autofocus window when Command Bar is toggled open
  useEffect(() => {
    if (isCommandBarOpen && window.electronAPI?.focusWindow) {
      window.electronAPI.focusWindow()
    }
  }, [isCommandBarOpen])

  // Dynamic window resizing for compact pill & sheets
  useEffect(() => {

    if (window.electronAPI) {
      if (overlayMode === 'dashboard') {
        window.electronAPI.resizeWindow({ width: 1040, height: 680 })
      } else if (overlayMode === 'compact') {
        if (showInspector) {
          window.electronAPI.resizeWindow({ width: 580, height: 440 })
        } else if (guidanceStep) {
          window.electronAPI.resizeWindow({ width: 620, height: 290 })
        } else if (isCommandBarOpen) {
          window.electronAPI.resizeWindow({ width: 540, height: 86 })
        } else if (showSettings) {
          window.electronAPI.resizeWindow({ width: 580, height: 430 })
        } else if (isApproving) {
          window.electronAPI.resizeWindow({ width: 580, height: 240 })
        } else if (activeQuestion !== null || (generatedTask !== null && stage === 'ready')) {
          window.electronAPI.resizeWindow({ width: 580, height: 370 })
        } else if (queryResult) {
          window.electronAPI.resizeWindow({ width: 400, height: 160 })
        } else if (stage === 'listening') {
          // Dedicated compact width with generous transparent breathing room to eliminate edge clipping
          const listenWidth = isPersistentMode ? 280 : 240
          window.electronAPI.resizeWindow({ width: listenWidth, height: 58 })
        } else if (showMenu) {
          window.electronAPI.resizeWindow({ width: 245, height: 205 })
        } else if (stage === 'analyzing' || executionStatus) {
          const statusLength = (executionStatus || '').length
          const statusWidth = statusLength > 28 ? 360 : (statusLength > 16 ? 310 : 270)
          window.electronAPI.resizeWindow({ width: statusWidth, height: 58 })
        } else {
          window.electronAPI.resizeWindow({ width: 155, height: 58 })
        }
      } else {
        const targetHeight = isApproving ? 220 : (isExpanded ? 370 : 64)
        window.electronAPI.resizeWindow({ width: 620, height: targetHeight })
      }
    }
  }, [activeQuestion, generatedTask, showSettings, stage, agentProposal, overlayMode, showMenu, executionStatus, isPersistentMode, queryResult, isCommandBarOpen, showInspector, guidanceStep])

  // Close menu on click outside or Escape
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.wf-popover-menu') && !target.closest('.wf-more-btn')) {
        setShowMenu(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showMenu) setShowMenu(false)
        else if (showSettings) setShowSettings(false)
        else if (showInspector) setShowInspector(false)
        else if (guidanceStep) {
          setGuidanceStep(null)
          setGuidanceWorkflow(null)
        }
        else if (isCommandBarOpen) setIsCommandBarOpen(false)
        else if (overlayMode === 'dashboard') setOverlayMode('compact')
        else if (overlayMode === 'expanded') setOverlayMode('compact')
      } else if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShowMenu(false)
        if (window.electronAPI?.showDashboard) {
          window.electronAPI.showDashboard()
        } else {
          setOverlayMode((prev) => (prev === 'dashboard' ? 'compact' : 'dashboard'))
        }
      }
    }
    window.addEventListener('mousedown', handleGlobalClick)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showMenu, showSettings, overlayMode])

  const handleUpdateSettings = (newSet: Partial<AppSettings>) => {
    const merged = { ...settings, ...newSet }
    setSettings(merged)
    try {
      localStorage.setItem('vesper_settings', JSON.stringify(merged))
    } catch (e) {}
    window.electronAPI?.saveSettings(merged)
  }

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getContext().then(setContext).catch(console.warn)
      window.electronAPI.getSettings().then((persisted) => {
        let cached: any = {}
        try {
          const raw = localStorage.getItem('vesper_settings')
          if (raw) cached = JSON.parse(raw)
        } catch (e) {}
        const viteEnvKey = (import.meta as any).env?.VITE_GROQ_API_KEY || ''
        const validKey = [persisted?.apiKey, viteEnvKey, cached?.apiKey, settings.apiKey]
          .find((k) => typeof k === 'string' && k.trim().length > 0) || ''

        const merged = {
          ...settings,
          ...cached,
          ...persisted,
          apiKey: validKey
        }
        setSettings(merged)
        if (merged.holdKey) {
          window.electronAPI?.setHoldKey(merged.holdKey)
        }
      }).catch(console.warn)

      // Pre-warm audio capture channel for instant <5ms response time on key hold / click
      audioRecorderRef.current.prewarm().catch(() => {})

      // 1. Global hotkey listener (Ctrl+Shift+Space): Toggle voice recording
      const unsubHotkey = window.electronAPI.onHotkeyTriggered(() => {
        refreshContext()
        setShowMenu(false)
        setShowSettings(false)
        setShowInspector(false)
        setGuidanceStep(null)
        if (stageRef.current === 'listening') {
          stopListeningRef.current?.(true)
        } else {
          startListeningRef.current?.()
        }
      })

      // 2. VESPER Hold-to-Talk listener (Fn / Right Alt / Configured key)
      const unsubHoldStart = window.electronAPI.onHoldStart(() => {
        setIsHoldMode(true)
        setIsPersistentMode(false)
        setIsPaused(false)
        if (window.electronAPI) {
          window.electronAPI.getContext().then((ctx) => {
            if (ctx && ctx.activeApp) {
              recordingStartContextRef.current = ctx
              setContext(ctx)
            }
          }).catch(() => {})
        }
        startListeningRef.current?.()
      })

      const unsubHoldEnd = window.electronAPI.onHoldEnd(() => {
        setIsHoldMode(false)
        stopListeningRef.current?.(true) // Auto-paste immediately when key is released
      })

      // 3. Double-tap Persistent Mode listener (Double-click Fn / Key)
      const unsubDoubleTap = window.electronAPI.onDoubleTap(() => {
        setIsPersistentMode(true)
        setIsHoldMode(false)
        setIsPaused(false)
        if (window.electronAPI) {
          window.electronAPI.getContext().then((ctx) => {
            if (ctx && ctx.activeApp) {
              recordingStartContextRef.current = ctx
              setContext(ctx)
            }
          }).catch(() => {})
        }
        startListeningRef.current?.()
      })

      // 4. Single-tap listener (Single click Fn / Key)
      const unsubSingleTap = window.electronAPI.onSingleTap?.(() => {
        refreshContext()
        toggleListeningRef.current?.()
      })

      return () => {
        unsubHotkey()
        unsubHoldStart()
        unsubHoldEnd()
        unsubDoubleTap()
        unsubSingleTap?.()
      }
    }
  }, [])

  useEffect(() => {
    if (overlayMode === 'compact') {
      if (stage === 'idle' && !executionStatus && !isCommandBarOpen && !showMenu) {
        window.electronAPI?.hideHUD()
      }
    }
  }, [stage, executionStatus, overlayMode, isCommandBarOpen, showMenu])

  const refreshContext = async () => {
    if (window.electronAPI) {
      const freshContext = await window.electronAPI.getContext()
      setContext(freshContext)
    }
  }

  const toggleListening = async () => {
    setShowMenu(false)
    if (stageRef.current === 'listening' || isRecordingRef.current || audioRecorderRef.current.isRecording) {
      stopListening(true)
    } else {
      setIsHoldMode(false)
      setIsPersistentMode(true)
      setIsPaused(false)
      startListening()
    }
  }
  toggleListeningRef.current = toggleListening

  const startListening = async () => {
    if (isRecordingRef.current) return
    // Daily free 30-minute limit guard (resets nightly at 12:00 AM)
    if (DailyUsageService.isDailyLimitExceeded()) {
      audioChimes.playError(settings.soundFeedback !== false)
      setExecutionStatus('⚠️ Daily free limit reached (30/30m). Resets at 12:00 AM.')
      setTimeout(() => setExecutionStatus(null), 4000)
      return
    }

    // Self-healing guard: if audio recorder is not actively recording, clear any stale isStoppingRef lock
    if (!audioRecorderRef.current.isRecording) {
      isStoppingRef.current = false
    } else if (isStoppingRef.current) {
      return
    }
    isRecordingRef.current = true
    sessionRecordStartMsRef.current = Date.now()
    if (overlayMode === 'compact') {
      window.electronAPI?.showHUD?.()
    }
    console.log('[VESPER] [REC] Audio capture starting...')
    audioChimes.playStart(settings.soundFeedback !== false)
    setShowMenu(false)
    setStage('listening')
    stageRef.current = 'listening'
    setIsPaused(false)
    setTranscript('')
    setActiveQuestion(null)
    setGeneratedTask(null)
    setExecutionStatus(null)

    // Start recording immediately without waiting for context refresh (0ms audio latency)
    audioRecorderRef.current.start(
      (vol) => {
        setAudioLevel(vol)
      },
      isPersistentModeRef.current
        ? (speechDurationMs) => {
            // Silero VAD hands-free cutoff: when user finishes speaking in toggle/persistent hands-free mode
            if (stageRef.current === 'listening' && !isStoppingRef.current && isPersistentModeRef.current) {
              console.log(`[VESPER] Silero VAD hands-free cutoff detected (${speechDurationMs}ms speech). Finalizing...`)
              stopListening(true)
            }
          }
        : undefined
    )

    if (window.electronAPI) {
      window.electronAPI.getContext().then((ctx) => {
        if (ctx && ctx.activeApp) {
          recordingStartContextRef.current = ctx
          setContext(ctx)
        }
      }).catch(() => {})
    } else {
      recordingStartContextRef.current = context
    }
  }
  startListeningRef.current = startListening

  const handleTogglePause = () => {
    if (isPaused) {
      audioRecorderRef.current.resume((vol) => setAudioLevel(vol))
      setIsPaused(false)
    } else {
      audioRecorderRef.current.pause()
      setAudioLevel(0)
      setIsPaused(true)
    }
  }

  const handleStopAndInsert = () => {
    setIsPersistentMode(false)
    setIsPaused(false)
    stopListening(true)
  }

  const handleCancel = async () => {
    isStoppingRef.current = false
    isRecordingRef.current = false
    await audioRecorderRef.current.stop()
    setAudioLevel(0)
    setTranscript('')
    setIsPersistentMode(false)
    setIsPaused(false)
    setIsHoldMode(false)
    setStage('idle')
    stageRef.current = 'idle'
    setActiveQuestion(null)
    setGeneratedTask(null)
    setAgentProposal(null)
    setExecutionStatus(null)
    window.electronAPI?.hideHUD()
  }

  const stopListening = async (autoPasteOnRelease = false) => {
    if (isStoppingRef.current) return
    if (!audioRecorderRef.current.isRecording && !isRecordingRef.current && stageRef.current !== 'listening') {
      return
    }

    isStoppingRef.current = true
    isRecordingRef.current = false
    audioChimes.playStop(settings.soundFeedback !== false)
    setStage('analyzing')
    stageRef.current = 'analyzing'
    setExecutionStatus('Transcribing with Groq Whisper...')

    let recResult
    try {
      recResult = await audioRecorderRef.current.stop()
    } catch (err) {
      console.warn('[VESPER] Recorder stop error:', err)
      isStoppingRef.current = false
      setStage('idle')
      stageRef.current = 'idle'
      return
    }

    setAudioLevel(0)
    setIsPaused(false)

    console.log(`[VESPER] [REC] Recording captured: ${recResult.durationMs}ms (${recResult.byteSize} bytes)`)

    const audioBlob = recResult.blob

    if (audioBlob && audioBlob.size > 0 && window.electronAPI?.saveDebugRecording) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1]
          if (base64data) {
            window.electronAPI!.saveDebugRecording!({
              base64Data: base64data,
              filename: `recording-${Date.now()}.webm`
            }).catch(() => {})
          }
        }
        reader.readAsDataURL(audioBlob)
      } catch (err) {}
    }

    let apiKey = (settings.apiKey || '').trim()
    if (!apiKey) {
      apiKey = getInitialApiKey()
      if (apiKey) {
        setSettings((prev) => ({ ...prev, apiKey }))
      }
    }

    const isExplicitLocal = settings.aiProvider === 'local' || settings.aiProvider === 'ollama'

    // 1. If Groq is the chosen provider and no API key is set, explicitly alert user and open settings
    if (!apiKey && !isExplicitLocal) {
      console.warn('[VESPER] Groq API key is missing. Opening settings dialog.')
      setStage('idle')
      stageRef.current = 'idle'
      isStoppingRef.current = false
      isRecordingRef.current = false
      setExecutionStatus('⚠️ Groq API key required for voice dictation. Opening Settings...')
      setShowSettings(true)
      setTimeout(() => setExecutionStatus(null), 4500)
      return
    }

    const isLocalMode = isExplicitLocal || !apiKey

    // 2. Early validation: Reject recordings that are too short or silent (< 300ms or < 500 bytes)
    if (recResult.durationMs < 300 || !audioBlob || audioBlob.size < 500) {
      console.warn(`[VESPER] ⚠️ Recording too short or empty (duration: ${recResult.durationMs}ms, bytes: ${recResult.byteSize})`)
      setExecutionStatus('Transcription unclear: please try again.')
      setTranscript('')
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
      }, 2500)
      return
    }

    // 3. Transcribe with Intelligent Dispatcher (Whisper Turbo v3 / Local Whisper ONNX)
    const whisperLabel = settings.whisperModel === 'whisper-large-v3-turbo' ? 'Whisper Turbo v3' : (settings.whisperModel || 'Whisper Turbo v3')
    setExecutionStatus(isLocalMode ? `Transcribing with Local ${whisperLabel}...` : `Transcribing with Cloud ${whisperLabel}...`)
    console.log(`[VESPER] Transcribing audio (${audioBlob.size} bytes, ${recResult.durationMs}ms, mode: ${isLocalMode ? 'local' : 'groq'}, model: ${whisperLabel})...`)

    // Compile dynamic Whisper context prompt from custom vocabulary + domain priming + active window
    let dynamicPrompt = ''
    try {
      const vocabTerms = getVocabulary().map((v) => v.term).filter(Boolean).slice(0, 30).join(', ')
      const promptParts: string[] = [
        'pricing tiers, pro plan, enterprise, popular badge, responsive, components, layout, free plan, navbar, modal, button'
      ]
      if (vocabTerms) promptParts.push(vocabTerms)
      if (context.activeApp) promptParts.push(`App: ${context.activeApp}`)
      if (context.windowTitle) promptParts.push(`Window: ${context.windowTitle}`)
      dynamicPrompt = promptParts.join('. ')
    } catch {}

    const { text: rawTranscript, provider: activeProvider, error: sttErr } = await transcribeAudio(
      audioBlob,
      apiKey,
      {
        model: settings.whisperModel || 'whisper-large-v3-turbo',
        language: settings.whisperLanguage || 'auto',
        prompt: dynamicPrompt || undefined,
        translateToEnglish: settings.englishLettersOnly !== false,
        preferLocal: isLocalMode
      }
    )

    if (sttErr && !rawTranscript) {
      console.error('[VESPER] STT error:', sttErr)
      setExecutionStatus(`⚠️ ${sttErr}`)
      isStoppingRef.current = false
      isRecordingRef.current = false
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
        stageRef.current = 'idle'
      }, 3000)
      return
    }

    // 4. Transcription Validation BEFORE Polishing
    const whisperValidation = validateWhisperTranscript(
      rawTranscript || '',
      recResult.durationMs,
      recResult.byteSize
    )

    if (!whisperValidation.valid) {
      console.warn(`[VESPER] ❌ Whisper transcript rejected: ${whisperValidation.reason} | Raw: "${rawTranscript}"`)
      setExecutionStatus('Transcription unclear: please try again.')
      setTranscript('')
      isStoppingRef.current = false
      isRecordingRef.current = false
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
        stageRef.current = 'idle'
      }, 2500)
      return
    }

    const validatedTranscript = whisperValidation.cleanedText || ''
    console.log(`[VESPER] [OK] Transcript validated (${activeProvider}): "${validatedTranscript}"`)
    let textToProcess = validatedTranscript
    setTranscript(validatedTranscript)

    // 5. Screen & Context-Aware AI Polishing
    if (settings.aiPolishing !== false) {
      setExecutionStatus(isLocalMode ? 'Rephrasing & polishing with Local AI / Rules...' : 'Rephrasing & polishing with LLM...')
      console.log(`[VESPER] Polishing with context [App: ${context.activeApp || 'Desktop'}, Title: ${context.windowTitle || 'Unknown'}, Provider: ${settings.aiProvider}]...`)

      let polished: string | null = null

      // If Ollama is selected or running locally, try local Ollama
      if (settings.aiProvider === 'ollama' || settings.aiProvider === 'local') {
        polished = await polishWithOllama(
          validatedTranscript,
          context,
          settings.ollamaEndpoint || 'http://localhost:11434',
          settings.ollamaModel || 'llama3.2',
          settings.englishLettersOnly !== false
        )
      }

      // If not polished and Groq API key is present and not strict local, use Groq Llama
      if (!polished && apiKey && settings.aiProvider !== 'local') {
        polished = await polishWithGroqLlama(
          validatedTranscript,
          context,
          apiKey,
          'llama-3.3-70b-versatile',
          settings.englishLettersOnly !== false
        )
      }

      // Local Deterministic Rule Polishing Fallback (Zero network overhead, 100% offline)
      if (!polished) {
        polished = polishWithLocalRules(validatedTranscript, context)
      }

      // 6. Validation step AFTER polishing
      if (polished) {
        const polishValidation = validatePolishedOutput(polished, validatedTranscript)
        if (!polishValidation.valid) {
          console.warn(`[VESPER] [FAIL] Polished output rejected: ${polishValidation.reason} | Polished: "${polished}"`)
          setExecutionStatus('Transcription unclear: please try again.')
          setTranscript('')
          isStoppingRef.current = false
          isRecordingRef.current = false
          setTimeout(() => {
            setExecutionStatus(null)
            setStage('idle')
            stageRef.current = 'idle'
          }, 2500)
          return
        }
        const cleanedPolished = polishValidation.cleanedText || ''
        console.log(`[VESPER] [OK] Polished Transcript: "${cleanedPolished}"`)
        textToProcess = cleanedPolished
        setTranscript(cleanedPolished)
      }
    }

    // VESPER Snippets Expansion: replace voice shortcut with expanded snippet
    try {
      const activeSnippets = getSnippets()
      const normalized = textToProcess.toLowerCase().trim().replace(/[.,!?;:]+$/, '')
      const matched = activeSnippets.find((s) => s.trigger.toLowerCase().trim() === normalized)
      if (matched) {
        console.log(`[VESPER] [SNIPPET] Voice Snippet expanded: "${matched.trigger}" -> "${matched.expansion.substring(0, 40)}..."`)
        textToProcess = matched.expansion
        setTranscript(matched.expansion)
      }
    } catch (err) {
      console.warn('[VESPER] Snippet lookup warning:', err)
    }

    if (textToProcess) {
      console.log(`[VESPER] Processing text: "${textToProcess}", autoPaste: ${autoPasteOnRelease}`)
      let currentCtx = context
      if (window.electronAPI?.getContext) {
        try {
          const fresh = await window.electronAPI.getContext()
          if (fresh && fresh.activeApp) {
            currentCtx = fresh
            setContext(fresh)
          }
        } catch {}
      }

      // In-Place Selection Transformation ("Edit Mode" inspired by FreeFlow)
      // When the user has highlighted text and speaks an edit/transform command
      if (SelectionTransformer.isTransformCommand(textToProcess, currentCtx)) {
        setExecutionStatus('Transforming selection in-place...')
        const transformResult = await SelectionTransformer.transform(
          textToProcess,
          currentCtx,
          apiKey
        )
        if (transformResult.isTransform && transformResult.transformedText) {
          console.log(`[VESPER] [EDIT-MODE] Selection transformed in-place: "${transformResult.transformedText.substring(0, 40)}..."`)
          textToProcess = transformResult.transformedText
          setTranscript(transformResult.transformedText)
        }
      }

      handleProcessSpeech(textToProcess, undefined, autoPasteOnRelease, currentCtx)
    } else {
      console.warn(`[VESPER] No text to process.`)
      setExecutionStatus('Transcription unclear: please try again.')
      isStoppingRef.current = false
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
        stageRef.current = 'idle'
      }, 2500)
    }
  }
  stopListeningRef.current = stopListening

  const handleCommandBarSubmit = async (text: string) => {
    setIsCommandBarOpen(false)
    setTranscript(text)

    const lower = text.toLowerCase().trim()

    // 1. Step-by-step Visual AI Guidance (Halo cursor & pointer tutorial)
    if (GuidanceEngine.isGuidanceRequest(text)) {
      const workflow = GuidanceEngine.getWorkflow(text, context)
      setGuidanceWorkflow(workflow)
      setGuidanceStepIndex(0)
      setGuidanceStep(workflow.steps[0])
      setExecutionStatus(`Visual Guide: ${workflow.title}`)
      setStage('ready')
      if (workflow.steps[1]?.shortcut && window.electronAPI?.writeClipboard) {
        window.electronAPI.writeClipboard(workflow.steps[1].shortcut).catch(() => {})
      }
      return
    }

    // 2. Application Launching (Universal Action: openApp)
    if (lower.startsWith('open ') || lower.startsWith('launch ') || (lower.startsWith('start ') && !lower.includes('start coding'))) {
      const appTarget = text.replace(/^(open|launch|start)\s+/i, '').trim()
      if (window.electronAPI?.executeUniversalAction) {
        setExecutionStatus(`Launching ${appTarget}...`)
        const res = await window.electronAPI.executeUniversalAction({
          actionId: `act_${Date.now()}`,
          actionType: 'openApp',
          target: appTarget,
          parameters: { appName: appTarget },
          riskLevel: 'low',
          state: 'pending'
        })
        setExecutionStatus(res.message || `Launched ${appTarget}`)
        setTimeout(() => setExecutionStatus(null), 2500)
        return
      }
    }

    // 3. Rollback / Undo (Universal Action: undoLastAction)
    if (lower === 'undo' || lower === 'undo that' || lower === 'rollback') {
      if (window.electronAPI?.undoLastAction) {
        setExecutionStatus('Rolling back last action...')
        const res = await window.electronAPI.undoLastAction()
        setExecutionStatus(res.message || 'Action undone')
        setTimeout(() => setExecutionStatus(null), 2500)
        return
      }
    }

    // 4. File Creation (Universal Action: createFile)
    if (
      lower.startsWith('create file') ||
      lower.startsWith('create a file') ||
      lower.startsWith('make file') ||
      lower.startsWith('make a file')
    ) {
      let speechForFile = text
        .replace(/\bquera\b/gi, 'vesper')
        .replace(/\s*underscore\s*/gi, '_')
        .replace(/\s*dot\s*/gi, '.')
        .replace(/\s*dash\s*/gi, '-')
        .replace(/\s*hyphen\s*/gi, '-')
        .replace(/[.,;!?]+$/, '')

      const match = speechForFile.match(/(?:create|make)\s+(?:a\s+)?file\s+([^\s]+)(?:\s+(?:with|containing)\s+([\s\S]+))?/i)
      const filePath = match ? match[1].trim() : 'vesper_file.txt'
      let fileContent = match && match[2] ? match[2].trim() : 'Created by VESPER Universal Action'
      if (window.electronAPI?.executeUniversalAction) {
        setExecutionStatus(`Creating ${filePath}...`)
        const res = await window.electronAPI.executeUniversalAction({
          actionId: `act_${Date.now()}`,
          actionType: 'createFile',
          target: filePath,
          parameters: { filePath, content: fileContent },
          riskLevel: 'medium',
          state: 'pending'
        })
        setExecutionStatus(res.message || `Created ${filePath}`)
        setTimeout(() => setExecutionStatus(null), 2500)
        return
      }
    }

    await handleProcessSpeech(text, undefined, true, context, 'text')
  }

  const handleProcessSpeech = async (
    speechText: string,
    currentClarifications = clarifications,
    autoPasteOnRelease = false,
    effectiveContext = context,
    inputMode: 'voice' | 'text' = 'voice'
  ) => {
    // 0. Visual AI Guidance Intent (Step-by-step halo cursor navigation)
    if (GuidanceEngine.isGuidanceRequest(speechText)) {
      console.log(`[VESPER] [GUIDANCE] Triggering Visual AI Guidance for: "${speechText}"`)
      const workflow = GuidanceEngine.getWorkflow(speechText, effectiveContext)
      setGuidanceWorkflow(workflow)
      setGuidanceStepIndex(0)
      setGuidanceStep(workflow.steps[0])
      setExecutionStatus(`Visual Guide: ${workflow.title}`)
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false

      const shortcut = workflow.steps.find((s) => s.shortcut)?.shortcut
      if (shortcut && window.electronAPI?.writeClipboard) {
        window.electronAPI.writeClipboard(shortcut).catch(() => {})
      }

      // If user is dictating with Hold-to-Talk auto-paste, also paste the procedural shortcut answer into the active editor
      let answerText = ''
      const qLower = speechText.toLowerCase()
      if (qLower.includes('close') && (qLower.includes('tab') || qLower.includes('file'))) {
        answerText = 'To close all saved tabs in Antigravity IDE / VS Code, press Ctrl+K then U. To close all open tabs, press Ctrl+K then W (or Ctrl+W to close active file). You can also right-click any tab and select "Close Saved" or "Close All".'
      } else if (qLower.includes('export') && qLower.includes('csv')) {
        answerText = 'To export to CSV in React/TypeScript, construct a Blob with CSV data or use the export-to-csv library. In the IDE, right-click the table/data file and select "Export as CSV".'
      } else if (qLower.includes('terminal') || qLower.includes('command prompt')) {
        answerText = 'To open the integrated terminal in Antigravity IDE / VS Code, press Ctrl+` (backtick) or navigate to Terminal > New Terminal.'
      } else if (qLower.includes('format')) {
        answerText = 'To format the active file in your editor, press Shift+Alt+F (or Ctrl+Shift+I).'
      } else if (shortcut) {
        answerText = `Shortcut: ${shortcut} - ${workflow.title}`
      }

      if (autoPasteOnRelease && answerText && window.electronAPI?.executeAction) {
        window.electronAPI.executeAction({
          content: answerText,
          autoPaste: true,
          targetContext: effectiveContext
        }).catch(() => {})
      }
      return
    }

    // Explicit GUI pointer navigation when not in Hold-to-Talk auto-paste mode
    const speechLower = speechText.toLowerCase().trim()
    const isVisualNavigation =
      !autoPasteOnRelease &&
      (speechLower.startsWith('show me where') ||
        speechLower.startsWith('where is') ||
        speechLower.startsWith('navigate to') ||
        speechLower.startsWith('help me find') ||
        speechLower.startsWith('guide me to'))

    if (isVisualNavigation) {
      setExecutionStatus('Locating target UI element with Screen Vision...')
      let screenshot: string | null = null
      try {
        screenshot = (await window.electronAPI?.captureScreen?.()) || null
      } catch {}

      const navPlan = await ScreenNavigator.resolveNavigationTargetWithVision(
        speechText,
        effectiveContext.activeApp || 'Desktop',
        screenshot,
        settings.apiKey
      )

      const target = navPlan.targetElement
      setGuidanceStep({
        stepIndex: 1,
        totalSteps: 2,
        title: target ? `Target: ${target.label}` : `Guide: ${effectiveContext.activeApp || 'Application'}`,
        instruction: navPlan.guidanceMessage || `Locate ${target?.label || 'action control'}. Follow highlighted pointer.`,
        targetElement: target?.label || effectiveContext.activeApp || 'Action Control',
        coordinates: target ? { x: target.x, y: target.y } : { x: 220, y: 80 }
      })
      setExecutionStatus(navPlan.guidanceMessage || 'Visual AI Guidance Active')
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false
      return
    }

    setStage('analyzing')

    // Always rank and compress context for explainability and inspection
    const ranked = ContextRanker.rankAndCompress(speechText, effectiveContext)
    setContextPackage(ranked)

    const { task, actionPlan, question, securityWarning, isBlocked, isChained } = await processIntent(
      speechText,
      effectiveContext,
      currentClarifications,
      settings,
      Object.keys(currentClarifications).length,
      lastCompletedTaskRef.current?.task || null,
      lastCompletedTaskRef.current?.timestamp,
      inputMode
    )

    if (isChained) {
      console.log('[VESPER] [CHAIN] Context Chained to parent task:', lastCompletedTaskRef.current?.task.taskId)
    }

    if (isBlocked) {
      setExecutionStatus(`⚠️ Blocked: ${securityWarning || 'Harmful action prevented'}`)
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false
      return
    }

    if (question && !currentClarifications[question.id] && !autoPasteOnRelease) {
      setActiveQuestion(question)
      setStage('clarifying')
      isStoppingRef.current = false
      isRecordingRef.current = false
      return
    }

    setActiveQuestion(null)
    setGeneratedTask(task)

    // Autonomous Screen & Chat Copilot Workflow (WhatsApp, Slack, CRM sales/reply)
    if (task.intent.action === 'agent_screen_copilot' || speechText.toLowerCase().includes('understand this') || speechText.toLowerCase().includes('make this sale')) {
      setExecutionStatus('Analyzing screen & conversation context...')
      let screenshot: string | null = null
      try {
        screenshot = (await window.electronAPI?.captureScreen?.()) || null
      } catch (err) {
        console.warn('[VESPER] Screen capture warning:', err)
      }

      const proposal = await executeScreenAgent({
        userGoal: speechText,
        context,
        screenshotBase64: screenshot,
        apiKey: settings.apiKey,
        aiProvider: settings.aiProvider
      })

      setAgentProposal(proposal)
      setExecutionStatus(null)
      setStage('approving')
      isStoppingRef.current = false
      isRecordingRef.current = false
      return
    }

    // 1. Ambient Context Query / Question: Present answer directly instead of pasting code prompt into editor
    if (task.interactionType === 'query' && task.queryAnswer) {
      setQueryResult({ question: speechText, answer: task.queryAnswer })
      setExecutionStatus(`💡 ${task.queryAnswer.substring(0, 45)}...`)

      if (window.electronAPI?.writeClipboard) {
        window.electronAPI.writeClipboard(task.queryAnswer).catch(() => {})
      } else {
        try {
          navigator.clipboard?.writeText(task.queryAnswer).catch(() => {})
        } catch {}
      }

      if (autoPasteOnRelease) {
        handleExecute(task, true)
        return
      }

      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false

      setTimeout(() => {
        if (overlayMode === 'compact') {
          window.electronAPI?.hideHUD()
          setQueryResult(null)
          setStage('idle')
        }
      }, 5000)
      return
    }

    // 2. Security Gate Enforcement: High risk operations (sending, deleting) MUST require explicit user confirmation
    if (task.security.requiresUserConfirmation) {
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false
    } else if (autoPasteOnRelease) {
      handleExecute(task, true)
    } else {
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false
    }
  }

  const handleSelectOption = (key: string, value: string) => {
    if (!activeQuestion) return
    const updated = { ...clarifications, [activeQuestion.id]: value }
    setClarifications(updated)
    handleProcessSpeech(transcript, updated, isHoldMode)
  }

  const handleExecute = async (task: UniversalTaskObject, autoPaste = true) => {
    setStage('executed')
    setExecutionStatus(autoPaste ? 'Inserted into input!' : 'Copied!')

    // 1. Application Launching (Universal Action: openApp)
    if (task.intent.action === 'open_app') {
      const appTarget = task.rawTranscript.replace(/^(open|launch|start)\s+/i, '').trim().replace(/[.,;!?]+$/, '')
      if (window.electronAPI?.executeUniversalAction) {
        const res = await window.electronAPI.executeUniversalAction({
          actionId: `act_${Date.now()}`,
          actionType: 'openApp',
          target: appTarget,
          parameters: { appName: appTarget },
          riskLevel: 'low',
          state: 'pending'
        })
        setExecutionStatus(res.message || `Launched ${appTarget}`)
        setTimeout(() => {
          setStage('idle')
          setExecutionStatus(null)
        }, 2500)
        return
      }
    }

    // 2. Rollback / Undo (Universal Action: undoLastAction)
    if (task.intent.action === 'undo' || task.rawTranscript.toLowerCase().trim() === 'undo') {
      if (window.electronAPI?.undoLastAction) {
        const res = await window.electronAPI.undoLastAction()
        setExecutionStatus(res.message || 'Action undone')
        setTimeout(() => {
          setStage('idle')
          setExecutionStatus(null)
        }, 2500)
        return
      }
    }

    // 3. File Creation (Universal Action: createFile)
    if (
      task.intent.action === 'file_operation' ||
      task.intent.action === 'create_file' ||
      /(?:create|make)\s+(?:a\s+)?file/i.test(task.rawTranscript)
    ) {
      let speechForFile = task.rawTranscript
        .replace(/\bquera\b/gi, 'vesper')
        .replace(/\s*underscore\s*/gi, '_')
        .replace(/\s*dot\s*/gi, '.')
        .replace(/\s*dash\s*/gi, '-')
        .replace(/\s*hyphen\s*/gi, '-')
        .replace(/[.,;!?]+$/, '')

      const match = speechForFile.match(/(?:create|make)\s+(?:a\s+)?file\s+([^\s]+)(?:\s+(?:with|containing)\s+([\s\S]+))?/i)
      const filePath = match ? match[1].trim() : 'test_vesper.txt'
      let fileContent = match && match[2] ? match[2].trim() : (task.targetRouting.optimizedPrompt || 'Hello World')
      if (fileContent.endsWith('.')) fileContent = fileContent.slice(0, -1)

      if (window.electronAPI?.executeUniversalAction) {
        const res = await window.electronAPI.executeUniversalAction({
          actionId: `act_${Date.now()}`,
          actionType: 'createFile',
          target: filePath,
          parameters: { filePath, content: fileContent },
          riskLevel: 'medium',
          state: 'pending'
        })
        setExecutionStatus(res.message || `Created ${filePath}`)
        setTimeout(() => {
          setStage('idle')
          setExecutionStatus(null)
        }, 2500)
        return
      }
    }

    console.log(`[VESPER] [EXEC] Executing action (${autoPaste ? 'Auto-Paste Ctrl+V' : 'Clipboard'}): "${task.targetRouting.optimizedPrompt.substring(0, 60)}${task.targetRouting.optimizedPrompt.length > 60 ? '...' : ''}"`)

    if (window.electronAPI) {
      const targetContext = recordingStartContextRef.current || task.context || context
      const result: any = await window.electronAPI.executeAction({
        content: task.targetRouting.optimizedPrompt,
        autoPaste,
        targetContext
      })

      if (result.outcome === 'needs_user') {
        audioChimes.playError(settings.soundFeedback !== false)
        setExecutionStatus(`⚠️ ${result.message}`)
      } else {
        if (result.success) {
          audioChimes.playSuccess(settings.soundFeedback !== false)
        } else {
          audioChimes.playError(settings.soundFeedback !== false)
        }
        setExecutionStatus(result.message)
      }

      // Record completed task to Central SQLite Context Engine
      try {
        window.electronAPI.recordTask?.({
          taskId: task.taskId,
          timestamp: Date.now(),
          rawSpeech: task.source.rawSpeech,
          intent: task.intent,
          requirements: task.specifications.requirements,
          targetApp: task.context.activeApp || 'Desktop',
          project: (context as any).projectWorkspace,
          taskObject: task,
          status: result.success ? 'executed' : 'failed'
        })
      } catch (e) {
        console.warn('[VESPER] Failed to record task to Context Engine:', e)
      }
    }

    // Save as last completed task for chaining subsequent interactions
    lastCompletedTaskRef.current = { task, timestamp: Date.now() }

    // Automatically log completed dictation to history store
    try {
      const wordCount = task.targetRouting.optimizedPrompt.trim().split(/\s+/).filter(Boolean).length
      addHistoryItem({
        targetApp: context.activeApp || 'Desktop',
        windowTitle: context.windowTitle,
        rawTranscript: transcript || task.targetRouting.optimizedPrompt,
        polishedText: task.targetRouting.optimizedPrompt,
        durationMs: 3800,
        wordCount,
        mode: settings.dictationMode || 'direct'
      })

      // Add to daily usage meter
      const recSec = sessionRecordStartMsRef.current ? Math.max(1, (Date.now() - sessionRecordStartMsRef.current) / 1000) : 1
      const procSec = sessionProcStartMsRef.current ? Math.max(0.5, (Date.now() - sessionProcStartMsRef.current) / 1000) : 0.5
      DailyUsageService.addUsage(recSec + procSec, { recording: recSec, processing: procSec })
      sessionRecordStartMsRef.current = 0
      sessionProcStartMsRef.current = 0
    } catch (e) {
      console.warn('[VESPER] Failed to record history or usage item:', e)
    }

    setTimeout(() => {
      setExecutionStatus(null)
      setStage('idle')
      stageRef.current = 'idle'
      setGeneratedTask(null)
      setAgentProposal(null)
      setActiveQuestion(null)
      setClarifications({})
      setIsHoldMode(false)
      setIsPersistentMode(false)
      setIsPaused(false)
      isStoppingRef.current = false
      isRecordingRef.current = false
      // Hide back to background after auto-pasting in compact or expanded mode
      if (autoPaste && (overlayMode === 'compact' || overlayMode === 'expanded')) {
        window.electronAPI?.hideHUD()
      }
    }, 1100)
  }

  const handlePresetClick = (text: string) => {
    setTranscript(text)
    handleProcessSpeech(text, undefined, true)
  }

  const handleMicClick = () => {
    if (stage === 'listening') {
      stopListening(true)
    } else {
      setShowMenu(false)
      setIsHoldMode(false)
      setIsPersistentMode(true)
      setIsPaused(false)
      startListening()
    }
  }

  const handleMoreClick = () => {
    setShowMenu((prev) => !prev)
  }

  const handleRePaste = async (text: string) => {
    if (window.electronAPI) {
      await window.electronAPI.executeAction({
        content: text,
        autoPaste: true,
        targetContext: recordingStartContextRef.current || context
      })
    }
  }

  // 0. Full VESPER Desktop Application Dashboard
  if (overlayMode === 'dashboard') {
    return (
      <VesperDashboard
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onBackToPill={() => setOverlayMode('compact')}
        onRePasteText={handleRePaste}
        activeApp={context.activeApp}
      />
    )
  }

  // 1. Compact Floating Pill Mode (Identical to native VESPER overlay widget)
  if (overlayMode === 'compact') {
    if (showInspector) {
      return (
        <div className="wf-compact-wrapper" style={{ padding: 6 }}>
          <ContextInspector
            context={context}
            contextPackage={contextPackage}
            lastTask={generatedTask}
            aiProvider={settings.aiProvider}
            isPaused={isPaused}
            onClose={() => setShowInspector(false)}
          />
        </div>
      )
    }

    if (guidanceStep) {
      return (
        <div className="wf-compact-wrapper" style={{ width: '100%', height: '100%' }}>
          <AICursorOverlay
            currentStep={guidanceStep}
            onDismiss={() => {
              setGuidanceStep(null)
              setGuidanceWorkflow(null)
              setGuidanceStepIndex(0)
            }}
            onNextStep={() => {
              if (guidanceWorkflow && guidanceStepIndex < guidanceWorkflow.steps.length - 1) {
                const nextIdx = guidanceStepIndex + 1
                setGuidanceStepIndex(nextIdx)
                setGuidanceStep(guidanceWorkflow.steps[nextIdx])
              } else if (guidanceStep.stepIndex < guidanceStep.totalSteps) {
                setGuidanceStep({
                  ...guidanceStep,
                  stepIndex: guidanceStep.stepIndex + 1,
                  title: `Step ${guidanceStep.stepIndex + 1}: Complete Action`,
                  instruction: `Follow through with the guided action in ${context.activeApp}.`
                })
              } else {
                setGuidanceStep(null)
                setGuidanceWorkflow(null)
                setGuidanceStepIndex(0)
              }
            }}
            onPrevStep={() => {
              if (guidanceWorkflow && guidanceStepIndex > 0) {
                const prevIdx = guidanceStepIndex - 1
                setGuidanceStepIndex(prevIdx)
                setGuidanceStep(guidanceWorkflow.steps[prevIdx])
              }
            }}
            onExecuteCurrentStep={async () => {
              if (guidanceStep.shortcut && window.electronAPI?.writeClipboard) {
                try {
                  await window.electronAPI.writeClipboard(guidanceStep.shortcut)
                } catch {}
              }
              if (guidanceWorkflow && guidanceStepIndex < guidanceWorkflow.steps.length - 1) {
                const nextIdx = guidanceStepIndex + 1
                setGuidanceStepIndex(nextIdx)
                setGuidanceStep(guidanceWorkflow.steps[nextIdx])
              } else {
                setExecutionStatus('Completed!')
                setTimeout(() => setExecutionStatus(null), 1500)
                setGuidanceStep(null)
                setGuidanceWorkflow(null)
                setGuidanceStepIndex(0)
              }
            }}
          />
        </div>
      )
    }

    if (isCommandBarOpen) {
      return (
        <div className="wf-compact-wrapper" style={{ padding: '4px 0' }}>
          <CommandBar
            activeApp={context.activeApp}
            windowTitle={context.windowTitle}
            context={context}
            onSubmitText={handleCommandBarSubmit}
            onStartVoice={() => {
              setIsCommandBarOpen(false)
              startListening()
            }}
            onClose={() => setIsCommandBarOpen(false)}
            isProcessing={stage === 'analyzing'}
            statusMessage={executionStatus}
          />
        </div>
      )
    }

    // In compact mode, show the capsule only when actively recording or analyzing
    if (stage !== 'listening' && stage !== 'analyzing' && !executionStatus) {
      return null
    }

    return (
      <div className="wf-compact-wrapper">
        <div className={`wf-compact-pill ${stage === 'listening' ? 'is-active-recording' : ''}`}>
          {/* Active Recording Waveform or Processing Status */}
          {stage === 'listening' ? (
            <div
              className="wf-compact-recording-body"
              onClick={handleStopAndInsert}
              title="Recording... Click to insert (or release key)"
              style={{ cursor: 'pointer' }}
            >
              <AudioVisualizer isRecording={true} audioLevel={audioLevel} barCount={20} />
              {isPersistentMode && (
                <button
                  className="wf-compact-action-btn wf-btn-cancel"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel()
                  }}
                  title="Cancel recording"
                  style={{ marginLeft: 4 }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ) : (
            <div className="wf-compact-status">
              <Activity size={12} style={{ color: 'var(--wf-text-muted)' }} />
              <span>{executionStatus || 'Polishing...'}</span>
            </div>
          )}
        </div>

        {/* Attached Popover Menu */}
        {showMenu && (
          <div className="wf-popover-menu">
            <div className="wf-popover-header">
              <span>VESPER Flow</span>
              <span style={{ fontSize: '9px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>{context.activeApp}</span>
            </div>

            {/* 1. Open VESPER Full Dashboard */}
            <button
              className="wf-popover-item"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--wf-border)',
                color: 'var(--wf-text-primary)',
                fontWeight: 500
              }}
              onClick={() => {
                setShowMenu(false)
                if (window.electronAPI?.showDashboard) {
                  window.electronAPI.showDashboard()
                } else {
                  setOverlayMode('dashboard')
                }
              }}
            >
              <div className="wf-popover-item-left">
                <LayoutDashboard size={13} style={{ color: 'var(--wf-text-secondary)' }} />
                <span>Open Flow Dashboard</span>
              </div>
              <ArrowUpRight size={12} style={{ color: 'var(--wf-text-muted)' }} />
            </button>

            <div className="wf-popover-divider" />

            <button
              className="wf-popover-item"
              onClick={() => {
                const nextMode: 'direct' | 'smart_assistant' = settings.dictationMode === 'direct' ? 'smart_assistant' : 'direct'
                const updated = { ...settings, dictationMode: nextMode }
                setSettings(updated)
                try {
                  localStorage.setItem('vesper_settings', JSON.stringify(updated))
                } catch (e) {}
                window.electronAPI?.saveSettings(updated)
              }}
            >
              <div className="wf-popover-item-left">
                <span>{settings.dictationMode === 'direct' ? 'Direct Dictation' : 'Smart Assistant'}</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--wf-success)', fontWeight: 600, letterSpacing: '0.04em' }}>ACTIVE</span>
            </button>

            <div className="wf-popover-divider" />

            <button
              className="wf-popover-item"
              onClick={() => {
                setShowMenu(false)
                setShowInspector(true)
              }}
            >
              <div className="wf-popover-item-left">
                <ShieldCheck size={13} style={{ color: '#10b981' }} />
                <span>Context & Privacy Inspector</span>
              </div>
            </button>

            <div className="wf-popover-divider" />

            <button
              className="wf-popover-item"
              onClick={() => {
                setShowMenu(false)
                setOverlayMode('dashboard')
              }}
            >
              <div className="wf-popover-item-left">
                <Activity size={13} style={{ color: 'var(--wf-text-muted)' }} />
                <span>System Audit & Verification</span>
              </div>
            </button>

            <button
              className="wf-popover-item"
              onClick={() => {
                setShowMenu(false)
                setShowSettings(true)
              }}
            >
              <div className="wf-popover-item-left">
                <Settings size={13} />
                <span>Settings...</span>
              </div>
            </button>

            <button
              className="wf-popover-item"
              style={{ color: '#fda4af' }}
              onClick={() => {
                setShowMenu(false)
                window.electronAPI?.quitApp()
              }}
            >
              <div className="wf-popover-item-left">
                <X size={13} />
                <span>Quit VESPER</span>
              </div>
            </button>
          </div>
        )}

        {/* Ambient Context Query / Question Answer Card */}
        {queryResult && (
          <div
            style={{
              marginTop: 8,
              width: '100%',
              maxWidth: 380,
              background: 'rgba(12, 14, 19, 0.98)',
              border: '1px solid var(--wf-border)',
              borderRadius: 'var(--wf-radius-md)',
              padding: '12px 14px',
              boxShadow: 'var(--wf-shadow-card)',
              backdropFilter: 'blur(24px)',
              color: 'var(--wf-text-primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--wf-text-primary)', fontWeight: 600 }}>
                <Terminal size={12} style={{ color: 'var(--wf-text-muted)' }} /> Ambient Recall
              </span>
              <button
                onClick={() => setQueryResult(null)}
                style={{ background: 'none', border: 'none', color: 'var(--wf-text-muted)', cursor: 'pointer', padding: 2 }}
              >
                <X size={12} />
              </button>
            </div>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--wf-text-secondary)', marginBottom: 10 }}>
              {queryResult.answer}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => {
                  handleRePaste(queryResult.answer)
                  setQueryResult(null)
                  if (overlayMode === 'compact') window.electronAPI?.hideHUD()
                }}
                className="wf-btn-primary"
                style={{
                  borderRadius: 'var(--wf-radius-sm)',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Insert at Cursor
              </button>
              <button
                onClick={() => {
                  if (window.electronAPI?.writeClipboard) {
                    window.electronAPI.writeClipboard(queryResult.answer).catch(() => {})
                  } else {
                    try {
                      navigator.clipboard?.writeText(queryResult.answer).catch(() => {})
                    } catch {}
                  }
                  setExecutionStatus('Copied!')
                  setTimeout(() => setExecutionStatus(null), 1000)
                }}
                className="wf-btn-ghost"
                style={{
                  borderRadius: 'var(--wf-radius-sm)',
                  padding: '5px 10px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Modal sheets (Agent approval card, settings, or smart QA) */}
        {stage === 'approving' && agentProposal && (
          <div style={{ marginTop: 8, width: '100%', maxWidth: 560 }}>
            <AgentApprovalCard
              proposal={agentProposal}
              onApprove={(finalText) => {
                if (generatedTask) {
                  const updatedTask: UniversalTaskObject = {
                    ...generatedTask,
                    targetRouting: {
                      ...generatedTask.targetRouting,
                      optimizedPrompt: finalText
                    }
                  }
                  handleExecute(updatedTask, true)
                }
              }}
              onEdit={(updatedText) => {
                setAgentProposal({ ...agentProposal, draftedReply: updatedText })
              }}
              onDisapprove={() => {
                setStage('idle')
                setAgentProposal(null)
                setGeneratedTask(null)
                setExecutionStatus('Proposal cancelled')
                setTimeout(() => setExecutionStatus(null), 1800)
              }}
            />
          </div>
        )}

        {showSettings && (
          <div style={{ marginTop: 8, width: '100%', maxWidth: 560 }}>
            <SettingsModal
              settings={settings}
              onSave={handleUpdateSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}

        {activeQuestion && (
          <div style={{ marginTop: 8, width: '100%', maxWidth: 560 }}>
            <SmartQAOverlay
              question={activeQuestion}
              onSelectOption={handleSelectOption}
            />
          </div>
        )}

        {/* Polished Task Output Card for confirmations, high risk, and review in Compact Mode */}
        {generatedTask && stage === 'ready' && (
          <div style={{ marginTop: 8, width: '100%', maxWidth: 560 }}>
            <TaskPreviewCard
              task={generatedTask}
              onExecute={handleExecute}
            />
          </div>
        )}
      </div>
    )
  }

  // 2. Expanded Search/Input Bar Mode

  return (
    <div className={`wf-container ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Authentic VESPER Floating Capsule Pill */}
      <div className="wf-capsule-bar">
        {/* Left: Brand Dot & Context App Pill */}
        <div className="wf-left">
          <div className="wf-brand-mark" title="VESPER Flow">
            <div className="wf-logo-glow">
              <span style={{ fontSize: '10px', fontWeight: 700 }}>Q</span>
            </div>
            <span>Flow</span>
          </div>
          <ContextBadge context={context} />
        </div>

        {/* Center: Live Sound Wave / Streaming Words */}
        <div className="wf-center">
          {isPaused ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-accent-amber)' }}>
              <span className="wf-pause-badge">PAUSED</span>
              <span>{transcript || 'Speech paused...'}</span>
            </div>
          ) : stage === 'listening' ? (
            <>
              <AudioVisualizer isRecording={true} audioLevel={audioLevel} />
              <div className="wf-live-speech">
                {transcript || (isHoldMode ? 'Listening (Release to Insert)...' : 'Listening...')}
                <span className="wf-caret" />
              </div>
            </>
          ) : stage === 'analyzing' ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-text-secondary)' }}>
              <Activity size={12} style={{ marginRight: 6, color: 'var(--wf-text-muted)' }} />
              <span>{executionStatus || 'Polishing & preparing input...'}</span>
            </div>
          ) : stage === 'approving' ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-text-secondary)' }}>
              <Activity size={12} style={{ marginRight: 6, color: 'var(--wf-text-muted)' }} />
              <span>Agent Proposal Ready • Review Below</span>
            </div>
          ) : executionStatus ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-success)' }}>
              <Check size={12} style={{ marginRight: 6 }} />
              <span>{executionStatus}</span>
            </div>
          ) : (
            <input
              type="text"
              className="wf-text-input"
              placeholder="Speak (Hold Fn / Alt) or type here & press Enter..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && transcript.trim()) {
                  handleProcessSpeech(transcript, undefined, true)
                }
              }}
            />
          )}
        </div>


        {/* Right: Interactive Controls (Record, Pause/Resume, Stop, Cancel) */}
        <div className="wf-right">
          {isPersistentMode || (stage === 'listening' && !isHoldMode) ? (
            <>
              {/* Pause / Resume Button */}
              <button
                className={`wf-control-btn wf-pause-btn ${isPaused ? 'is-paused' : ''}`}
                onClick={handleTogglePause}
                title={isPaused ? 'Resume Recording' : 'Pause Recording'}
              >
                {isPaused ? <Play size={12} fill="#fff" /> : <Pause size={12} />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              {/* Stop & Insert Button */}
              <button
                className="wf-control-btn wf-done-btn"
                onClick={handleStopAndInsert}
                title="Stop recording and insert into active text field"
              >
                <Check size={13} strokeWidth={3} />
                <span>Insert</span>
              </button>

              {/* Cancel Button */}
              <button
                className="wf-control-btn wf-cancel-btn"
                onClick={handleCancel}
                title="Cancel & discard recording"
              >
                <X size={13} />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              className={`wf-record-btn ${stage === 'listening' ? 'is-recording' : ''}`}
              onClick={toggleListening}
              title={stage === 'listening' ? 'Finish & Polish' : 'Record Voice'}
            >
              {stage === 'listening' ? (
                <>
                  <Square size={13} fill="#fff" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Mic size={14} />
                  <span>Speak</span>
                </>
              )}
            </button>
          )}

          <button
            className="wf-icon-btn"
            onClick={() => setOverlayMode('compact')}
            title="Collapse to Mini Pill"
          >
            <Minimize2 size={14} />
          </button>

          <button
            className="wf-icon-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings size={14} />
          </button>

          <button
            className="wf-icon-btn"
            onClick={() => window.electronAPI?.hideHUD()}
            title="Hide to Background"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Expanded Sheet: Smart Q&A, Polished Output, or Settings */}
      {isExpanded && (
        <div className="wf-sheet-body">
          {/* Quick Presets Row */}
          <div className="wf-presets-row">
            <span style={{ fontSize: '10px', color: 'var(--wf-text-subtle)', marginRight: 2 }}>
              Presets:
            </span>
            {SAMPLE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                className="wf-preset-pill"
                onClick={() => handlePresetClick(p.text)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Smart Q&A Disambiguation Card */}
          {activeQuestion && (
            <SmartQAOverlay
              question={activeQuestion}
              onSelectOption={handleSelectOption}
            />
          )}

          {/* Polished Task Output Card */}
          {generatedTask && stage === 'ready' && (
            <TaskPreviewCard
              task={generatedTask}
              onExecute={handleExecute}
            />
          )}

          {/* Autonomous Agent Human-in-the-Loop (HITL) Approval Card */}
          {stage === 'approving' && agentProposal && (
            <AgentApprovalCard
              proposal={agentProposal}
              onApprove={(finalText) => {
                if (generatedTask) {
                  const updatedTask: UniversalTaskObject = {
                    ...generatedTask,
                    targetRouting: {
                      ...generatedTask.targetRouting,
                      optimizedPrompt: finalText
                    }
                  }
                  handleExecute(updatedTask, true)
                }
              }}
              onEdit={(updatedText) => {
                setAgentProposal({ ...agentProposal, draftedReply: updatedText })
              }}
              onDisapprove={() => {
                setStage('idle')
                setAgentProposal(null)
                setGeneratedTask(null)
                setExecutionStatus('Proposal cancelled')
                setTimeout(() => setExecutionStatus(null), 1800)
              }}
            />
          )}

          {/* Settings Sheet */}
          {showSettings && (
            <SettingsModal
              settings={settings}
              onSave={handleUpdateSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
