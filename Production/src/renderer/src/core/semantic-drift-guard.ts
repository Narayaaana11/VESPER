/**
 * VESPER Semantic Drift Guard (Master Spec Sections 4, 8, 86)
 *
 * Compares the immutable raw speech/request against the polished/normalized text
 * and the final task interpretation.
 *
 * Prevents semantic drift where an LLM or normalizer silently:
 * 1. Inverts negation (e.g., "don't send" turning into "send")
 * 2. Elevates a draft-only instruction to an execution/sending action
 * 3. Alters target entity/recipients
 * 4. Silently strips critical constraints
 */

export interface SemanticDriftCheckResult {
  passed: boolean
  driftDetected: boolean
  reason?: string
  safetyViolation?: 'NEGATION_INVERTED' | 'UNINTENDED_EXECUTION' | 'TARGET_ENTITY_MISMATCH' | 'CRITICAL_CONSTRAINT_LOST'
  remediation?: {
    correctedAction?: string
    requiresUserConfirmation: boolean
    explanation: string
  }
}

export class SemanticDriftGuard {
  private static NEGATION_PATTERNS = [
    /\bdon'?t\s+send\b/i,
    /\bdo\s+not\s+send\b/i,
    /\bnever\s+send\b/i,
    /\bwithout\s+sending\b/i,
    /\bhold\s+off\s+on\s+sending\b/i,
    /\bdraft\s+only\b/i,
    /\bdo\s+not\s+delete\b/i,
    /\bdon'?t\s+delete\b/i,
    /\bdo\s+not\s+remove\b/i,
    /\bdon'?t\s+remove\b/i,
    /\bdon'?t\s+execute\b/i,
    /\bdo\s+not\s+execute\b/i,
    /\bdo\s+not\s+run\b/i,
    /\bdon'?t\s+run\b/i,
    /\bjust\s+(a\s+)?draft\b/i,
    /\bnot\s+yet\b/i
  ]

  private static DESTRUCTIVE_ACTIONS = [
    'send_email',
    'send_message',
    'delete_file',
    'delete_files',
    'remove_file',
    'execute_command',
    'run_destructive_command'
  ]

  /**
   * Evaluates raw input against normalized text and final requested action/intent.
   */
  public static evaluate(
    rawTranscript: string,
    normalizedTranscript: string,
    interpretation: {
      action: string
      intent?: string
      targetEntity?: string
      recipient?: string
    }
  ): SemanticDriftCheckResult {
    const raw = (rawTranscript || '').toLowerCase().trim()
    const normalized = (normalizedTranscript || '').toLowerCase().trim()
    const action = (interpretation.action || '').toLowerCase().trim()

    // 1. Check for Negation Inversion (e.g. "don't send this email yet")
    const rawHasNegation = this.NEGATION_PATTERNS.some((pattern) => pattern.test(raw))
    const normalizedHasNegation = this.NEGATION_PATTERNS.some((pattern) => pattern.test(normalized))

    if (rawHasNegation) {
      // If raw contains "don't send" but normalization stripped the negation
      if (!normalizedHasNegation) {
        return {
          passed: false,
          driftDetected: true,
          reason: 'Critical negation was removed during text polishing/normalization.',
          safetyViolation: 'NEGATION_INVERTED',
          remediation: {
            correctedAction: 'compose_draft_only',
            requiresUserConfirmation: true,
            explanation: 'User explicitly specified not to execute or send. Forcing draft-only mode.'
          }
        }
      }

      // If raw contains "don't send" but action is send_email or send_message
      const isSendingAction =
        action === 'send' ||
        action === 'send_it' ||
        action === 'send_email' ||
        action === 'send_message' ||
        action === 'execute_send'

      if (isSendingAction) {
        return {
          passed: false,
          driftDetected: true,
          reason: `Semantic drift detected: Raw input contains explicit negation ("${raw}"), but task interpretation attempted to execute "${action}".`,
          safetyViolation: 'NEGATION_INVERTED',
          remediation: {
            correctedAction: 'compose_draft_only',
            requiresUserConfirmation: true,
            explanation: 'Inverted send action to draft only to strictly enforce user negative constraint.'
          }
        }
      }
    }

    // 2. Check for Entity / Recipient Drift if recipient was explicitly extracted
    if (interpretation.recipient) {
      const recipientLower = interpretation.recipient.toLowerCase().trim()
      // If user specified a specific recipient in raw speech, ensure it appears in normalized text
      if (raw.includes(recipientLower) && !normalized.includes(recipientLower)) {
        return {
          passed: false,
          driftDetected: true,
          reason: `Recipient "${interpretation.recipient}" was dropped or mutated during normalization.`,
          safetyViolation: 'TARGET_ENTITY_MISMATCH',
          remediation: {
            requiresUserConfirmation: true,
            explanation: 'Verify recipient before delivering content.'
          }
        }
      }
    }

    // 3. Check for unintended destructive action from ambiguous speech
    const isDestructive = this.DESTRUCTIVE_ACTIONS.includes(action)
    if (isDestructive && !rawHasNegation) {
      // Verify that raw actually contained an affirmative execution token
      const hasExplicitSendVerb = /\b(send|dispatch|deliver|transmit|submit)\b/i.test(raw)
      const hasExplicitDeleteVerb = /\b(delete|remove|erase|destroy|purge|drop)\b/i.test(raw)

      if ((action.includes('send') && !hasExplicitSendVerb) || (action.includes('delete') && !hasExplicitDeleteVerb)) {
        return {
          passed: false,
          driftDetected: true,
          reason: `High-risk action "${action}" was inferred without explicit affirmative verbs in raw speech.`,
          safetyViolation: 'UNINTENDED_EXECUTION',
          remediation: {
            correctedAction: action.includes('send') ? 'compose_draft_only' : 'review_target_only',
            requiresUserConfirmation: true,
            explanation: 'Action requires explicit user confirmation.'
          }
        }
      }
    }

    return {
      passed: true,
      driftDetected: false
    }
  }

  /**
   * Fast check whether input contains negative action constraints
   */
  public static hasNegativeConstraint(text: string): boolean {
    if (!text) return false
    return this.NEGATION_PATTERNS.some((pattern) => pattern.test(text))
  }
}
