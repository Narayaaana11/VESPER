import { SystemContext } from '../types/task'

export interface GroqTranscriptionOptions {
  model?: 'whisper-large-v3' | 'whisper-large-v3-turbo'
  language?: string
  prompt?: string
  temperature?: number
  translateToEnglish?: boolean
}

/**
 * High-accuracy, low-latency audio transcription & translation using Groq Cloud Whisper
 */
export async function transcribeWithGroq(
  audioBlob: Blob,
  apiKey: string,
  options: GroqTranscriptionOptions = {}
): Promise<{ text: string; error?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { text: '', error: 'Groq API key not provided.' }
  }

  const model = options.model || 'whisper-large-v3'
  const prompt = (options.prompt || '').trim()
  const temperature = options.temperature ?? 0.0

  const formData = new FormData()
  formData.append('file', audioBlob, 'audio.webm')
  formData.append('model', model)
  if (prompt) {
    formData.append('prompt', prompt)
  }
  formData.append('temperature', temperature.toString())
  formData.append('response_format', 'json')

  // When translating to English, endpoint is /translations; otherwise /transcriptions
  const endpoint = options.translateToEnglish
    ? 'https://api.groq.com/openai/v1/audio/translations'
    : 'https://api.groq.com/openai/v1/audio/transcriptions'

  if (!options.translateToEnglish && options.language && options.language !== 'auto') {
    formData.append('language', options.language)
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: formData,
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errBody = await response.text().catch(() => '')
        console.warn(`[QEVRA Groq STT] Request failed on ${endpoint}: ${response.status} ${response.statusText}`, errBody)
        if (attempt === 1 && (response.status >= 500 || response.status === 429)) {
          await new Promise((r) => setTimeout(r, 600))
          continue
        }
        return { text: '', error: `Groq Whisper error (${response.status}): ${response.statusText}` }
      }

      const data = await response.json()
      const text = (data.text || '').trim()
      return { text }
    } catch (err: any) {
      clearTimeout(timeoutId)
      if (attempt === 1 && (err?.name === 'AbortError' || err?.message?.includes('fetch'))) {
        console.warn('[QEVRA Groq STT] Network glitch detected. Retrying transcription once...', err)
        await new Promise((r) => setTimeout(r, 600))
        continue
      }
      console.error('[QEVRA Groq STT] Network / fetch error:', err)
      return { text: '', error: err?.message || 'Network error connecting to Groq STT' }
    }
  }

  return { text: '', error: 'Transcription request failed after retry' }
}

/**
 * Ultra-fast Llama 3.3 70B dictation post-processor (Wispr Flow style)
 * Removes filler words, fixes phonetic mishearings, and applies natural punctuation.
 */
export async function polishWithGroqLlama(
  rawTranscript: string,
  context: SystemContext,
  apiKey: string,
  model = 'llama-3.3-70b-versatile',
  englishLettersOnly = true
): Promise<string> {
  if (!apiKey || !rawTranscript.trim()) {
    return rawTranscript.trim()
  }

  const contextDetails = [
    context.activeApp ? `Active Target Application: ${context.activeApp}` : null,
    context.windowTitle ? `Active Window / File Title: ${context.windowTitle}` : null,
    context.detectedCategory ? `Context Domain: ${context.detectedCategory}` : null,
    context.clipboardContent ? `Relevant Active Context / Selection:\n"""\n${context.clipboardContent.slice(0, 500)}\n"""` : null
  ].filter(Boolean).join('\n')

  const multilingualRule = englishLettersOnly
    ? `\n4. MULTILINGUAL SUPPORT & STRICT ENGLISH LETTERS (A-Z) RULE:
   - Detect and support ALL spoken languages (Hindi, Spanish, Telugu, Tamil, French, German, Arabic, Japanese, Chinese, Russian, Hinglish, etc.).
   - ALWAYS output strictly in English letters (Latin alphabet A-Z).
   - If the user speaks in another language or mixed language, translate and clarify into natural, fluent English using English letters.
   - If technical or code terms are spoken, preserve them cleanly in English letters.
   - STRICT PROHIBITION: NEVER output non-Latin scripts (strictly NO Devanagari, Arabic script, Cyrillic, Chinese/Japanese characters). Every character in the output MUST be in standard English letters (A-Z, a-z), numbers, and standard punctuation.`
    : ''

  const systemInstruction = `You are QEVRA's real-time speech dictation post-processor, exactly like Wispr Flow.
Your job:
1. Observe the user's active screen and application context:
${contextDetails || 'Active window: Desktop'}

2. Based on the open window and context above, improve and clarify the user's spoken audio transcript:
   - Fix phonetic transcription inaccuracies and technical terms according to the open app/code/document.
   - Punctuate, capitalize, and format cleanly and naturally.
   - Remove verbal filler words (um, uh, you know, like, I mean, kind of, sort of) unless intentional.
   - Resolve real-time self-corrections gracefully (e.g. "create a blue button no wait a dark indigo button" -> "create a dark indigo button"; "meeting at three actually four PM" -> "meeting at 4:00 PM").
   - Format numbers, currencies, dates, and times naturally (e.g. "$500", "October 24th", "10:30 AM").
   - Format code identifiers and commands accurately if in a coding environment (e.g. "camelCase", "snake_case", "npm run dev", "git commit", "const", "async/await").
3. CRITICAL RULES:
   - Preserve the EXACT intended meaning and spoken language context.
   - DO NOT answer the user or act as a conversational assistant.
   - DO NOT generate code, boilerplate, or explanations unless the user explicitly dictated it.
   - DO NOT change what the user said or substitute words unnecessarily.
   - DO NOT add markdown quotes, backticks, or conversational preamble.
   - STRIP SILENCE & TRAILING HALLUCINATIONS: Trailing silence in Whisper often produces hallucinated subtitle fragments such as "Thank you.", "Thank you. Thank you", "Thanks for watching", or muttered unfinished tails like "I'm going to go ahead and.". Strip these completely if they are not part of the primary dictated sentence.
   - Output ONLY the polished transcript text ready to be inserted directly at the user's cursor.${multilingualRule}`

  // Try preferred model first, then fallback to fast 8B model if 404
  const candidateModels = [
    model,
    'llama-3.1-8b-instant'
  ].filter((m, idx, arr) => arr.indexOf(m) === idx)

  for (const candidate of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: candidate,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: rawTranscript }
          ],
          temperature: 0.1,
          max_tokens: 1024
        })
      })

      if (response.ok) {
        const data = await response.json()
        const polished = data.choices?.[0]?.message?.content?.trim()
        if (polished) return polished
      } else if (response.status === 404) {
        // Model not available on this tier, try next candidate
        continue
      } else {
        console.warn(`[QEVRA Groq LLM] Polishing request failed on ${candidate}: ${response.status}`)
      }
    } catch (err: any) {
      console.warn(`[QEVRA Groq LLM] Network error with ${candidate}:`, err)
      // If network itself is down, abort fallback loop immediately to prevent freezing UI
      if (err?.name === 'TypeError' || err?.message?.includes('fetch')) {
        break
      }
    }
  }

  return rawTranscript.trim()
}

/**
 * Local LLM dictation polisher via Ollama (e.g. Llama 3.2 / Qwen 2.5)
 */
export async function polishWithOllama(
  rawTranscript: string,
  context: SystemContext,
  endpoint = 'http://localhost:11434',
  model = 'llama3.2',
  englishLettersOnly = true
): Promise<string | null> {
  if (!rawTranscript.trim()) return rawTranscript.trim()

  const contextDetails = [
    context.activeApp ? `Active Target Application: ${context.activeApp}` : null,
    context.windowTitle ? `Active Window / File Title: ${context.windowTitle}` : null,
    context.detectedCategory ? `Context Domain: ${context.detectedCategory}` : null,
    context.clipboardContent ? `Relevant Active Context / Selection:\n"""\n${context.clipboardContent.slice(0, 500)}\n"""` : null
  ].filter(Boolean).join('\n')

  const multilingualRule = englishLettersOnly
    ? `\n5. MULTILINGUAL SUPPORT & STRICT ENGLISH LETTERS (A-Z) RULE:
   - Detect and support ALL spoken languages (Hindi, Spanish, Telugu, Tamil, French, German, Arabic, Japanese, Chinese, Russian, Hinglish, etc.).
   - ALWAYS output strictly in English letters (Latin alphabet A-Z).
   - If the user speaks in another language, translate and clarify into natural, fluent English using English letters.
   - NEVER output non-Latin scripts (strictly NO Devanagari, Arabic script, Cyrillic, Chinese/Japanese characters). Every character in the output MUST be in standard English letters (A-Z, a-z), numbers, and standard punctuation.`
    : ''

  const systemInstruction = `You are QEVRA's real-time speech dictation post-processor, exactly like Wispr Flow.
Your job:
1. Observe the user's active screen context:
${contextDetails || 'Active window: Desktop'}

2. Improve and clarify the spoken audio transcript based on this context.
3. Clean filler words, fix phonetic errors, resolve self-corrections, and format punctuation and code tokens cleanly.
4. Output ONLY the polished transcript text. Do not answer or add conversational commentary.${multilingualRule}`

  try {
    const formattedUrl = `${endpoint.replace(/\/+$/, '')}/v1/chat/completions`
    const response = await fetch(formattedUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: rawTranscript }
        ],
        temperature: 0.1,
        max_tokens: 1024
      })
    })

    if (response.ok) {
      const data = await response.json()
      const text = data.choices?.[0]?.message?.content?.trim()
      if (text) return text
    }
  } catch (err) {
    console.warn('[QEVRA Local LLM] Ollama call error or offline:', err)
  }

  return null
}
