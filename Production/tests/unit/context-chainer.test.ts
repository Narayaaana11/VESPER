import { describe, it, expect } from 'vitest'
import { ContextChainer } from '../../src/renderer/src/core/context-chainer'
import { UniversalTaskObject, SystemContext } from '../../src/renderer/src/types/task'

describe('ContextChainer (MVP Real Context Chaining)', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - RestaurantSite - Cursor',
    detectedCategory: 'code'
  }

  // Base Task 1: "Build a restaurant website"
  const baseTask: UniversalTaskObject = {
    taskId: 'task_base_1',
    timestamp: new Date().toISOString(),
    source: { rawSpeech: 'Build a restaurant website', sttConfidence: 0.98 },
    context: dummyContext,
    intent: { domain: 'coding', category: 'development', action: 'create_project' },
    specifications: {
      requirements: ['Build a restaurant website'],
      technology: ['React', 'TypeScript'],
      styling: []
    },
    targetRouting: {
      adapter: 'cursor_composer',
      deliveryMethod: 'paste',
      optimizedPrompt: 'Build a modern restaurant website with React and TypeScript',
      explanation: 'Targeted Cursor Composer'
    },
    security: { riskLevel: 'low', requiresUserConfirmation: false }
  }

  it('chains "Make it dark" to the active restaurant website task', () => {
    const chain1 = ContextChainer.resolve('Make it dark', dummyContext, baseTask, Date.now())

    expect(chain1.isChained).toBe(true)
    expect(chain1.parentTaskId).toBe('task_base_1')
    expect(chain1.originalGoal).toBe('Build a restaurant website')
    expect(chain1.styling).toContain('dark theme')
    expect(chain1.synthesizedPrompt).toContain('restaurant website')
    expect(chain1.synthesizedPrompt).toContain('dark')
  })

  it('chains "Add reservations" retaining dark theme and restaurant website', () => {
    // Task 2 state with dark theme
    const task2: UniversalTaskObject = {
      ...baseTask,
      taskId: 'task_chain_2',
      specifications: {
        ...baseTask.specifications,
        styling: ['dark theme'],
        requirements: ['Build a restaurant website', 'dark theme']
      }
    }

    const chain2 = ContextChainer.resolve('Add reservations', dummyContext, task2, Date.now())

    expect(chain2.isChained).toBe(true)
    expect(chain2.features).toContain('reservations')
    expect(chain2.styling).toContain('dark theme')
    expect(chain2.synthesizedPrompt).toContain('reservations')
  })

  it('chains "Make the reservation section better" targeting the specific section', () => {
    // Task 3 state with reservations
    const task3: UniversalTaskObject = {
      ...baseTask,
      taskId: 'task_chain_3',
      specifications: {
        ...baseTask.specifications,
        styling: ['dark theme'],
        requirements: ['Build a restaurant website', 'dark theme', 'reservations']
      }
    }

    const chain3 = ContextChainer.resolve(
      'Make the reservation section better',
      dummyContext,
      task3,
      Date.now()
    )

    expect(chain3.isChained).toBe(true)
    expect(chain3.targetSection).toBe('reservation')
    expect(chain3.synthesizedPrompt).toContain('reservation')
    expect(chain3.synthesizedPrompt).toContain('restaurant website')
  })

  it('does not chain if the previous task is null (fresh interaction)', () => {
    const fresh = ContextChainer.resolve('Create a calculator app', dummyContext, null)
    expect(fresh.isChained).toBe(false)
    expect(fresh.synthesizedPrompt).toBe('Create a calculator app')
  })
})
