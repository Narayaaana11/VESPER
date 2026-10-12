import { describe, it, expect } from 'vitest'
import { AgentHarness } from '../../src/renderer/src/core/agent-harness'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('Agentic Harness System', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - VESPER',
    detectedCategory: 'code',
    timestamp: Date.now(),
    confidence: 0.95
  }

  it('decomposes goal into verifiable multi-step harness session', () => {
    const session = AgentHarness.createSession('build responsive restaurant menu component', dummyContext)

    expect(session.plan.length).toBeGreaterThanOrEqual(3)
    expect(session.sessionId).toContain('harness_')
    expect(session.plan[0].actionType).toBe('verify')
    expect(session.advisoryReviews.length).toBe(5)
    expect(session.overallVerdict).toMatch(/APPROVED|APPROVED_WITH_CONDITIONS/)
  })

  it('executes steps sequentially and records verification receipts', async () => {
    const session = AgentHarness.createSession('format speech dictation', dummyContext)
    expect(session.currentStepIndex).toBe(0)

    const updated = await AgentHarness.executeNextStep(session, async (step) => {
      return true
    })

    expect(updated.currentStepIndex).toBe(1)
    expect(updated.plan[0].status).toBe('completed')
    expect(updated.plan[0].receipt).toBeDefined()
    expect(updated.logs.some(l => l.includes('Step 1 OK'))).toBe(true)
  })

  it('pauses session when step execution returns failure', async () => {
    const session = AgentHarness.createSession('failing action step', dummyContext)

    const updated = await AgentHarness.executeNextStep(session, async () => {
      return false
    })

    expect(updated.isPaused).toBe(true)
    expect(updated.plan[0].status).toBe('failed')
  })
})
