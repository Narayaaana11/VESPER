import { describe, it, expect, vi, beforeEach } from 'vitest'
import { classifyIntent } from '../../src/renderer/src/core/intent-classifier'
import { ScreenTracker } from '../../src/main/context/screen-tracker'
import { ContextStore } from '../../src/main/context/context-store'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('Speech Intent Routing — Dictation vs Query vs Task', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx - QEVRA',
    detectedCategory: 'code'
  }

  it('classifies direct questions as "query"', () => {
    const q1 = classifyIntent('What was I working on before lunch?', dummyContext)
    expect(q1.interactionType).toBe('query')
    expect(q1.isTask).toBe(false)

    const q2 = classifyIntent('Where did I store the API key?', dummyContext)
    expect(q2.interactionType).toBe('query')

    const q3 = classifyIntent('How does the authentication flow work?', dummyContext)
    expect(q3.interactionType).toBe('query')

    const q4 = classifyIntent('Who sent me that email?', dummyContext)
    expect(q4.interactionType).toBe('query')
  })

  it('classifies actionable instructions as "task"', () => {
    const t1 = classifyIntent('Refactor this auth function to use async await', dummyContext)
    expect(t1.interactionType).toBe('task')
    expect(t1.isTask).toBe(true)

    const t2 = classifyIntent('Fix the bug on line 42', dummyContext)
    expect(t2.interactionType).toBe('task')
    expect(t2.isTask).toBe(true)

    const t3 = classifyIntent('Build a modern dashboard component with Tailwind', dummyContext)
    expect(t3.interactionType).toBe('task')
    expect(t3.isTask).toBe(true)
  })

  it('classifies regular natural speech / prose as "dictation"', () => {
    const d1 = classifyIntent('The quick brown fox jumps over the lazy dog', dummyContext)
    expect(d1.interactionType).toBe('dictation')
    expect(d1.isTask).toBe(false)
    expect(d1.intent).toBe('write')

    const d2 = classifyIntent('Meeting moved to tomorrow afternoon thanks', dummyContext)
    expect(d2.interactionType).toBe('dictation')
    expect(d2.isTask).toBe(false)
  })
})

describe('ScreenTracker (Ambient Desktop Ingestion)', () => {
  beforeEach(async () => {
    await ContextStore.getInstance().initialize()
  })

  it('starts and stops cleanly without errors', () => {
    const tracker = ScreenTracker.getInstance()
    expect(tracker.isEnabled()).toBe(false)

    tracker.start(10000)
    expect(tracker.isEnabled()).toBe(true)

    tracker.stop()
    expect(tracker.isEnabled()).toBe(false)
  })

  it('captures activity and generates Littlebird receipts', async () => {
    const tracker = ScreenTracker.getInstance()
    tracker.start(10000)

    const tick = await tracker.captureActivityTick()
    if (tick) {
      expect(tick.receipt).toMatch(/^\[.+ \| .+ \| .+\]$/)
      expect(tick.activitySummary).toBeDefined()
      expect(typeof tick.timestamp).toBe('number')
    }

    tracker.stop()
  })
})
