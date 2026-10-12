import { AppSettings } from '../../types/task'
import { AIProvider } from './ai-types'
import { GroqProvider } from './groq-provider'
import { LocalModelProvider } from './local-provider'
import { RuleBasedProvider } from './rule-provider'
import { GeminiProvider } from './gemini-provider'

export class AIFactory {
  private static cachedProvider: AIProvider | null = null
  private static lastProviderKey: string = ''

  public static getProvider(settings: Partial<AppSettings>): AIProvider {
    const providerType = settings.aiProvider || 'groq'
    const apiKey = settings.apiKey || ''
    const endpoint = settings.ollamaEndpoint || 'http://localhost:11434'
    const model = settings.ollamaModel || 'llama3.2'

    const cacheKey = `${providerType}_${apiKey}_${endpoint}_${model}`

    if (this.cachedProvider && this.lastProviderKey === cacheKey) {
      return this.cachedProvider
    }

    let provider: AIProvider

    if (providerType === 'local' || providerType === 'ollama') {
      provider = new LocalModelProvider(endpoint, model)
    } else if (providerType === 'groq') {
      provider = new GroqProvider(apiKey)
    } else if (providerType === 'gemini') {
      provider = new GeminiProvider(apiKey)
    } else {
      provider = new RuleBasedProvider()
    }

    this.cachedProvider = provider
    this.lastProviderKey = cacheKey
    return provider
  }
}
