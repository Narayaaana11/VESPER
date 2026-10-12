import { SystemContext, UniversalTaskObject } from '../types/task'

export interface HarnessStep {
  stepIndex: number
  description: string
  actionType: 'dictate' | 'navigate' | 'file_write' | 'clipboard' | 'mcp_tool' | 'verify'
  target: string
  payload?: any
  riskLevel: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'
  reversalAction?: () => Promise<boolean>
  receipt?: string
}

export interface AdvisoryReview {
  agentName: string
  verdict: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REJECTED'
  score: number // 1-10
  feedback: string
}

export interface HarnessExecutionSession {
  sessionId: string
  userGoal: string
  context: SystemContext
  plan: HarnessStep[]
  advisoryReviews: AdvisoryReview[]
  overallVerdict: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REJECTED'
  currentStepIndex: number
  isPaused: boolean
  isCompleted: boolean
  logs: string[]
}

/**
 * VESPER Agentic Harness Engine
 * Coordinates autonomous agent multi-step execution, safety guardrails, environment observation, and advisory review.
 */
export class AgentHarness {
  /**
   * Plans and evaluates a goal through the advisory harness.
   */
  public static createSession(
    userGoal: string,
    context: SystemContext
  ): HarnessExecutionSession {
    const sessionId = `harness_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const steps = this.decomposeGoal(userGoal, context)
    const reviews = this.evaluateWithAdvisoryBoard(userGoal, steps, context)

    const avgScore = reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length
    const anyRejected = reviews.some(r => r.verdict === 'REJECTED')
    const overallVerdict: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REJECTED' = anyRejected
      ? 'REJECTED'
      : avgScore >= 7.5
      ? 'APPROVED'
      : 'APPROVED_WITH_CONDITIONS'

    return {
      sessionId,
      userGoal,
      context,
      plan: steps,
      advisoryReviews: reviews,
      overallVerdict,
      currentStepIndex: 0,
      isPaused: overallVerdict === 'REJECTED',
      isCompleted: false,
      logs: [
        `[Session Initialized] Goal: "${userGoal}"`,
        `[Advisory Evaluation] Committee Verdict: ${overallVerdict} (Avg Score: ${avgScore.toFixed(1)}/10)`,
        `[Plan Generated] ${steps.length} sequential execution steps planned.`
      ]
    }
  }

  /**
   * Decomposes user goal into granular, verifiable harness steps.
   */
  private static decomposeGoal(goal: string, context: SystemContext): HarnessStep[] {
    const steps: HarnessStep[] = []
    const cleanGoal = goal.toLowerCase()

    // Step 1: Environment Observation
    steps.push({
      stepIndex: 1,
      description: `Observe active workspace: verify foreground window "${context.activeApp || 'Desktop'}"`,
      actionType: 'verify',
      target: context.activeApp || 'Desktop',
      riskLevel: 'low',
      status: 'pending'
    })

    // Step 2: Target action
    if (cleanGoal.includes('click') || cleanGoal.includes('navigate') || cleanGoal.includes('open')) {
      steps.push({
        stepIndex: 2,
        description: `Locate and navigate to screen target matching: "${goal}"`,
        actionType: 'navigate',
        target: context.activeApp || 'Screen',
        payload: { query: goal },
        riskLevel: 'low',
        status: 'pending'
      })
    } else if (cleanGoal.includes('file') || cleanGoal.includes('create') || cleanGoal.includes('save')) {
      steps.push({
        stepIndex: 2,
        description: `Synthesize content and prepare document action`,
        actionType: 'file_write',
        target: context.activeFile || 'new_document.txt',
        riskLevel: 'medium',
        status: 'pending'
      })
    } else {
      steps.push({
        stepIndex: 2,
        description: `Format context-aware speech dictation and inject at active cursor`,
        actionType: 'dictate',
        target: context.activeApp || 'Focused Element',
        payload: { rawText: goal },
        riskLevel: 'low',
        status: 'pending'
      })
    }

    // Step 3: Verification
    steps.push({
      stepIndex: 3,
      description: `Verify action execution state and log Littlebird receipt to Central Context Engine`,
      actionType: 'verify',
      target: 'vesper-context.sqlite',
      riskLevel: 'low',
      status: 'pending'
    })

    return steps
  }

  /**
   * Simulates synthetic committee review across key executive personas.
   */
  private static evaluateWithAdvisoryBoard(
    goal: string,
    steps: HarnessStep[],
    context: SystemContext
  ): AdvisoryReview[] {
    const reviews: AdvisoryReview[] = []

    // 1. Elon Musk (First Principles & Latency)
    const elonScore = steps.length <= 4 ? 9 : 6
    reviews.push({
      agentName: 'Elon Musk',
      verdict: elonScore >= 8 ? 'APPROVED' : 'APPROVED_WITH_CONDITIONS',
      score: elonScore,
      feedback: steps.length <= 4
        ? 'Minimalist step sequence. Zero redundant friction. Ensure native Win32 dispatch takes <300ms.'
        : 'Too many steps. Eliminate unnecessary sub-routines.'
    })

    // 2. Jeff Bezos (Customer Obsession & Safety)
    reviews.push({
      agentName: 'Jeff Bezos',
      verdict: 'APPROVED',
      score: 8.5,
      feedback: `Targeting customer focus in ${context.activeApp || 'workspace'}. Seamless experience without breaking cognitive flow.`
    })

    // 3. Jensen Huang (Compute & Execution Rigor)
    reviews.push({
      agentName: 'Jensen Huang',
      verdict: 'APPROVED',
      score: 9.0,
      feedback: 'Local inference and event logging properly architected. Low CPU and memory overhead.'
    })

    // 4. Sam Altman (Agentic Loop & Tooling)
    reviews.push({
      agentName: 'Sam Altman',
      verdict: 'APPROVED',
      score: 8.8,
      feedback: 'Plan properly leverages environment observation and MCP tool contracts.'
    })

    // 5. Andrej Karpathy (Grounding & Verification)
    reviews.push({
      agentName: 'Andrej Karpathy',
      verdict: 'APPROVED',
      score: 8.7,
      feedback: 'Verification receipt at Step 3 ensures closed-loop validation.'
    })

    return reviews
  }

  /**
   * Advances the execution of the next step in the session.
   */
  public static async executeNextStep(
    session: HarnessExecutionSession,
    actionDispatcher: (step: HarnessStep) => Promise<boolean>
  ): Promise<HarnessExecutionSession> {
    if (session.isCompleted || session.isPaused) return session

    const currentStep = session.plan[session.currentStepIndex]
    if (!currentStep) {
      session.isCompleted = true
      session.logs.push('[Session Completed] All planned steps successfully verified.')
      return { ...session }
    }

    currentStep.status = 'in_progress'
    session.logs.push(`[Executing Step ${currentStep.stepIndex}] ${currentStep.description}`)

    try {
      const success = await actionDispatcher(currentStep)
      if (success) {
        currentStep.status = 'completed'
        currentStep.receipt = `Receipt #${Date.now().toString(36)}: Verified in ${currentStep.target}`
        session.logs.push(`[Step ${currentStep.stepIndex} OK] Completed successfully.`)
        session.currentStepIndex += 1

        if (session.currentStepIndex >= session.plan.length) {
          session.isCompleted = true
          session.logs.push('[Session Completed] Goal fully fulfilled.')
        }
      } else {
        currentStep.status = 'failed'
        session.isPaused = true
        session.logs.push(`[Step ${currentStep.stepIndex} FAILED] Execution returned false. Session paused for safety.`)
      }
    } catch (err: any) {
      currentStep.status = 'failed'
      session.isPaused = true
      session.logs.push(`[Step ${currentStep.stepIndex} ERROR] ${err?.message || 'Unknown error'}`)
    }

    return { ...session }
  }
}
