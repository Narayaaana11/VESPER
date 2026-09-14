import { describe, it, expect, vi } from 'vitest'
import { ContextRevalidator } from '../../src/main/context/context-revalidator'
import { ContextCollector } from '../../src/main/context/context-collector'
import { DeviceContext } from '../../src/main/context/context-types'

describe('ContextRevalidator (Pre-execution Safety Gate)', () => {
  it('allows action when target application and window are unchanged', async () => {
    const initialContext: DeviceContext = {
      activeApp: 'Cursor',
      windowTitle: 'App.tsx - Vayro - Cursor',
      category: 'code',
      timestamp: Date.now(),
      confidence: 0.95
    }

    vi.spyOn(ContextCollector, 'collect').mockResolvedValue(initialContext)

    const result = await ContextRevalidator.revalidate(initialContext)
    expect(result.isValid).toBe(true)
    expect(result.action).toBe('proceed')
  })

  it('aborts when current application switched to a protected app', async () => {
    const initialContext: DeviceContext = {
      activeApp: 'Cursor',
      windowTitle: 'App.tsx - Vayro',
      category: 'code',
      timestamp: Date.now(),
      confidence: 0.95
    }

    const protectedContext: DeviceContext = {
      activeApp: 'Bitwarden',
      windowTitle: '[Protected Application]',
      category: 'general',
      isProtected: true,
      timestamp: Date.now(),
      confidence: 0.95
    }

    vi.spyOn(ContextCollector, 'collect').mockResolvedValue(protectedContext)

    const result = await ContextRevalidator.revalidate(initialContext)
    expect(result.isValid).toBe(false)
    expect(result.action).toBe('abort')
    expect(result.reason).toContain('protected application')
  })

  it('pauses and alerts user when foreground application changed during generation', async () => {
    const initialContext: DeviceContext = {
      activeApp: 'VS Code',
      windowTitle: 'index.ts - Vayro',
      category: 'code',
      timestamp: Date.now(),
      confidence: 0.95
    }

    const switchedContext: DeviceContext = {
      activeApp: 'Google Chrome',
      windowTitle: 'YouTube - Google Chrome',
      category: 'browser',
      timestamp: Date.now(),
      confidence: 0.95
    }

    vi.spyOn(ContextCollector, 'collect').mockResolvedValue(switchedContext)

    const result = await ContextRevalidator.revalidate(initialContext)
    expect(result.isValid).toBe(false)
    expect(result.action).toBe('pause_for_user')
    expect(result.reason).toContain('Application switched from VS Code to Google Chrome')
  })
})
