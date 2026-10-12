import { describe, it, expect } from 'vitest'
import { GuidanceEngine } from '../../src/renderer/src/core/guidance-engine'
import { SystemContext } from '../../src/renderer/src/types/task'

describe('GuidanceEngine (Visual Step-by-Step AI Guidance)', () => {
  const mockContext: SystemContext = {
    activeApp: 'Antigravity IDE',
    windowTitle: 'AgentApprovalCard.tsx - VESPER',
    detectedCategory: 'code'
  }

  it('correctly identifies guidance requests from user natural language', () => {
    expect(GuidanceEngine.isGuidanceRequest('how to close saved tabs')).toBe(true)
    expect(GuidanceEngine.isGuidanceRequest('how do I close saved tabs?')).toBe(true)
    expect(GuidanceEngine.isGuidanceRequest('how do I close the saved tabs')).toBe(true)
    expect(GuidanceEngine.isGuidanceRequest('show me how to export to csv')).toBe(true)
    expect(GuidanceEngine.isGuidanceRequest('where is the terminal')).toBe(true)
    expect(GuidanceEngine.isGuidanceRequest('how to format code')).toBe(true)

    // Non-guidance requests
    expect(GuidanceEngine.isGuidanceRequest('schedule a meeting tomorrow at 10am')).toBe(false)
    expect(GuidanceEngine.isGuidanceRequest('build a real-time crypto app')).toBe(false)
    expect(GuidanceEngine.isGuidanceRequest('fix the token refresh bug')).toBe(false)
  })

  it('generates the exact multi-step workflow for closing saved tabs', () => {
    const wf = GuidanceEngine.getWorkflow('how to close saved tabs', mockContext)
    expect(wf.id).toBe('close_saved_tabs')
    expect(wf.steps).toHaveLength(2)

    // Step 1: More actions
    const step1 = wf.steps[0]
    expect(step1.stepIndex).toBe(1)
    expect(step1.targetElement).toBe('Tab Actions (•••)')
    expect(step1.coordinates).toEqual({ x: 310, y: 40 })
    expect(step1.actionButtonText).toBe('Click that')
    expect(step1.instruction).toContain('More Actions')

    // Step 2: Close saved
    const step2 = wf.steps[1]
    expect(step2.stepIndex).toBe(2)
    expect(step2.targetElement).toBe('Close Saved')
    expect(step2.coordinates).toEqual({ x: 310, y: 115 })
    expect(step2.actionButtonText).toBe('Click that')
    expect(step2.shortcut).toBe('Ctrl+K U')
  })

  it('generates multi-step workflow for CSV export', () => {
    const wf = GuidanceEngine.getWorkflow('how to export to csv', mockContext)
    expect(wf.id).toBe('export_to_csv')
    expect(wf.steps).toHaveLength(2)
    expect(wf.steps[0].targetElement).toBe('Data Table Actions')
    expect(wf.steps[1].targetElement).toBe('Export as CSV')
  })

  it('generates multi-step workflow for opening terminal', () => {
    const wf = GuidanceEngine.getWorkflow('how to open terminal', mockContext)
    expect(wf.id).toBe('open_terminal')
    expect(wf.steps).toHaveLength(2)
    expect(wf.steps[1].shortcut).toBe('Ctrl+`')
  })

  it('generates fallback multi-step guidance for general questions', () => {
    const wf = GuidanceEngine.getWorkflow('how to do custom action', mockContext)
    expect(wf.id).toBe('general_guidance')
    expect(wf.steps).toHaveLength(2)
    expect(wf.steps[0].stepIndex).toBe(1)
    expect(wf.steps[1].stepIndex).toBe(2)
  })
})
