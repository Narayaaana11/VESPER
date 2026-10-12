import { UniversalTaskObject, SystemContext } from '../types/task'

export interface ChainedContextResolution {
  isChained: boolean
  parentTaskId?: string
  originalGoal?: string
  synthesizedPrompt: string
  mergedRequirements: string[]
  styling: string[]
  technologies: string[]
  features: string[]
  targetSection?: string
}

export class ContextChainer {
  private static readonly MAX_CHAIN_AGE_MS = 15 * 60 * 1000 // 15 minutes

  /**
   * Resolves whether incoming speech refers to the previous task and merges context
   */
  public static resolve(
    currentSpeech: string,
    currentContext: SystemContext,
    previousTask: UniversalTaskObject | null,
    previousTaskTimestamp?: number
  ): ChainedContextResolution {
    const rawSpeech = (currentSpeech || '').trim()
    if (!previousTask || !rawSpeech) {
      return {
        isChained: false,
        synthesizedPrompt: rawSpeech,
        mergedRequirements: [rawSpeech],
        styling: [],
        technologies: [],
        features: []
      }
    }

    // Check age of previous task
    if (previousTaskTimestamp) {
      const age = Date.now() - previousTaskTimestamp
      if (age > this.MAX_CHAIN_AGE_MS) {
        return {
          isChained: false,
          synthesizedPrompt: rawSpeech,
          mergedRequirements: [rawSpeech],
          styling: [],
          technologies: [],
          features: []
        }
      }
    }

    const s = rawSpeech.toLowerCase().trim()

    // 1. Direct anaphoric commands modifying previous object: e.g. "make it dark", "send it", "turn it into..."
    const isAnaphoricCommand = /^(make|turn|convert|change|update|style|send|delete|run)\s+(it|that|this)\b/i.test(s)

    // 2. Section-level modification on previous task: e.g. "make the reservation section better", "in the menu section..."
    const sectionMatch = s.match(/\b([a-z0-9_-]+)\s+section\b/i)
    const targetSection = sectionMatch ? sectionMatch[1] : undefined
    const isSectionDirective = !!targetSection && /^(make|add|style|change|update|improve|enhance|put|redesign)\b/i.test(s)

    // 3. Incremental task addition: e.g. "add reservations", "also add authentication", "add dark theme"
    const isIncrementalCommand = /^(add\s+|also\s+add\s+|also\s+|enhance\s+the|improve\s+the)/i.test(s)

    // Negative filters: General conversation, dictation, testing, questions must NEVER chain
    const isExcludedFromChaining =
      s.startsWith("let's") ||
      s.startsWith("test ") ||
      s.includes("test if") ||
      s.includes("typed directly") ||
      s.startsWith("can you") ||
      s.startsWith("what is") ||
      s.startsWith("how to") ||
      s.startsWith("so here") ||
      s.startsWith("i want to")

    // Determine if this is a genuine chained interaction
    const isChained = (isAnaphoricCommand || isIncrementalCommand || isSectionDirective) && !isExcludedFromChaining

    if (!isChained) {
      return {
        isChained: false,
        synthesizedPrompt: rawSpeech,
        mergedRequirements: [rawSpeech],
        styling: [],
        technologies: [],
        features: []
      }
    }

    // 4. Extract previous task components
    const prevGoal =
      previousTask.source.rawSpeech ||
      previousTask.specifications.requirements[0] ||
      'active project'
    const prevStyling = [...(previousTask.specifications.styling || [])]
    const prevTech = [...(previousTask.specifications.technology || [])]
    const prevReqs = [...(previousTask.specifications.requirements || [])]

    // Extract new styling directives from speech
    const newStyling: string[] = []
    if (/\bdark(\s+theme|\s+mode)?\b/i.test(s)) newStyling.push('dark theme')
    if (/\blight(\s+theme|\s+mode)?\b/i.test(s)) newStyling.push('light theme')
    if (/\bminimal(ist)?\b/i.test(s)) newStyling.push('minimalist')
    if (/\bmodern\b/i.test(s)) newStyling.push('modern')
    if (/\bglassmorphism\b/i.test(s)) newStyling.push('glassmorphism')

    // Extract new feature directives
    const newFeatures: string[] = []
    if (/\breservation(s)?\b/i.test(s)) newFeatures.push('reservations')
    if (/\banimation(s)?\b/i.test(s)) newFeatures.push('animations')
    if (/\bresponsive|mobile\b/i.test(s)) newFeatures.push('responsive mobile support')
    if (/\bpayment(s)?|stripe\b/i.test(s)) newFeatures.push('payment integration')
    if (/\bauth(entication)?|login\b/i.test(s)) newFeatures.push('authentication')

    const allStyling = Array.from(new Set([...prevStyling, ...newStyling]))
    const allReqs = Array.from(new Set([...prevReqs, rawSpeech]))

    // Build synthesized prompt retaining parent task identity WITHOUT naive string replacement
    let synthesized = ''

    if (targetSection) {
      synthesized = `For ${prevGoal}: enhance and improve the ${targetSection} section.`
      if (allStyling.length > 0) {
        synthesized += ` Maintain styling: ${allStyling.join(', ')}.`
      }
    } else if (isAnaphoricCommand) {
      synthesized = `For ${prevGoal}: ${rawSpeech}. Keep existing features intact.`
      if (allStyling.length > 0) {
        synthesized += ` Apply styling: ${allStyling.join(', ')}.`
      }
    } else if (isIncrementalCommand) {
      synthesized = `For ${prevGoal}: ${rawSpeech}.`
      if (allStyling.length > 0) {
        synthesized += ` Style requirements: ${allStyling.join(', ')}.`
      }
    } else {
      synthesized = `For ${prevGoal}: ${rawSpeech}.`
    }

    return {
      isChained: true,
      parentTaskId: previousTask.taskId,
      originalGoal: prevGoal,
      synthesizedPrompt: synthesized,
      mergedRequirements: allReqs,
      styling: allStyling,
      technologies: prevTech,
      features: newFeatures,
      targetSection
    }
  }
}
