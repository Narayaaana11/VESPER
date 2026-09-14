import { describe, it, expect } from 'vitest'
import { classifyIntent } from '../../src/renderer/src/core/intent-classifier'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('IntentClassifier - 12 Intent Taxonomy', () => {
  const defaultContext: SystemContext = {
    activeApp: 'Desktop',
    windowTitle: 'Workspace',
    detectedCategory: 'general'
  }

  it('correctly classifies "code" intent for scaffolding requests', () => {
    const res = classifyIntent('Create a modern React portfolio website with dark mode', defaultContext)
    expect(res.intent).toBe('code')
    expect(res.domain).toBe('coding')
    expect(res.requirements.technologies).toContain('React')
    expect(res.requirements.styling).toContain('Dark mode')
    expect(res.requirements.styling).toContain('Modern aesthetic')
  })

  it('correctly classifies "debug" intent', () => {
    const res = classifyIntent('Debug why this function is returning undefined', defaultContext)
    expect(res.intent).toBe('debug')
    expect(res.domain).toBe('coding')
  })

  it('correctly classifies "reply" intent for communications', () => {
    const res = classifyIntent('Reply to this email saying I will attend tomorrow at 3 PM', {
      ...defaultContext,
      activeApp: 'Google Chrome',
      windowTitle: 'Gmail - Inbox',
      detectedCategory: 'communication'
    })
    expect(res.intent).toBe('reply')
    expect(res.domain).toBe('communication')
  })

  it('correctly classifies "summarize" intent', () => {
    const res = classifyIntent('Summarize this document and give me five most important points', defaultContext)
    expect(res.intent).toBe('summarize')
    expect(res.domain).toBe('document')
  })

  it('correctly classifies "explain" intent', () => {
    const res = classifyIntent('Explain how this authentication middleware works', {
      ...defaultContext,
      detectedCategory: 'code'
    })
    expect(res.intent).toBe('explain')
    expect(res.domain).toBe('coding')
  })

  it('correctly classifies "search" intent', () => {
    const res = classifyIntent('Search for React state management alternatives to Redux', defaultContext)
    expect(res.intent).toBe('search')
    expect(res.domain).toBe('research')
  })

  it('correctly classifies "rewrite" intent', () => {
    const res = classifyIntent('Make this text shorter and more professional', defaultContext)
    expect(res.intent).toBe('rewrite')
    expect(res.requirements.tone).toBe('Professional')
  })

  it('correctly classifies "edit" / refactor intent', () => {
    const res = classifyIntent('Refactor this code without changing behavior', {
      ...defaultContext,
      detectedCategory: 'code'
    })
    expect(res.intent).toBe('edit')
    expect(res.requirements.constraints).toContain('Preserve exact runtime behavior')
  })

  it('correctly classifies file creation / system operation', () => {
    const res = classifyIntent('Create a file called config.json', defaultContext)
    expect(res.intent).toBe('create')
    expect(res.domain).toBe('system')
  })

  it('correctly classifies file deletion as execute intent', () => {
    const res = classifyIntent('Delete this file', defaultContext)
    expect(res.intent).toBe('execute')
    expect(res.domain).toBe('system')
  })

  it('contextual resolution: "Fix this" in Cursor resolves to debug code', () => {
    const res = classifyIntent('Fix this', {
      activeApp: 'Cursor',
      windowTitle: 'server.ts',
      detectedCategory: 'code'
    })
    expect(res.intent).toBe('debug')
    expect(res.domain).toBe('coding')
  })

  it('contextual resolution: "Fix this" in Gmail resolves to rewrite email', () => {
    const res = classifyIntent('Fix this', {
      activeApp: 'Google Chrome',
      windowTitle: 'Gmail - Draft',
      detectedCategory: 'communication'
    })
    expect(res.intent).toBe('rewrite')
    expect(res.domain).toBe('communication')
  })

  it('Wispr Flow: classifies natural conversational speech as natural text (isTask: false)', () => {
    const res = classifyIntent(
      "So here's the thing it is not working as intended as I am thinking of right now",
      defaultContext
    )
    expect(res.isTask).toBe(false)
    expect(res.intent).toBe('write')
    expect(res.action).toBe('direct_dictation')
  })

  it('Wispr Flow: classifies imperative instructions as a task (isTask: true)', () => {
    const res = classifyIntent(
      'Build a modern restaurant landing page with a dark premium design, menu section and smooth animations',
      { activeApp: 'Cursor', windowTitle: 'App.tsx - QEVRA', detectedCategory: 'code' }
    )
    expect(res.isTask).toBe(true)
    expect(res.domain).toBe('coding')
  })

  it('classifies spoken prompt request for restaurant landing page with enriched sections and dark luxury theme', () => {
    const res = classifyIntent(
      'Create a website for a restaurant landing page. I need a prompt for that so give me a prompt for that thing.',
      defaultContext
    )
    expect(res.isTask).toBe(true)
    expect(res.domain).toBe('coding')
    expect(res.requirements.technologies).toContain('HTML5')
    expect(res.requirements.technologies).toContain('Modern CSS / Tailwind')
    expect(res.requirements.styling.some((s) => s.toLowerCase().includes('dark luxury'))).toBe(true)
    expect(res.requirements.sections.some((s) => s.toLowerCase().includes('menu'))).toBe(true)
    expect(res.requirements.sections.some((s) => s.toLowerCase().includes('reservation'))).toBe(true)
  })

  it('classifies system audit and verification commands as debug tasks with audit specifications', () => {
    const speech =
      "So here's a task for you: so the end of the goal is to check whether the entire system is working or not. So based upon what we discussed, what are the features that we discussed earlier and how I want it to be worked, so based upon all those things, fully check each and everything whether these things are working or not, and we need to do something to get those things rightly working on."

    const res = classifyIntent(speech, {
      activeApp: 'Antigravity IDE',
      windowTitle: 'intent-classifier.ts - QEVRA',
      detectedCategory: 'code'
    })

    expect(res.isTask).toBe(true)
    expect(res.interactionType).toBe('task')
    expect(res.intent).toBe('debug')
    expect(res.domain).toBe('coding')
    expect(res.action).toBe('system_audit_and_verification')
    expect(res.requirements.technologies).toContain('Vitest / Unit Tests')
    expect(res.requirements.technologies).toContain('TypeScript')
    expect(res.requirements.constraints.some((c) => c.includes('TypeScript compilation'))).toBe(true)
    expect(res.requirements.constraints.some((c) => c.includes('unit and integration test suites'))).toBe(true)
  })

  it('classifies direct "check whether the system is working" as a task', () => {
    const res = classifyIntent('Check whether the entire system is working or not', defaultContext)
    expect(res.isTask).toBe(true)
    expect(res.interactionType).toBe('task')
    expect(res.intent).toBe('debug')
    expect(res.action).toBe('system_audit_and_verification')
  })

  it('infers rich sections and technologies for e-commerce store requests', () => {
    const res = classifyIntent('Create an online store for sneakers', defaultContext)
    expect(res.intent).toBe('code')
    expect(res.domain).toBe('coding')
    expect(res.requirements.technologies).toContain('HTML5')
    expect(res.requirements.sections.some((s) => s.includes('Product Grid'))).toBe(true)
    expect(res.requirements.sections.some((s) => s.includes('Shopping Cart'))).toBe(true)
  })

  it('infers KPI metrics and charts for dashboard requests', () => {
    const res = classifyIntent('Build an analytics dashboard for tracking user events', defaultContext)
    expect(res.intent).toBe('code')
    expect(res.domain).toBe('coding')
    expect(res.requirements.technologies).toContain('React')
    expect(res.requirements.sections.some((s) => s.includes('KPI Metric Cards'))).toBe(true)
    expect(res.requirements.sections.some((s) => s.includes('Chart'))).toBe(true)
  })
})
