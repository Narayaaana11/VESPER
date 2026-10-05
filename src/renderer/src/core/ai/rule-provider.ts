import { SystemContext, UniversalTaskObject } from '../../types/task'
import { classifyIntent, IntentClassificationResult } from '../intent-classifier'
import { polishWithLocalRules } from '../groq-service'
import { AIProvider, ExtractedRequirements, AmbiguityReport, ActionPlan } from './ai-types'

export class RuleBasedProvider implements AIProvider {
  public id = 'rule_based'
  public name = 'Deterministic Rule Engine'

  public async isAvailable(): Promise<boolean> {
    return true
  }

  public async generate(prompt: string): Promise<string> {
    return prompt
  }

  public polish(prompt: string, context?: SystemContext): string {
    return polishWithLocalRules(prompt, context)
  }

  public async classify(
    speech: string,
    context: SystemContext
  ): Promise<IntentClassificationResult> {
    return classifyIntent(speech, context)
  }

  public async extractRequirements(
    speech: string,
    context?: SystemContext
  ): Promise<ExtractedRequirements> {
    const classification = classifyIntent(speech, context || { activeApp: 'Desktop', windowTitle: '', detectedCategory: 'general' })
    const s = speech.toLowerCase()

    // Dynamic style extraction
    const styles: string[] = [...classification.requirements.styling]
    if (/\bdark(\s+theme|\s+mode)?\b/i.test(s) && !styles.includes('dark')) styles.push('dark')
    if (/\bpremium\b/i.test(s) && !styles.includes('premium')) styles.push('premium')
    if (/\bminimal(ist)?\b/i.test(s) && !styles.includes('minimalist')) styles.push('minimalist')
    if (/\bmodern\b/i.test(s) && !styles.includes('modern')) styles.push('modern')
    if (/\bglassmorphism\b/i.test(s) && !styles.includes('glassmorphism')) styles.push('glassmorphism')

    // Dynamic feature extraction
    const features: string[] = []
    if (/\breservation(s)?\b/i.test(s)) features.push('reservations')
    if (/\banimation(s)?\b/i.test(s)) features.push('animations')
    if (/\bresponsive|mobile(\s+support)?\b/i.test(s)) features.push('responsive mobile support')
    if (/\bpayment(s)?|stripe\b/i.test(s)) features.push('payment integration')
    if (/\bauth(entication)?|login\b/i.test(s)) features.push('authentication')
    if (/\bcart|checkout\b/i.test(s)) features.push('shopping cart')

    // Clean goal extraction
    let goal = speech
      .replace(/^(build|create|make|develop|implement|code)\s+(a|an|the)?\s*/i, '')
      .replace(/\s+(with|having|including|and)\s+.*$/i, '')
      .trim()
    if (!goal) goal = speech

    return {
      goal,
      domain: classification.domain,
      styling: styles,
      features,
      technologies: classification.requirements.technologies,
      constraints: classification.requirements.constraints,
      sections: classification.requirements.sections,
      tone: classification.requirements.tone
    }
  }

  public async detectAmbiguity(
    speech: string,
    req: ExtractedRequirements
  ): Promise<AmbiguityReport> {
    // If requirement extraction already has sufficient clarity, skip questions
    const hasClearGoal = req.goal.length > 5
    const hasSpecs = req.styling.length > 0 || req.features.length > 0 || req.technologies.length > 0

    if (hasClearGoal && hasSpecs) {
      return {
        isAmbiguous: false,
        confidence: 0.9,
        questions: []
      }
    }

    const question = DisambiguationEngine.evaluate(
      speech,
      { activeApp: 'Cursor', windowTitle: '', detectedCategory: req.domain === 'coding' ? 'code' : 'general' },
      {
        technologies: req.technologies,
        styling: req.styling,
        constraints: req.constraints,
        sections: req.sections,
        tone: req.tone,
        isExplicitCode: req.domain === 'coding'
      },
      0
    )

    if (question) {
      return {
        isAmbiguous: true,
        confidence: 0.6,
        questions: [question]
      }
    }

    return {
      isAmbiguous: false,
      confidence: 0.85,
      questions: []
    }
  }

  public async planTask(task: UniversalTaskObject): Promise<ActionPlan> {
    const isCoding = task.intent.domain === 'coding'
    const targetApp = task.context.activeApp || (isCoding ? 'Cursor' : 'Desktop')

    const steps = [
      {
        stepNumber: 1,
        actionType: 'inspect_context' as const,
        targetApp,
        description: `Verify target focus in ${targetApp}`,
        requiresConfirmation: false
      },
      {
        stepNumber: 2,
        actionType: task.targetRouting.deliveryMethod === 'paste' ? ('insert_prompt' as const) : ('clipboard' as const),
        targetApp,
        description: `Deliver optimized instruction to ${task.targetRouting.adapter}`,
        parameters: { content: task.targetRouting.optimizedPrompt },
        requiresConfirmation: task.security.requiresUserConfirmation
      },
      {
        stepNumber: 3,
        actionType: 'verify' as const,
        targetApp,
        description: 'Verify execution state and update context history',
        requiresConfirmation: false
      }
    ]

    return {
      planId: `plan_${Math.random().toString(36).substring(2, 8)}`,
      summary: `Execute ${task.intent.action} for ${targetApp}`,
      targetApp,
      steps,
      estimatedDurationMs: 450
    }
  }
}
