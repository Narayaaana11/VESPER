import { SystemContext } from '../types/task'

export interface TransformResult {
  isTransform: boolean
  originalText?: string
  transformedText?: string
  explanation?: string
}

/**
 * QEVRA In-Place Selection Transformer ("Edit Mode" inspired by FreeFlow)
 * Detects when speech targets highlighted text in the active window and replaces it in-place.
 */
export class SelectionTransformer {
  private static TRANSFORM_PATTERNS = [
    /^(make this|make it)\s+(more\s+)?(concise|professional|casual|friendly|shorter|longer|clearer|polite|formal)/i,
    /^(rewrite|rephrase|paraphrase)\s+(this|it)/i,
    /^(shorten|summarize|condense|expand)\s+(this|it)/i,
    /^(fix|correct)\s+(the\s+)?(grammar|spelling|typos|punctuation)/i,
    /^(proofread)\s+(this|it)?/i,
    /^(translate)\s+(this|it)?\s*(in|into|to)\s+([a-zA-Z\s]+)/i,
    /^(convert|format)\s+(this|it)?\s*(in|into|to|as)\s+([a-zA-Z\s]+)/i,
    /^(add comments|document)\s+(this|it)/i
  ]

  /**
   * Checks whether the given speech and context qualify as an in-place selection transformation
   */
  public static isTransformCommand(speech: string, context: SystemContext): boolean {
    const text = speech.trim()
    const selection = (context.clipboardContent || '').trim()

    // Must have non-trivial selected/clipboard text present (at least 3 characters)
    if (!selection || selection.length < 3) {
      return false
    }

    return this.TRANSFORM_PATTERNS.some((pattern) => pattern.test(text))
  }

  /**
   * Transforms the selected text using an LLM or local deterministic rule
   */
  public static async transform(
    speech: string,
    context: SystemContext,
    apiKey = '',
    model = 'llama-3.3-70b-versatile'
  ): Promise<TransformResult> {
    const selection = (context.clipboardContent || '').trim()
    if (!selection) {
      return { isTransform: false }
    }

    // 1. If Groq API Key is available, use fast LPU LLM transformation
    if (apiKey && apiKey.trim()) {
      const candidateModels = [model, 'llama-3.1-8b-instant'].filter((m, idx, arr) => arr.indexOf(m) === idx)
      for (const candidate of candidateModels) {
        try {
          const systemPrompt = `You are QEVRA's precision in-place text transformation engine (Edit Mode).
Your task is to transform the user's selected text according to their spoken instruction.
CRITICAL RULES:
1. Apply the user's edit or translation accurately.
2. Output ONLY the replacement text.
3. DO NOT include any conversational filler, explanations, markdown quotes, or notes.
4. Preserve the formatting and casing structure where appropriate.`

          const userPrompt = `SELECTED TEXT:
"""
${selection}
"""

INSTRUCTION:
${speech.trim()}

TRANSFORMED REPLACEMENT:`

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
              model: candidate,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.1,
              max_tokens: 2048
            })
          })

          if (response.ok) {
            const data = await response.json()
            const transformed = data.choices?.[0]?.message?.content?.trim()
            if (transformed) {
              return {
                isTransform: true,
                originalText: selection,
                transformedText: transformed,
                explanation: `Transformed selection in ${context.activeApp}: "${speech.trim()}"`
              }
            }
          } else if (response.status === 404 || response.status === 429) {
            continue
          }
        } catch (err: any) {
          console.warn(`[SelectionTransformer] Groq transform error with ${candidate}:`, err)
          if (err?.name === 'TypeError' || err?.message?.includes('fetch')) {
            break
          }
        }
      }
    }

    // 2. Local Deterministic Transformations (Rule-based fallback)
    const lower = speech.toLowerCase().trim()
    let localTransformed = selection

    if (lower.includes('uppercase') || lower.includes('all caps')) {
      localTransformed = selection.toUpperCase()
    } else if (lower.includes('lowercase')) {
      localTransformed = selection.toLowerCase()
    } else if (lower.includes('bullet points') || lower.includes('bullets')) {
      localTransformed = selection
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => (line.startsWith('-') || line.startsWith('•') ? line : `- ${line}`))
        .join('\n')
    } else if (lower.includes('json')) {
      try {
        localTransformed = JSON.stringify(JSON.parse(selection), null, 2)
      } catch {
        localTransformed = JSON.stringify({ text: selection }, null, 2)
      }
    } else if (lower.includes('shorter') || lower.includes('concise')) {
      localTransformed = selection
        .replace(/\b(repeatedly|very|really|basically|literally|actually|please|kindly|in order to)\b/gi, '')
        .replace(/\band make it responsive\b/gi, 'and responsive')
        .replace(/\s+/g, ' ')
        .trim()
      const sentences = localTransformed.split(/(?<=[.?!])\s+/).filter(Boolean)
      const uniqueSentences = Array.from(new Set(sentences))
      if (uniqueSentences.length < sentences.length) {
        localTransformed = uniqueSentences.join(' ')
      }
    }

    return {
      isTransform: true,
      originalText: selection,
      transformedText: localTransformed,
      explanation: `Transformed selection in ${context.activeApp}`
    }
  }
}
