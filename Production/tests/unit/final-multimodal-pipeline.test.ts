import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LangGraphAgentOrchestrator } from '../../src/renderer/src/core/agent-graph/langgraph-orchestrator'
import { PromptArchitect } from '../../src/renderer/src/core/prompt-architect'
import { VisionHarness } from '../../src/renderer/src/core/vision-harness'
import { ScreenNavigator } from '../../src/renderer/src/core/screen-navigator'
import { HoldToTalkManager } from '../../src/main/hold-to-talk'
import { SystemContext, AppSettings } from '../../src/renderer/src/types/task'

describe('VESPER Final Multimodal Architecture & Pipeline', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'vesper-production - Cursor',
    detectedCategory: 'coding',
    clipboardContent: 'const auth = useAuth()',
    isCodeEditor: true,
    isTerminal: false,
    isBrowser: false
  }

  const dummySettings: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'local',
    whisperModel: 'whisper-large-v3-turbo',
    whisperLanguage: 'auto',
    dictationMode: 'smart_assistant',
    aiPolishing: true,
    englishLettersOnly: true,
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: '',
    autoPaste: true,
    soundFeedback: false,
    privacyMode: 'strict_local'
  }

  describe('1. Right-Alt Push-to-Talk Configuration', () => {
    it('initializes with default targetKey strictly set to RIGHT ALT', () => {
      const dummyWindow = {
        webContents: { send: vi.fn() },
        isDestroyed: () => false
      } as any

      const manager = new HoldToTalkManager(dummyWindow)
      expect(manager.getTargetKey()).toBe('RIGHT ALT')
    })
  })

  describe('2. LangGraph Modality Classification', () => {
    it('classifies natural speech into DICTATION by default', () => {
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'The quick brown fox jumps over the lazy dog',
        dummyContext
      )
      expect(modality).toBe('dictation')
    })

    it('classifies prompt creation requests into PROMPTING', () => {
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'Create a prompt to build a real-time reactive dashboard in React',
        dummyContext
      )
      expect(modality).toBe('prompting')

      const modality2 = LangGraphAgentOrchestrator.classifyModality(
        'Ask Claude to write a FastAPI auth middleware',
        dummyContext
      )
      expect(modality2).toBe('prompting')
    })

    it('classifies email writing or replies into EMAIL', () => {
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'Write an email requesting sick leave for tomorrow',
        dummyContext
      )
      expect(modality).toBe('email')

      const emailContext: SystemContext = {
        ...dummyContext,
        activeApp: 'Outlook',
        windowTitle: 'Inbox - Outlook'
      }
      const modality2 = LangGraphAgentOrchestrator.classifyModality(
        'Reply saying I will join the meeting in 5 minutes',
        emailContext
      )
      expect(modality2).toBe('email')
    })

    it('classifies shell commands in terminal into TERMINAL', () => {
      const termContext: SystemContext = {
        ...dummyContext,
        activeApp: 'WindowsTerminal',
        isTerminal: true
      }
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'Git status and commit with message fix build',
        termContext
      )
      expect(modality).toBe('terminal')
    })

    it('classifies chat messages in messaging apps into TEXTING', () => {
      const slackContext: SystemContext = {
        ...dummyContext,
        activeApp: 'Slack',
        windowTitle: 'Slack - #general'
      }
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'Sounds good see you tomorrow at lunch',
        slackContext
      )
      expect(modality).toBe('texting')
    })

    it('classifies UI questions into NAVIGATION', () => {
      const modality = LangGraphAgentOrchestrator.classifyModality(
        'How do I export this sheet to PDF in Excel',
        dummyContext
      )
      expect(modality).toBe('navigation')

      const modality2 = LangGraphAgentOrchestrator.classifyModality(
        'Where is the billing page in settings',
        dummyContext
      )
      expect(modality2).toBe('navigation')
    })
  })

  describe('3. Industrial Prompt Architect', () => {
    it('detects Cursor Composer target platform in Cursor editor', () => {
      const platform = PromptArchitect.detectTargetPlatform('Build a modal', dummyContext)
      expect(platform).toBe('Cursor Composer')
    })

    it('detects Claude when explicit in user speech', () => {
      const platform = PromptArchitect.detectTargetPlatform('Ask Claude to write a regex', dummyContext)
      expect(platform).toBe('Anthropic Claude')
    })

    it('synthesizes structured industrial prompt with role, specs, and guardrails', async () => {
      const res = await PromptArchitect.generatePrompt({
        userGoal: 'Create an e-commerce checkout form with Stripe',
        context: dummyContext
      })

      expect(res.industrialPrompt).toBeDefined()
      expect(res.industrialPrompt).toContain('Role & Persona')
      expect(res.industrialPrompt).toContain('Primary Objective')
      expect(res.industrialPrompt).toContain('Engineering Specifications & Requirements')
      expect(res.industrialPrompt).toContain('Deliverable Contract')
      expect(res.tokensCountEstimate).toBeGreaterThan(30)
    })
  })

  describe('4. Multimodal Screen Vision Harness', () => {
    it('correctly detects when a prompt requires screen perception', () => {
      expect(VisionHarness.requiresScreenPerception('Reply to this email agreeing to terms', dummyContext)).toBe(true)
      expect(VisionHarness.requiresScreenPerception('What did they ask on screen?', dummyContext)).toBe(true)
      expect(VisionHarness.requiresScreenPerception('Write a leave email for next Monday', dummyContext)).toBe(false)
    })

    it('drafts complete executive leave email from standalone user request', async () => {
      const email = await VisionHarness.draftEmail(
        'Request 2 days sick leave from tomorrow',
        dummyContext
      )

      expect(email.body).toBeDefined()
      expect(email.body).toContain('leave')
      expect(email.body).toContain('Best regards')
    })

    it('resolves interactable UI navigation target coordinates', async () => {
      const target = await VisionHarness.locateScreenTarget(
        '',
        'Where is the settings page',
        dummyContext
      )

      expect(target).toBeDefined()
      expect(target?.x).toBeGreaterThan(0)
      expect(target?.y).toBeGreaterThan(0)
      expect(target?.label).toBe('Settings')
    })
  })

  describe('5. Screen Navigator with Vision', () => {
    it('resolves search bar target coordinates on desktop', async () => {
      const plan = await ScreenNavigator.resolveNavigationTargetWithVision(
        'Find search input bar',
        'Cursor'
      )

      expect(plan.status).toBe('matched')
      expect(plan.targetElement).toBeDefined()
      expect(plan.targetElement?.label).toBe('Search Input Bar')
      expect(plan.guidanceMessage).toContain('Targeting')
    })
  })

  describe('6. LangGraph End-to-End Orchestrator Execution', () => {
    it('executes prompt generation pipeline successfully', async () => {
      const state = await LangGraphAgentOrchestrator.execute({
        initialText: 'Create a prompt for a dark theme landing page',
        context: dummyContext,
        settings: dummySettings
      })

      expect(state.modality).toBe('prompting')
      expect(state.finalText).toBeDefined()
      expect(state.finalText.length).toBeGreaterThan(50)
      expect(state.isBlocked).toBe(false)
    })

    it('executes navigation pipeline and returns visual guidance coordinates', async () => {
      const state = await LangGraphAgentOrchestrator.execute({
        initialText: 'How do I open integrated terminal',
        context: dummyContext,
        settings: dummySettings
      })

      expect(state.modality).toBe('navigation')
      expect(state.executionType).toBe('visual_guidance')
      expect(state.navigationTarget).toBeDefined()
      expect(state.navigationTarget?.label).toContain('Terminal')
    })

    it('executes dictation enhancement and cleans speech text', async () => {
      const state = await LangGraphAgentOrchestrator.execute({
        initialText: 'The project status is basically on track and we should deploy tomorrow',
        context: dummyContext,
        settings: dummySettings
      })

      expect(state.modality).toBe('dictation')
      expect(state.finalText).toBeDefined()
      expect(state.executionType).toBe('inject_keystrokes')
    })
  })
})
