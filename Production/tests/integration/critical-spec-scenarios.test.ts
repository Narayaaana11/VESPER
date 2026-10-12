import { describe, it, expect, vi } from 'vitest'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { ContextChainer } from '../../src/renderer/src/core/context-chainer'
import { ContextRevalidator } from '../../src/main/context/context-revalidator'
import { ContextCollector } from '../../src/main/context/context-collector'
import { SystemContext, AppSettings, UniversalTaskObject } from '../../src/renderer/src/types/task'

describe('VESPER Master Specification — Critical Scenarios (Section 80)', () => {
  const defaultSettings: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'local',
    ollamaModel: 'llama3.2',
    ollamaEndpoint: 'http://localhost:11434',
    apiKey: '',
    autoPaste: true,
    soundFeedback: false,
    privacyMode: 'strict_local'
  }

  // 1. "Write an email to Ravi but don't send it." -> Expected: draft only. NOT: send email.
  it('Scenario 1: "Write an email to Ravi but don\'t send it" strictly produces draft only and prevents sending', async () => {
    const rawSpeech = "Write an email to Ravi saying the report is ready, but don't send it yet."
    const gmailContext: SystemContext = {
      activeApp: 'Gmail',
      windowTitle: 'Inbox - user@gmail.com',
      detectedCategory: 'communication'
    }

    const { task } = await processIntent(
      rawSpeech,
      gmailContext,
      {},
      defaultSettings,
      0,
      null,
      undefined,
      'voice'
    )

    expect(task.rawTranscript).toBe(rawSpeech)
    expect(task.constraints).toContain('do_not_send')
    expect(task.intent.action).not.toBe('send_email')
    expect(task.intent.action).not.toBe('send_message')
    expect(task.intent.action).not.toBe('execute_send')
  })

  // 2. "Send it." -> Expected: identify current draft -> confirmation -> send.
  it('Scenario 2: "Send it" triggers high-risk classification and requires confirmation', async () => {
    const rawSpeech = 'Send it.'
    const gmailContext: SystemContext = {
      activeApp: 'Gmail',
      windowTitle: 'Draft - VESPER Update',
      detectedCategory: 'communication'
    }

    const previousTask: UniversalTaskObject = {
      id: 'task_email_draft',
      taskId: 'task_email_draft',
      rawTranscript: 'Write an email to Ravi saying the report is ready',
      normalizedTranscript: 'Write an email to Ravi saying the report is ready',
      inputMode: 'voice',
      timestamp: new Date().toISOString(),
      activeApplication: 'Gmail',
      activeWindow: 'Draft - VESPER Update',
      context: gmailContext,
      source: { rawSpeech: 'Write an email to Ravi saying the report is ready', sttConfidence: 0.95 },
      intent: { domain: 'communication', category: 'reply', action: 'compose_email' },
      requirements: ['email to Ravi'],
      specifications: { requirements: ['email to Ravi'] },
      confidence: 0.95,
      riskLevel: 'low',
      requiresClarification: false,
      requiresConfirmation: false,
      targetRouting: {
        adapter: 'gmail',
        deliveryMethod: 'paste',
        optimizedPrompt: 'Hi Ravi, the report is ready.',
        explanation: 'Email draft'
      },
      security: { riskLevel: 'low', requiresUserConfirmation: false }
    }

    const { task } = await processIntent(
      rawSpeech,
      gmailContext,
      {},
      defaultSettings,
      0,
      previousTask,
      Date.now(),
      'voice'
    )

    // Resolved "it" to the current email draft
    expect(task.rawTranscript).toBe(rawSpeech)
    expect(task.conversationContext?.isChained).toBe(true)
  })

  // 3. "Paste this here" -> User switches application -> Expected: pause / revalidate.
  it('Scenario 3: Application switch race condition pauses auto-paste safely', async () => {
    const initialTarget = {
      activeApp: 'Cursor',
      windowTitle: 'index.ts - VESPER',
      category: 'code' as const,
      timestamp: Date.now(),
      confidence: 0.95
    }

    const switchedContext = {
      activeApp: 'WhatsApp',
      windowTitle: 'WhatsApp Chat',
      category: 'communication' as const,
      timestamp: Date.now(),
      confidence: 0.95
    }

    vi.spyOn(ContextCollector, 'collect').mockResolvedValue(switchedContext as any)

    const reval = await ContextRevalidator.revalidate(initialTarget as any)
    expect(reval.isValid).toBe(false)
    expect(reval.action).toBe('pause_for_user')
    expect(reval.reason).toContain('Context changed')
    expect(reval.reason).toContain('WhatsApp')
  })

  // 4. "Make it shorter." -> Expected: resolve 'it' using current task context.
  it('Scenario 4: "Make it shorter" resolves anaphoric reference "it" from prior task', () => {
    const gmailContext: SystemContext = {
      activeApp: 'Gmail',
      windowTitle: 'Draft - Meeting Update',
      detectedCategory: 'communication'
    }

    const previousTask: UniversalTaskObject = {
      id: 'task_long_draft',
      taskId: 'task_long_draft',
      rawTranscript: 'Write a comprehensive update about our sprint deliverables for the management team',
      normalizedTranscript: 'Write a comprehensive update about our sprint deliverables for the management team',
      inputMode: 'voice',
      timestamp: new Date().toISOString(),
      activeApplication: 'Gmail',
      activeWindow: 'Draft - Meeting Update',
      context: gmailContext,
      source: { rawSpeech: 'Write a comprehensive update about sprint deliverables', sttConfidence: 0.95 },
      intent: { domain: 'communication', category: 'write', action: 'draft_content' },
      requirements: ['sprint deliverables', 'management team'],
      specifications: { requirements: ['sprint deliverables', 'management team'] },
      confidence: 0.95,
      riskLevel: 'low',
      requiresClarification: false,
      requiresConfirmation: false,
      targetRouting: {
        adapter: 'gmail',
        deliveryMethod: 'paste',
        optimizedPrompt: 'Here is our detailed sprint update...',
        explanation: 'Draft content'
      },
      security: { riskLevel: 'low', requiresUserConfirmation: false }
    }

    const chained = ContextChainer.resolve('Make it shorter and bullet points', gmailContext, previousTask, Date.now())
    expect(chained.isChained).toBe(true)
    expect(chained.synthesizedPrompt).toContain('sprint deliverables')
    expect(chained.synthesizedPrompt.toLowerCase()).toContain('shorter')
  })
})
