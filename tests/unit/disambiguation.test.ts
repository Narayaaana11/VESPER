import { describe, it, expect } from 'vitest'
import { DisambiguationEngine } from '../../src/renderer/src/core/disambiguation'
import { classifyIntent } from '../../src/renderer/src/core/intent-classifier'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('DisambiguationEngine - Smart Q&A Quality', () => {
  const codeContext: SystemContext = {
    activeApp: 'Cursor',
    windowTitle: 'App.tsx',
    detectedCategory: 'code'
  }

  it('A. Complete request: asks 0 questions', () => {
    const speech = 'Create a React portfolio website with Tailwind CSS, dark mode, animations, projects, skills and contact sections.'
    const classification = classifyIntent(speech, codeContext)
    const question = DisambiguationEngine.evaluate(speech, codeContext, classification.requirements)

    expect(question).toBeNull() // ZERO unnecessary questions!
  })

  it('B. Ambiguous request: asks for missing tech stack with options including "Let AI decide"', () => {
    const speech = 'Create a portfolio website.'
    const classification = classifyIntent(speech, codeContext)
    // Clear extracted tech to simulate ambiguity
    classification.requirements.technologies = []

    const question = DisambiguationEngine.evaluate(speech, codeContext, classification.requirements)

    expect(question).not.toBeNull()
    expect(question?.id).toBe('coding_tech_stack')
    expect(question?.options.some((o) => o.label.includes('Let AI decide'))).toBe(true)
    expect(question?.options.length).toBe(4)
  })

  it('C. Vague request: "Make this better" uses context and asks 0 questions', () => {
    const speech = 'Make this better.'
    const classification = classifyIntent(speech, codeContext)
    const question = DisambiguationEngine.evaluate(speech, codeContext, classification.requirements)

    expect(question).toBeNull() // Uses context directly without generic questions!
  })

  it('Enforces maximum question limit (stops asking after MAX_QUESTIONS reached)', () => {
    const speech = 'Build an app.'
    const classification = classifyIntent(speech, codeContext)
    classification.requirements.technologies = []

    // When max questions limit is reached:
    const question = DisambiguationEngine.evaluate(
      speech,
      codeContext,
      classification.requirements,
      DisambiguationEngine.MAX_QUESTIONS_PER_SESSION
    )

    expect(question).toBeNull()
  })
})
