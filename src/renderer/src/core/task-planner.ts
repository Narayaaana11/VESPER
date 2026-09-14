import { UniversalTaskObject } from '../types/task'
import { ActionPlan, ActionPlanStep } from './ai/ai-types'

export class TaskPlanner {
  /**
   * Decomposes a UniversalTaskObject into a safe, deterministic, executable ActionPlan
   */
  public static plan(task: UniversalTaskObject): ActionPlan {
    const isCoding = task.intent.domain === 'coding'
    const isComm = task.intent.domain === 'communication'
    const targetApp = task.context.activeApp || 'Desktop'

    const steps: ActionPlanStep[] = []

    // Step 1: Pre-flight context validation
    steps.push({
      stepNumber: 1,
      actionType: 'inspect_context',
      targetApp,
      description: `Validate target window focus in ${targetApp}`,
      parameters: {
        expectedApp: targetApp,
        expectedCategory: task.context.detectedCategory
      },
      requiresConfirmation: false
    })

    // Step 2: Content preparation & routing
    if (isCoding) {
      steps.push({
        stepNumber: 2,
        actionType: task.targetRouting.deliveryMethod === 'paste' ? 'insert_prompt' : 'clipboard',
        targetApp,
        description: `Deliver formatted coding prompt to ${task.targetRouting.adapter}`,
        parameters: {
          content: task.targetRouting.optimizedPrompt,
          techStack: task.specifications.technology,
          styling: task.specifications.styling
        },
        requiresConfirmation: task.security.requiresUserConfirmation
      })
    } else if (isComm) {
      steps.push({
        stepNumber: 2,
        actionType: task.targetRouting.deliveryMethod === 'paste' ? 'insert_prompt' : 'clipboard',
        targetApp,
        description: `Deliver communication draft to ${targetApp}`,
        parameters: {
          content: task.targetRouting.optimizedPrompt,
          tone: task.specifications.tone
        },
        requiresConfirmation: task.security.requiresUserConfirmation
      })
    } else {
      steps.push({
        stepNumber: 2,
        actionType: task.targetRouting.deliveryMethod === 'paste' ? 'insert_prompt' : 'clipboard',
        targetApp,
        description: `Deliver action payload to ${targetApp}`,
        parameters: {
          content: task.targetRouting.optimizedPrompt
        },
        requiresConfirmation: task.security.requiresUserConfirmation
      })
    }

    // Step 3: Result verification
    steps.push({
      stepNumber: 3,
      actionType: 'verify',
      targetApp,
      description: 'Verify execution state and record task in context history',
      requiresConfirmation: false
    })

    return {
      planId: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      summary: `Execute ${task.intent.action} for ${targetApp}`,
      targetApp,
      steps,
      estimatedDurationMs: 400
    }
  }
}
