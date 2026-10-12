import { describe, it, expect } from 'vitest'
import { SemanticDriftGuard } from '../../src/renderer/src/core/semantic-drift-guard'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { SystemContext, AppSettings } from '../../src/renderer/src/types/task'

describe('Semantic Drift Guard & Canonical UTO (Phase 1)', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Gmail',
    windowTitle: 'Inbox - user@gmail.com',
    detectedCategory: 'communication'
  }

  const dummySettings: AppSettings = {
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

  it('detects negative action constraints in speech', () => {
    expect(SemanticDriftGuard.hasNegativeConstraint('reply saying I will send the report but do not send it yet')).toBe(true)
    expect(SemanticDriftGuard.hasNegativeConstraint("don't send this email")).toBe(true)
    expect(SemanticDriftGuard.hasNegativeConstraint('draft only please')).toBe(true)
    expect(SemanticDriftGuard.hasNegativeConstraint('send the email to Ravi now')).toBe(false)
  })

  it('flags semantic drift when raw input has negation but proposed action is send_email', () => {
    const rawSpeech = "Write an email to Ravi saying the report is ready, but don't send it yet."
    const normalized = "Write an email to Ravi saying the report is ready, but don't send it yet."
    const result = SemanticDriftGuard.evaluate(rawSpeech, normalized, {
      action: 'send_email',
      intent: 'reply',
      recipient: 'Ravi'
    })

    expect(result.passed).toBe(false)
    expect(result.driftDetected).toBe(true)
    expect(result.safetyViolation).toBe('NEGATION_INVERTED')
    expect(result.remediation?.correctedAction).toBe('compose_draft_only')
    expect(result.remediation?.requiresUserConfirmation).toBe(true)
  })

  it('passes validation when raw input explicitly authorizes sending', () => {
    const rawSpeech = 'Send it now.'
    const normalized = 'Send it now.'
    const result = SemanticDriftGuard.evaluate(rawSpeech, normalized, {
      action: 'send_message',
      intent: 'reply'
    })

    expect(result.passed).toBe(true)
    expect(result.driftDetected).toBe(false)
  })

  it('preserves immutable rawTranscript and negative constraints in UniversalTaskObject through processIntent', async () => {
    const rawSpeech = "reply to Rahul saying I will arrive at 5 PM, but don't send yet"
    const { task } = await processIntent(
      rawSpeech,
      dummyContext,
      {},
      dummySettings,
      0,
      null,
      undefined,
      'voice'
    )

    // UTO canonical properties
    expect(task.id).toBeDefined()
    expect(task.taskId).toBe(task.id)
    expect(task.rawTranscript).toBe(rawSpeech)
    expect(task.activeApplication).toBe('Gmail')
    expect(task.activeWindow).toBe('Inbox - user@gmail.com')
    expect(task.constraints).toContain('do_not_send')
    expect(task.intent.action).not.toBe('send_email')
    expect(task.intent.action).not.toBe('send_message')
    expect(task.executionPlan).toBeDefined()
    expect(task.executionPlan!.length).toBeGreaterThan(0)
    expect(task.executionState).toBe('planned')
    expect(task.verificationState).toBe('pending')
  })
})
