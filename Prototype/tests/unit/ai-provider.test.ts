import { describe, it, expect, vi } from 'vitest'
import { RuleBasedProvider } from '../../src/renderer/src/core/ai/rule-provider'
import { AIFactory } from '../../src/renderer/src/core/ai/ai-factory'
import { TaskPlanner } from '../../src/renderer/src/core/task-planner'
import { UniversalTaskObject, SystemContext } from '../../src/renderer/src/types/task'

describe('AI Provider & Requirement Extraction', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - VESPER',
    detectedCategory: 'code'
  }

  describe('Dynamic Requirement Extraction (Phase 11)', () => {
    it('extracts goal, styling, and features without rigid substring matching', async () => {
      const provider = new RuleBasedProvider()
      const speech =
        'Build a premium dark restaurant landing page with reservations, animations and mobile support'

      const req = await provider.extractRequirements(speech, dummyContext)

      expect(req.goal.toLowerCase()).toContain('restaurant landing page')
      expect(req.styling).toContain('premium')
      expect(req.styling).toContain('dark')
      expect(req.features).toContain('reservations')
      expect(req.features).toContain('animations')
      expect(req.features).toContain('responsive mobile support')
    })
  })

  describe('AIFactory & AI Providers (Phase 8 & Phase H)', () => {
    it('instantiates GroqProvider for groq settings', () => {
      const provider = AIFactory.getProvider({
        aiProvider: 'groq',
        apiKey: 'gsk_test'
      })
      expect(provider.id).toBe('groq')
    })

    it('instantiates LocalModelProvider for ollama settings', () => {
      const provider = AIFactory.getProvider({
        aiProvider: 'ollama',
        ollamaEndpoint: 'http://localhost:11434'
      })
      expect(provider.id).toBe('local')
    })

    it('GroqProvider generates polished output when API key is valid', async () => {
      const provider = AIFactory.getProvider({
        aiProvider: 'groq',
        apiKey: 'gsk_sample_key'
      })

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Polished text from Groq Llama 3.3.' } }]
          })
      })

      const output = await provider.generate('sample input speech', dummyContext)
      expect(output).toBe('Polished text from Groq Llama 3.3.')
    })

    it('GroqProvider gracefully falls back to raw prompt if API key is missing', async () => {
      const provider = AIFactory.getProvider({
        aiProvider: 'groq',
        apiKey: ''
      })

      const output = await provider.generate('raw voice prompt', dummyContext)
      expect(output).toBe('raw voice prompt')
    })

    it('LocalModelProvider detects when Ollama daemon is offline and uses deterministic fallback', async () => {
      const provider = AIFactory.getProvider({
        aiProvider: 'ollama',
        ollamaEndpoint: 'http://localhost:11434'
      })

      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'))
      const available = await provider.isAvailable()
      expect(available).toBe(false)

      const output = await provider.generate('local speech command', dummyContext)
      expect(output).toBe('local speech command')
    })

    it('RuleBasedProvider provides deterministic classification and task planning', async () => {
      const provider = AIFactory.getProvider({ aiProvider: 'rule_based' as any })
      expect(await provider.isAvailable()).toBe(true)

      const classification = await provider.classify('Build a React landing page', dummyContext)
      expect(classification.domain).toBe('coding')
      expect(classification.requirements.technologies).toContain('React')
    })
  })

  describe('TaskPlanner (Phase 14)', () => {
    it('converts a UniversalTaskObject into a safe structured ActionPlan', () => {
      const sampleTask: UniversalTaskObject = {
        taskId: 'task_plan_test',
        timestamp: new Date().toISOString(),
        source: { rawSpeech: 'Build a dark restaurant page', sttConfidence: 0.95 },
        context: dummyContext,
        intent: { domain: 'coding', category: 'development', action: 'create_project' },
        specifications: {
          requirements: ['Build a dark restaurant page'],
          technology: ['React'],
          styling: ['dark']
        },
        targetRouting: {
          adapter: 'cursor_composer',
          deliveryMethod: 'paste',
          optimizedPrompt: 'Build a dark restaurant page with React',
          explanation: 'Targeted Cursor'
        },
        security: { riskLevel: 'low', requiresUserConfirmation: false }
      }

      const plan = TaskPlanner.plan(sampleTask)

      expect(plan.planId).toBeDefined()
      expect(plan.steps.length).toBe(3)
      expect(plan.steps[0].actionType).toBe('inspect_context')
      expect(plan.steps[1].actionType).toBe('insert_prompt')
      expect(plan.steps[2].actionType).toBe('verify')
      expect(plan.steps[1].requiresConfirmation).toBe(false)
    })

    it('enforces requiresConfirmation on high risk tasks', () => {
      const highRiskTask: UniversalTaskObject = {
        taskId: 'task_delete',
        timestamp: new Date().toISOString(),
        source: { rawSpeech: 'Delete all customer records from database', sttConfidence: 0.95 },
        context: dummyContext,
        intent: { domain: 'system', category: 'destructive', action: 'delete_data' },
        specifications: { requirements: ['Delete all customer records'] },
        targetRouting: {
          adapter: 'clipboard',
          deliveryMethod: 'clipboard',
          optimizedPrompt: 'DROP TABLE customers',
          explanation: 'High risk'
        },
        security: { riskLevel: 'high', requiresUserConfirmation: true }
      }

      const plan = TaskPlanner.plan(highRiskTask)
      expect(plan.steps[1].requiresConfirmation).toBe(true)
    })
  })
})
