import React, { useState, useEffect, useRef } from 'react'
import { Mic, Square, Settings, X, Sparkles, Check, Pause, Play, MoreHorizontal, ArrowUpRight, Maximize2, Minimize2, LayoutDashboard } from 'lucide-react'
import { SystemContext, DisambiguationQuestion, UniversalTaskObject, AppSettings } from './types/task'
import { AudioRecorder } from './core/audio-recorder'
import { validateWhisperTranscript, validatePolishedOutput } from './core/transcription-validator'
import { processIntent } from './core/intent-engine'
import { transcribeWithGroq, polishWithGroqLlama, polishWithOllama } from './core/groq-service'
import { executeScreenAgent, ScreenAgentResult } from './core/screen-agent'
import { AudioVisualizer } from './components/AudioVisualizer'
import { ContextBadge } from './components/ContextBadge'
import { SmartQAOverlay } from './components/SmartQAOverlay'
import { TaskPreviewCard } from './components/TaskPreviewCard'
import { AgentApprovalCard } from './components/AgentApprovalCard'
import { SettingsModal } from './components/SettingsModal'
import { WisprFlowDashboard } from './components/WisprFlowDashboard'
import { addHistoryItem, getSnippets, getVocabulary } from './types/dashboard'
import { audioChimes } from './core/audio-chimes'
import { SelectionTransformer } from './core/selection-transformer'

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
      hideHUD: () => void
      minimizeHUD: () => void
      showDashboard?: () => void
      hideDashboard?: () => void
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
    }
  }
}

const getInitialApiKey = (): string => {
  try {
    const raw = localStorage.getItem('qevra_settings')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.apiKey && typeof parsed.apiKey === 'string' && parsed.apiKey.trim().length > 0) {
        return parsed.apiKey.trim()
      }
    }
  } catch (e) {}
  const viteKey = (import.meta as any).env?.VITE_GROQ_API_KEY || ''
  return typeof viteKey === 'string' ? viteKey.trim() : ''
}

const getInitialSettings = (): AppSettings => {
  const envMode = ((import.meta as any).env?.VITE_DICTATION_MODE as any) || 'direct'
  const defaults: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'groq',
    whisperModel: 'whisper-large-v3',
    whisperLanguage: 'auto',
    dictationMode: envMode,
    aiPolishing: true,
    englishLettersOnly: true,
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: getInitialApiKey(),
    autoPaste: true,
    soundFeedback: true,
    privacyMode: 'strict_local'
  }

  try {
    const raw = localStorage.getItem('qevra_settings')
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
  { label: '🍕 Restaurant Page', text: 'Create a website for a restaurant landing page. I need a prompt for that.' },
  { label: '⚡ Auth API', text: 'Fix the bug with the token refresh failing on 401 authorization requests.' },
  { label: '🎣 Custom Hook', text: 'Refit component to use React custom hook and clean up state management.' },
  { label: '📱 Responsive & CSV', text: 'Make it responsive for mobile screens and add export to CSV button.' }
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

  const [context, setContext] = useState<SystemContext>({
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - QEVRA',
    detectedCategory: 'code'
  })

  const [settings, setSettings] = useState<AppSettings>(getInitialSettings)

  const audioRecorderRef = useRef<AudioRecorder>(new AudioRecorder())
  const lastCompletedTaskRef = useRef<{ task: UniversalTaskObject; timestamp: number } | null>(null)

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

  const isApproving = stage === 'approving' && agentProposal !== null
  const isExpanded = activeQuestion !== null || (generatedTask !== null && stage === 'ready') || showSettings || isApproving

  // Dynamic window resizing for authentic Wispr Flow compact pill & sheets
  useEffect(() => {

    if (window.electronAPI) {
      if (overlayMode === 'dashboard') {
        window.electronAPI.resizeWindow({ width: 1040, height: 680 })
      } else if (overlayMode === 'compact') {
        if (showSettings) {
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
          window.electronAPI.resizeWindow({ width: 140, height: 58 })
        }
      } else {
        const targetHeight = isApproving ? 220 : (isExpanded ? 370 : 64)
        window.electronAPI.resizeWindow({ width: 620, height: targetHeight })
      }
    }
  }, [activeQuestion, generatedTask, showSettings, stage, agentProposal, overlayMode, showMenu, executionStatus, isPersistentMode, queryResult])

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
      localStorage.setItem('qevra_settings', JSON.stringify(merged))
    } catch (e) {}
    window.electronAPI?.saveSettings(merged)
  }

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getContext().then(setContext).catch(console.warn)
      window.electronAPI.getSettings().then((persisted) => {
        let cached: any = {}
        try {
          const raw = localStorage.getItem('qevra_settings')
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
      }).catch(console.warn)

      // 1. Toggle hotkey listener (Ctrl+Shift+Space)
      const unsubHotkey = window.electronAPI.onHotkeyTriggered(() => {
        refreshContext()
        toggleListeningRef.current?.()
      })

      // 2. Wispr Flow Hold-to-Talk listener (Fn / Right Alt / Configured key)
      const unsubHoldStart = window.electronAPI.onHoldStart(() => {
        setIsHoldMode(true)
        setIsPersistentMode(false)
        setIsPaused(false)
        refreshContext()
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
        refreshContext()
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
    // Self-healing guard: if audio recorder is not actively recording, clear any stale isStoppingRef lock
    if (!audioRecorderRef.current.isRecording) {
      isStoppingRef.current = false
    } else if (isStoppingRef.current) {
      return
    }
    isRecordingRef.current = true
    console.log('[QEVRA] [REC] Audio capture starting...')
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
      (speechDurationMs) => {
        // Silero VAD hands-free cutoff: when user finishes speaking in toggle/persistent hands-free mode
        if (stageRef.current === 'listening' && !isStoppingRef.current && isPersistentModeRef.current) {
          console.log(`[QEVRA] Silero VAD hands-free cutoff detected (${speechDurationMs}ms speech). Finalizing...`)
          stopListening(true)
        }
      }
    )

    refreshContext().catch(() => {})
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
      console.warn('[QEVRA] Recorder stop error:', err)
      isStoppingRef.current = false
      setStage('idle')
      stageRef.current = 'idle'
      return
    }

    setAudioLevel(0)
    setIsPaused(false)

    console.log(`[QEVRA] [REC] Recording captured: ${recResult.durationMs}ms (${recResult.byteSize} bytes)`)

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

    // 1. If no API key is configured, prompt clearly and open Settings
    if (!apiKey) {
      console.warn('[QEVRA] Groq API key is missing. Opening settings.')
      setStage('idle')
      setExecutionStatus('⚠️ Groq API key required for speech.')
      setShowSettings(true)
      setTimeout(() => setExecutionStatus(null), 4000)
      return
    }

    // 2. Early validation: Reject recordings that are too short or silent (< 300ms or < 500 bytes)
    if (recResult.durationMs < 300 || !audioBlob || audioBlob.size < 500) {
      console.warn(`[QEVRA] ⚠️ Recording too short or empty (duration: ${recResult.durationMs}ms, bytes: ${recResult.byteSize})`)
      setExecutionStatus('Transcription unclear — please try again.')
      setTranscript('')
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
      }, 2500)
      return
    }

    // 3. Transcribe with Groq Whisper-large-v3
    setExecutionStatus('Transcribing with Whisper-large-v3...')
    console.log(`[QEVRA] Transcribing with Groq Whisper-large-v3 (${audioBlob.size} bytes, ${recResult.durationMs}ms)...`)

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

    const { text: rawGroqTranscript, error: groqErr } = await transcribeWithGroq(
      audioBlob,
      apiKey,
      {
        model: settings.whisperModel || 'whisper-large-v3',
        language: settings.whisperLanguage || 'auto',
        prompt: dynamicPrompt || undefined,
        translateToEnglish: settings.englishLettersOnly !== false
      }
    )

    if (groqErr) {
      console.error('[QEVRA] Groq STT error:', groqErr)
      setExecutionStatus(`⚠️ ${groqErr}`)
      isStoppingRef.current = false
      isRecordingRef.current = false
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
        stageRef.current = 'idle'
      }, 3000)
      return
    }

    // 4. Task 8 & 9: Transcription Validation BEFORE Llama
    const whisperValidation = validateWhisperTranscript(
      rawGroqTranscript || '',
      recResult.durationMs,
      recResult.byteSize
    )

    if (!whisperValidation.valid) {
      console.warn(`[QEVRA] ❌ Whisper transcript rejected: ${whisperValidation.reason} | Raw: "${rawGroqTranscript}"`)
      setExecutionStatus('Transcription unclear — please try again.')
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

    const groqTranscript = whisperValidation.cleanedText || ''
    console.log(`[QEVRA] [OK] Whisper Transcript validated: "${groqTranscript}"`)
    let textToProcess = groqTranscript
    setTranscript(groqTranscript)

    // 5. Screen & Context-Aware AI Polishing
    if (settings.aiPolishing !== false) {
      setExecutionStatus('Polishing with screen context & English letters...')
      console.log(`[QEVRA] Polishing with screen context [App: ${context.activeApp || 'Desktop'}, Title: ${context.windowTitle || 'Unknown'}, English Letters: ${settings.englishLettersOnly !== false}]...`)

      let polished: string | null = null

      // If Ollama is selected, try local Ollama first
      if (settings.aiProvider === 'ollama') {
        setExecutionStatus('Polishing with Local LLM (Ollama)...')
        polished = await polishWithOllama(
          groqTranscript,
          context,
          settings.ollamaEndpoint || 'http://localhost:11434',
          settings.ollamaModel || 'llama3.2',
          settings.englishLettersOnly !== false
        )
        if (!polished) {
          console.warn('[QEVRA] Local Ollama offline, falling back to Groq Cloud')
        }
      }

      // Fall back to / use Groq Cloud LLM
      if (!polished) {
        polished = await polishWithGroqLlama(
          groqTranscript,
          context,
          apiKey,
          'llama-3.3-70b-versatile',
          settings.englishLettersOnly !== false
        )
      }

      // 6. Task 10: Validation step AFTER Llama polishing
      if (polished) {
        const polishValidation = validatePolishedOutput(polished, groqTranscript)
        if (!polishValidation.valid) {
          console.warn(`[QEVRA] [FAIL] Polished output rejected: ${polishValidation.reason} | Polished: "${polished}"`)
          setExecutionStatus('Transcription unclear — please try again.')
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
        console.log(`[QEVRA] [OK] Polished Transcript (English letters): "${cleanedPolished}"`)
        textToProcess = cleanedPolished
        setTranscript(cleanedPolished)
      }
    }

    // Wispr Flow Snippets Expansion: replace voice shortcut with expanded snippet
    try {
      const activeSnippets = getSnippets()
      const normalized = textToProcess.toLowerCase().trim().replace(/[.,!?;:]+$/, '')
      const matched = activeSnippets.find((s) => s.trigger.toLowerCase().trim() === normalized)
      if (matched) {
        console.log(`[QEVRA] [SNIPPET] Voice Snippet expanded: "${matched.trigger}" -> "${matched.expansion.substring(0, 40)}..."`)
        textToProcess = matched.expansion
        setTranscript(matched.expansion)
      }
    } catch (err) {
      console.warn('[QEVRA] Snippet lookup warning:', err)
    }

    if (textToProcess) {
      console.log(`[QEVRA] Processing text: "${textToProcess}", autoPaste: ${autoPasteOnRelease}`)
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
          console.log(`[QEVRA] [EDIT-MODE] Selection transformed in-place: "${transformResult.transformedText.substring(0, 40)}..."`)
          textToProcess = transformResult.transformedText
          setTranscript(transformResult.transformedText)
        }
      }

      handleProcessSpeech(textToProcess, undefined, autoPasteOnRelease, currentCtx)
    } else {
      console.warn(`[QEVRA] No text to process.`)
      setExecutionStatus('Transcription unclear — please try again.')
      isStoppingRef.current = false
      setTimeout(() => {
        setExecutionStatus(null)
        setStage('idle')
        stageRef.current = 'idle'
      }, 2500)
    }
  }
  stopListeningRef.current = stopListening

  const handleProcessSpeech = async (
    speechText: string,
    currentClarifications = clarifications,
    autoPasteOnRelease = false,
    effectiveContext = context
  ) => {
    setStage('analyzing')

    const { task, actionPlan, question, securityWarning, isBlocked, isChained } = await processIntent(
      speechText,
      effectiveContext,
      currentClarifications,
      settings,
      Object.keys(currentClarifications).length,
      lastCompletedTaskRef.current?.task || null,
      lastCompletedTaskRef.current?.timestamp
    )

    if (isChained) {
      console.log('[QEVRA] [CHAIN] Context Chained to parent task:', lastCompletedTaskRef.current?.task.taskId)
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
        console.warn('[QEVRA] Screen capture warning:', err)
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
      setStage('ready')
      isStoppingRef.current = false
      isRecordingRef.current = false

      try {
        navigator.clipboard.writeText(task.queryAnswer)
      } catch {}

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

    console.log(`[QEVRA] [EXEC] Executing action (${autoPaste ? 'Auto-Paste Ctrl+V' : 'Clipboard'}): "${task.targetRouting.optimizedPrompt.substring(0, 60)}${task.targetRouting.optimizedPrompt.length > 60 ? '...' : ''}"`)

    if (window.electronAPI) {
      const result: any = await window.electronAPI.executeAction({
        content: task.targetRouting.optimizedPrompt,
        autoPaste,
        targetContext: task.context || context
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
        console.warn('[QEVRA] Failed to record task to Context Engine:', e)
      }
    }

    // Save as last completed task for chaining subsequent interactions
    lastCompletedTaskRef.current = { task, timestamp: Date.now() }

    // Automatically log completed dictation to Wispr Flow history store
    try {
      addHistoryItem({
        targetApp: context.activeApp || 'Desktop',
        windowTitle: context.windowTitle,
        rawTranscript: transcript || task.targetRouting.optimizedPrompt,
        polishedText: task.targetRouting.optimizedPrompt,
        durationMs: 3800,
        wordCount: task.targetRouting.optimizedPrompt.trim().split(/\s+/).filter(Boolean).length,
        mode: settings.dictationMode || 'direct'
      })
    } catch (e) {
      console.warn('[QEVRA] Failed to record history item:', e)
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
        autoPaste: true
      })
    }
  }

  // 0. Full Wispr Flow Desktop Application Dashboard
  if (overlayMode === 'dashboard') {
    return (
      <WisprFlowDashboard
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onBackToPill={() => setOverlayMode('compact')}
        onRePasteText={handleRePaste}
        activeApp={context.activeApp}
      />
    )
  }

  // 1. Compact Floating Pill Mode (Identical to native Wispr Flow overlay widget)
  if (overlayMode === 'compact') {
    return (
      <div className="wf-compact-wrapper">
        <div className={`wf-compact-pill ${stage === 'listening' ? 'is-active-recording' : ''}`}>
          {/* Left: Drag Handle Section */}
          <div
            className="wf-drag-handle-section"
            title="Drag overlay anywhere on screen (Double-click to open Flow Dashboard)"
            onDoubleClick={() => {
              if (window.electronAPI?.showDashboard) {
                window.electronAPI.showDashboard()
              } else {
                setOverlayMode('dashboard')
              }
            }}
          >
            <div className="wf-drag-handle-bar" />
          </div>

          {/* Center: AI Chat 8 Audio Levels Waveform / Status */}
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
          ) : stage === 'analyzing' || executionStatus ? (
            <div className="wf-compact-status">
              <Sparkles size={12} color="var(--wf-accent-violet)" />
              <span>{executionStatus || 'Polishing...'}</span>
            </div>
          ) : (
            <button
              className="wf-pill-btn wf-mic-btn"
              onClick={handleMicClick}
              title="Click to Record (or Hold Fn / Right Alt to speak)"
            >
              <Mic size={17} strokeWidth={1.8} />
            </button>
          )}

          {/* Right: More Options Button (hidden during active listening to keep pill compact) */}
          {stage !== 'listening' && (
            <button
              className={`wf-pill-btn wf-more-btn ${showMenu ? 'is-active' : ''}`}
              onClick={handleMoreClick}
              title="Options & Settings"
            >
              <MoreHorizontal size={17} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Attached Popover Menu */}
        {showMenu && (
          <div className="wf-popover-menu">
            <div className="wf-popover-header">
              <span>QEVRA Flow</span>
              <span style={{ fontSize: '9px', color: '#a1a1aa' }}>{context.activeApp}</span>
            </div>

            {/* 1. Open Wispr Flow Full Dashboard */}
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
                <LayoutDashboard size={13} style={{ color: 'var(--wf-accent-light)' }} />
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
                  localStorage.setItem('qevra_settings', JSON.stringify(updated))
                } catch (e) {}
                window.electronAPI?.saveSettings(updated)
              }}
            >
              <div className="wf-popover-item-left">
                <span>{settings.dictationMode === 'direct' ? '🎙️ Direct Dictation' : '🤖 Smart Assistant'}</span>
              </div>
              <span style={{ fontSize: '9px', color: 'var(--wf-success)', fontWeight: 600, letterSpacing: '0.04em' }}>ACTIVE</span>
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
                <Sparkles size={13} style={{ color: 'var(--wf-accent-light)' }} />
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
              style={{ color: '#ef4444' }}
              onClick={() => {
                setShowMenu(false)
                window.electronAPI?.quitApp()
              }}
            >
              <div className="wf-popover-item-left">
                <X size={13} />
                <span>Quit QEVRA</span>
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
              background: 'rgba(13, 14, 20, 0.98)',
              border: '1px solid var(--wf-border)',
              borderRadius: 'var(--wf-radius-lg)',
              padding: '12px 14px',
              boxShadow: 'var(--wf-shadow-card)',
              backdropFilter: 'blur(24px)',
              color: 'var(--wf-text-primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--wf-accent-light)', fontWeight: 600 }}>
                <Sparkles size={12} /> Ambient Answer
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
                  navigator.clipboard.writeText(queryResult.answer)
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
      </div>
    )
  }

  // 2. Expanded Search/Input Bar Mode

  return (
    <div className={`wf-container ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Authentic Wispr Flow Floating Capsule Pill */}
      <div className="wf-capsule-bar">
        {/* Left: Brand Dot & Context App Pill */}
        <div className="wf-left">
          <div className="wf-brand-mark" title="QEVRA Flow AI Layer">
            <div className="wf-logo-glow">
              <Sparkles size={12} color="#fff" />
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
            <div className="wf-live-speech" style={{ color: 'var(--wf-accent-violet)' }}>
              <Sparkles size={12} style={{ marginRight: 6 }} />
              <span>{executionStatus || 'Polishing & preparing input...'}</span>
            </div>
          ) : stage === 'approving' ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-accent-violet)' }}>
              <Sparkles size={12} style={{ marginRight: 6 }} />
              <span>Agent Proposal Ready • Review Below</span>
            </div>
          ) : executionStatus ? (
            <div className="wf-live-speech" style={{ color: 'var(--wf-accent-emerald)' }}>
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
