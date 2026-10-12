import { SystemContext, UniversalTaskObject } from '../../types/task'
import { IntentClassificationResult } from '../intent-classifier'
import { AIProvider, ExtractedRequirements, AmbiguityReport, ActionPlan } from './ai-types'
import { RuleBasedProvider } from './rule-provider'
import { polishWithGroqLlama } from '../groq-service'

export class GroqProvider implements AIProvider {
  public id = 'groq'
  public name = 'Groq Cloud LLM (Llama 3.3)'
  private apiKey: string
  private fallback: RuleBasedProvider

  constructor(apiKey = '') {
    this.apiKey = apiKey
    this.fallback = new RuleBasedProvider()
  }

  public setApiKey(key: string): void {
    this.apiKey = key
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.apiKey && this.apiKey.trim().length > 0
  }

  public async generate(prompt: string, context?: SystemContext): Promise<string> {
    if (!this.apiKey) return this.fallback.generate(prompt)

    try {
      const polished = await polishWithGroqLlama(
        prompt,
        context || { activeApp: 'Desktop', windowTitle: '', detectedCategory: 'general' },
        this.apiKey
      )
      return polished || prompt
    } catch {
      return prompt
    }
  }

  public async classify(
    speech: string,
    context: SystemContext
  ): Promise<IntentClassificationResult> {
    // Zero-latency deterministic classifier with LLM fallback
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
