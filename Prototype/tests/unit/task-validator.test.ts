import { describe, it, expect } from 'vitest'
import { TaskValidator } from '../../src/renderer/src/core/task-validator'

describe('TaskValidator - Schema Validation & Safe Recovery', () => {
  it('validates a complete and correct task object', () => {
    const valid = {
      taskId: 'task_123',
      timestamp: '2026-09-07T00:00:00Z',
      source: { rawSpeech: 'Hello world', sttConfidence: 0.95 },
      context: { activeApp: 'Cursor', windowTitle: 'App.tsx', detectedCategory: 'code' },
      intent: { domain: 'coding', category: 'code', action: 'scaffold' },
      specifications: { requirements: ['React'] },
      targetRouting: {
        adapter: 'cursor_composer',
        deliveryMethod: 'paste',
        optimizedPrompt: 'Do this',
        explanation: 'Formatted'
      },
      security: { riskLevel: 'low', requiresUserConfirmation: false }
    }

    const result = TaskValidator.validateAndRecover(valid)
    expect(result.isValid).toBe(true)
    expect(result.recovered).toBe(false)
  })

  it('safely recovers missing fields from malformed payloads', () => {
    const malformed = {
      source: { rawSpeech: 'Incomplete prompt' }
    }

    const result = TaskValidator.validateAndRecover(malformed)
    expect(result.recovered).toBe(true)
    expect(result.task.taskId).toBeDefined()
    expect(result.task.timestamp).toBeDefined()
    expect(result.task.security.riskLevel).toBe('low')
    expect(result.task.targetRouting.adapter).toBe('clipboard')
  })

  it('creates a safe fallback task when null or non-object is provided', () => {
    const result = TaskValidator.validateAndRecover(null)
    expect(result.isValid).toBe(false)
    expect(result.recovered).toBe(true)
    expect(result.task.taskId).toBeDefined()
  })
})
