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

    // Validate taskId
    if (!task.taskId || typeof task.taskId !== 'string') {
      task.taskId = `task_${Math.random().toString(36).substring(2, 9)}`
      recovered = true
    }

    // Validate timestamp
    if (!task.timestamp || typeof task.timestamp !== 'string') {
      task.timestamp = new Date().toISOString()
      recovered = true
    }

    // Validate source
    if (!task.source || typeof task.source !== 'object') {
      task.source = { rawSpeech: '', sttConfidence: 0.5 }
      recovered = true
    }

    // Validate context
    if (!task.context || typeof task.context !== 'object') {
      task.context = { activeApp: 'Desktop', windowTitle: 'Workspace', detectedCategory: 'general' }
      recovered = true
    }

    // Validate intent
    if (!task.intent || typeof task.intent !== 'object' || !task.intent.domain) {
      task.intent = { domain: 'document', category: 'general_assistance', action: 'draft_content' }
      recovered = true
    }

    // Validate specifications
    if (!task.specifications || typeof task.specifications !== 'object') {
      task.specifications = { requirements: [task.source.rawSpeech || ''] }
      recovered = true
    }

    // Validate targetRouting
    if (!task.targetRouting || typeof task.targetRouting !== 'object' || !task.targetRouting.optimizedPrompt) {
      task.targetRouting = {
        adapter: 'clipboard',
        deliveryMethod: 'clipboard',
        optimizedPrompt: task.source.rawSpeech || '',
        explanation: 'Recovered basic prompt due to routing error.'
      }
      recovered = true
    }

    // Validate security
    if (!task.security || typeof task.security !== 'object') {
      task.security = { riskLevel: 'low', requiresUserConfirmation: false }
      recovered = true
    }

    return {
      isValid: errors.length === 0,
      recovered,
      errors,
      task: task as UniversalTaskObject
    }
  }

  public static createSafeFallbackTask(rawSpeech: string): UniversalTaskObject {
    return {
      taskId: `fallback_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
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
      specifications: {
        requirements: [rawSpeech]
      },
      targetRouting: {
        adapter: 'clipboard',
        deliveryMethod: 'clipboard',
        optimizedPrompt: rawSpeech,
        explanation: 'Safe fallback output copied to clipboard.'
      },
      security: {
        riskLevel: 'low',
        requiresUserConfirmation: false
      }
    }
  }
}
