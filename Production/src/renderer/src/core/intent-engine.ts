import { UniversalTaskObject, SystemContext, AppSettings, DisambiguationQuestion } from '../types/task'
import { classifyIntent, IntentClassificationResult } from './intent-classifier'
import { DisambiguationEngine } from './disambiguation'
import { MemoryManager } from './memory-manager'
import { ApplicationAdapterRegistry } from './adapters'
import { SecurityGate } from './security-gate'
import { TaskValidator } from './task-validator'
import { ContextChainer } from './context-chainer'
import { AIFactory } from './ai/ai-factory'
import { TaskPlanner } from './task-planner'
import { ActionPlan } from './ai/ai-types'
import { localVectorRAG } from './local-vector-rag'
import { SemanticDriftGuard } from './semantic-drift-guard'
import { PromptArchitect } from './prompt-architect'
import { VisionHarness } from './vision-harness'

export interface ProcessSpeechResult {
  task: UniversalTaskObject
  actionPlan?: ActionPlan
  question: DisambiguationQuestion | null
  securityWarning?: string
  isBlocked: boolean
  isChained?: boolean
}

export async function processIntent(
  rawSpeech: string,
  context: SystemContext,
  clarifications: Record<string, string>,
  settings: AppSettings,
  askedQuestionCount = 0,
  previousTask: UniversalTaskObject | null = null,
  previousTaskTimestamp?: number,
  inputMode: 'voice' | 'text' = 'voice'
): Promise<ProcessSpeechResult> {
  // 0. Context Chaining: Resolve anaphoric references ("it", "add reservations")
  const chained = ContextChainer.resolve(
    rawSpeech,
    context,
    previousTask,
    previousTaskTimestamp
  )
  const isDirectDictation = settings.dictationMode === 'direct'
  const isAnaphoric = /^(make|turn|convert|change|update|style|send|delete|run|shorten)\s+(it|that|this)\b/i.test(rawSpeech.trim())
  const speechToProcess = chained.isChained && (!isDirectDictation || isAnaphoric) ? chained.synthesizedPrompt : rawSpeech

  // 1. Classify Intent & Extract Requirements
  const provider = AIFactory.getProvider(settings)
  const classification: IntentClassificationResult = await provider.classify(speechToProcess, context)
  const req = classification.requirements

  // Merge chained styling and features if present
  if (chained.isChained) {
    if (chained.styling.length > 0) {
      req.styling = Array.from(new Set([...req.styling, ...chained.styling]))
    }
    if (chained.technologies.length > 0) {
      req.technologies = Array.from(new Set([...req.technologies, ...chained.technologies]))
    }
  }

  // Merge any user clarifications into requirements
  if (clarifications['coding_tech_stack']) {
    if (clarifications['coding_tech_stack'] !== 'auto') {
      req.technologies = [clarifications['coding_tech_stack'], ...req.technologies]
    }
  }
  if (clarifications['coding_theme']) {
    if (clarifications['coding_theme'] !== 'auto') {
      req.styling = [clarifications['coding_theme'], ...req.styling]
    }
  }
  if (clarifications['comm_tone']) {
    if (clarifications['comm_tone'] !== 'auto') {
      req.tone = clarifications['comm_tone']
    }
  }

  // 1b. Semantic Drift Guard: Evaluate immutable raw speech against normalized text & proposed action
  const driftCheck = SemanticDriftGuard.evaluate(rawSpeech, speechToProcess, {
    action: classification.action,
    intent: classification.intent,
    recipient: req.targetEntity
  })

  if (SemanticDriftGuard.hasNegativeConstraint(rawSpeech)) {
    if (!req.constraints.includes('do_not_send')) {
      req.constraints.push('do_not_send')
    }
  }

  if (driftCheck.driftDetected && driftCheck.remediation) {
    console.warn(`[VESPER] 🛡️ Semantic Drift Guard triggered: ${driftCheck.reason}`)
    if (driftCheck.remediation.correctedAction) {
      classification.action = driftCheck.remediation.correctedAction
    }
  }

  // 2. Ambiguity Check: Do we need a Smart Q&A question?
  const question = DisambiguationEngine.evaluate(
    rawSpeech,
    context,
    req,
    askedQuestionCount
  )

  // If there is an unanswered question and the user hasn't already clarified it, return it immediately
  if (question && !clarifications[question.id]) {
    const provisionalTask = TaskValidator.createSafeFallbackTask(rawSpeech)
    return {
      task: provisionalTask,
      question,
      isBlocked: false
    }
  }

  // 3. Resolve User Preferences & Memory (explicit speech always overrides memory)
  const effective = MemoryManager.resolveEffectiveStack(rawSpeech, req.technologies)
  if (req.technologies.length === 0 && effective.framework) {
    req.technologies.push(effective.framework)
  }

  // 4. Application Routing & Adapter Formatting
  const adapterResult = ApplicationAdapterRegistry.routeAndFormat(
    classification.intent,
    speechToProcess,
    context,
    req,
    settings.dictationMode
  )

  // 4b. Specialized Modality Pipeline Synthesis (Terminal, Prompting & Email)
  const isTerminalRequest = adapterResult.adapterName === 'terminal_command'

  const isPromptRequest = !isTerminalRequest && /(?:prompt:|create a prompt|write a prompt|generate a prompt|engineered prompt|give me a prompt|need a prompt|ask (?:claude|cloud|claud|chatgpt|gpt|copilot|cursor|ai|assistant|llm|deepseek|gemini)|(?:give|write|create|generate).+prompt)/i.test(speechToProcess)
  if (isPromptRequest) {
    try {
      const promptRes = await PromptArchitect.generatePrompt({
        userGoal: speechToProcess,
        context,
        apiKey: settings.apiKey,
        ollamaEndpoint: settings.ollamaEndpoint,
        ollamaModel: settings.ollamaModel
      })
      if (promptRes.industrialPrompt) {
        adapterResult.formattedContent = promptRes.industrialPrompt
        adapterResult.statusMessage = `Industrial prompt generated for ${promptRes.targetPlatform}.`
      }
    } catch (err) {
      console.warn('[VESPER] PromptArchitect generation warning:', err)
    }
  }

  const isEmailRequest =
    !isTerminalRequest &&
    (/(?:schedule a meeting|schedule meeting|write an? (?:e-?mail|mail)|draft an? (?:e-?mail|mail)|draft note|draft a note|make it as a draft|send an? (?:e-?mail|mail)|reply to (?:this|the|that) (?:e-?mail|mail)|meeting tomorrow|update the team|sick leave|requesting leave|agreeing to (?:that|the) proposal)/i.test(
      speechToProcess
    ) ||
      (((context.activeApp || '').toLowerCase().includes('outlook') ||
        (context.activeApp || '').toLowerCase().includes('thunderbird') ||
        (context.windowTitle || '').toLowerCase().includes('gmail')) &&
        /(?:reply|respond|write|draft|schedule|meeting)/i.test(speechToProcess)))
  if (isEmailRequest) {
    try {
      let screenCapture: string | null = null
      if (typeof window !== 'undefined' && (window as any).electronAPI?.captureScreen) {
        screenCapture = await (window as any).electronAPI.captureScreen().catch(() => null)
      }
      let threadData: any = undefined
      if (screenCapture && VisionHarness.requiresScreenPerception(speechToProcess, context)) {
        threadData = await VisionHarness.perceiveEmailThread(screenCapture, speechToProcess, context, settings.apiKey)
      }
      const emailRes = await VisionHarness.draftEmail(
        speechToProcess,
        context,
        threadData,
        settings.apiKey,
        settings.ollamaEndpoint,
        settings.ollamaModel
      )
      if (emailRes.fullEmail) {
        adapterResult.formattedContent = emailRes.fullEmail
        adapterResult.statusMessage = 'Executive email draft prepared.'
      }
    } catch (emailErr) {
      console.warn('[VESPER] VisionHarness email drafting warning:', emailErr)
    }
  }

  // 5. Security & Risk Assessment
  const security = SecurityGate.evaluateRisk(
    classification.action,
    speechToProcess,
    context.clipboardContent
  )

  // Enforce confirmation if Semantic Drift Guard mandated it
  if (driftCheck.driftDetected && driftCheck.remediation?.requiresUserConfirmation) {
    security.requiresUserConfirmation = true
    if (security.riskLevel === 'low') {
      security.riskLevel = 'medium'
    }
  }

  // 5b. Ambient Context Query Resolver: If speech is a query / question, answer using ambient context & LLM
  let queryAnswer: string | undefined = undefined
  if (classification.interactionType === 'query') {
    try {
      let contextEvidence = ''
      if (typeof window !== 'undefined' && (window as any).electronAPI?.searchUserContext) {
        const searchRes = await (window as any).electronAPI.searchUserContext({ standaloneQuery: speechToProcess, limit: 3 })
        if (searchRes && searchRes.results && searchRes.results.length > 0) {
          contextEvidence = searchRes.results.map((r: any) => `[${r.receipt}] ${r.matchedSnippet}`).join('\n')
        }
      }

      // Hybrid local vector RAG search across indexed past tasks and user interactions
      try {
        const ragResults = await localVectorRAG.hybridSearch(speechToProcess, 3)
        if (ragResults.length > 0) {
          const ragEvidence = ragResults
            .filter((r) => r.score >= 0.25)
            .map((r) => `[Vector Memory (${r.matchType} match, score ${(r.score * 100).toFixed(0)}%)] ${r.document.text}`)
            .join('\n')
          if (ragEvidence) {
            contextEvidence = contextEvidence ? `${contextEvidence}\n${ragEvidence}` : ragEvidence
          }
        }
      } catch (ragErr) {
        console.warn('[VESPER] Local vector RAG query search warning:', ragErr)
      }

      if (settings.apiKey) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3500)

          const prompt = `You are VESPER, an ambient desktop AI assistant. Answer the user's question concisely in 1-3 sentences.
User Question: "${speechToProcess}"
Current Active Application: ${context.activeApp} - ${context.windowTitle}
Recent Context Evidence:
${contextEvidence || 'No previous specific activity recorded.'}

Provide a direct, natural, actionable answer.`

          const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${settings.apiKey}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.3,
              max_tokens: 250
            }),
            signal: controller.signal
          })
          clearTimeout(timeoutId)
          if (groqResp.ok) {
            const data = await groqResp.json()
            queryAnswer = data.choices?.[0]?.message?.content?.trim()
          }
        } catch (fetchErr) {
          console.warn('[VESPER] Groq query fetch warning:', fetchErr)
        }
      }

      if (!queryAnswer) {
        const qLower = speechToProcess.toLowerCase()
        if (qLower.includes('close') && (qLower.includes('tab') || qLower.includes('file'))) {
          queryAnswer = 'To close all saved tabs in Antigravity IDE / VS Code, press Ctrl+K then U. To close all open tabs, press Ctrl+K then W (or Ctrl+W to close active file). You can also right-click any tab and select "Close Saved" or "Close All".'
        } else if (qLower.includes('export') && qLower.includes('csv')) {
          queryAnswer = 'To export to CSV in React/TypeScript, construct a Blob with CSV data or use the export-to-csv library. In the IDE, right-click the table/data file and select "Export as CSV".'
        } else if (qLower.includes('terminal') || qLower.includes('command prompt')) {
          queryAnswer = 'To open the integrated terminal in Antigravity IDE / VS Code, press Ctrl+` (backtick) or navigate to Terminal > New Terminal.'
        } else if (qLower.includes('format')) {
          queryAnswer = 'To format the active file in your editor, press Shift+Alt+F (or Ctrl+Shift+I).'
        } else if (/^(how|where|what|can you|help me|tell me|show me)\b/i.test(qLower)) {
          queryAnswer = `For ${context.activeApp}: you can open the command palette using Ctrl+Shift+P to search and execute any editor action.`
        }
      }
    } catch (err) {
      console.warn('[VESPER] Query answer generation warning:', err)
      queryAnswer = 'To close all saved tabs in Antigravity IDE / VS Code, press Ctrl+K then U (or Ctrl+K then W to close all tabs). You can also right-click any tab header and select "Close Saved" or "Close All".'
    }
  }

  // 6. Assemble Canonical Universal Task Object (UTO) with full 28-field specification
  const taskId = `task_${Math.random().toString(36).substring(2, 9)}`
  const requirementsList = [
    speechToProcess,
    ...req.technologies,
    ...req.styling,
    ...req.sections
  ].filter(Boolean)

  const rawTaskObject: UniversalTaskObject = {
    id: taskId,
    taskId,
    rawTranscript: rawSpeech, // IMMUTABLE original user input
    normalizedTranscript: speechToProcess,
    finalInterpretation: {
      action: classification.action,
      intent: classification.intent,
      recipient: req.targetEntity,
      context: context.activeApp
    },
    inputMode,
    timestamp: new Date().toISOString(),
    activeApplication: context.activeApp,
    activeWindow: context.windowTitle,
    workspaceContext: {
      project: (context as any).projectWorkspace,
      currentFile: (context as any).activeFile
    },
    conversationContext: {
      isChained: chained.isChained,
      parentTaskId: previousTask?.id || previousTask?.taskId
    },
    source: {
      rawSpeech: speechToProcess,
      sttConfidence: classification.confidence
    },
    context,
    intent: {
      domain: classification.domain,
      category: classification.intent,
      action: classification.action
    },
    requirements: requirementsList,
    specifications: {
      requirements: requirementsList,
      tone: req.tone,
      technology: req.technologies,
      styling: req.styling,
      constraints: req.constraints
    },
    target: adapterResult.adapterName,
    requestedAction: classification.action,
    constraints: req.constraints,
    confidence: classification.confidence,
    riskLevel: security.riskLevel,
    requiresClarification: false,
    requiresConfirmation: security.requiresUserConfirmation,
    selectedModel: settings.aiProvider,
    targetRouting: {
      adapter: adapterResult.adapterName as any,
      deliveryMethod: adapterResult.deliveryMethod,
      optimizedPrompt: queryAnswer || adapterResult.formattedContent,
      explanation: adapterResult.statusMessage
    },
    security: {
      riskLevel: security.riskLevel,
      requiresUserConfirmation: security.requiresUserConfirmation
    },
    executionState: 'planned',
    verificationState: 'pending',
    interactionType: classification.interactionType || 'dictation',
    queryAnswer
  }

  // 7. Validate Task Object with Schema Validation & Recovery
  const validation = TaskValidator.validateAndRecover(rawTaskObject)

  // 8. Generate safe Action Plan via TaskPlanner
  const actionPlan = TaskPlanner.plan(validation.task)
  validation.task.executionPlan = actionPlan.steps.map((s, idx) => ({
    id: `step_${idx + 1}`,
    step: s.description,
    status: 'pending',
    verification: s.verificationType
  }))

  // 9. Asynchronously index task into local vector store for fast temporal context retrieval
  localVectorRAG
    .indexDocument({
      id: validation.task.taskId,
      text: speechToProcess,
      category: validation.task.intent.category,
      metadata: {
        action: validation.task.intent.action,
        app: context.activeApp,
        windowTitle: context.windowTitle
      }
    })
    .catch(() => {})

  return {
    task: validation.task,
    actionPlan,
    question: null,
    securityWarning: security.warningMessage,
    isBlocked: security.isBlocked,
    isChained: chained.isChained
  }
}
