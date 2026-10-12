import { describe, it, expect, vi, beforeEach } from 'vitest'
import { transcribeWithGroq, polishWithGroqLlama, polishWithLocalRules, transcribeAudio } from '../../src/renderer/src/core/groq-service'
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
      if (String(url).includes('groq.com')) {
        capturedPayload = JSON.parse(init.body)
      }
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
    expect(capturedPayload.messages[0].content).toContain('VESPER')
  })

  it('falls back to raw transcript gracefully if network fails during polishing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const raw = 'Write a function to calculate fibonacci numbers'
    const result = await polishWithGroqLlama(raw, dummyContext, 'gsk_test1234567890')
    expect(result).toBe(raw)
  })

  describe('Local Compute STT & Deterministic Rule Polishing', () => {
    it('polishes raw speech deterministically with local rules (zero cloud API)', () => {
      const raw = 'um uh build a modern landing page no wait a personal portfolio you know'
      const polished = polishWithLocalRules(raw, dummyContext)

      expect(polished).not.toContain('um')
      expect(polished).not.toContain('uh')
      expect(polished).not.toContain('you know')
      expect(polished.toLowerCase()).toContain('personal portfolio')
      expect(polished.endsWith('.')).toBe(true)
    })

    it('strips Whisper trailing hallucinations in local rules', () => {
      const raw = 'Create a navbar and footer thank you. Thanks for watching.'
      const polished = polishWithLocalRules(raw, dummyContext)

      expect(polished).not.toContain('thank you')
      expect(polished).not.toContain('Thanks for watching')
      expect(polished).toContain('Create a navbar and footer')
    })

    it('formats code keywords properly in code context', () => {
      const raw = 'convert this to camel case and submit a pull request'
      const polished = polishWithLocalRules(raw, dummyContext)

      expect(polished).toContain('camelCase')
      expect(polished).toContain('Pull Request')
    })

    it('transcribeAudio automatically falls back to local Whisper when Groq fails', async () => {
      // Mock window.electronAPI.transcribeLocal
      const originalWindow = (globalThis as any).window
      ;(globalThis as any).window = {
        electronAPI: {
          transcribeLocal: vi.fn().mockResolvedValue({ text: 'Local Whisper transcript text' })
        },
        AudioContext: class {
          decodeAudioData() {
            return Promise.resolve({
              getChannelData: () => new Float32Array(16000)
            })
          }
          close() {
            return Promise.resolve()
          }
        }
      }

      // Mock Groq fetch failure
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'))

      const fakeBlob = new Blob(['audio data'], { type: 'audio/webm' })
      const result = await transcribeAudio(fakeBlob, 'gsk_test', {
        preferLocal: false
      })

      expect(result.provider).toBe('local')
      expect(result.text).toBe('Local Whisper transcript text')

      ;(globalThis as any).window = originalWindow
    })

    it('transcribeAudio uses local Whisper directly when preferLocal is true', async () => {
      const originalWindow = (globalThis as any).window
      ;(globalThis as any).window = {
        electronAPI: {
          transcribeLocal: vi.fn().mockResolvedValue({ text: 'Direct offline transcript' })
        },
        AudioContext: class {
          decodeAudioData() {
            return Promise.resolve({
              getChannelData: () => new Float32Array(16000)
            })
          }
          close() {
            return Promise.resolve()
          }
        }
      }

      const fakeBlob = new Blob(['audio data'], { type: 'audio/webm' })
      const result = await transcribeAudio(fakeBlob, '', {
        preferLocal: true
      })

      expect(result.provider).toBe('local')
      expect(result.text).toBe('Direct offline transcript')

      ;(globalThis as any).window = originalWindow
    })

    it('routes whisper-large-v3-turbo to /transcriptions endpoint even when translateToEnglish is true', async () => {
      const fakeBlob = new Blob(['audio data'], { type: 'audio/webm' })
      let capturedUrl = ''

      globalThis.fetch = vi.fn().mockImplementation((url: string) => {
        capturedUrl = url
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ text: 'Transcribed via turbo' })
        })
      })

      const result = await transcribeWithGroq(fakeBlob, 'gsk_test1234567890', {
        model: 'whisper-large-v3-turbo',
        translateToEnglish: true
      })

      expect(capturedUrl).toBe('https://api.groq.com/openai/v1/audio/transcriptions')
      expect(result.text).toBe('Transcribed via turbo')
    })

    it('automatically recovers from /translations 400 unsupported_task error by retrying /transcriptions', async () => {
      const fakeBlob = new Blob(['audio data'], { type: 'audio/webm' })
      const calledUrls: string[] = []

      globalThis.fetch = vi.fn().mockImplementation((url: string) => {
        calledUrls.push(url)
        if (url.includes('/translations')) {
          return Promise.resolve({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            text: () => Promise.resolve('{"error":{"message":"The model does not support translate","code":"unsupported_task"}}')
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ text: 'Recovered transcription' })
        })
      })

      const result = await transcribeWithGroq(fakeBlob, 'gsk_test1234567890', {
        model: 'whisper-large-v3',
        translateToEnglish: true
      })

      expect(calledUrls).toEqual([
        'https://api.groq.com/openai/v1/audio/translations',
        'https://api.groq.com/openai/v1/audio/transcriptions'
      ])
      expect(result.text).toBe('Recovered transcription')
    })
  })
})

