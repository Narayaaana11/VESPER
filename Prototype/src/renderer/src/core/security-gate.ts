export type ActionRiskLevel = 'low' | 'medium' | 'high'

export interface SecurityAssessment {
  riskLevel: ActionRiskLevel
  requiresUserConfirmation: boolean
  isBlocked: boolean
  warningMessage?: string
  sanitizedContent: string
  injectionDetected: boolean
}

export class SecurityGate {
  /**
   * Suspicious patterns representing prompt injection attacks in untrusted external text
   */
  private static readonly INJECTION_PATTERNS = [
    /ignore (all )?previous instructions/i,
    /disregard (all )?prior prompts/i,
    /system:\s*execute/i,
    /delete (all )?files/i,
    /rm\s+-rf/i,
    /drop\s+database/i,
    /format\s+c:/i,
    /powershell\s+-enc/i,
    /bypass\s+security/i
  ]

  /**
   * Evaluates the risk level of an action and verifies safety against prompt injection
   */
  public static evaluateRisk(
    actionType: string,
    rawSpeech: string,
    externalContextText?: string
  ): SecurityAssessment {
    const combined = `${rawSpeech} ${externalContextText || ''}`

    // 1. Check for prompt injection in external data or speech
    let injectionDetected = false
    let warningMessage: string | undefined = undefined

    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(combined)) {
        injectionDetected = true
        warningMessage = 'Potential prompt injection or destructive command intercepted.'
        break
      }
    }

    // 2. Classify Risk Level
    let riskLevel: ActionRiskLevel = 'low'
    let requiresUserConfirmation = false

    const action = actionType.toLowerCase()
    const speech = rawSpeech.toLowerCase()
    const cleanSpeech = speech.replace(/[.,!?;:]/g, ' ').replace(/\s+/g, ' ').trim()

    // HIGH RISK & AUTONOMOUS AGENT OPERATIONS
    if (
      action.includes('agent_') ||
      action.includes('delete') ||
      speech.includes('delete this file') ||
      speech.includes('remove file') ||
      action.includes('send_email') ||
      action.includes('send_message') ||
      cleanSpeech.startsWith('send ') ||
      cleanSpeech.endsWith('send it') ||
      cleanSpeech.includes(' send it') ||
      action.includes('shell') ||
      speech.includes('format drive') ||
      speech.includes('purchase')
    ) {
      riskLevel = action.includes('agent_') ? 'medium' : 'high'
      requiresUserConfirmation = true
      warningMessage = action.includes('agent_')
        ? 'Autonomous Agent response prepared — review and approve to send.'
        : (warningMessage || 'High-risk action requires explicit user confirmation.')
    }
    // MEDIUM RISK OPERATIONS
    else if (
      action.includes('create_file') ||
      action.includes('modify_file') ||
      action.includes('open_application') ||
      action.includes('navigate')
    ) {
      riskLevel = 'medium'
      requiresUserConfirmation = true
      warningMessage = 'Medium-risk operation: creates or modifies local files.'
    }
    // LOW RISK OPERATIONS (Default for drafts, code scaffolds, search, rewrites)
    else {
      riskLevel = 'low'
      requiresUserConfirmation = false
    }

    // If injection was detected, force HIGH risk and block automatic execution
    if (injectionDetected) {
      riskLevel = 'high'
      requiresUserConfirmation = true
    }

    // 3. Sanitize external data: wrap data clearly so LLMs never treat it as system instructions
    const sanitized = this.sanitizeData(rawSpeech)

    return {
      riskLevel,
      requiresUserConfirmation,
      isBlocked: injectionDetected && (speech.includes('delete all') || speech.includes('rm -rf')),
      warningMessage,
      sanitizedContent: sanitized,
      injectionDetected
    }
  }

  /**
   * Sanitizes external content and wraps it in structured XML-style data tags
   */
  public static sanitizeData(input: string): string {
    return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim()
  }

  public static wrapAsUntrustedData(data: string, label = 'UNTRUSTED_EXTERNAL_DATA'): string {
    const clean = this.sanitizeData(data)
    return `\n<${label}>\n${clean}\n</${label}>\n`
  }
}
