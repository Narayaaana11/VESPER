export interface SystemContext {
  activeApp: string
  windowTitle: string
  clipboardContent?: string
  detectedCategory: 'code' | 'communication' | 'browser' | 'document' | 'general'
  hwnd?: number
  pid?: number
  executablePath?: string
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

export interface ExecutionPlanStep {
  id: string
  step: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  input?: string
  output?: string
  verification?: string
}

/**
 * Canonical Universal Task Object (UTO)
 * (Master Spec Section 3 & 4)
 * Every meaningful VESPER request MUST become a structured UniversalTaskObject before execution.
 */
export interface UniversalTaskObject {
  // Identity & Immutability
  id: string
  taskId: string // Backwards-compatible alias for id
  rawTranscript: string // Immutable original user speech or text
  normalizedTranscript?: string // Polished / normalized text
  finalInterpretation?: {
    action: string
    recipient?: string
    context?: string
    intent?: string
    parameters?: Record<string, any>
  }
  inputMode?: 'voice' | 'text'
  timestamp: string

  // Environment & Context
  activeApplication: string
  activeWindow: string
  screenContext?: {
    application?: string
    window?: string
    screenshot?: string
    visibleText?: string
    elements?: any[]
    coordinates?: any[]
    timestamp?: number
  }
  workspaceContext?: {
    project?: string
    currentFile?: string
    gitBranch?: string
    gitDiffSummary?: string
    recentError?: string
  }
  conversationContext?: {
    isChained?: boolean
    parentTaskId?: string
    turnCount?: number
  }

  // Backwards-compatible context objects
  context: SystemContext
  source: {
    rawSpeech: string
    sttConfidence: number
  }

  // Intent & Requirements
  intent: {
    domain: 'coding' | 'communication' | 'research' | 'document' | 'system'
    category: string
    action: string
  }
  requirements: string[]
  specifications: {
    requirements: string[]
    tone?: string
    technology?: string[]
    styling?: string[]
    constraints?: string[]
  }
  entities?: Record<string, any>
  target?: string
  requestedAction?: string
  constraints?: string[]

  // Scoring, Policy & Governance
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  requiresClarification: boolean
  requiresConfirmation: boolean
  security: {
    riskLevel: 'low' | 'medium' | 'high'
    requiresUserConfirmation: boolean
  }

  // Model & Tools
  selectedModel?: string
  selectedTools?: string[]

  // Routing & Backwards Compatibility
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

  // Planning, Execution & Verification
  executionPlan?: ExecutionPlanStep[]
  executionState?: 'created' | 'planned' | 'executing' | 'verified' | 'failed' | 'aborted'
  verificationState?: 'pending' | 'verified' | 'failed'
  result?: any
  error?: string
  provenance?: {
    provider?: string
    latencyMs?: number
    timestamp: string
  }

  // Legacy Interaction Type
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
