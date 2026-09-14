import { describe, it, expect } from 'vitest'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { ContextChainer } from '../../src/renderer/src/core/context-chainer'
import { AppSettings, SystemContext, UniversalTaskObject } from '../../src/renderer/src/types/task'

describe('QA Suite: Deadlock & Dictation Resilience Verification', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Antigravity IDE',
    windowTitle: 'pricing.tsx - QEVRA',
    detectedCategory: 'code'
  }

  const baseTask: UniversalTaskObject = {
    taskId: 'task_pricing_base',
    timestamp: new Date().toISOString(),
    source: { rawSpeech: 'Create a pricing table with three tiers', sttConfidence: 0.98 },
    context: dummyContext,
    intent: { domain: 'coding', category: 'development', action: 'create_project' },
    specifications: {
      requirements: ['Create a pricing table with three tiers'],
      technology: ['React', 'TypeScript'],
      styling: []
    },
    targetRouting: {
      adapter: 'antigravity_composer',
      deliveryMethod: 'paste',
      optimizedPrompt: 'Create a pricing table with three tiers',
      explanation: 'Targeted Antigravity Composer'
    },
    security: { riskLevel: 'low', requiresUserConfirmation: false }
  }

  it('verifies Direct Dictation Mode outputs clean natural text without "For [prev]:" prefix', async () => {
    const directSettings: AppSettings = {
      hotkey: 'CommandOrControl+Shift+Space',
      aiProvider: 'local',
      ollamaModel: 'llama3.2',
      ollamaEndpoint: 'http://localhost:11434',
      apiKey: '',
      dictationMode: 'direct', // Pure voice typing mode
      autoPaste: true,
      soundFeedback: true,
      privacyMode: 'strict_local'
    }

    const res = await processIntent(
      'Add a popular badge to the pro plan and make it responsive',
      dummyContext,
      {},
      directSettings,
      0,
      baseTask,
      Date.now()
    )

    // In direct dictation mode, the user's spoken words should be pasted cleanly
    expect(res.task.targetRouting.optimizedPrompt).not.toContain('For Create a pricing table')
    expect(res.task.targetRouting.optimizedPrompt).toBe('Add a popular badge to the pro plan and make it responsive')
  })

  it('verifies Smart Assistant Mode constructs structured engineered prompts when requested', async () => {
    const assistantSettings: AppSettings = {
      hotkey: 'CommandOrControl+Shift+Space',
      aiProvider: 'local',
      ollamaModel: 'llama3.2',
      ollamaEndpoint: 'http://localhost:11434',
      apiKey: '',
      dictationMode: 'smart_assistant', // Full prompt engineering mode
      autoPaste: true,
      soundFeedback: true,
      privacyMode: 'strict_local'
    }

    const res = await processIntent(
      'Add a popular badge to the pro plan and make it responsive',
      dummyContext,
      {},
      assistantSettings,
      0,
      baseTask,
      Date.now()
    )

    // In smart assistant mode, context chainer synthesizes full context for agent execution
    expect(res.task.targetRouting.optimizedPrompt).toContain('For Create a pricing table with three tiers')
    expect(res.task.targetRouting.optimizedPrompt).toContain('popular badge')
  })

  it('verifies ContextChainer extracts responsive features and mobile styling into specifications', () => {
    const chained = ContextChainer.resolve(
      'Add a popular badge to the pro plan and make it responsive',
      dummyContext,
      baseTask,
      Date.now()
    )

    expect(chained.isChained).toBe(true)
    expect(chained.parentTaskId).toBe('task_pricing_base')
    expect(chained.features).toContain('responsive mobile support')
    expect(chained.mergedRequirements).toContain('Add a popular badge to the pro plan and make it responsive')
  })

  it('verifies non-chained queries like questions or testing do not trigger chaining', () => {
    const queryResult = ContextChainer.resolve(
      'What is the current file status?',
      dummyContext,
      baseTask,
      Date.now()
    )
    expect(queryResult.isChained).toBe(false)
    expect(queryResult.synthesizedPrompt).toBe('What is the current file status?')
  })
})
