import { describe, it, expect, vi } from 'vitest'
import { classifyIntent } from '../../src/renderer/src/core/intent-classifier'
import { SecurityGate } from '../../src/renderer/src/core/security-gate'
import { executeScreenAgent } from '../../src/renderer/src/core/screen-agent'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('Autonomous Screen & Chat Copilot Agent Suite', () => {
  const dummyContext: SystemContext = {
    activeApp: 'WhatsApp',
    windowTitle: 'WhatsApp Web - Chat with Alex',
    detectedCategory: 'communication',
    clipboardContent: 'Client: What is the cost for 5 licenses?'
  }

  it('classifies sales and conversation instructions as agent_screen_copilot', () => {
    const speech1 = 'Understand this chat and make this sale to him'
    const res1 = classifyIntent(speech1, dummyContext)

    expect(res1.action).toBe('agent_screen_copilot')
    expect(res1.requirements.isAgentAction).toBe(true)
    expect(res1.requirements.agentGoal).toContain('make this sale')

    const speech2 = 'Understand the conversation and help me sell our product'
    const res2 = classifyIntent(speech2, dummyContext)
    expect(res2.action).toBe('agent_screen_copilot')
    expect(res2.requirements.isAgentAction).toBe(true)
  })

  it('keeps normal conversational speech as standard direct dictation', () => {
    const speech = 'Hey Alex, I will send you the document later today'
    const res = classifyIntent(speech, dummyContext)

    expect(res.action).not.toBe('agent_screen_copilot')
    expect(res.requirements.isAgentAction).toBe(false)
  })

  it('enforces Human-in-the-Loop user confirmation for any autonomous agent action', () => {
    const security = SecurityGate.evaluateRisk('agent_screen_copilot', 'Make this sale to him')

    expect(security.requiresUserConfirmation).toBe(true)
    expect(security.riskLevel).toBe('medium')
    expect(security.warningMessage).toContain('Autonomous Agent')
  })

  it('generates context-aware response for sales pitch using executeScreenAgent', async () => {
    const proposal = await executeScreenAgent({
      userGoal: 'Make this sale offering a discount',
      context: dummyContext
    })

    expect(proposal.requiresApproval).toBe(true)
    expect(proposal.targetApp).toBe('WhatsApp')
    expect(proposal.draftedReply).toBeTruthy()
    expect(proposal.draftedReply.toLowerCase()).toContain('demo')
  })

  it('analyzes screen with Vision API when screenshot and API key are provided', async () => {
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content:
                    'Hi Alex, we can offer a 15% discount for 5 licenses if onboarded this week. Would you like me to send the invoice?'
                }
              }
            ]
          })
      })
    )

    const proposal = await executeScreenAgent({
      userGoal: 'Offer a 15% discount and close the deal',
      context: dummyContext,
      screenshotBase64: 'data:image/jpeg;base64,fakeimgdata',
      apiKey: 'gsk_test123'
    })

    expect(proposal.requiresApproval).toBe(true)
    expect(proposal.draftedReply).toContain('15% discount')
    expect(proposal.draftedReply).toContain('Alex')
  })
})
