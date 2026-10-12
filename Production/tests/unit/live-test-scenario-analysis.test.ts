import { describe, it, expect } from 'vitest'
import { ApplicationAdapterRegistry } from '../../src/renderer/src/core/adapters'
import { TerminalCommandExtractor } from '../../src/renderer/src/core/terminal-command-extractor'
import { PromptArchitect } from '../../src/renderer/src/core/prompt-architect'
import { VisionHarness } from '../../src/renderer/src/core/vision-harness'
import { polishWithLocalRules } from '../../src/renderer/src/core/groq-service'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('VESPER Live User Testing Scenario Analysis & Validation', () => {
  const ideContext: SystemContext = {
    activeApp: 'Antigravity ide',
    windowTitle: 'VESPER - Antigravity IDE - AgentApprovalCard.tsx',
    detectedCategory: 'code',
    clipboardContent: 'Please schedule a meeting tomorrow at 10 am and update the team. The development is basically ready for production tomorrow at 9 am.'
  }

  describe('Scenario 1: Dictation & Conversational Filler Stripping', () => {
    it('strips "basically" from dictated speech', () => {
      const raw = 'The development is basically ready for production tomorrow at 9 am.'
      const polished = polishWithLocalRules(raw, ideContext)

      expect(polished).not.toMatch(/\bbasically\b/i)
      expect(polished).toContain('ready for production')
      expect(polished).toContain('9:00 AM')
    })

    it('corrects meeting time representations cleanly', () => {
      const raw = 'Please schedule a meeting tomorrow at 10 am and update the team.'
      const polished = polishWithLocalRules(raw, ideContext)

      expect(polished).toContain('10:00 AM')
      expect(polished).toContain('update the team')
    })
  })

  describe('Scenario 2: Prompt Creation for Crypto Tracker', () => {
    it('synthesizes high-level industrial prompt with WebSocket and dark theme specifications', async () => {
      const speech = 'Create a prompt to build a real-time reactive crypto price tracking with web sockets in the react and tailwind dark theme.'
      const res = await PromptArchitect.generatePrompt({
        userGoal: speech,
        context: ideContext
      })

      expect(res.industrialPrompt).toBeDefined()
      expect(res.industrialPrompt).toContain('# Role & Persona')
      expect(res.industrialPrompt).toContain('# Primary Objective')
      expect(res.industrialPrompt).toContain('# Engineering Specifications & Requirements')
      expect(res.industrialPrompt).toContain('# Deliverable Contract')
      expect(res.industrialPrompt).toContain('WebSocket')
      expect(res.industrialPrompt).toContain('Tailwind')
    })
  })

  describe('Scenario 3: Phonetic Mishearing & Claude Prompt Synthesis', () => {
    it('corrects "Ask cloud" and "Faust API" to "ask Claude" and "FastAPI"', () => {
      const raw1 = 'Ask cloud to write a fast api auth middleware with JWT tokens and release rate limiting.'
      const polished1 = polishWithLocalRules(raw1, ideContext)
      expect(polished1).toMatch(/ask Claude to/i)
      expect(polished1).toContain('FastAPI')
      expect(polished1).toContain('Redis rate limiting')

      const raw2 = 'Ask Cloud to write a Faust API auth middleware with JWT token and a Redis rate limiting.'
      const polished2 = polishWithLocalRules(raw2, ideContext)
      expect(polished2).toMatch(/ask Claude to/i)
      expect(polished2).toContain('FastAPI')
    })

    it('detects Anthropic Claude platform even when spoken phonetically as cloud', () => {
      const platform = PromptArchitect.detectTargetPlatform(
        'Ask cloud to write a fast api auth middleware with JWT tokens and release rate limiting.',
        ideContext
      )
      expect(platform).toBe('Anthropic Claude')
    })

    it('generates tailored Python & Redis security specifications for FastAPI prompt', async () => {
      const res = await PromptArchitect.generatePrompt({
        userGoal: 'Ask cloud to write a fast api auth middleware with JWT tokens and release rate limiting.',
        context: ideContext
      })

      expect(res.targetPlatform).toBe('Anthropic Claude')
      expect(res.industrialPrompt).toContain('FastAPI')
      expect(res.industrialPrompt).toContain('Redis')
      expect(res.industrialPrompt).toContain('Principal Python Backend Engineer')
    })
  })

  describe('Scenario 4: Executive Email Synthesis (No verbatim raw prompts)', () => {
    it('synthesizes clean executive sick leave email without echoing instructions', async () => {
      const rawSpeech = 'Write an email to my manager requesting 2 days sick leave starting tomorrow.'
      const email = await VisionHarness.draftEmail(rawSpeech, ideContext)

      expect(email.body).toBeDefined()
      expect(email.body).toContain('Dear Manager,')
      expect(email.body).toContain('2 days of sick leave starting tomorrow')
      expect(email.body).not.toContain('Write an email to my manager requesting')
      expect(email.body).toContain('Best regards')
    })

    it('repairs "Repair.gmail" phonetic mishearing to "reply to the email"', () => {
      const raw = 'Repair.gmail agreeing to the proposal but asking for 15% discount on that.'
      const polished = polishWithLocalRules(raw, ideContext)

      expect(polished).toMatch(/reply to the email/i)
      expect(polished).not.toMatch(/repair\.?\s*gmail/i)
    })

    it('synthesizes executive proposal agreement with 15% discount negotiation', async () => {
      const rawSpeech = 'So I got an email and it is related to some proposal. So can you write an email for that? So reply to that email agreeing to that proposal. I am agreeing to that proposal but currently I am asking 15% discount for that.'
      const email = await VisionHarness.draftEmail(rawSpeech, ideContext)

      expect(email.body).toBeDefined()
      expect(email.body).toContain('proposal')
      expect(email.body).toContain('15% discount')
      expect(email.body).not.toContain('So I got an email and it is related')
      expect(email.body).not.toContain('can you write an email for that')
      expect(email.body).toContain('Best regards')
    })
  })

  describe('Scenario 5: Terminal & Git Command Extraction', () => {
    it('translates spoken git commit and push speech into executable chained shell command', () => {
      const speech1 = 'Check the github status and add all files and commit with message fixauth bugs and push to main.'
      const result1 = TerminalCommandExtractor.extractCommand(speech1)

      expect(result1.isTerminalCommand).toBe(true)
      expect(result1.command).toBe('git status && git add -A && git commit -m "fix: auth bugs" && git push origin main')

      const speech2 = 'So in the terminal, check the git status and commit all the things, push the entire code into the github. Write the commands for that.'
      const result2 = TerminalCommandExtractor.extractCommand(speech2)

      expect(result2.isTerminalCommand).toBe(true)
      expect(result2.command).toBe('git status && git add -A && git commit -m "update: sync changes" && git push origin main')
    })

    it('routes terminal command in ApplicationAdapterRegistry even when inside IDE', () => {
      const speech = 'Check the github status and add all files and commit with message fixauth bugs and push to main.'
      const res = ApplicationAdapterRegistry.routeAndFormat(
        'execute',
        speech,
        ideContext,
        {
          technologies: [],
          styling: [],
          sections: [],
          constraints: [],
          isExplicitCode: false,
          isTask: true
        }
      )

      expect(res.adapterName).toBe('terminal_command')
      expect(res.formattedContent).toBe('git status && git add -A && git commit -m "fix: auth bugs" && git push origin main')
    })
  })
})
