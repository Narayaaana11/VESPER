import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { UniversalActionSystem } from '../../src/main/actions/universal-actions'
import fs from 'fs'
import path from 'path'

describe('Universal Action System (Phase 3)', () => {
  const testDir = path.join(process.cwd(), 'tests', 'scratch')
  const testFile = path.join(testDir, 'test-doc.txt')

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
  })

  afterEach(() => {
    try {
      if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
      if (fs.existsSync(testDir)) fs.rmdirSync(testDir)
    } catch {}
  })

  it('evaluates action risk levels correctly', () => {
    expect(UniversalActionSystem.evaluateRisk('pasteText', {})).toBe('low')
    expect(UniversalActionSystem.evaluateRisk('openApp', { appName: 'notepad' })).toBe('low')
    expect(UniversalActionSystem.evaluateRisk('createFile', { filePath: 'foo.txt' })).toBe('medium')
    expect(UniversalActionSystem.evaluateRisk('runCommand', { command: 'npm test' })).toBe('medium')
    expect(UniversalActionSystem.evaluateRisk('runCommand', { command: 'rm -rf node_modules' })).toBe('high')
    expect(UniversalActionSystem.evaluateRisk('sendMessage', { autoSend: true })).toBe('high')
    expect(UniversalActionSystem.evaluateRisk('sendMessage', { autoSend: false })).toBe('low')
  })

  it('creates and edits files with verified state and undo reversal support', async () => {
    // 1. Create file action
    const createResult = await UniversalActionSystem.execute({
      actionId: 'act_1',
      actionType: 'createFile',
      target: testFile,
      parameters: { filePath: testFile, content: 'Initial Hello World' },
      riskLevel: 'medium',
      description: 'Create test file'
    })

    expect(createResult.success).toBe(true)
    expect(createResult.verification.verified).toBe(true)
    expect(createResult.reversalAvailable).toBe(true)
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('Initial Hello World')

    // 2. Edit file action
    const editResult = await UniversalActionSystem.execute({
      actionId: 'act_2',
      actionType: 'editFile',
      target: testFile,
      parameters: { filePath: testFile, content: 'Updated Content Line 2' },
      riskLevel: 'medium',
      description: 'Update test file'
    })

    expect(editResult.success).toBe(true)
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('Updated Content Line 2')

    // 3. Undo action -> restores initial content
    const undoResult = await UniversalActionSystem.undoLastAction()
    expect(undoResult.success).toBe(true)
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('Initial Hello World')
  })
})
