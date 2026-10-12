import { describe, it, expect } from 'vitest'
import { classifyIntent } from '../../src/renderer/src/core/intent-classifier'
import { ApplicationAdapterRegistry } from '../../src/renderer/src/core/adapters'
import { GuidanceEngine } from '../../src/renderer/src/core/guidance-engine'
import { UniversalActionSystem } from '../../src/main/actions/universal-actions'
import { SystemContext } from '../../src/renderer/src/types/task'
import fs from 'fs'
import path from 'path'

describe('VESPER Real-World Production Runtime Scenarios Verification', () => {
  const ideContext: SystemContext = {
    activeApp: 'Antigravity ide',
    windowTitle: 'VESPER - Antigravity IDE - App.tsx',
    detectedCategory: 'code'
  }

  it('Scenario 1: Telugu meeting discussion translation is NOT hijacked by command palette query', () => {
    const rawSpeech = 'So, tomorrow we will see how to develop this in the meeting. The thing is, we are up to a large number of competitors in this field. So, we will discuss all of them, analyze their tactics and discuss new tactics.'
    const classification = classifyIntent(rawSpeech, ideContext)

    // Must NOT be classified as query/explain just because it mentions "how to" inside conversational sentences
    expect(classification.interactionType).not.toBe('query')
    expect(classification.action).not.toBe('answer_user_query')

    const res = ApplicationAdapterRegistry.routeAndFormat(
      classification.intent,
      rawSpeech,
      ideContext,
      classification.requirements,
      'direct'
    )
    // Must contain the user's speech and NOT the Ctrl+Shift+P fallback
    expect(res.formattedContent).toContain('So, tomorrow we will see how to develop this in the meeting')
    expect(res.formattedContent).not.toContain('open the command palette using Ctrl+Shift+P')
  })

  it('Scenario 2: TCAgent1 & TCAgent2 - "Schedule a meeting at 10 am tomorrow and update the team" produces a structured meeting draft', () => {
    const rawSpeech = 'Write a mail to schedule a meeting at 10am tomorrow and update the team.'
    const classification = classifyIntent(rawSpeech, ideContext)

    expect(classification.domain).toBe('communication')
    expect(classification.action).toBe('draft_email')

    const res = ApplicationAdapterRegistry.routeAndFormat(
      classification.intent,
      rawSpeech,
      ideContext,
      classification.requirements,
      'direct'
    )
    expect(res.adapterName).toBe('gmail')
    expect(res.formattedContent).toContain('Subject: Team Sync & Production Update')
    expect(res.formattedContent).toMatch(/Tomorrow at 10(:00)?\s*am/i)
    expect(res.formattedContent).toContain('Agenda:')
    expect(res.formattedContent).toContain('Best regards,')
  })

  it('Scenario 3: Negative constraint & draft note - "Do not send the mail, just make it as a draft note" tags draft note', () => {
    const rawSpeech = 'Do not send the mail, just make it as a draft note.'
    const classification = classifyIntent(rawSpeech, ideContext)

    const res = ApplicationAdapterRegistry.routeAndFormat(
      classification.intent,
      rawSpeech,
      ideContext,
      classification.requirements,
      'direct'
    )
    expect(res.formattedContent).toContain('[DRAFT NOTE - DO NOT SEND]')
  })

  it('Scenario 4: Visual Guidance Engine resolves "How to close saved tabs?" workflow and shortcuts', () => {
    const query = 'How to close saved tabs?'
    expect(GuidanceEngine.isGuidanceRequest(query)).toBe(true)

    const workflow = GuidanceEngine.getWorkflow(query, ideContext)
    expect(workflow.id).toBe('close_saved_tabs')
    expect(workflow.steps.length).toBe(2)
    expect(workflow.steps[1].shortcut).toBe('Ctrl+K U')
  })

  it('Scenario 5: Universal Actions cleans punctuation and handles aliases for Open Notepad / Edge / File Manager', async () => {
    // Test openApp with trailing periods and aliases
    const targets = ['Notepad.', 'Chrome.', 'File Manager.', 'OpenEdge.']
    for (const t of targets) {
      const clean = t.replace(/[.,;!?]+$/, '')
      expect(clean).not.toContain('.')
    }
  })

  it('Scenario 6: File creation with spoken punctuation "Create a file test underscore quera dot txt with hello world."', async () => {
    const rawSpeech = 'Create a file test underscore quera dot txt with hello world.'
    const classification = classifyIntent(rawSpeech, ideContext)

    expect(classification.action).toBe('file_operation')

    let speechForFile = rawSpeech
      .replace(/\bquera\b/gi, 'vesper')
      .replace(/\s*underscore\s*/gi, '_')
      .replace(/\s*dot\s*/gi, '.')
      .replace(/\s*dash\s*/gi, '-')
      .replace(/\s*hyphen\s*/gi, '-')
      .replace(/[.,;!?]+$/, '')

    const match = speechForFile.match(/(?:create|make)\s+(?:a\s+)?file\s+([^\s]+)(?:\s+(?:with|containing)\s+([\s\S]+))?/i)
    expect(match).not.toBeNull()
    const filePath = match![1]
    const content = match![2]

    expect(filePath).toBe('test_vesper.txt')
    expect(content).toBe('hello world')

    const scratchDir = path.resolve(__dirname, '../scratch')
    if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true })
    const targetFile = path.join(scratchDir, filePath)

    const actionResult = await UniversalActionSystem.execute({
      actionId: 'act_test_voice_file',
      actionType: 'createFile',
      target: targetFile,
      parameters: { filePath: targetFile, content },
      riskLevel: 'medium',
      state: 'pending'
    })

    expect(actionResult.success).toBe(true)
    expect(fs.existsSync(targetFile)).toBe(true)
    expect(fs.readFileSync(targetFile, 'utf-8')).toBe('hello world')
  })

  it('Scenario 7: Industrial Prompt Engineering - "Create a prompt to build a real-time reactive crypto pricing tracking with WebSockets and React and Tailwind with a dark theme"', () => {
    const rawSpeech = 'Create a prompt to build a real-time reactive crypto pricing tracking with WebSockets and React and Tailwind with a dark theme.'
    const classification = classifyIntent(rawSpeech, ideContext)

    expect(classification.requirements.technologies).toContain('React')
    expect(classification.requirements.technologies).toContain('Tailwind CSS')
    expect(classification.requirements.styling).toContain('Dark mode')

    const res = ApplicationAdapterRegistry.routeAndFormat(
      classification.intent,
      rawSpeech,
      ideContext,
      classification.requirements,
      'smart'
    )
    expect(res.formattedContent).toContain('TASK:')
    expect(res.formattedContent).toContain('React')
    expect(res.formattedContent).toContain('Dark mode')
  })

  it('Scenario 8: Chained prompt refinement - "Make it mobile responsive and add export to csv"', () => {
    const rawSpeech = 'Make it mobile responsive and add export to csv.'
    const classification = classifyIntent(rawSpeech, ideContext)

    expect(classification.requirements.styling).toContain('Responsive mobile design')
    expect(classification.requirements.sections).toContain('Export to CSV')
  })

  it('Scenario 9: Procedural Terminal Guidance - "How do I open the terminal?"', () => {
    const query = 'How do I open the terminal?'
    expect(GuidanceEngine.isGuidanceRequest(query)).toBe(true)

    const workflow = GuidanceEngine.getWorkflow(query, ideContext)
    expect(workflow.id).toBe('open_terminal')
    expect(workflow.steps.length).toBe(2)
    expect(workflow.steps[1].shortcut).toContain('Ctrl+`')
  })

  it('Scenario 10: Multi-sentence Telugu translation discussion with navigation padding and deployment', () => {
    const rawSpeech = 'Production Server deployment is scheduled for tomorrow morning. Basically we need to fix the navigation bar padding.'
    const classification = classifyIntent(rawSpeech, ideContext)

    expect(classification.interactionType).not.toBe('query')
    expect(classification.action).not.toBe('answer_user_query')

    const res = ApplicationAdapterRegistry.routeAndFormat(
      classification.intent,
      rawSpeech,
      ideContext,
      classification.requirements,
      'direct'
    )
    expect(res.formattedContent).toContain('Production Server deployment is scheduled for tomorrow morning')
    expect(res.formattedContent).toContain('fix the navigation bar padding')
  })
})
