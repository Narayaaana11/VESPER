import { SystemContext, UniversalTaskObject } from '../../types/task'
import { IntentClassificationResult } from '../intent-classifier'
import { AIProvider, ExtractedRequirements, AmbiguityReport, ActionPlan } from './ai-types'
import { RuleBasedProvider } from './rule-provider'
import { polishWithOllama } from '../groq-service'

export class LocalModelProvider implements AIProvider {
  public id = 'local'
  public name = 'Local LLM (Ollama)'
  private endpoint: string
  private model: string
  private fallback: RuleBasedProvider

  constructor(endpoint = 'http://localhost:11434', model = 'llama3.2') {
    this.endpoint = endpoint
    this.model = model
    this.fallback = new RuleBasedProvider()
  }

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.endpoint}/api/tags`, { method: 'GET', signal: AbortSignal.timeout(1000) })
      return res.ok
    } catch {
      return false
    }
  }

  public async generate(prompt: string, context?: SystemContext): Promise<string> {
    const isOnline = await this.isAvailable()
    if (!isOnline) {
      return this.fallback.generate(prompt)
    }

    try {
      const polished = await polishWithOllama(
        prompt,
        context || { activeApp: 'Desktop', windowTitle: '', detectedCategory: 'general' },
        this.endpoint,
        this.model
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
