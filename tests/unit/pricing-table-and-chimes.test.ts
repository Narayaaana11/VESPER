import { describe, it, expect, vi } from 'vitest'
import { audioChimes } from '../../src/renderer/src/core/audio-chimes'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { polishWithGroqLlama } from '../../src/renderer/src/core/groq-service'
import { SystemContext, AppSettings, UniversalTaskObject } from '../../src/renderer/src/types/task'

describe('QEVRA Full Application Core Testing', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Antigravity ide',
    windowTitle: 'PricingTable.tsx - QEVRA',
    detectedCategory: 'code'
  }

  describe('Tactile Audio Chimes Engine', () => {
    it('executes sound feedback routines cleanly without throwing', () => {
      expect(() => audioChimes.playStart(true)).not.toThrow()
      expect(() => audioChimes.playStop(true)).not.toThrow()
      expect(() => audioChimes.playSuccess(true)).not.toThrow()
      expect(() => audioChimes.playError(true)).not.toThrow()
    })

    it('silently ignores chime playback when soundFeedback is false', () => {
      expect(() => audioChimes.playStart(false)).not.toThrow()
      expect(() => audioChimes.playStop(false)).not.toThrow()
      expect(() => audioChimes.playSuccess(false)).not.toThrow()
      expect(() => audioChimes.playError(false)).not.toThrow()
    })
  })

  describe('Direct Dictation vs Smart Assistant Mode', () => {
    const previousTask: UniversalTaskObject = {
      taskId: 'task_pricing_1',
      timestamp: new Date().toISOString(),
      source: { rawSpeech: 'Create a pricing table with three tiers', sttConfidence: 0.98 },
      context: dummyContext,
      intent: { domain: 'coding', category: 'development', action: 'create_component' },
      specifications: {
        requirements: ['Create a pricing table with three tiers'],
        technology: ['React', 'Tailwind'],
        styling: []
      },
      targetRouting: {
        adapter: 'direct_dictation',
        deliveryMethod: 'paste',
        optimizedPrompt: 'Create a pricing table with three tiers',
        explanation: 'Direct text'
      },
      security: { riskLevel: 'low', requiresUserConfirmation: false }
    }

    it('retains pure natural dictation in direct mode without artificial prefixes', async () => {
      const directSettings: AppSettings = {
        hotkey: 'CommandOrControl+Shift+Space',
        aiProvider: 'groq',
        dictationMode: 'direct',
        apiKey: '',
        autoPaste: true,
        soundFeedback: true,
        privacyMode: 'strict_local'
      }

      const result = await processIntent(
        'Add a popular badge to the pro plan and make it responsive',
        dummyContext,
        {},
        directSettings,
        0,
        previousTask,
        Date.now()
      )

      // In direct dictation mode, optimizedPrompt MUST NOT have robotic "For Create a pricing table...:" prefix
      expect(result.task.targetRouting.optimizedPrompt).not.toContain('For Create a pricing table')
      expect(result.task.targetRouting.optimizedPrompt).toContain('Add a popular badge to the pro plan')
    })
  })

  describe('Groq STT & LLM Fast Recovery on Network Error', () => {
    it('immediately aborts and returns raw transcript without 24s freezing when fetch fails', async () => {
      const originalFetch = global.fetch
      // Mock network failure (e.g. offline / DNS drop)
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

      try {
        const start = Date.now()
        const res = await polishWithGroqLlama(
          'Add a popular badge to the pro plan and make it responsive',
          dummyContext,
          'mock_api_key'
        )
        const elapsed = Date.now() - start

        // Must fail fast (< 100ms) and return raw speech cleanly
        expect(elapsed).toBeLessThan(500)
        expect(res).toBe('Add a popular badge to the pro plan and make it responsive')
      } finally {
        global.fetch = originalFetch
      }
    })
  })
})
