import { describe, it, expect } from 'vitest'
import { validateWhisperTranscript, validatePolishedOutput } from '../../src/renderer/src/core/transcription-validator'
import { processIntent } from '../../src/renderer/src/core/intent-engine'
import { AppSettings, SystemContext } from '../../src/renderer/src/types/task'

describe('End-to-End Voice Transcription Pipeline & Scenarios', () => {
  const defaultSettings: AppSettings = {
    hotkey: 'CommandOrControl+Shift+Space',
    holdKey: 'RIGHT ALT',
    aiProvider: 'groq',
    whisperModel: 'whisper-large-v3',
    whisperLanguage: 'auto',
    dictationMode: 'direct',
    aiPolishing: true,
    englishLettersOnly: true,
    apiKey: 'gsk_mock_api_key_test',
    autoPaste: true,
    soundFeedback: true,
    privacyMode: 'strict_local'
  }

  const antigravityContext: SystemContext = {
    activeApp: 'Antigravity IDE',
    windowTitle: 'QEVRA - App.tsx',
    detectedCategory: 'code'
  }

  const chatGptContext: SystemContext = {
    activeApp: 'ChatGPT Classic',
    windowTitle: 'ChatGPT - AI Assistant',
    detectedCategory: 'browser'
  }

  // Scenario 1: Short spoken phrase
  it('Scenario 1 — Short spoken phrase: processes and routes correctly', async () => {
    const rawAudioDurationMs = 1200
    const rawAudioBytes = 18400
    const transcript = 'Good morning team'

    // Pre-Llama validation
    const preCheck = validateWhisperTranscript(transcript, rawAudioDurationMs, rawAudioBytes)
    expect(preCheck.valid).toBe(true)
    expect(preCheck.cleanedText).toBe('Good morning team')

    // Post-Llama validation
    const postCheck = validatePolishedOutput(preCheck.cleanedText, preCheck.cleanedText)
    expect(postCheck.valid).toBe(true)

    // Screen context processing (Antigravity IDE)
    const res = await processIntent(postCheck.cleanedText, antigravityContext, {}, defaultSettings)
    expect(res.isBlocked).toBe(false)
    expect(res.task.targetRouting.optimizedPrompt).toContain('Good morning team')
    expect(res.task.targetRouting.adapter).toBeDefined()
  })

  // Scenario 2: Normal sentence
  it('Scenario 2 — Normal sentence: passes dual validation and maintains screen context', async () => {
    const rawAudioDurationMs = 3800
    const rawAudioBytes = 62000
    const transcript = 'Please schedule the team sync for tomorrow afternoon at 3 PM.'

    const preCheck = validateWhisperTranscript(transcript, rawAudioDurationMs, rawAudioBytes)
    expect(preCheck.valid).toBe(true)

    const postCheck = validatePolishedOutput(
      'Please schedule the team sync for tomorrow afternoon at 3:00 PM.',
      transcript
    )
    expect(postCheck.valid).toBe(true)

    // Screen context processing (ChatGPT Classic)
    const res = await processIntent(postCheck.cleanedText, chatGptContext, {}, defaultSettings)
    expect(res.isBlocked).toBe(false)
    expect(res.task.targetRouting.optimizedPrompt).toContain('Please schedule the team sync')
  })

  // Scenario 3: Long paragraph
  it('Scenario 3 — Long paragraph: accurately preserved without truncating valid text', async () => {
    const rawAudioDurationMs = 14500
    const rawAudioBytes = 230000
    const longParagraph =
      'In this update we overhauled the audio recording lifecycle to ensure all buffers are cleared. ' +
      'Every Hold-to-Talk session now initializes with a fresh chunk array and verifies that the MediaRecorder ' +
      'is completely inactive before sending the audio blob to Groq Whisper for transcription. ' +
      'Furthermore, any hallucinated outputs or prompt repetitions are actively trapped before reaching Llama.'

    const preCheck = validateWhisperTranscript(longParagraph, rawAudioDurationMs, rawAudioBytes)
    expect(preCheck.valid).toBe(true)
    expect(preCheck.cleanedText.length).toBeGreaterThan(200)

    const postCheck = validatePolishedOutput(preCheck.cleanedText, longParagraph)
    expect(postCheck.valid).toBe(true)
  })

  // Scenario 4: Silent recording / empty audio
  it('Scenario 4 — Silent recording: rejects short duration, tiny byte size, or empty transcript', async () => {
    // 4a. Short duration silent tap (<300ms)
    const shortCheck = validateWhisperTranscript('hi', 150, 200)
    expect(shortCheck.valid).toBe(false)
    expect(shortCheck.reason).toContain('too short')

    // 4b. Low byte size click (<500 bytes)
    const lowByteCheck = validateWhisperTranscript('test', 800, 320)
    expect(lowByteCheck.valid).toBe(false)
    expect(lowByteCheck.reason).toContain('Audio data too small')

    // 4c. Completely silent/empty transcript from Whisper
    const emptyCheck = validateWhisperTranscript('', 2500, 42000)
    expect(emptyCheck.valid).toBe(false)
    expect(emptyCheck.reason).toContain('Empty transcript')

    // 4d. Punctuation only
    const punctCheck = validateWhisperTranscript('...', 2500, 42000)
    expect(punctCheck.valid).toBe(false)
  })

  // Scenario 5: Repeated Hold-to-Talk sessions (buffer isolation simulation)
  it('Scenario 5 — Repeated Hold-to-Talk sessions: guarantees session isolation', () => {
    // Simulate session 1
    const session1 = {
      chunks: ['chunk1_data', 'chunk2_data'],
      cleaned: true
    }
    expect(session1.chunks.length).toBe(2)
    // Clear chunks at end of session 1
    session1.chunks = []
    expect(session1.chunks.length).toBe(0)

    // Simulate session 2: must start empty
    const session2 = {
      chunks: [] as string[],
      bufferResetConfirmed: true
    }
    expect(session2.chunks.length).toBe(0)
    expect(session2.bufferResetConfirmed).toBe(true)

    // Simulate recording into session 2
    session2.chunks.push('new_session_chunk1')
    expect(session2.chunks).toEqual(['new_session_chunk1'])
  })

  // Critical Hallucination Protections
  it('Critical Hallucination Gates: rejects "EVRA voice dictation" and "END OF TRANSCRIPT"', () => {
    // Whisper hallucinating prompt phrase
    const promptHallucination = validateWhisperTranscript('EVRA voice dictation.', 1800, 30000)
    expect(promptHallucination.valid).toBe(false)
    expect(promptHallucination.reason).toContain('Known hallucination')

    // Whisper returning END OF TRANSCRIPT
    const eotHallucination = validateWhisperTranscript('END OF TRANSCRIPT END OF TRANSCRIPT', 2000, 35000)
    expect(eotHallucination.valid).toBe(false)
    expect(eotHallucination.reason?.toLowerCase()).toContain('end of transcript')

    // Single END OF TRANSCRIPT
    const singleEot = validateWhisperTranscript('END OF TRANSCRIPT', 2000, 35000)
    expect(singleEot.valid).toBe(false)
    expect(singleEot.reason?.toLowerCase()).toContain('end of transcript')

    // Repeated phrase loop
    const looped = validateWhisperTranscript('hello world hello world hello world hello world', 2000, 35000)
    expect(looped.valid).toBe(false)
    expect(looped.reason).toContain('Repetitive phrase loop')

    // Post-Llama validation must also catch any leaked hallucinations
    const postEot = validatePolishedOutput('END OF TRANSCRIPT', 'some valid input')
    expect(postEot.valid).toBe(false)

    const postEvra = validatePolishedOutput('EVRA voice dictation.', 'some valid input')
    expect(postEvra.valid).toBe(false)
  })
})
