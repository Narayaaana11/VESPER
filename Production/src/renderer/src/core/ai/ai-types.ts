import { SystemContext, UniversalTaskObject } from '../../types/task'
import { IntentClassificationResult } from '../intent-classifier'

export interface ExtractedRequirements {
  goal: string
  domain: 'coding' | 'communication' | 'research' | 'document' | 'system'
  styling: string[]
  features: string[]
  technologies: string[]
  constraints: string[]
  sections: string[]
  tone?: string
}

export interface AmbiguityQuestion {
  id: string
  question: string
  options: {
    key: string
    label: string
    value: string
    isRecommended?: boolean
  }[]
}

export interface AmbiguityReport {
  isAmbiguous: boolean
  confidence: number
  questions: AmbiguityQuestion[]
}

export interface ActionPlanStep {
  stepNumber: number
  actionType: 'inspect_context' | 'insert_prompt' | 'clipboard' | 'run_validation' | 'verify'
  targetApp: string
  description: string
  parameters?: Record<string, any>
  requiresConfirmation: boolean
  verificationType?: string
}

export interface ActionPlan {
  planId: string
  summary: string
  targetApp: string
  steps: ActionPlanStep[]
  estimatedDurationMs: number
}

export interface AIProvider {
  id: string
  name: string
  isAvailable(): Promise<boolean>
  generate(prompt: string, context?: SystemContext): Promise<string>
  classify(speech: string, context: SystemContext): Promise<IntentClassificationResult>
  extractRequirements(speech: string, context?: SystemContext): Promise<ExtractedRequirements>
  detectAmbiguity(speech: string, req: ExtractedRequirements): Promise<AmbiguityReport>
  planTask(task: UniversalTaskObject): Promise<ActionPlan>
}
