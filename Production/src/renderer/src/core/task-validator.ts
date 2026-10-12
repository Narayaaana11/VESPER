import { UniversalTaskObject } from '../types/task'

export interface TaskValidationResult {
  isValid: boolean
  task: UniversalTaskObject
  recovered: boolean
  errors: string[]
}

export class TaskValidator {
  /**
   * Validates a UniversalTaskObject against canonical constraints and applies safe recovery if needed
   */
  public static validateAndRecover(input: any): TaskValidationResult {
    const errors: string[] = []
    let recovered = false

    if (!input || typeof input !== 'object') {
      errors.push('Task payload is not a valid object')
      return {
        isValid: false,
        recovered: true,
        errors,
        task: this.createSafeFallbackTask('Invalid task object received')
      }
    }

    // Clone to prevent mutating input
    const task = { ...input }

    // Validate taskId & id
    if (!task.taskId || typeof task.taskId !== 'string') {
      task.taskId = task.id || `task_${Math.random().toString(36).substring(2, 9)}`
      recovered = true
    }
    if (!task.id) {
      task.id = task.taskId
    }

    // Validate timestamp
    if (!task.timestamp || typeof task.timestamp !== 'string') {
      task.timestamp = new Date().toISOString()
      recovered = true
    }

    // Validate source & rawTranscript
    if (!task.source || typeof task.source !== 'object') {
      task.source = { rawSpeech: task.rawTranscript || '', sttConfidence: 0.5 }
      recovered = true
    }
    if (!task.rawTranscript) {
      task.rawTranscript = task.source.rawSpeech || ''
    }
    if (!task.normalizedTranscript) {
      task.normalizedTranscript = task.rawTranscript
    }

    // Validate context & activeApp
    if (!task.context || typeof task.context !== 'object') {
      task.context = { activeApp: 'Desktop', windowTitle: 'Workspace', detectedCategory: 'general' }
      recovered = true
    }
    task.activeApplication = task.activeApplication || task.context.activeApp || 'Desktop'
    task.activeWindow = task.activeWindow || task.context.windowTitle || 'Workspace'

    // Validate intent
    if (!task.intent || typeof task.intent !== 'object' || !task.intent.domain) {
      task.intent = { domain: 'document', category: 'general_assistance', action: 'draft_content' }
      recovered = true
    }

    // Validate specifications & requirements
    if (!task.specifications || typeof task.specifications !== 'object') {
      task.specifications = { requirements: [task.rawTranscript || ''] }
      recovered = true
    }
    task.requirements = task.requirements || task.specifications.requirements || [task.rawTranscript]

    // Validate targetRouting
    if (!task.targetRouting || typeof task.targetRouting !== 'object' || !task.targetRouting.optimizedPrompt) {
      task.targetRouting = {
        adapter: 'clipboard',
        deliveryMethod: 'clipboard',
        optimizedPrompt: task.rawTranscript || '',
        explanation: 'Recovered basic prompt due to routing error.'
      }
      recovered = true
    }

    // Validate security & policy
    if (!task.security || typeof task.security !== 'object') {
      task.security = { riskLevel: 'low', requiresUserConfirmation: false }
      recovered = true
    }
    task.riskLevel = task.riskLevel || task.security.riskLevel || 'low'
    task.requiresConfirmation = task.requiresConfirmation ?? task.security.requiresUserConfirmation ?? false
    task.requiresClarification = task.requiresClarification ?? false
    task.confidence = task.confidence ?? task.source.sttConfidence ?? 0.85
    task.executionState = task.executionState || 'created'
    task.verificationState = task.verificationState || 'pending'

    return {
      isValid: errors.length === 0,
      recovered,
      errors,
      task: task as UniversalTaskObject
    }
  }

  public static createSafeFallbackTask(rawSpeech: string): UniversalTaskObject {
    const id = `fallback_${Math.random().toString(36).substring(2, 9)}`
    return {
      id,
      taskId: id,
      rawTranscript: rawSpeech,
      normalizedTranscript: rawSpeech,
      inputMode: 'voice',
      timestamp: new Date().toISOString(),
      activeApplication: 'Desktop',
      activeWindow: 'Fallback Session',
      source: {
        rawSpeech,
        sttConfidence: 0.5
      },
      context: {
        activeApp: 'Desktop',
        windowTitle: 'Fallback Session',
        detectedCategory: 'general'
      },
      intent: {
        domain: 'document',
        category: 'fallback',
        action: 'copy_fallback'
      },
      requirements: [rawSpeech],
      specifications: {
        requirements: [rawSpeech]
      },
      confidence: 0.5,
      riskLevel: 'low',
      requiresClarification: false,
      requiresConfirmation: false,
      targetRouting: {
        adapter: 'clipboard',
        deliveryMethod: 'clipboard',
        optimizedPrompt: rawSpeech,
        explanation: 'Safe fallback output copied to clipboard.'
      },
      security: {
        riskLevel: 'low',
        requiresUserConfirmation: false
      },
      executionState: 'created',
      verificationState: 'pending'
    }
  }
}
