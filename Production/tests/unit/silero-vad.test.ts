import { describe, it, expect, vi } from 'vitest'
import { SileroVAD } from '../../src/renderer/src/core/silero-vad'

describe('Silero Voice Activity Detection (VAD) Engine', () => {
  it('initializes with default audio options', () => {
    const vad = new SileroVAD()
    expect(vad).toBeDefined()
    expect(vad.calculateProbability(new Float32Array(512))).toBe(0)
  })

  it('correctly scores pure silence as 0 probability', () => {
    const vad = new SileroVAD()
    const silenceFrame = new Float32Array(512).fill(0)
    const prob = vad.calculateProbability(silenceFrame)
    expect(prob).toBe(0)
  })

  it('detects voice-like frequencies with high probability (> 0.5)', () => {
    const vad = new SileroVAD({ speechThreshold: 0.5 })
    const voiceFrame = new Float32Array(512)
    // Generate synthetic 250Hz voice pitch waveform at 16kHz sampling rate
    for (let i = 0; i < 512; i++) {
      voiceFrame[i] = 0.08 * Math.sin((2 * Math.PI * 250 * i) / 16000)
    }

    const prob = vad.calculateProbability(voiceFrame)
    expect(prob).toBeGreaterThan(0.5)
  })

  it('penalizes high-frequency mechanical noise (e.g. keyboard clicks)', () => {
    const vad = new SileroVAD()
    const clickFrame = new Float32Array(512)
    // High frequency alternating noise (ZCR > 0.45)
    for (let i = 0; i < 512; i++) {
      clickFrame[i] = (i % 2 === 0 ? 0.025 : -0.025)
    }

    const prob = vad.calculateProbability(clickFrame)
    // Due to ZCR penalty (>0.45), click probability should be penalized
    expect(prob).toBeLessThan(0.4)
  })

  it('triggers onSpeechStart when sustained human voice is processed', () => {
    const vad = new SileroVAD({ speechThreshold: 0.5 })
    const onSpeechStart = vi.fn()
    const onSpeechEnd = vi.fn()

    vad.init({ onSpeechStart, onSpeechEnd })

    const voiceFrame = new Float32Array(512)
    for (let i = 0; i < 512; i++) {
      voiceFrame[i] = 0.08 * Math.sin((2 * Math.PI * 200 * i) / 16000)
    }

    // Process frame 1
    vad.processFrame(voiceFrame)
    // Process frame 2 (consecutive frames trigger onset)
    const res = vad.processFrame(voiceFrame)

    expect(res.isSpeaking).toBe(true)
    expect(onSpeechStart).toHaveBeenCalledTimes(1)
  })

  it('triggers onSpeechEnd after silence timeout is satisfied', () => {
    const vad = new SileroVAD({
      speechThreshold: 0.5,
      silenceThreshold: 0.3,
      silenceTimeoutMs: 100, // Short timeout for testing
      minSpeechDurationMs: 50
    })

    const onSpeechStart = vi.fn()
    const onSpeechEnd = vi.fn()

    vad.init({ onSpeechStart, onSpeechEnd })

    const voiceFrame = new Float32Array(512)
    for (let i = 0; i < 512; i++) {
      voiceFrame[i] = 0.08 * Math.sin((2 * Math.PI * 200 * i) / 16000)
    }

    // Trigger voice onset
    vad.processFrame(voiceFrame)
    vad.processFrame(voiceFrame)
    expect(onSpeechStart).toHaveBeenCalled()

    // Simulate passage of speech duration
    const silenceFrame = new Float32Array(512).fill(0)

    // First silence frame starts silence timer
    vad.processFrame(silenceFrame)

    // Advance time virtually by mocking Date.now or feeding silence after elapsed time
    const originalDateNow = Date.now
    try {
      const startTime = originalDateNow()
      // Mock time advance beyond silenceTimeoutMs + minSpeechDurationMs
      Date.now = () => startTime + 200

      vad.processFrame(silenceFrame)
      expect(onSpeechEnd).toHaveBeenCalledTimes(1)
    } finally {
      Date.now = originalDateNow
    }
  })

  it('resets and stops cleanly', () => {
    const vad = new SileroVAD()
    vad.init({ onSpeechStart: vi.fn(), onSpeechEnd: vi.fn() })
    vad.stop()

    const voiceFrame = new Float32Array(512).fill(0.08)
    const res = vad.processFrame(voiceFrame)
    expect(res.isSpeaking).toBe(false)
  })
})
