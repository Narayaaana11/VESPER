import { SystemContext } from '../types/task'

export interface ScreenAgentRequest {
  userGoal: string
  context: SystemContext
  screenshotBase64?: string | null
  apiKey?: string
  aiProvider?: string
}

export interface ScreenAgentResult {
  draftedReply: string
  contextSummary: string
  targetApp: string
  requiresApproval: boolean
}

/**
 * Autonomous Screen & Chat Intelligence Agent
 * Reads conversation context on screen (WhatsApp, Slack, LinkedIn, CRM) and formulates goal-driven responses.
 */
export async function executeScreenAgent(
  req: ScreenAgentRequest
): Promise<ScreenAgentResult> {
  const activeApp = req.context.activeApp || 'Active Chat'
  const goal = req.userGoal.trim()

  // 1. Multimodal Vision path (Groq llama-3.2-11b-vision-preview / Cloud Vision)
  if (req.apiKey && req.screenshotBase64) {
    try {
      const visionResult = await analyzeScreenWithVision(
        req.screenshotBase64,
        goal,
        req.context,
        req.apiKey
      )
      if (visionResult) {
        return {
          draftedReply: visionResult,
          contextSummary: `Generated response based on ${activeApp} screen context`,
          targetApp: activeApp,
          requiresApproval: true
        }
      }
    } catch (err) {
      console.warn('[VESPER ScreenAgent] Vision analysis error, falling back to text engine:', err)
    }
  }

  // 2. Text-Based LLM fallback (Groq Llama 3.3 / Local)
  if (req.apiKey) {
    try {
      const textResult = await analyzeWithTextLlm(goal, req.context, req.apiKey)
      if (textResult) {
        return {
          draftedReply: textResult,
          contextSummary: `Context-aware draft for ${activeApp}`,
          targetApp: activeApp,
          requiresApproval: true
        }
      }
    } catch (err) {
      console.warn('[VESPER ScreenAgent] Text LLM error:', err)
    }
  }

  // 3. Rule-based offline heuristic fallback
  const fallbackDraft = generateOfflineAgentDraft(goal, activeApp)
  return {
    draftedReply: fallbackDraft,
    contextSummary: `Draft prepared for ${activeApp}`,
    targetApp: activeApp,
    requiresApproval: true
  }
}

/**
 * Sends screen image to Groq Vision model (llama-3.2-11b-vision-preview)
 */
async function analyzeScreenWithVision(
  imageDataUrl: string,
  userGoal: string,
  context: SystemContext,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are VESPER's Screen & Chat Intelligence Agent.
The user is viewing an active conversation or application on screen (${context.activeApp} - "${context.windowTitle}").
The user's goal is: "${userGoal}".

INSTRUCTIONS:
1. Examine the on-screen conversation (the other party's latest messages, questions, pricing concerns, or topic).
2. Formulate the single best conversational reply that accomplishes the user's goal (e.g. closing a sale, handling objections, answering questions, or booking a call).
3. Tone: Friendly, concise, professional, and natural for messaging apps (WhatsApp/Slack/LinkedIn). Avoid robotic corporate speak.
4. Output ONLY the drafted message text. Do NOT include greetings to the user, markdown code blocks, commentary, or explanations.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Here is the current screen. Please craft the ideal response to achieve this goal: "${userGoal}"`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl.startsWith('data:') ? imageDataUrl : `data:image/jpeg;base64,${imageDataUrl}`
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 512
    })
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.warn(`[VESPER ScreenAgent] Vision API returned ${response.status}:`, errText)
    return null
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || null
}

/**
 * Text-based LLM analysis fallback using Llama 3.3 70B
 */
async function analyzeWithTextLlm(
  userGoal: string,
  context: SystemContext,
  apiKey: string
): Promise<string | null> {
  const systemPrompt = `You are VESPER's Screen & Chat Intelligence Agent.
The user is working in ${context.activeApp} ("${context.windowTitle}").
Recent clipboard content if relevant: "${context.clipboardContent || 'None'}".
The user wants to accomplish this conversational or workflow goal: "${userGoal}".

Craft the optimal, high-converting, courteous, natural message for ${context.activeApp}.
Output ONLY the message text itself. No preamble, no quotes, no commentary.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userGoal }
      ],
      temperature: 0.2,
      max_tokens: 512
    })
  })

  if (!response.ok) return null
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || null
}

/**
 * Offline heuristic fallback for zero-latency local execution
 */
function generateOfflineAgentDraft(goal: string, _app: string): string {
  const lower = goal.toLowerCase()
  if (lower.includes('sale') || lower.includes('sell') || lower.includes('discount')) {
    return `Hi! Thanks for reaching out. We would love to assist you with this. We're currently offering special onboarding terms: would you be open to a quick 10-minute demo this week?`
  }
  if (lower.includes('meet') || lower.includes('schedule') || lower.includes('call')) {
    return `Sounds great! Does tomorrow afternoon or Thursday morning work best on your end for a quick sync?`
  }
  return `Hi, thank you for your message. Regarding your inquiry, I've reviewed the details and would be glad to help move this forward.`
}
