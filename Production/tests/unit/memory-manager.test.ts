import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryManager } from '../../src/renderer/src/core/memory-manager'

describe('MemoryManager - User Preferences & Precedence', () => {
  beforeEach(() => {
    MemoryManager.clearPreferences()
  })

  it('provides default preferences', () => {
    const prefs = MemoryManager.getPreferences()
    expect(prefs.preferredFramework).toBe('React')
    expect(prefs.preferredLanguage).toBe('TypeScript')
  })

  it('updates and persists preferences', () => {
    MemoryManager.savePreferences({ preferredFramework: 'Next.js' })
    const updated = MemoryManager.getPreferences()
    expect(updated.preferredFramework).toBe('Next.js')
  })

  it('CRITICAL RULE: Explicit speech instructions ALWAYS override stored memory', () => {
    // Memory prefers React
    MemoryManager.savePreferences({ preferredFramework: 'React' })

    // User explicitly says Vue in speech
    const speech = 'Create a Vue portfolio website'
    const res = MemoryManager.resolveEffectiveStack(speech, ['Vue.js'])

    expect(res.framework).toBe('Vue.js')
    expect(res.isFromMemory).toBe(false)
  })

  it('applies stored memory when user is unspecified', () => {
    MemoryManager.savePreferences({ preferredFramework: 'React' })

    const speech = 'Create a dashboard'
    const res = MemoryManager.resolveEffectiveStack(speech, [])

    expect(res.framework).toBe('React')
    expect(res.isFromMemory).toBe(true)
  })
})
