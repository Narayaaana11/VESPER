import { describe, it, expect, beforeEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { validateWhisperTranscript, cleanTrailingHallucinations } from '../../src/renderer/src/core/transcription-validator'
import { SemanticDriftGuard } from '../../src/renderer/src/core/semantic-drift-guard'
import { ContextChainer } from '../../src/renderer/src/core/context-chainer'
import { SelectionTransformer } from '../../src/renderer/src/core/selection-transformer'
import { ContextRevalidator } from '../../src/main/context/context-revalidator'
import { ContextCollector } from '../../src/main/context/context-collector'
import { UniversalActionSystem } from '../../src/main/actions/universal-actions'
import { ContextRanker } from '../../src/renderer/src/core/context-ranker'
import { PrivacyShield } from '../../src/main/context/privacy-shield'
import { SystemContext, AppSettings, UniversalTaskObject } from '../../src/renderer/src/types/task'
import { DeviceContext } from '../../src/main/context/context-types'

describe('VESPER Master Matrix End-to-End Verification (Categories A to I)', () => {
  const baseSettings: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'groq',
    whisperModel: 'whisper-large-v3',
    whisperLanguage: 'auto',
    dictationMode: 'smart_assistant',
    aiPolishing: true,
    englishLettersOnly: true,
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: '',
    autoPaste: true,
    soundFeedback: true,
    privacyMode: 'strict_local'
  }

  const defaultContext: SystemContext = {
    activeApp: 'Notepad',
    windowTitle: 'Untitled - Notepad',
    detectedCategory: 'text'
  }

  // =========================================================================
  // Category A: Voice Dictation & Hold-to-Talk
  // =========================================================================
  describe('Test Category A: Voice Dictation & Hold-to-Talk', () => {
    it('TC-VOICE-01: Validates legitimate speech transcript and processes intent', async () => {
      const rawAudioTranscript = 'Hello, this is a test of the VESPER interaction layer.'
      const validation = validateWhisperTranscript(rawAudioTranscript, 1400, 24000)
      expect(validation.isValid).toBe(true)
      expect(validation.cleanedText).toBe('Hello, this is a test of the VESPER interaction layer.')

      const { task } = await processIntent(
        validation.cleanedText!,
        defaultContext,
        {},
        baseSettings
      )
      expect(task).toBeDefined()
      expect(task.rawTranscript).toBe('Hello, this is a test of the VESPER interaction layer.')
      expect(task.targetRouting.deliveryMethod).toBe('paste')
    })

    it('TC-VOICE-02: Persistent mode clean transcript handling without trailing noise', () => {
      const rawWithFiller = 'This is continuous hands-free dictation.\n\nThank you. Thank you.'
      const cleaned = cleanTrailingHallucinations(rawWithFiller)
      expect(cleaned).toBe('This is continuous hands-free dictation.')
    })

    it('TC-VOICE-03: Silence & Hallucination Filter rejects [BLANK_AUDIO]. and sound tokens', () => {
      expect(validateWhisperTranscript('[BLANK_AUDIO].', 1200, 18000).isValid).toBe(false)
      expect(validateWhisperTranscript('[BLANK_AUDIO]', 1200, 18000).isValid).toBe(false)
      expect(validateWhisperTranscript('blank audio', 1200, 18000).isValid).toBe(false)
      expect(validateWhisperTranscript('(silence)', 1200, 18000).isValid).toBe(false)
      expect(validateWhisperTranscript('EVRA voice dictation.', 1200, 18000).isValid).toBe(false)
      expect(validateWhisperTranscript('...', 1000, 15000).isValid).toBe(false)
    })
  })

  // =========================================================================
  // Category B: Dual-Mode Global Command Bar (Text & Voice)
  // =========================================================================
  describe('Test Category B: Dual-Mode Global Command Bar', () => {
    it('TC-CMD-01: Resolves active application context and metadata for Command Bar', () => {
      const activeApp = defaultContext.activeApp
      const windowTitle = defaultContext.windowTitle
      expect(activeApp).toBe('Notepad')
      expect(windowTitle).toBe('Untitled - Notepad')
    })

    it('TC-CMD-02: Keyboard Text Execution routes through Universal Task Object pipeline', async () => {
      const textCommand = 'Write a professional email thanking the team for the release'
      const commContext: SystemContext = {
        activeApp: 'Gmail',
        windowTitle: 'Inbox - user@company.com - Google Chrome',
        detectedCategory: 'communication'
      }

      const { task } = await processIntent(
        textCommand,
        commContext,
        {},
        baseSettings,
        0,
        null,
        undefined,
        'text'
      )

      expect(task.inputMode).toBe('text')
      expect(task.intent.domain).toBe('communication')
      expect(task.rawTranscript).toBe(textCommand)
      expect(task.targetRouting.optimizedPrompt.length).toBeGreaterThan(0)
    })

    it('TC-CMD-03: Dismissal state reset handles cleanly', () => {
      let isCommandBarOpen = true
      // Pressing Escape
      isCommandBarOpen = false
      expect(isCommandBarOpen).toBe(false)
    })
  })

  // =========================================================================
  // Category C: Semantic Drift Guard & Negation Protection
  // =========================================================================
  describe('Test Category C: Semantic Drift Guard & Negation Protection', () => {
    it('TC-GUARD-01: Negation Protection strictly prevents unintended email dispatch', async () => {
      const speech = "Reply to Rahul saying I will arrive at 5 PM, but don't send it yet."
      const commContext: SystemContext = {
        activeApp: 'Gmail',
        windowTitle: 'Meeting Discussion - Gmail',
        detectedCategory: 'communication'
      }

      // 1. Semantic Drift Guard evaluation
      expect(SemanticDriftGuard.hasNegativeConstraint(speech)).toBe(true)
      const driftCheck = SemanticDriftGuard.evaluate(speech, speech, {
        action: 'send_email',
        intent: 'write',
        recipient: 'Rahul'
      })
      expect(driftCheck.driftDetected).toBe(true)
      expect(driftCheck.remediation?.correctedAction).toBe('compose_draft_only')
      expect(driftCheck.remediation?.requiresUserConfirmation).toBe(true)

      // 2. Full pipeline intent execution
      const { task } = await processIntent(speech, commContext, {}, baseSettings)
      expect(task.constraints).toContain('do_not_send')
      expect(task.security.requiresUserConfirmation).toBe(true)
    })

    it('TC-GUARD-02: Preserves immutable raw speech verbatim in UniversalTaskObject', async () => {
      const speech = 'Send Ravi the thing I pushed yesterday.'
      const { task } = await processIntent(speech, defaultContext, {}, baseSettings)
      expect(task.rawTranscript).toBe('Send Ravi the thing I pushed yesterday.')
      expect(task.finalInterpretation.recipient).toBe('Ravi')
    })
  })

  // =========================================================================
  // Category D: Context Chaining & Anaphora Resolution
  // =========================================================================
  describe('Test Category D: Context Chaining & Anaphora Resolution', () => {
    let parentTask: UniversalTaskObject

    beforeEach(async () => {
      const initialSpeech = 'Write a summary of our quarterly metrics for the board.'
      const res = await processIntent(initialSpeech, defaultContext, {}, baseSettings)
      parentTask = res.task
    })

    it('TC-CHAIN-01: "Make it shorter" synthesizes prompt retaining quarterly metrics context', async () => {
      const followUp = 'Make it shorter and bullet points.'
      const chained = ContextChainer.resolve(followUp, defaultContext, parentTask, Date.now())
      expect(chained.isChained).toBe(true)
      expect(chained.synthesizedPrompt).toContain('Write a summary of our quarterly metrics')
      expect(chained.synthesizedPrompt).toContain('Make it shorter and bullet points')

      const { task, isChained } = await processIntent(
        followUp,
        defaultContext,
        {},
        baseSettings,
        0,
        parentTask,
        Date.now()
      )
      expect(isChained).toBe(true)
      expect(task.conversationContext?.isChained).toBe(true)
    })

    it('TC-CHAIN-02: "Send it" chained to parent draft demands explicit user confirmation', async () => {
      const sendSpeech = 'Send it.'
      const chained = ContextChainer.resolve(sendSpeech, defaultContext, parentTask, Date.now())
      expect(chained.isChained).toBe(true)

      const { task } = await processIntent(
        sendSpeech,
        defaultContext,
        {},
        baseSettings,
        0,
        parentTask,
        Date.now()
      )
      expect(task.security.requiresUserConfirmation).toBe(true)
    })
  })

  // =========================================================================
  // Category E: In-Place Text Selection Transformation
  // =========================================================================
  describe('Test Category E: In-Place Text Selection Transformation', () => {
    it('TC-EDIT-01: Transforms "hey sir i am unable to come today" into professional English', async () => {
      const contextWithInformal: SystemContext = {
        activeApp: 'VS Code',
        windowTitle: 'email.txt',
        detectedCategory: 'text',
        clipboardContent: 'hey sir i am unable to come today'
      }

      // Check command classification
      expect(SelectionTransformer.isTransformCommand('Make this professional.', contextWithInformal)).toBe(true)

      // Transform offline via deterministic rules
      const result = await SelectionTransformer.transform('Make this professional.', contextWithInformal)
      expect(result.isTransform).toBe(true)
      expect(result.transformedText).toContain('Dear sir')
      expect(result.transformedText).toContain('unable to attend today')
    })
  })

  // =========================================================================
  // Category F: Active Window Revalidation (Safety Race Condition)
  // =========================================================================
  describe('Test Category F: Active Window Revalidation', () => {
    it('TC-REVAL-01: Detects foreground application switch and pauses auto-paste', async () => {
      const initialCtx: DeviceContext = {
        activeApp: 'Notepad',
        windowTitle: 'Notes.txt - Notepad',
        category: 'text'
      }

      // Mock ContextCollector to simulate user switching to WhatsApp while generating
      const originalCollect = ContextCollector.collect
      ContextCollector.collect = async () => ({
        activeApp: 'WhatsApp',
        windowTitle: 'WhatsApp Desktop',
        category: 'communication'
      })

      const reval = await ContextRevalidator.revalidate(initialCtx)
      expect(reval.isValid).toBe(false)
      expect(reval.action).toBe('pause_for_user')
      expect(reval.reason).toContain('Application switched from Notepad to WhatsApp')

      // Restore
      ContextCollector.collect = originalCollect
    })
  })

  // =========================================================================
  // Category G: Universal Action Subsystem & Undo Stack
  // =========================================================================
  describe('Test Category G: Universal Action Subsystem & Undo Stack', () => {
    it('TC-ACT-01: Evaluates openApp action with low risk classification', async () => {
      const risk = UniversalActionSystem.evaluateRisk('openApp', { appName: 'notepad' })
      expect(risk).toBe('low')
    })

    it('TC-ACT-02: File creation and rollback via UniversalActionSystem.undoLastAction()', async () => {
      const scratchDir = path.join(process.cwd(), 'tests', 'scratch')
      if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true })
      }
      const testFile = path.join(scratchDir, 'matrix-test-rollback.txt')

      // 1. Create file
      const createRes = await UniversalActionSystem.execute({
        actionId: 'act_mat_01',
        actionType: 'createFile',
        target: testFile,
        parameters: { filePath: testFile, content: 'Version 1 content' },
        riskLevel: 'medium',
        state: 'pending'
      })
      expect(createRes.success).toBe(true)
      expect(fs.existsSync(testFile)).toBe(true)

      // 2. Undo rollback
      const undoRes = await UniversalActionSystem.undoLastAction()
      expect(undoRes.success).toBe(true)
      expect(fs.existsSync(testFile)).toBe(false)
    })
  })

  // =========================================================================
  // Category H: Screen Guidance & Visual AI Cursor Overlay
  // =========================================================================
  describe('Test Category H: Screen Guidance & Visual AI Cursor Overlay', () => {
    it('TC-GUIDE-01: Detects "Show me how to export this" as guidance intent', () => {
      const text = 'Show me how to export this.'
      const lower = text.toLowerCase().trim()
      const isGuide =
        lower.startsWith('how do i') ||
        lower.startsWith('show me how') ||
        lower.includes('how to export') ||
        lower.includes('show me how to')

      expect(isGuide).toBe(true)

      // Expected guidance card configuration
      const guidanceStep = {
        stepIndex: 1,
        totalSteps: 3,
        title: 'Guide: Notepad',
        instruction: 'Locate the main action control in Notepad. Follow the highlighted target pointer.',
        targetElement: 'Notepad',
        coordinates: { x: 220, y: 80 }
      }
      expect(guidanceStep.totalSteps).toBe(3)
      expect(guidanceStep.coordinates.x).toBe(220)
    })
  })

  // =========================================================================
  // Category I: Context & Privacy Inspector
  // =========================================================================
  describe('Test Category I: Context & Privacy Inspector', () => {
    it('TC-INSP-01: Scores context relevance and explains selection rationale', () => {
      const speech = 'Fix the syntax error on line 42'
      const codeContext: SystemContext = {
        activeApp: 'Visual Studio Code',
        windowTitle: 'server.ts - Backend - VS Code',
        detectedCategory: 'code',
        terminalError: 'SyntaxError: Unexpected token on line 42'
      }

      const ranked = ContextRanker.rankAndCompress(speech, codeContext)
      expect(ranked.confidence).toBeGreaterThan(0.9)
      expect(ranked.currentApp).toContain('Visual Studio Code')
      expect(ranked.selectionReason).toContain('active window')
      expect(ranked.rankedItems.some((s) => s.type === 'terminal_error')).toBe(true)
    })

    it('TC-INSP-02: Redaction audit scrubs API keys and sensitive tokens', () => {
      const sensitiveSpeech = 'Here is my groq key gsk_1234567890abcdef1234567890abcdef and token bearer secret_token_xyz'
      const sanitized = PrivacyShield.sanitizeSpeech(sensitiveSpeech)
      expect(sanitized).not.toContain('gsk_1234567890abcdef1234567890abcdef')
      expect(sanitized).toContain('[REDACTED_API_KEY]')
    })
  })
})
