import { SystemContext, UniversalTaskObject } from '../../types/task'
import { IntentClassificationResult } from '../intent-classifier'
import { AIProvider, ExtractedRequirements, AmbiguityReport, ActionPlan } from './ai-types'
import { RuleBasedProvider } from './rule-provider'
import { TokenUsageService } from '../token-usage-service'

/**
 * GeminiProvider
 * Integrates Google AI Studio Free Tier (from free-for.dev)
 * Model: gemini-1.5-flash / gemini-2.0-flash (15 RPM, 1,500 RPD, 1M TPM free tier)
 */
export class GeminiProvider implements AIProvider {
  public id = 'gemini'
  public name = 'Google AI Studio (Gemini 1.5 Flash - Free Tier)'
  private apiKey: string
  private model: string
  private fallback: RuleBasedProvider

  constructor(apiKey = '', model = 'gemini-1.5-flash') {
    this.apiKey = apiKey.trim()
    this.model = model
    this.fallback = new RuleBasedProvider()
  }

  public setApiKey(key: string): void {
    this.apiKey = key.trim()
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.length > 0
  }

  public async generate(prompt: string, context?: SystemContext): Promise<string> {
    if (!this.apiKey) {
      return this.fallback.generate(prompt)
    }

    const appName = context?.activeApp || 'Desktop'
    const systemPrompt = `You are VESPER's Neural Dictation Engine. The user is dictating speech intended for the target application: "${appName}". 
Convert raw speech into clean, polished, punctuation-perfect text matching the tone of the active application.
Do not add conversational fluff, chit-chat, quotes, or preambles. Output ONLY the polished text.`

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      })

      if (!response.ok) {
        console.warn(`[GeminiProvider] Google AI Studio API error (${response.status}):`, await response.text().catch(() => ''))
        return this.fallback.polish(prompt, context)
      }

      const data = await response.json()
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      // Track token usage from Google AI Studio usageMetadata
      if (data.usageMetadata) {
        const promptTokens = data.usageMetadata.promptTokenCount ?? 0
        const completionTokens = data.usageMetadata.candidatesTokenCount ?? 0
        const totalTokens = data.usageMetadata.totalTokenCount ?? (promptTokens + completionTokens)

        TokenUsageService.recordUsage({
          model: this.model,
          provider: 'gemini',
          promptTokens,
          completionTokens,
          totalTokens,
          targetApp: appName
        })
      }

      return candidateText || prompt
    } catch (err) {
      console.warn('[GeminiProvider] Network/execution error, falling back to local rule engine:', err)
      return this.fallback.polish(prompt, context)
    }
  }

  public async classify(
    speech: string,
    context: SystemContext
  ): Promise<IntentClassificationResult> {
    return this.fallback.classify(speech, context)
  }

  public async extractRequirements(
    speech: string,
    context?: SystemContext
  ): Promise<ExtractedRequirements> {
    return this.fallback.extractRequirements(speech, context)
  }

  public async detectAmbiguity(
    speech: string,
    req: ExtractedRequirements
  ): Promise<AmbiguityReport> {
    return this.fallback.detectAmbiguity(speech, req)
  }

  public async planTask(task: UniversalTaskObject): Promise<ActionPlan> {
    return this.fallback.planTask(task)
  }
}
