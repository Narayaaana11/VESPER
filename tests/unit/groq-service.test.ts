import { describe, it, expect, vi, beforeEach } from 'vitest'
import { transcribeWithGroq, polishWithGroqLlama } from '../../src/renderer/src/core/groq-service'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('Groq Service - Whisper STT & Llama Polishing Pipeline', () => {
  const dummyContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx',
    detectedCategory: 'code'
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects transcription gracefully when no API key is provided', async () => {
    const fakeBlob = new Blob(['fake audio'], { type: 'audio/webm' })
    const result = await transcribeWithGroq(fakeBlob, '')
    expect(result.text).toBe('')
    expect(result.error).toContain('API key not provided')
  })

  it('sends correct Whisper parameters (whisper-large-v3, prompt, temperature 0)', async () => {
    const fakeBlob = new Blob(['fake audio data'], { type: 'audio/webm' })
    let capturedBody: FormData | null = null
    let capturedHeaders: any = null

    globalThis.fetch = vi.fn().mockImplementation((url: string, init: any) => {
      capturedBody = init.body
      capturedHeaders = init.headers
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ text: 'Create a modern landing page with CSS and JS' })
      })
    })

    const result = await transcribeWithGroq(fakeBlob, 'gsk_test1234567890', {
      model: 'whisper-large-v3',
      temperature: 0.0,
      prompt: 'Technical software context'
    })

    expect(result.text).toBe('Create a modern landing page with CSS and JS')
    expect(capturedHeaders.Authorization).toBe('Bearer gsk_test1234567890')
    expect(capturedBody).toBeInstanceOf(FormData)
    expect((capturedBody as any).get('model')).toBe('whisper-large-v3')
    expect((capturedBody as any).get('temperature')).toBe('0')
    expect((capturedBody as any).get('prompt')).toBe('Technical software context')
  })

  it('polishes raw speech through Groq Llama with context instructions', async () => {
    let capturedPayload: any = null

    globalThis.fetch = vi.fn().mockImplementation((url: string, init: any) => {
      capturedPayload = JSON.parse(init.body)
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: 'Create a responsive personal portfolio with HTML and CSS.'
                }
              }
            ]
          })
      })
    })

    const polished = await polishWithGroqLlama(
      'um like so create a responsive personal portfolio with HTML and CSS you know',
      dummyContext,
      'gsk_test1234567890'
    )

    expect(polished).toBe('Create a responsive personal portfolio with HTML and CSS.')
    expect(capturedPayload.model).toBe('llama-3.3-70b-versatile')
    expect(capturedPayload.messages[0].content).toContain('Wispr Flow')
  })

  it('falls back to raw transcript gracefully if network fails during polishing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const raw = 'Write a function to calculate fibonacci numbers'
    const result = await polishWithGroqLlama(raw, dummyContext, 'gsk_test1234567890')
    expect(result).toBe(raw)
  })
})
