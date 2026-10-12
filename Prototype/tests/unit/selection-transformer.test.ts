import { describe, it, expect } from 'vitest'
import { SelectionTransformer } from '../../src/renderer/src/core/selection-transformer'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('SelectionTransformer (In-Place Edit Mode inspired by FreeFlow)', () => {
  const contextWithSelection: SystemContext = {
    activeApp: 'Visual Studio Code',
    windowTitle: 'App.tsx',
    detectedCategory: 'code',
    clipboardContent: 'The quick brown fox jumps over the lazy dog repeatedly.'
  }

  const contextEmptySelection: SystemContext = {
    activeApp: 'Notepad',
    windowTitle: 'Untitled - Notepad',
    detectedCategory: 'text',
    clipboardContent: ''
  }

  it('detects transform commands when selection is present', () => {
    expect(SelectionTransformer.isTransformCommand('make this more concise', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('make it shorter', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('rephrase this', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('rewrite it', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('translate this to Spanish', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('format as JSON', contextWithSelection)).toBe(true)
    expect(SelectionTransformer.isTransformCommand('fix the grammar', contextWithSelection)).toBe(true)
  })

  it('rejects transform commands when clipboard/selection is empty', () => {
    expect(SelectionTransformer.isTransformCommand('make this more concise', contextEmptySelection)).toBe(false)
    expect(SelectionTransformer.isTransformCommand('rephrase this', contextEmptySelection)).toBe(false)
  })

  it('rejects general dictation and non-transform commands even if text is in clipboard', () => {
    expect(SelectionTransformer.isTransformCommand('Write a poem about the sunrise', contextWithSelection)).toBe(false)
    expect(SelectionTransformer.isTransformCommand('Hello team please find the weekly report attached below', contextWithSelection)).toBe(false)
    expect(SelectionTransformer.isTransformCommand('Create a React component with state', contextWithSelection)).toBe(false)
  })

  it('executes deterministic transformation without API key', async () => {
    const resConcise = await SelectionTransformer.transform('make this shorter', contextWithSelection)
    expect(resConcise.isTransform).toBe(true)
    expect(resConcise.transformedText).toBeDefined()
    expect(resConcise.originalText).toBe(contextWithSelection.clipboardContent)

    const resJson = await SelectionTransformer.transform('format as json', contextWithSelection)
    expect(resJson.isTransform).toBe(true)
    expect(resJson.transformedText?.startsWith('{')).toBe(true)
  })

  it('gracefully handles empty input and missing clipboard', async () => {
    const resEmpty = await SelectionTransformer.transform('make this concise', contextEmptySelection)
    expect(resEmpty.isTransform).toBe(false)
  })

  it('transforms informal speech to professional English locally (TC-EDIT-01)', async () => {
    const contextWithInformal: SystemContext = {
      activeApp: 'Slack',
      windowTitle: 'Direct Message',
      detectedCategory: 'communication',
      clipboardContent: 'hey sir i am unable to come today'
    }

    expect(SelectionTransformer.isTransformCommand('make this professional', contextWithInformal)).toBe(true)
    const res = await SelectionTransformer.transform('make this professional', contextWithInformal)
    expect(res.isTransform).toBe(true)
    expect(res.transformedText).toContain('Dear sir')
    expect(res.transformedText).toContain('unable to attend today')
  })

  it('rejects [BLANK_AUDIO] and sound artifacts in clipboard from being transformed', () => {
    const contextWithBlankAudio: SystemContext = {
      activeApp: 'Notepad',
      windowTitle: 'Untitled - Notepad',
      detectedCategory: 'text',
      clipboardContent: '[BLANK_AUDIO].'
    }

    expect(SelectionTransformer.isTransformCommand('make this professional', contextWithBlankAudio)).toBe(false)
  })
})
