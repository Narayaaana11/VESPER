import { describe, it, expect, beforeEach } from 'vitest'
import { ContextStore } from '../../src/main/context/context-store'

describe('Central 24/7 Context Engine (Desktop Operations)', () => {
  let store: ContextStore

  beforeEach(async () => {
    store = ContextStore.getInstance()
    await store.initialize()
  })

  it('records desktop operations into SQLite and retrieves them chronologically', () => {
    const id = store.recordDesktopOperation({
      opType: 'window_focus',
      activeApp: 'Cursor',
      windowTitle: 'App.tsx - VESPER',
      summary: 'Focused editor on App.tsx',
      details: { line: 42, col: 10 }
    })

    expect(id).toMatch(/^op_/)

    const recent = store.getRecentOperations(10)
    expect(recent.length).toBeGreaterThan(0)
    const found = recent.find((r) => r.id === id)
    expect(found).toBeDefined()
    expect(found?.activeApp).toBe('Cursor')
    expect(found?.opType).toBe('window_focus')
    expect(found?.details?.line).toBe(42)
  })

  it('searches operations by query filter', () => {
    store.recordDesktopOperation({
      opType: 'git_commit',
      activeApp: 'Windows Terminal',
      summary: 'Committed feat: implement agent harness and MCP tools',
      details: { branch: 'main' }
    })

    const results = store.searchOperations('agent harness', 5)
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].summary).toContain('agent harness')
  })
})
