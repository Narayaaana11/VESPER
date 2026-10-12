import { describe, it, expect, vi } from 'vitest'
import { resolveBinary } from '../../src/main/binary-resolver'
import { HoldToTalkManager } from '../../src/main/hold-to-talk'

describe('Windows Native Binary Resolver & Push-to-Talk Subsystem', () => {
  it('resolves detect-window.exe and send-input.exe physical disk paths', () => {
    const detectWin = resolveBinary('detect-window.exe')
    const sendInput = resolveBinary('send-input.exe')
    const winKey = resolveBinary('WinKeyServer.exe')

    expect(detectWin).toBeTruthy()
    expect(detectWin).not.toContain('app.asar\\')
    expect(sendInput).toBeTruthy()
    expect(sendInput).not.toContain('app.asar\\')
    expect(winKey).toBeTruthy()
    expect(winKey).not.toContain('app.asar\\')
  })

  it('never returns an executable inside raw app.asar', () => {
    const path = resolveBinary('non-existent-binary.exe')
    expect(path).toBe('')
  })

  it('HoldToTalkManager handles ANY ALT matching for Left Alt, Right Alt, and VK_MENU', () => {
    const mockWindow: any = {
      isDestroyed: () => false,
      setAlwaysOnTop: vi.fn(),
      showInactive: vi.fn(),
      moveTop: vi.fn(),
      webContents: {
        send: vi.fn()
      }
    }

    const manager = new HoldToTalkManager(mockWindow, 'ANY ALT')
    expect(manager.getTargetKey()).toBe('ANY ALT')

    // Test isKeyMatch via private access
    const isKeyMatch = (manager as any).isKeyMatch.bind(manager)

    // Left Alt (164)
    expect(isKeyMatch({ name: 'LEFT ALT', vKey: 164, state: 'DOWN' })).toBe(true)

    // Right Alt (165)
    expect(isKeyMatch({ name: 'RIGHT ALT', vKey: 165, state: 'DOWN' })).toBe(true)

    // Win32 Generic Alt (18)
    expect(isKeyMatch({ name: 'ALT', vKey: 18, state: 'DOWN' })).toBe(true)

    // Unrelated key (Space = 32)
    expect(isKeyMatch({ name: 'SPACE', vKey: 32, state: 'DOWN' })).toBe(false)
  })

  it('supports updating targetKey dynamically', () => {
    const mockWindow: any = {
      isDestroyed: () => false,
      webContents: { send: vi.fn() }
    }

    const manager = new HoldToTalkManager(mockWindow, 'ANY ALT')
    manager.setTargetKey('CAPS LOCK')
    expect(manager.getTargetKey()).toBe('CAPS LOCK')

    const isKeyMatch = (manager as any).isKeyMatch.bind(manager)
    expect(isKeyMatch({ name: 'CAPS LOCK', vKey: 20, state: 'DOWN' })).toBe(true)
    expect(isKeyMatch({ name: 'LEFT ALT', vKey: 164, state: 'DOWN' })).toBe(false)
  })
})
