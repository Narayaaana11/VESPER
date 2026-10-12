import { SystemContext } from '../types/task'

export interface PromptArchitectRequest {
  userGoal: string
  context: SystemContext
  ragEvidence?: string[]
  apiKey?: string
  ollamaEndpoint?: string
  ollamaModel?: string
}

export interface PromptArchitectResult {
  industrialPrompt: string
  targetPlatform: string
  category: string
  tokensCountEstimate: number
  generatedBy: 'local-ollama' | 'groq-llama' | 'rule-architect'
}

/**
 * Industrial Prompt Architect Engine
 * Converts conversational user intent into enterprise-grade, high-level industrial prompts
 * complete with Role, Objective, Technical Specifications, Guardrails, and Deliverable Contracts.
 */
export class PromptArchitect {
  /**
   * Identifies the target AI platform based on active application or user speech
   */
  public static detectTargetPlatform(userGoal: string, context: SystemContext): string {
    const goalLower = userGoal.toLowerCase()
    // Explicit user speech takes precedence over active application window
    if (goalLower.includes('claude') || goalLower.includes('cloud') || goalLower.includes('claud')) return 'Anthropic Claude'
    if (goalLower.includes('chatgpt') || goalLower.includes('gpt-4') || goalLower.includes('openai')) return 'ChatGPT'
    if (goalLower.includes('cursor') || goalLower.includes('composer')) return 'Cursor Composer'
    if (goalLower.includes('copilot')) return 'GitHub Copilot'
    if (goalLower.includes('windsurf')) return 'Windsurf Cascade'
    if (goalLower.includes('v0')) return 'Vercel v0'
    if (goalLower.includes('midjourney')) return 'Midjourney'

    const combined = `${context.activeApp || ''} ${context.windowTitle || ''}`.toLowerCase()
    if (combined.includes('cursor') || combined.includes('composer')) return 'Cursor Composer'
    if (combined.includes('claude')) return 'Anthropic Claude'
    if (combined.includes('chatgpt') || combined.includes('openai')) return 'ChatGPT'
    if (combined.includes('copilot')) return 'GitHub Copilot'
    if (combined.includes('windsurf')) return 'Windsurf Cascade'
    if (context.activeApp?.toLowerCase().includes('code')) return 'VS Code AI'

    return 'Advanced AI Assistant'
  }

  /**
   * Main generation method: Local LLM first ➔ Groq fallback ➔ Rule architect fallback
   */
  public static async generatePrompt(req: PromptArchitectRequest): Promise<PromptArchitectResult> {
    const cleanGoal = req.userGoal
      .replace(/^(?:so\s+)?ask (?:claude|cloud|claud|chatgpt|gpt|copilot|cursor|ai|assistant) to\s+/i, '')
      .replace(/^(?:so\s+)?(?:create|write|generate|give me|need)\s+a?\s*prompt\s+(?:to|for)?\s*/i, '')
      .replace(/[.,\s]+$/g, '')
      .trim() || req.userGoal

    const targetPlatform = this.detectTargetPlatform(req.userGoal, req.context)
    const activeApp = req.context.activeApp || 'Desktop'
    const windowTitle = req.context.windowTitle || 'Workspace'
    const selection = req.context.clipboardContent ? req.context.clipboardContent.slice(0, 800) : ''
    const ragContext = req.ragEvidence && req.ragEvidence.length > 0
      ? req.ragEvidence.slice(0, 3).join('\n---\n')
      : ''

    const systemInstruction = `You are VESPER's Senior Principal AI Prompt Architect.
Your task is to take a raw user request and transform it into an elite, industrial-grade, production-ready system prompt tailored for ${targetPlatform}.

THE USER'S GOAL:
"${cleanGoal}"

CURRENT ACTIVE CONTEXT:
- Active Application: ${activeApp}
- Window / Project: ${windowTitle}
${selection ? `- Selected Code/Text Snippet:\n\`\`\`\n${selection}\n\`\`\`` : ''}
${ragContext ? `- Relevant Project Memory:\n${ragContext}` : ''}

INSTRUCTIONS:
Craft a comprehensive, high-level industrial prompt using the following structured sections:
1. [ROLE & PERSONA]: Define the exact senior expert role (e.g. Principal Systems Architect, Staff React Engineer).
2. [OBJECTIVE]: Pinpoint the exact deliverable and business/engineering objective.
3. [TECHNICAL SPECIFICATIONS]: Precise tech stack, libraries, architecture patterns, and data contracts.
4. [CRITICAL CONSTRAINTS & EDGE CASES]: Strict quality rules, error handling, security (sanitize inputs, auth, rate limits), responsive layout, accessibility.
5. [DELIVERABLE CONTRACT]: Demand complete, production-ready implementation with ZERO pseudocode, ZERO placeholders (e.g. no "// implement here"), and clean modular file breakdown.

IMPORTANT RULES:
- Output ONLY the synthesized industrial prompt ready to be pasted directly into ${targetPlatform}.
- Do NOT add introductory conversational remarks (e.g. "Here is your prompt:").
- Do NOT wrap the entire output in a giant markdown block.
- Preserve all user requirements faithfully while elevating them to enterprise engineering standards.`

    // 1. Try Local Ollama (Privacy-first on-device reasoning)
    const endpoint = req.ollamaEndpoint || 'http://localhost:11434'
    const model = req.ollamaModel || 'llama3.2'

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 7000)

      const response = await fetch(`${endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: `Synthesize industrial prompt for: "${req.userGoal}"` }
          ],
          stream: false,
          options: {
            temperature: 0.2,
            top_p: 0.9
          }
        }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const text = data?.message?.content?.trim()
        if (text && text.length > 80) {
          return {
            industrialPrompt: text,
            targetPlatform,
            category: 'coding',
            tokensCountEstimate: Math.round(text.length / 4),
            generatedBy: 'local-ollama'
          }
        }
      }
    } catch {
      // Local Ollama offline or timed out -> proceed to Groq cloud
    }

    // 2. Try Groq Cloud (Llama 3.3 70B - sub-300ms speed)
    if (req.apiKey && req.apiKey.trim().length > 10) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 6000)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${req.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: `Synthesize industrial prompt for: "${req.userGoal}"` }
            ],
            temperature: 0.2,
            max_tokens: 1500
          }),
          signal: controller.signal
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const text = data?.choices?.[0]?.message?.content?.trim()
          if (text && text.length > 80) {
            return {
              industrialPrompt: text,
              targetPlatform,
              category: 'coding',
              tokensCountEstimate: Math.round(text.length / 4),
              generatedBy: 'groq-llama'
            }
          }
        }
      } catch (groqErr) {
        console.warn('[PromptArchitect] Groq cloud error, using deterministic rule architect:', groqErr)
      }
    }

    // 3. Deterministic Industrial Rule Architect Fallback (100% offline, zero latency)
    const rulePrompt = this.synthesizeRuleBasedPrompt(req.userGoal, req.context, targetPlatform)
    return {
      industrialPrompt: rulePrompt,
      targetPlatform,
      category: 'coding',
      tokensCountEstimate: Math.round(rulePrompt.length / 4),
      generatedBy: 'rule-architect'
    }
  }

  /**
   * Deterministic High-Level Industrial Prompt Template
   */
  private static synthesizeRuleBasedPrompt(
    goal: string,
    context: SystemContext,
    targetPlatform: string
  ): string {
    const cleanGoal = goal
      .replace(/^(?:so\s+)?ask (?:claude|cloud|claud|chatgpt|gpt|copilot|cursor|ai|assistant) to\s+/i, '')
      .replace(/^(?:so\s+)?(?:create|write|generate|give me|need)\s+a?\s*prompt\s+(?:to|for)?\s*/i, '')
      .replace(/[.,\s]+$/g, '')
      .trim() || goal

    const isFastAPIAuth = /fastapi|faust|jwt|redis|auth middleware/i.test(cleanGoal)
    const isCryptoWebSocket = /crypto|web\s*sockets?|price track/i.test(cleanGoal)
    const isCoding = !/(email|letter|poem|essay|article)/i.test(cleanGoal)

    let role = isCoding
      ? 'Principal Full-Stack Software Engineer & Software Architect'
      : 'Executive Communications Specialist & Subject Matter Expert'

    let specs = [
      '1. **Architecture & Design**: Build modular, clean, readable components following modern industry best practices.',
      '2. **Type Safety & Contracts**: Provide strict TypeScript interfaces / schemas with complete validation.',
      '3. **Error Handling & Resilience**: Implement graceful degradation, meaningful error messages, and loading/empty states.',
      '4. **Security & Performance**: Sanitize all inputs, avoid redundant re-renders or allocations, and adhere to OWASP security guidelines.'
    ]

    if (isFastAPIAuth) {
      role = 'Principal Python Backend Engineer & Security Architect'
      specs = [
        '1. **Architecture & Framework**: FastAPI with Python 3.11+, modular APIRouter, clean dependency injection (Depends) pattern.',
        '2. **Authentication & JWT**: HS256/RS256 signature verification, token expiration (access + refresh), Bearer scheme extraction, constant-time token comparison.',
        '3. **Distributed Rate Limiting**: Redis-backed sliding window or token bucket algorithm with HTTP 429 Too Many Requests, X-RateLimit headers, and Retry-After support.',
        '4. **Security & Resilience**: Fail-closed Redis connection handler, timing attack mitigation, and comprehensive Pydantic v2 schemas.'
      ]
    } else if (isCryptoWebSocket) {
      role = 'Principal Frontend Architect & Real-Time Systems Specialist'
      specs = [
        '1. **Architecture & State**: React 18+ with TypeScript, reactive hooks, and lightweight modular state management.',
        '2. **WebSocket Lifecycle**: Native WebSocket API with automatic exponential backoff reconnection, heartbeat ping-pong, and real-time status indicators.',
        '3. **Design & UX**: Sleek Tailwind CSS dark theme, price change pulse animations (green/red flash), clean ticker cards, and responsive data table.',
        '4. **Performance & Memory**: Batch high-frequency price updates, memoize component renders, and ensure clean unmount teardown with zero memory leaks.'
      ]
    }

    return `# Role & Persona
You are acting as an elite ${role} operating within ${targetPlatform}.

# Primary Objective
Execute the following request with absolute precision, end-to-end completeness, and zero ambiguity:
"${cleanGoal}"

# Context & Environment
- Target Application: ${context.activeApp || 'Desktop Environment'}
- Active Workspace: ${context.windowTitle || 'Primary Workspace'}
${context.clipboardContent ? `- Active Reference Code / Snippet:\n\`\`\`\n${context.clipboardContent.slice(0, 400)}\n\`\`\`` : ''}

# Engineering Specifications & Requirements
${specs.join('\n')}

# Deliverable Contract
- Provide complete, copy-pasteable, production-ready code or content.
- Do NOT include placeholders, ellipses (...), or "// TODO: implement later" comments.
- Structure files with clear header comments indicating their intended file path.`
  }
}
