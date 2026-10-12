import { SystemContext } from '../types/task'
import { ExtractedRequirements } from './intent-classifier'
import { TerminalCommandExtractor } from './terminal-command-extractor'

export interface AdapterResult {
  adapterName: string
  isSupported: boolean
  deliveryMethod: 'paste' | 'clipboard'
  formattedContent: string
  statusMessage: string
}

export class ApplicationAdapterRegistry {
  /**
   * Translates internal intent and requirements into an application-optimized payload
   */
  public static routeAndFormat(
    intent: string,
    rawSpeech: string,
    context: SystemContext,
    requirements: ExtractedRequirements,
    dictationMode?: 'direct' | 'smart_assistant'
  ): AdapterResult {
    // 0a. Terminal & CLI Command Synthesis (Git, npm, shell operations)
    if (TerminalCommandExtractor.isTerminalIntent(rawSpeech, context.activeApp)) {
      const termRes = TerminalCommandExtractor.extractCommand(rawSpeech)
      if (termRes.isTerminalCommand) {
        return {
          adapterName: 'terminal_command',
          isSupported: true,
          deliveryMethod: 'paste',
          formattedContent: termRes.command,
          statusMessage: termRes.explanation
        }
      }
    }

    const isExplicitPromptRequest =
      /(?:prompt:|task:|create a prompt|write a prompt|generate a prompt|engineered prompt|give me a prompt|need a prompt|give me the prompt|ask (?:claude|cloud|claud|chatgpt|gpt|copilot|cursor|ai|assistant|llm|deepseek|gemini)|(?:give|write|create|generate).+prompt)/i.test(
        rawSpeech.trim()
      )

    const app = context.activeApp.toLowerCase()
    const title = context.windowTitle.toLowerCase()

    // 0a. Chat Applications (Slack, Teams, Discord)
    if (app.includes('slack') || app.includes('teams') || app.includes('discord')) {
      return {
        adapterName: 'slack',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatChatMessage(rawSpeech, requirements),
        statusMessage: `Formatted message for ${context.activeApp}.`
      }
    }

    // 0b. Email & Meeting Scheduling (Takes precedence over IDE code scaffold and dictation fallback)
    const isCommRequest =
      intent === 'reply' ||
      /(?:schedule a meeting|schedule meeting|meeting tomorrow|write a mail|write an email|draft an email|draft a mail|draft note|draft a note|make it as a draft|send an email|update the team|do not send the mail)/i.test(
        rawSpeech
      )

    if (isCommRequest) {
      return {
        adapterName: 'gmail',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatEmailDraft(rawSpeech, requirements, context),
        statusMessage: 'Prepared meeting / email invitation draft.'
      }
    }

    // 0c. Dictation: If not an explicit task or in direct mode (and not explicit prompt request), return pure verbatim polished dictation
    if ((requirements.isTask === false || dictationMode === 'direct') && !isExplicitPromptRequest) {
      return {
        adapterName: 'direct_dictation',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: rawSpeech.trim(),
        statusMessage: `Dictated directly into ${context.activeApp || 'active window'}.`
      }
    }

    // 1. Antigravity IDE / Windsurf / AI Code Editors
    if (app.includes('antigravity') || title.includes('antigravity') || app.includes('windsurf')) {
      return {
        adapterName: 'antigravity_composer',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatAntigravityPrompt(rawSpeech, requirements, context),
        statusMessage: 'Engineered prompt for Antigravity AI Assistant.'
      }
    }

    // 2. Cursor IDE (Composer adapter)
    if (app.includes('cursor')) {
      return {
        adapterName: 'cursor_composer',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatCursorPrompt(rawSpeech, requirements, context),
        statusMessage: 'Formatted for Cursor Composer.'
      }
    }

    // 3. VS Code (Copilot / Editor adapter)
    if (app.includes('code') || app.includes('visual studio')) {
      return {
        adapterName: 'vscode',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatVsCodePrompt(rawSpeech, requirements, context),
        statusMessage: 'Formatted for VS Code.'
      }
    }

    // 4. Gmail & Email Clients
    if (app.includes('outlook') || app.includes('thunderbird') || title.includes('gmail') || title.includes('mail')) {
      return {
        adapterName: 'gmail',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatEmailDraft(rawSpeech, requirements, context),
        statusMessage: 'Draft prepared for Gmail / Email client.'
      }
    }

    // 5. Slack & Teams & Discord
    if (app.includes('slack') || app.includes('teams') || app.includes('discord')) {
      return {
        adapterName: 'slack',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatChatMessage(rawSpeech, requirements),
        statusMessage: `Formatted message for ${context.activeApp}.`
      }
    }

    // 6. ChatGPT (Browser tab)
    if (title.includes('chatgpt') || title.includes('openai')) {
      return {
        adapterName: 'chatgpt',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatChatGptPrompt(rawSpeech, requirements),
        statusMessage: 'Engineered prompt for ChatGPT.'
      }
    }

    // 7. Claude (Browser tab)
    if (title.includes('claude') || title.includes('anthropic')) {
      return {
        adapterName: 'claude',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: this.formatClaudePrompt(rawSpeech, requirements),
        statusMessage: 'Engineered prompt for Claude.'
      }
    }

    // 8. Windows File Explorer
    if (app.includes('explorer') || title.includes('file explorer') || title.includes('this pc')) {
      return {
        adapterName: 'file_explorer',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: rawSpeech.trim(),
        statusMessage: 'Ready for File Explorer navigation or search.'
      }
    }

    // 9. Plain Text Editors (Notepad, Word, TextEdit)
    if (app.includes('notepad') || app.includes('winword') || app.includes('notes')) {
      return {
        adapterName: 'plaintext',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: isExplicitPromptRequest
          ? this.formatUniversalPrompt(rawSpeech, requirements, context)
          : rawSpeech.trim(),
        statusMessage: isExplicitPromptRequest
          ? `Engineered prompt inserted into ${context.activeApp}.`
          : `Text inserted into ${context.activeApp}.`
      }
    }

    // 10. General Browser Search
    if (context.detectedCategory === 'browser') {
      if (isExplicitPromptRequest) {
        return {
          adapterName: 'browser',
          isSupported: true,
          deliveryMethod: 'paste',
          formattedContent: this.formatUniversalPrompt(rawSpeech, requirements, context),
          statusMessage: 'Engineered prompt prepared for browser.'
        }
      }
      return {
        adapterName: 'browser',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: rawSpeech.replace(/search for|look up|find me/gi, '').trim(),
        statusMessage: 'Search query prepared for browser.'
      }
    }

    // 11. Terminal / Command Line
    if (app.includes('terminal') || title.includes('terminal') || app.includes('powershell') || app.includes('cmd')) {
      return {
        adapterName: 'terminal_and_ide',
        isSupported: true,
        deliveryMethod: 'paste',
        formattedContent: isExplicitPromptRequest
          ? this.formatUniversalPrompt(rawSpeech, requirements, context)
          : rawSpeech.trim(),
        statusMessage: isExplicitPromptRequest
          ? `Engineered prompt prepared for ${context.activeApp || 'IDE / Terminal'}.`
          : `Inserted into ${context.activeApp || 'IDE / Terminal'}.`
      }
    }

    // 12. Universal Application Fallback (Works everywhere: chat, browsers, forms, any focused input)
    return {
      adapterName: 'universal_input',
      isSupported: true,
      deliveryMethod: 'paste',
      formattedContent: isExplicitPromptRequest
        ? this.formatUniversalPrompt(rawSpeech, requirements, context)
        : rawSpeech.trim(),
      statusMessage: isExplicitPromptRequest
        ? 'Engineered prompt generated.'
        : `Inserted into ${context.activeApp || 'active application'}.`
    }
  }

  public static cleanMetaSpeech(speech: string): string {
    let text = speech
      // Remove trailing prompt request phrases
      .replace(
        /(i need a prompt for that so give me a prompt for that thing|so give me a prompt for that thing|give me a prompt for that thing|i need a prompt for that|i need a prompt for this|give me a prompt for that|give me a prompt for this|give me a prompt|generate a prompt for that|write a prompt for that|create a prompt for that|so give me a prompt|give me the prompt|give me a prompt for it|give me a prompt please)/gi,
        ''
      )
      .trim()

    // Remove spoken intro meta-commentary and conversational preambles
    text = text
      .replace(/(\b|^)(so\s+)?i'm speaking this (one\s+)?so you can see it[.,]?\s*/gi, '')
      .replace(/(\b|^)(so\s+)?these are the logs currently in the terminal[.,]?\s*/gi, '')
      .replace(/(\b|^)(so\s+)?i'm not satisfied with the output[.,]?\s*/gi, '')
      .replace(/^(so\s+)?we are working on (some|an|our) application[.,]?\s*(i want you to\s*)?/i, '')
      .replace(/^(so\s+)?here's a task(\s+for\s+you)?[:\s,-]*/i, '')
      .replace(/^(so\s+)?the end of the goal is to\s*/i, '')
      .replace(/^(so\s+)?the goal is to\s*/i, '')
      .replace(/^(so\s+)?based upon what we discussed[.:,;]?\s*/i, '')
      .replace(/^(so\s+)?basically what (i want|i need|we want|we need) (is to|is)?\s*/i, '')
      .replace(/^(so\s+)?what i'm trying to do is\s*/i, '')
      .replace(/^(so\s+)?what we're trying to do is\s*/i, '')
      .replace(/^(so\s+)?i want you to\s*/i, '')
      .replace(/^(so\s+)?i need you to\s*/i, '')
      .replace(/^(so\s+)?ask (?:claude|cloud|claud|chatgpt|gpt|copilot|cursor|ai|assistant) to\s+/i, '')
      .replace(/^(so\s+)?in the terminal,?\s*/i, '')
      .replace(/^(so\s+)?can you (please\s+)?(help me\s+)?(build|create|write|make|generate)\s*/i, '$4 ')
      .replace(/^(so\s+)?could you (please\s+)?(help me\s+)?(build|create|write|make|generate)\s*/i, '$4 ')
      .replace(/^(so\s+)?can you write an? email for that\??\s*/i, '')
      .replace(/^(so\s+)?write an? email to (?:my\s+)?(?:manager|team|boss|them)\s+(?:requesting|asking for)?\s*/i, '')
      .replace(/^(so\s+)?reply to (?:that|the|this) email\s+(?:agreeing to|asking for)?\s*/i, '')
      .replace(/[.,\s]*(?:write (?:the )?commands? for that|write (?:the )?commands?)[.,\s]*$/i, '')
      .replace(/^prompt:\s*/i, '')
      .replace(/^task:\s*/i, '')
      .replace(/[.,\s]+$/g, '')
      .trim()

    return text
  }

  private static formatUniversalPrompt(
    speech: string,
    req: ExtractedRequirements,
    context: SystemContext
  ): string {
    const cleaned = this.cleanMetaSpeech(speech) || speech.trim()
    const stack = req.technologies.length > 0 ? req.technologies.join(', ') : 'HTML5, Modern CSS / Tailwind, JavaScript'
    const styling = req.styling.length > 0 ? req.styling.join(', ') : 'Modern, responsive, production-ready'
    const sections =
      req.sections.length > 0
        ? `\n\nCORE SECTIONS & MODULES:\n${req.sections.map((s) => `- ${s}`).join('\n')}`
        : ''
    const constraintsList = [
      'Clean semantic code structure with zero placeholder text',
      'Fully responsive across desktop, tablet, and mobile devices',
      ...(req.constraints || [])
    ]
    const constraints = `\n\nCONSTRAINTS:\n${constraintsList.map((c) => `- ${c}`).join('\n')}`

    return `TASK:
${cleaned}

TECHNOLOGY STACK:
- ${stack}

DESIGN & ARCHITECTURE:
- ${styling}
- Clean semantic code structure with zero placeholder text
- Fully responsive across desktop, tablet, and mobile devices${sections}${constraints}

DELIVERABLES:
- Complete, functional, copy-pasteable files ready to run.`
  }

  private static formatAntigravityPrompt(
    speech: string,
    req: ExtractedRequirements,
    context: SystemContext
  ): string {
    const cleaned = this.cleanMetaSpeech(speech) || speech.trim()
    const stack = req.technologies.length > 0 ? req.technologies.join(', ') : 'TypeScript, React, Node.js'
    const styling = req.styling.length > 0 ? req.styling.join(', ') : 'Clean, robust, type-safe'
    const sections =
      req.sections.length > 0
        ? `\n\nCORE SECTIONS & MODULES:\n${req.sections.map((s) => `- ${s}`).join('\n')}`
        : ''
    const constraintsList = [
      ...(req.constraints || [])
    ]
    const constraints = constraintsList.length > 0 ? `\n\nCONSTRAINTS:\n${constraintsList.map((c) => `- ${c}`).join('\n')}` : ''

    return `TASK:
${cleaned}

SPECIFICATIONS & REQUIREMENTS:
- Technologies: ${stack}
- Architecture / Styling: ${styling}
- Active Context: ${context.windowTitle || 'Current Workspace'}${sections}${constraints}`
  }

  private static formatCursorPrompt(
    speech: string,
    req: ExtractedRequirements,
    context: SystemContext
  ): string {
    const cleaned = this.cleanMetaSpeech(speech) || speech.trim()
    const stack = req.technologies.length > 0 ? req.technologies.join(', ') : 'HTML5, CSS3, JavaScript'
    const styling = req.styling.length > 0 ? req.styling.join(', ') : 'Modern, responsive, dark theme'
    const sections =
      req.sections.length > 0
        ? `\n\nSECTIONS & COMPONENTS:\n${req.sections.map((s) => `- ${s}`).join('\n')}`
        : ''

    return `TASK: ${cleaned}

TECHNOLOGY:
- ${stack}

DESIGN & ARCHITECTURE:
- ${styling}
- Ensure modular component structure
- Provide complete working files (no placeholders)${sections}

CONTEXT:
Active File: ${context.windowTitle || 'Unknown'}`
  }

  private static formatVsCodePrompt(
    speech: string,
    req: ExtractedRequirements,
    context: SystemContext
  ): string {
    const cleaned = this.cleanMetaSpeech(speech) || speech.trim()
    const sections = req.sections.length > 0 ? `\n// Sections: ${req.sections.join(', ')}` : ''
    return `// Instruction: ${cleaned}
// Requirements: ${req.technologies.join(', ') || 'Standard stack'}${sections}
// Target: ${context.windowTitle || 'active file'}`
  }

  private static formatEmailDraft(
    speech: string,
    req: ExtractedRequirements,
    context: SystemContext
  ): string {
    const isDraftOnly = /(?:do not send|don't send|just make it as a draft|draft note|draft only)/i.test(speech)
    const isMeeting = /(?:meeting|schedule|sync|catch up|discussion|update the team)/i.test(speech)

    // Extract time / day details if present
    const timeMatch = speech.match(/\b(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i)
    const dayMatch = speech.match(/\b(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)
    const timeStr = timeMatch ? timeMatch[1] : '10:00 AM'
    const dayStr = dayMatch ? dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1) : 'Tomorrow'

    let draft = ''
    if (isMeeting) {
      const subject = `Subject: Team Sync & Production Update - ${dayStr} at ${timeStr}`
      const body = `Hi Team,

I would like to schedule a team meeting for ${dayStr.toLowerCase()} at ${timeStr} to align on our current status, discuss production readiness, and review action items.

Agenda:
• Production release overview & timeline
• Review pending blockers and QA status
• Team Q&A and next steps

Please let me know if you have any scheduling conflicts.

Best regards,
Engineering Team`

      draft = `${subject}\n\n${body}`
    } else {
      let core = speech
        .replace(/^(?:write a mail|write an email|send an email|draft an email|draft a mail|reply to this email saying|reply saying|tell him|tell her|tell them)\s*(?:to\s+)?/gi, '')
        .trim()
      if (!core) core = speech.trim()

      draft = `Subject: Update Regarding Project Status\n\nHi,\n\n${core.charAt(0).toUpperCase() + core.slice(1)}.\n\nPlease let me know if you need any additional information.\n\nBest regards,\n[Your Name]`
    }

    if (isDraftOnly) {
      draft = `[DRAFT NOTE - DO NOT SEND]\n\n${draft}`
    }

    return draft
  }

  private static formatChatMessage(speech: string, req: ExtractedRequirements): string {
    const core = speech.replace(/tell him|tell her|tell them|saying/gi, '').trim()
    return core.charAt(0).toUpperCase() + core.slice(1)
  }

  private static formatChatGptPrompt(speech: string, req: ExtractedRequirements): string {
    return `Please act as a senior expert.

GOAL:
${speech.trim()}

SPECIFICATIONS:
${req.technologies.map((t) => `- ${t}`).join('\n') || '- Production quality'}
${req.styling.map((s) => `- ${s}`).join('\n')}

OUTPUT FORMAT:
Provide comprehensive, step-by-step, production-ready code with explanations.`
  }

  private static formatClaudePrompt(speech: string, req: ExtractedRequirements): string {
    return `<instruction>
${speech.trim()}
</instruction>

<requirements>
${req.technologies.map((t) => `<tech>${t}</tech>`).join('\n') || '<tech>Clean Standard</tech>'}
${req.styling.map((s) => `<style>${s}</style>`).join('\n')}
</requirements>`
  }
}
