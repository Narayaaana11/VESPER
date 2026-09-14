export interface ValidationResult {
  isValid: boolean
  valid: boolean
  reason?: string
  cleanedText?: string
}

// Known hallucination phrases frequently produced by Whisper on low energy or silent audio
const KNOWN_HALLUCINATIONS = [
  'evra voice dictation',
  'qevra voice dictation',
  'voice dictation',
  'english alphabet',
  'end of transcript',
  'subtitles by',
  'translated by',
  'transcribed by',
  'amara.org',
  'thank you for watching',
  'thanks for watching',
  'please subscribe',
  'like and subscribe',
  'watching',
  'thank you. bye.',
  'bye bye'
]

/**
 * Strips trailing Whisper silence artifacts (e.g. "Thank you. Thank you", "I'm going to go ahead and", etc.)
 */
export function cleanTrailingHallucinations(raw: string): string {
  let text = (raw || '').trim()

  const trailingPatterns = [
    /(\n+|\s+)*(thank you[.\s!?,]*)+$/i,
    /(\n+|\s+)*(thanks[.\s!?,]*)+$/i,
    /(\n+|\s+)*(thank you very much[.\s!?,]*)+$/i,
    /(\n+|\s+)*(thanks for watching[.\s!?,]*)+$/i,
    /(\n+|\s+)*(thank you for watching[.\s!?,]*)+$/i,
    /(\n+|\s+)*(i'm going to go ahead and[.\s!?,]*)+$/i,
    /(\n+|\s+)*(i am going to go ahead and[.\s!?,]*)+$/i,
    /(\n+|\s+)*(going to go ahead and[.\s!?,]*)+$/i,
    /(\n+|\s+)*(so yeah[.\s!?,]*)+$/i,
    /(\n+|\s+)*(bye bye[.\s!]*)+$/i,
    /(\n+|\s+)*(please subscribe[.\s!]*)+$/i,
    /(\n+|\s+)*(like and subscribe[.\s!]*)+$/i
  ]

  let modified = true
  while (modified) {
    modified = false
    for (const pattern of trailingPatterns) {
      if (pattern.test(text)) {
        const stripped = text.replace(pattern, '').trim()
        if (stripped !== text) {
          text = stripped
          modified = true
        }
      }
    }
  }

  return text
}

/**
 * Validates raw transcript returned by Groq Whisper BEFORE sending to Llama
 */
export function validateWhisperTranscript(
  rawTranscript: string,
  audioDurationMs?: number,
  audioByteSize?: number
): ValidationResult {
  const raw = (rawTranscript || '').trim()

  // 1. Reject empty or whitespace-only
  if (!raw) {
    return { isValid: false, valid: false, reason: 'Empty transcript' }
  }

  // 2. Reject extremely short or zero-audio recordings
  if (audioDurationMs !== undefined && audioDurationMs < 300) {
    return { isValid: false, valid: false, reason: `Recording too short (${audioDurationMs}ms)` }
  }
  if (audioByteSize !== undefined && audioByteSize < 500) {
    return { isValid: false, valid: false, reason: `Audio data too small (${audioByteSize} bytes)` }
  }

  // 3. Reject pure punctuation (e.g. ".", "...", "!", "?")
  if (/^[.,!?:;'"\-_~`\s]+$/.test(raw)) {
    return { isValid: false, valid: false, reason: 'Transcript contains only punctuation' }
  }

  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

  // 4. Detect repeated or isolated "END OF TRANSCRIPT" first
  if (normalized.includes('end of transcript')) {
    return { isValid: false, valid: false, reason: 'Hallucinated "END OF TRANSCRIPT" detected' }
  }

  // 5. Detect known hallucination phrases
  for (const phrase of KNOWN_HALLUCINATIONS) {
    if (normalized === phrase || normalized.startsWith(phrase + ' ') || normalized.endsWith(' ' + phrase)) {
      return { isValid: false, valid: false, reason: `Known hallucination phrase detected: "${phrase}"` }
    }
  }

  // 6. Strip trailing silence artifacts (e.g. "Thank you. Thank you" or "I'm going to go ahead and")
  const text = cleanTrailingHallucinations(raw)
  if (!text) {
    return { isValid: false, valid: false, reason: 'Transcript only contained trailing silence filler' }
  }

  const cleanedNormalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

  // 7. Detect repetitive loops (e.g. "word word word" or "phrase phrase phrase")
  const phraseRepetition = /\b([a-z0-9]+(?:\s+[a-z0-9]+){0,4})\s+\1\s+\1\b/i
  if (phraseRepetition.test(cleanedNormalized)) {
    return { isValid: false, valid: false, reason: 'Repetitive phrase loop detected' }
  }

  // Check single word repeated 4+ times consecutively
  const wordRepetition = /\b([a-z0-9]+)(\s+\1){3,}\b/i
  if (wordRepetition.test(cleanedNormalized)) {
    return { isValid: false, valid: false, reason: 'Runaway word repetition detected' }
  }

  return { isValid: true, valid: true, cleanedText: text }
}

/**
 * Validates output AFTER Llama polishing BEFORE pasting into active application
 */
export function validatePolishedOutput(
  polishedText: string,
  originalTranscript: string
): ValidationResult {
  const raw = (polishedText || '').trim()

  // 1. Reject empty
  if (!raw) {
    return { isValid: false, valid: false, reason: 'Polished text is empty' }
  }

  const lower = raw.toLowerCase()

  // 2. Trailing/contained END OF TRANSCRIPT
  if (lower.includes('end of transcript')) {
    return { isValid: false, valid: false, reason: 'Hallucinated token in polished output' }
  }

  // 3. Reject conversational AI preamble or refusals
  const forbiddenPreamble = [
    'i cannot',
    'as an ai',
    'as a language model',
    'here is the polished',
    'here is the transcript',
    'polished transcript:'
  ]

  for (const phrase of forbiddenPreamble) {
    if (lower.startsWith(phrase)) {
      return { isValid: false, valid: false, reason: `AI preamble/refusal detected: "${phrase}"` }
    }
  }

  // 4. If polished text is completely corrupted or contains known hallucinations
  for (const phrase of KNOWN_HALLUCINATIONS) {
    const normalized = lower.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
    if (normalized === phrase || normalized.startsWith(phrase + ' ') || normalized.endsWith(' ' + phrase)) {
      return { isValid: false, valid: false, reason: `Known hallucination phrase detected in polished output: "${phrase}"` }
    }
  }

  // 5. Clean trailing silence hallucinations from polished text
  const text = cleanTrailingHallucinations(raw)
  if (!text) {
    return { isValid: false, valid: false, reason: 'Polished text only contained trailing silence filler' }
  }

  // 6. Reject repetitive loops in polished output
  const wordRepetition = /\b([a-z0-9]+)(\s+\1){3,}\b/i
  if (wordRepetition.test(text.toLowerCase())) {
    return { isValid: false, valid: false, reason: 'Repetitive loop in polished output' }
  }

  return { isValid: true, valid: true, cleanedText: text }
}
