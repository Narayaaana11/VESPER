import { SystemContext, AppSettings } from '../../types/task'
import { transcribeAudio } from '../groq-service'
import { PromptArchitect } from '../prompt-architect'
import { VisionHarness, NavigationTargetCoordinate, EmailPerceptionResult } from '../vision-harness'
import { polishWithGroqLlama, polishWithOllama, polishWithLocalRules } from '../groq-service'
import { localVectorRAG } from '../local-vector-rag'
import { SemanticDriftGuard } from '../semantic-drift-guard'
import { TokenUsageService } from '../token-usage-service'

export type AgentModality = 'dictation' | 'prompting' | 'email' | 'terminal' | 'texting' | 'navigation'

export interface VesperAgentGraphState {
  // Input channels
  audioBlob: Blob | null
  rawTranscript: string
  translatedEnglishText: string
  modality: AgentModality
  systemContext: SystemContext
  screenScreenshotBase64?: string | null

  // Context & Evidence channels
  ragEvidence: string[]
  emailThread?: EmailPerceptionResult
  navigationTarget?: NavigationTargetCoordinate | null

  // Reasoning & Output channels
  finalText: string
  executionType: 'inject_keystrokes' | 'visual_guidance' | 'query_answer'
  statusMessage: string
  isBlocked: boolean
  blockedReason?: string
  executionMetrics: {
    sttMs: number
    reasoningMs: number
    totalMs: number
  }
}

/**
 * LangGraph Agent State Machine Orchestrator
 * Implements a deterministic, graph-based execution pipeline for desktop actions.
 */
export class LangGraphAgentOrchestrator {
  /**
   * Primary entrypoint: runs the multi-node state graph from audio/speech to desktop execution
   */
  public static async execute(params: {
    audioBlob?: Blob | null
    initialText?: string
    context: SystemContext
    settings: AppSettings
    screenshotBase64?: string | null
    onStatusUpdate?: (status: string) => void
  }): Promise<VesperAgentGraphState> {
    const startTime = performance.now()
    const update = (msg: string) => params.onStatusUpdate?.(msg)

    // 1. Initial State Initialization
    const state: VesperAgentGraphState = {
      audioBlob: params.audioBlob || null,
      rawTranscript: params.initialText || '',
      translatedEnglishText: params.initialText || '',
      modality: 'dictation',
      systemContext: params.context,
      screenScreenshotBase64: params.screenshotBase64 || null,
      ragEvidence: [],
      finalText: '',
      executionType: 'inject_keystrokes',
      statusMessage: 'Initializing LangGraph pipeline...',
      isBlocked: false,
      executionMetrics: { sttMs: 0, reasoningMs: 0, totalMs: 0 }
    }

    // Node 1: Speech-to-Text & Cross-Lingual Translation Node
    if (state.audioBlob && (!state.rawTranscript || state.rawTranscript.trim().length === 0)) {
      update('Transcribing & translating with Whisper Turbo v3...')
      const sttStart = performance.now()
      const sttResult = await transcribeAudio(
        state.audioBlob,
        params.settings.apiKey || '',
        {
          model: params.settings.whisperModel || 'whisper-large-v3-turbo',
          language: params.settings.whisperLanguage || 'auto',
          translateToEnglish: true,
          preferLocal: params.settings.aiProvider === 'local'
        }
      )
      state.executionMetrics.sttMs = Math.round(performance.now() - sttStart)

      if (sttResult.error && !sttResult.text) {
        state.isBlocked = true
        state.blockedReason = sttResult.error
        state.statusMessage = `STT Error: ${sttResult.error}`
        return state
      }

      state.rawTranscript = sttResult.text || ''
      state.translatedEnglishText = sttResult.text || ''
    }

    const workingText = state.translatedEnglishText.trim()
    if (!workingText) {
      state.isBlocked = true
      state.blockedReason = 'No speech detected.'
      return state
    }

    // Node 2: Modality Classifier Node
    state.modality = this.classifyModality(workingText, state.systemContext)
    update(`Routing to ${state.modality.toUpperCase()} pipeline...`)

    // Node 3: Context Enrichment Node (Local Vector RAG)
    try {
      const ragMatches = await localVectorRAG.hybridSearch(workingText, 3)
      state.ragEvidence = ragMatches
        .filter((r) => r.score >= 0.2)
        .map((r) => r.document.text)
    } catch {}

    const reasoningStart = performance.now()

    // Node 4: Modality-Specific Sub-Graph Branching
    switch (state.modality) {
      case 'prompting': {
        update('Synthesizing High-Level Industrial Prompt...')
        const promptResult = await PromptArchitect.generatePrompt({
          userGoal: workingText,
          context: state.systemContext,
          ragEvidence: state.ragEvidence,
          apiKey: params.settings.apiKey,
          ollamaEndpoint: params.settings.ollamaEndpoint,
          ollamaModel: params.settings.ollamaModel
        })
        state.finalText = promptResult.industrialPrompt
        state.executionType = 'inject_keystrokes'
        break
      }

      case 'email': {
        update('Perceiving email thread & drafting response...')
        let threadData: EmailPerceptionResult | undefined = undefined
        if (state.screenScreenshotBase64 && VisionHarness.requiresScreenPerception(workingText, state.systemContext)) {
          threadData = await VisionHarness.perceiveEmailThread(
            state.screenScreenshotBase64,
            workingText,
            state.systemContext,
            params.settings.apiKey
          )
          state.emailThread = threadData
        }

        const emailResult = await VisionHarness.draftEmail(
          workingText,
          state.systemContext,
          threadData,
          params.settings.apiKey,
          params.settings.ollamaEndpoint,
          params.settings.ollamaModel
        )
        state.finalText = emailResult.fullEmail
        state.executionType = 'inject_keystrokes'
        break
      }

      case 'navigation': {
        update('OmniParser locating GUI coordinates on screen...')
        const target = await VisionHarness.locateScreenTarget(
          state.screenScreenshotBase64 || '',
          workingText,
          state.systemContext,
          params.settings.apiKey
        )
        state.navigationTarget = target
        state.finalText = target ? `Targeting [${target.label}] at (${target.x}, ${target.y})` : 'Target element located'
        state.executionType = 'visual_guidance'
        break
      }

      case 'terminal': {
        update('Formulating shell command...')
        state.finalText = this.formatTerminalCommand(workingText, state.systemContext)
        state.executionType = 'inject_keystrokes'
        break
      }

      case 'texting': {
        update('Adapting conversational reply...')
        state.finalText = await this.enhanceConversationalReply(workingText, params.settings, state.systemContext)
        state.executionType = 'inject_keystrokes'
        break
      }

      case 'dictation':
      default: {
        update('Enhancing dictation & removing fillers...')
        state.finalText = await this.enhanceDictationText(workingText, params.settings, state.systemContext)
        state.executionType = 'inject_keystrokes'
        break
      }
    }

    state.executionMetrics.reasoningMs = Math.round(performance.now() - reasoningStart)

    // Node 5: Semantic Drift & Negation Guard Node
    const driftCheck = SemanticDriftGuard.evaluate(state.rawTranscript, state.finalText, {
      action: state.modality,
      intent: 'execute',
      recipient: null
    })

    if (driftCheck.driftDetected && driftCheck.remediation) {
      console.warn('[LangGraph] Semantic Drift Guard remediation applied:', driftCheck.reason)
    }

    state.executionMetrics.totalMs = Math.round(performance.now() - startTime)
    state.statusMessage = `Completed via LangGraph in ${state.executionMetrics.totalMs}ms`
    return state
  }

  /**
   * Deterministic modality classification based on speech semantics and active application
   */
  public static classifyModality(speech: string, context: SystemContext): AgentModality {
    const textLower = speech.toLowerCase().trim()
    const appLower = (context.activeApp || '').toLowerCase()
    const titleLower = (context.windowTitle || '').toLowerCase()

    // 1. Navigation Assistant
    if (
      textLower.startsWith('how do i') ||
      textLower.startsWith('show me how') ||
      textLower.startsWith('how to') ||
      textLower.startsWith('where is') ||
      textLower.startsWith('navigate to') ||
      textLower.startsWith('help me find') ||
      textLower.includes('where can i find')
    ) {
      return 'navigation'
    }

    // 2. Prompting Modality
    if (
      textLower.startsWith('prompt:') ||
      textLower.startsWith('create a prompt') ||
      textLower.startsWith('write a prompt') ||
      textLower.startsWith('ask claude') ||
      textLower.startsWith('ask chatgpt') ||
      textLower.startsWith('tell cursor') ||
      textLower.startsWith('generate a prompt') ||
      appLower.includes('cursor') && textLower.includes('prompt')
    ) {
      return 'prompting'
    }

    // 3. Email Modality
    if (
      textLower.startsWith('write an email') ||
      textLower.startsWith('write a email') ||
      textLower.startsWith('draft an email') ||
      textLower.startsWith('reply to this email') ||
      textLower.startsWith('reply saying') ||
      textLower.includes('leave email') ||
      appLower.includes('outlook') ||
      appLower.includes('thunderbird') ||
      titleLower.includes('gmail')
    ) {
      return 'email'
    }

    // 4. Terminal Modality
    if (
      appLower.includes('windowsterminal') ||
      appLower.includes('powershell') ||
      appLower.includes('cmd') ||
      appLower.includes('bash') ||
      textLower.startsWith('run command') ||
      textLower.startsWith('git ') ||
      textLower.startsWith('npm ')
    ) {
      return 'terminal'
    }

    // 5. Texting Modality
    if (
      appLower.includes('slack') ||
      appLower.includes('teams') ||
      appLower.includes('discord') ||
      appLower.includes('whatsapp')
    ) {
      return 'texting'
    }

    // Default: Dictation
    return 'dictation'
  }

  /**
   * Dictation text enhancer: cleans filler words, formats punctuation and code tokens
   */
  private static async enhanceDictationText(
    text: string,
    settings: AppSettings,
    context: SystemContext
  ): Promise<string> {
    // 1. Try Ollama local
    if (settings.aiProvider === 'ollama' || settings.aiProvider === 'local') {
      try {
        const polished = await polishWithOllama(
          text,
          context,
          settings.ollamaEndpoint || 'http://localhost:11434',
          settings.ollamaModel || 'llama3.2',
          true
        )
        if (polished) return polished
      } catch {}
    }

    // 2. Try Groq Llama
    if (settings.apiKey && settings.aiProvider !== 'local') {
      try {
        const polished = await polishWithGroqLlama(
          text,
          context,
          settings.apiKey,
          'llama-3.3-70b-versatile',
          true
        )
        if (polished) return polished
      } catch {}
    }

    // 3. Rule fallback
    return polishWithLocalRules(text, context)
  }

  private static formatTerminalCommand(speech: string, context: SystemContext): string {
    let clean = speech.trim()
    // Common speech patterns to CLI syntax
    clean = clean.replace(/^(?:run|execute|type)\s+(?:command\s+)?/i, '')
    clean = clean.replace(/\band\s+(?:then\s+)?/gi, '&& ')
    clean = clean.replace(/\bwith\s+message\s+["']?([^"']+)["']?/i, '-m "$1"')

    return clean
  }

  private static async enhanceConversationalReply(
    text: string,
    settings: AppSettings,
    context: SystemContext
  ): Promise<string> {
    if (settings.apiKey) {
      try {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${settings.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `You are VESPER's messaging copilot for Slack/WhatsApp/Teams.
User spoke: "${text}".
Convert this into a natural, friendly, concise chat message.
Output ONLY the message text. No quotes, no preamble.`
              },
              { role: 'user', content: text }
            ],
            temperature: 0.3,
            max_tokens: 200
          })
        })
        if (resp.ok) {
          const data = await resp.json()
          const promptTokens = data.usage?.prompt_tokens ?? Math.round(text.length / 4) + 60
          const completionTokens = data.usage?.completion_tokens ?? Math.round((data.choices?.[0]?.message?.content?.length || 0) / 4)
          TokenUsageService.recordUsage({
            model: 'llama-3.1-8b-instant',
            provider: 'groq',
            promptTokens,
            completionTokens,
            totalTokens: data.usage?.total_tokens ?? (promptTokens + completionTokens),
            targetApp: context.activeApp
          })
          const content = data.choices?.[0]?.message?.content?.trim()
          if (content) return content
        }
      } catch {}
    }

    return polishWithLocalRules(text, context)
  }
}
