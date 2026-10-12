import { DisambiguationQuestion, SystemContext } from '../types/task'
import { ExtractedRequirements } from './intent-classifier'
import { MemoryManager } from './memory-manager'

export class DisambiguationEngine {
  public static readonly MAX_QUESTIONS_PER_SESSION = 2

  /**
   * Evaluates whether a request has critical ambiguities requiring a Smart Q&A question
   */
  public static evaluate(
    rawSpeech: string,
    context: SystemContext,
    requirements: ExtractedRequirements,
    askedQuestionCount = 0
  ): DisambiguationQuestion | null {
    // 1. Guardrail: Enforce max question limit, and NEVER ask questions for natural dictation
    if (askedQuestionCount >= this.MAX_QUESTIONS_PER_SESSION || requirements.isTask === false) {
      return null
    }

    const text = rawSpeech.trim().toLowerCase()

    // 2. Vague commands: "Fix this", "Make this better", "Improve this"
    // RULE: Use context FIRST before asking questions. If context provides the answer, DO NOT ask!
    const isVagueCommand =
      text === 'fix this' ||
      text === 'fix this.' ||
      text === 'make this better' ||
      text === 'make this better.' ||
      text === 'clean this up' ||
      text === 'improve this'

    if (isVagueCommand) {
      // Context already tells us what to do!
      // In VS Code/Cursor -> Debug/clean code.
      // In Gmail/Slack -> Polish email/message.
      // In Document -> Rewrite selected text.
      return null
    }

    // 3. Complete Requests Check
    // If user specified technology (e.g. React, Next, HTML, Tailwind) OR if the request is already specific,
    // NO unnecessary question should be asked.
    const hasExplicitTech =
      requirements.technologies.length > 0 ||
      text.includes('react') ||
      text.includes('next') ||
      text.includes('html') ||
      text.includes('vue') ||
      text.includes('python') ||
      text.includes('tailwind') ||
      text.includes('css')

    // 4. Coding Domain Ambiguities
    const isBuildingWebsiteOrApp =
      text.includes('website') ||
      text.includes('portfolio') ||
      text.includes('dashboard') ||
      text.includes('landing page') ||
      text.includes('component') ||
      text.includes('app')

    if (isBuildingWebsiteOrApp) {
      // If tech is not specified in speech, check if memory has a default
      if (!hasExplicitTech) {
        const prefs = MemoryManager.getPreferences()
        // If user configured "Let AI decide" in memory, skip question
        if (prefs.defaultAiDecision && prefs.preferredFramework) {
          return null
        }

        return {
          id: 'coding_tech_stack',
          question: 'Which framework/stack should we use?',
          options: [
            { key: '1', label: 'HTML5 + CSS + Vanilla JS', value: 'HTML5 + Vanilla JS' },
            { key: '2', label: 'React + Vite + Tailwind', value: 'React + Tailwind', isRecommended: true },
            { key: '3', label: 'Next.js App Router', value: 'Next.js' },
            { key: '4', label: 'Let AI decide', value: 'auto' }
          ]
        }
      }

      // If tech is known, but theme is completely unspecified and it's a visual landing page/portfolio
      const hasTheme =
        requirements.styling.length > 0 ||
        text.includes('dark') ||
        text.includes('light') ||
        text.includes('minimal') ||
        text.includes('modern')

      if (!hasTheme && (text.includes('portfolio') || text.includes('landing page'))) {
        return {
          id: 'coding_theme',
          question: 'Visual theme preference?',
          options: [
            { key: '1', label: 'Dark Mode (Cyber / Sleek)', value: 'dark', isRecommended: true },
            { key: '2', label: 'Clean Editorial Light', value: 'light' },
            { key: '3', label: 'Adaptive (System Preference)', value: 'adaptive' },
            { key: '4', label: 'Let AI decide', value: 'auto' }
          ]
        }
      }
    }

    // 5. Communication Domain Ambiguities
    const isCommunication =
      context.detectedCategory === 'communication' ||
      text.startsWith('reply') ||
      text.includes('tell him') ||
      text.includes('tell her') ||
      text.includes('email')

    if (isCommunication) {
      const hasTone =
        requirements.tone ||
        text.includes('formal') ||
        text.includes('casual') ||
        text.includes('concise') ||
        text.includes('friendly')

      // Only ask if intent is a major email reply and tone wasn't specified
      if (!hasTone && text.includes('reply to this email')) {
        return {
          id: 'comm_tone',
          question: 'What tone should this reply carry?',
          options: [
            { key: '1', label: 'Professional & Courteous', value: 'Professional', isRecommended: true },
            { key: '2', label: 'Casual & Direct', value: 'Casual & Direct' },
            { key: '3', label: 'Concise (1-2 sentences)', value: 'Concise' },
            { key: '4', label: 'Let AI decide', value: 'auto' }
          ]
        }
      }
    }

    // High confidence - no ambiguity questions required
    return null
  }
}
