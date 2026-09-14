import { describe, it, expect } from 'vitest'
import { validateWhisperTranscript, validatePolishedOutput } from '../../src/renderer/src/core/transcription-validator'

describe('Transcription Validator (Pre-Llama & Post-Llama Gates)', () => {
  describe('validateWhisperTranscript (Pre-Llama)', () => {
    it('rejects empty and whitespace-only transcripts', () => {
      expect(validateWhisperTranscript('').isValid).toBe(false)
      expect(validateWhisperTranscript('   ').isValid).toBe(false)
      expect(validateWhisperTranscript('\n\t').isValid).toBe(false)
    })

    it('rejects sub-300ms recordings', () => {
      const res = validateWhisperTranscript('Hello world', 250, 5000)
      expect(res.isValid).toBe(false)
      expect(res.reason).toContain('too short')
    })

    it('rejects pure punctuation', () => {
      expect(validateWhisperTranscript('.').isValid).toBe(false)
      expect(validateWhisperTranscript('...').isValid).toBe(false)
      expect(validateWhisperTranscript('?!').isValid).toBe(false)
    })

    it('rejects Whisper hallucination "EVRA voice dictation."', () => {
      const res1 = validateWhisperTranscript('EVRA voice dictation.', 1500, 20000)
      expect(res1.isValid).toBe(false)
      expect(res1.reason).toContain('hallucination')

      const res2 = validateWhisperTranscript('QEVRA voice dictation', 1500, 20000)
      expect(res2.isValid).toBe(false)

      const res3 = validateWhisperTranscript('voice dictation.', 1500, 20000)
      expect(res3.isValid).toBe(false)
    })

    it('rejects repeated "END OF TRANSCRIPT"', () => {
      const res = validateWhisperTranscript('END OF TRANSCRIPT END OF TRANSCRIPT', 2000, 30000)
      expect(res.isValid).toBe(false)
      expect(res.reason?.toLowerCase()).toContain('end of transcript')
    })

    it('rejects runaway word repetition loops', () => {
      const res = validateWhisperTranscript('you you you you you', 1500, 20000)
      expect(res.isValid).toBe(false)
      expect(res.reason?.toLowerCase()).toContain('repetit')
    })

    it('rejects repeated phrase loops', () => {
      const res = validateWhisperTranscript('thank you so much thank you so much thank you so much', 3000, 40000)
      expect(res.isValid).toBe(false)
      expect(res.reason?.toLowerCase()).toContain('repetit')
    })

    it('accepts genuine short phrase', () => {
      const res = validateWhisperTranscript('Good morning team', 1200, 15000)
      expect(res.isValid).toBe(true)
      expect(res.cleanedText).toBe('Good morning team')
    })

    it('accepts genuine normal sentence', () => {
      const res = validateWhisperTranscript('Please review the pull request before our standup meeting.', 2500, 35000)
      expect(res.isValid).toBe(true)
    })

    it('accepts genuine long paragraph', () => {
      const speech = 'We are finalizing the implementation of our universal voice intent engine. All tests pass with flying colors and the UI remains responsive and compact.'
      const res = validateWhisperTranscript(speech, 8000, 95000)
      expect(res.isValid).toBe(true)
    })
    it('strips trailing Whisper silence hallucinations like "Thank you.Thank you" and "I\'m going to go ahead and"', () => {
      const noisyTranscript = `Please send the updated roadmap to the team by 4 pm today.

I'm going to go ahead and.
Thank you.Thank you.`

      const res = validateWhisperTranscript(noisyTranscript, 4000, 65000)
      expect(res.isValid).toBe(true)
      expect(res.cleanedText).toBe('Please send the updated roadmap to the team by 4 pm today.')
    })
  })

  describe('validatePolishedOutput (Post-Llama)', () => {
    it('rejects empty output', () => {
      expect(validatePolishedOutput('', 'Hello').isValid).toBe(false)
      expect(validatePolishedOutput('   ', 'Hello').isValid).toBe(false)
    })

    it('strips trailing Whisper hallucinations in polished output', () => {
      const polished = 'Please send the updated roadmap to the team by 4:00 PM today.\n\nThank you. Thank you.'
      const res = validatePolishedOutput(polished, 'Please send the updated roadmap')
      expect(res.isValid).toBe(true)
      expect(res.cleanedText).toBe('Please send the updated roadmap to the team by 4:00 PM today.')
    })

    it('rejects AI conversational refusals and preambles', () => {
      const res1 = validatePolishedOutput('I cannot fulfill this request.', 'Hello')
      expect(res1.isValid).toBe(false)

      const res2 = validatePolishedOutput('As an AI language model, I recommend...', 'Hello')
      expect(res2.isValid).toBe(false)

      const res3 = validatePolishedOutput('Here is the polished transcript: Good morning', 'Good morning')
      expect(res3.isValid).toBe(false)
    })

    it('rejects hallucinated END OF TRANSCRIPT in polished output', () => {
      const res = validatePolishedOutput('Everything is done. END OF TRANSCRIPT', 'Done')
      expect(res.isValid).toBe(false)
    })

    it('accepts valid polished text', () => {
      const res = validatePolishedOutput('Good morning, team. We are ready to launch.', 'good morning team we are ready to launch')
      expect(res.isValid).toBe(true)
      expect(res.cleanedText).toBe('Good morning, team. We are ready to launch.')
    })
  })
})
