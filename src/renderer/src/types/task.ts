export interface SystemContext {
  activeApp: string
  windowTitle: string
  clipboardContent?: string
  detectedCategory: 'code' | 'communication' | 'browser' | 'document' | 'general'
}

export interface DisambiguationQuestion {
  id: string
  question: string
  options: {
    key: string // '1', '2', '3', '4'
    label: string
    value: string
    isRecommended?: boolean
  }[]
}

export interface UniversalTaskObject {
  taskId: string
  timestamp: string
  source: {
    rawSpeech: string
    sttConfidence: number
  }
  context: SystemContext
  intent: {
    domain: 'coding' | 'communication' | 'research' | 'document' | 'system'
    category: string
    action: string
  }
  specifications: {
    requirements: string[]
    tone?: string
    technology?: string[]
    styling?: string[]
    constraints?: string[]
  }
  targetRouting: {
    adapter:
      | 'antigravity_composer'
      | 'cursor_composer'
      | 'vscode'
      | 'gmail'
      | 'slack'
      | 'chatgpt'
      | 'claude'
      | 'browser'
      | 'clipboard'
      | 'terminal_and_ide'
      | 'direct_dictation'
      | 'file_explorer'
      | 'plaintext'
      | 'universal_input'
    deliveryMethod: 'paste' | 'clipboard'
    optimizedPrompt: string
    explanation: string
  }
  security: {
    riskLevel: 'low' | 'medium' | 'high'
    requiresUserConfirmation: boolean
  }
  interactionType?: 'dictation' | 'query' | 'task'
  queryAnswer?: string
}

export interface AppSettings {
  hotkey: string
  holdKey?: string
  aiProvider: 'local' | 'groq' | 'ollama' | 'openai' | 'anthropic' | 'gemini'
  ollamaModel: string
  ollamaEndpoint: string
  apiKey: string
  whisperModel?: 'whisper-large-v3' | 'whisper-large-v3-turbo'
  whisperLanguage?: string
  dictationMode?: 'direct' | 'smart_assistant'
  aiPolishing?: boolean
  englishLettersOnly?: boolean
  autoPaste: boolean
  soundFeedback: boolean
  privacyMode: 'strict_local' | 'hybrid' | 'cloud_allowed'
}

