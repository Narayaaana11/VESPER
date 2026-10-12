import { describe, it, expect } from 'vitest'
import { ApplicationAdapterRegistry } from '../../src/renderer/src/core/adapters'
import { SystemContext } from '../../src/renderer/src/types/task'
import { ExtractedRequirements } from '../../src/renderer/src/core/intent-classifier'

describe('ApplicationAdapterRegistry - Routing & Output Formatting', () => {
  const dummyReq: ExtractedRequirements = {
    technologies: ['React', 'Tailwind CSS'],
    styling: ['Dark mode'],
    sections: ['Hero', 'Contact'],
    constraints: [],
    isExplicitCode: true
  }

  it('routes to Cursor Composer when active app is Cursor', () => {
    const context: SystemContext = {
      activeApp: 'Cursor',
      windowTitle: 'App.tsx',
      detectedCategory: 'code'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat('code', 'Create landing page', context, dummyReq)
    expect(res.adapterName).toBe('cursor_composer')
    expect(res.isSupported).toBe(true)
    expect(res.formattedContent).toContain('TASK: Create landing page')
    expect(res.formattedContent).toContain('TECHNOLOGY:')
  })

  it('routes to VS Code when active app is Code', () => {
    const context: SystemContext = {
      activeApp: 'VS Code',
      windowTitle: 'main.py',
      detectedCategory: 'code'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat('code', 'Fix function', context, dummyReq)
    expect(res.adapterName).toBe('vscode')
    expect(res.isSupported).toBe(true)
  })

  it('routes to Gmail when in Chrome on Gmail tab', () => {
    const context: SystemContext = {
      activeApp: 'Google Chrome',
      windowTitle: 'Gmail - Project discussion',
      detectedCategory: 'communication'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat(
      'reply',
      'Reply saying I will attend tomorrow at 3 PM',
      context,
      { ...dummyReq, tone: 'Professional' }
    )
    expect(res.adapterName).toBe('gmail')
    expect(res.isSupported).toBe(true)
    expect(res.formattedContent).toContain('Hi,')
    expect(res.formattedContent).toContain('attend tomorrow at 3 PM')
  })

  it('routes to Slack when in Slack app', () => {
    const context: SystemContext = {
      activeApp: 'Slack',
      windowTitle: '#engineering',
      detectedCategory: 'communication'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat('reply', 'Tell him I will be ten minutes late', context, dummyReq)
    expect(res.adapterName).toBe('slack')
    expect(res.isSupported).toBe(true)
    expect(res.formattedContent).toContain('I will be ten minutes late')
  })

  it('routes to File Explorer when active app is Windows Explorer', () => {
    const context: SystemContext = {
      activeApp: 'Explorer.EXE',
      windowTitle: 'Projects - File Explorer',
      detectedCategory: 'general'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat('navigate', 'Open Documents', context, dummyReq)
    expect(res.adapterName).toBe('file_explorer')
    expect(res.isSupported).toBe(true)
    expect(res.statusMessage).toContain('File Explorer')
  })

  it('provides universal input routing for any application or chat input box', () => {
    const context: SystemContext = {
      activeApp: 'CustomLegacyTool.exe',
      windowTitle: 'Main Window',
      detectedCategory: 'general'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat('write', 'Some text', context, dummyReq)
    expect(res.adapterName).toBe('universal_input')
    expect(res.isSupported).toBe(true)
    expect(res.deliveryMethod).toBe('paste')
    expect(res.formattedContent).toBe('Some text')
    expect(res.statusMessage).toContain('Inserted into')
  })

  it('outputs raw clean speech verbatim in direct dictation mode without template boilerplate', () => {
    const context: SystemContext = {
      activeApp: 'Cursor',
      windowTitle: 'App.tsx - VESPER',
      detectedCategory: 'code'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat(
      'code',
      'Please write a function that adds two numbers',
      context,
      dummyReq,
      'direct'
    )

    expect(res.adapterName).toBe('direct_dictation')
    expect(res.formattedContent).toBe('Please write a function that adds two numbers')
    expect(res.formattedContent).not.toContain('TASK:')
    expect(res.formattedContent).not.toContain('TECHNOLOGY:')
  })

  it('routes to Antigravity Composer with engineered prompt when in Antigravity IDE', () => {
    const context: SystemContext = {
      activeApp: 'Antigravity IDE',
      windowTitle: 'ai-provider.test.ts - VESPER',
      detectedCategory: 'code'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat(
      'code',
      'Fix the bug with the token refresh failing on 401 authorization requests',
      context,
      { ...dummyReq, technologies: ['TypeScript', 'JWT'], constraints: ['Preserve exact runtime behavior'] },
      'smart_assistant'
    )

    expect(res.adapterName).toBe('antigravity_composer')
    expect(res.isSupported).toBe(true)
    expect(res.formattedContent).toContain('TASK:')
    expect(res.formattedContent).toContain('SPECIFICATIONS & REQUIREMENTS:')
    expect(res.formattedContent).toContain('JWT')
    expect(res.formattedContent).toContain('CONSTRAINTS:')
    expect(res.formattedContent).toContain('Preserve exact runtime behavior')
  })

  it('generates engineered prompt even in direct mode when user explicitly requests a prompt', () => {
    const context: SystemContext = {
      activeApp: 'Antigravity IDE',
      windowTitle: 'ai-provider.test.ts - VESPER',
      detectedCategory: 'code'
    }

    const res = ApplicationAdapterRegistry.routeAndFormat(
      'code',
      'Prompt: Refit component to use React custom hook and clean up state management',
      context,
      dummyReq,
      'direct'
    )

    expect(res.adapterName).toBe('antigravity_composer')
    expect(res.formattedContent).toContain('TASK:')
  })

  it('cleans meta-speech chatter ("I need a prompt for that...") and formats restaurant landing page prompt', () => {
    const context: SystemContext = {
      activeApp: 'Antigravity IDE',
      windowTitle: 'App.tsx - VESPER',
      detectedCategory: 'code'
    }

    const restaurantReq: ExtractedRequirements = {
      technologies: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      styling: ['Dark luxury theme (warm charcoal, gold accents)', 'Micro-animations'],
      sections: ['Interactive Menu with Pricing & Dietary Tags', 'Table Reservation Booking Modal', 'Customer Testimonials & Reviews'],
      constraints: ['Zero placeholder content'],
      isExplicitCode: true,
      isTask: true
    }

    const speech = 'Create a website for a restaurant landing page. I need a prompt for that so give me a prompt for that thing.'
    const res = ApplicationAdapterRegistry.routeAndFormat('code', speech, context, restaurantReq, 'direct')

    expect(res.adapterName).toBe('antigravity_composer')
    expect(res.formattedContent).toContain('TASK:\nCreate a website for a restaurant landing page')
    expect(res.formattedContent).not.toContain('I need a prompt for that so give me a prompt for that thing')
    expect(res.formattedContent).toContain('Interactive Menu with Pricing & Dietary Tags')
    expect(res.formattedContent).toContain('Table Reservation Booking Modal')
    expect(res.formattedContent).toContain('Dark luxury theme')
  })

  it('generates rich universal engineered prompt when prompt requested in generic app or notepad', () => {
    const context: SystemContext = {
      activeApp: 'Notepad',
      windowTitle: 'Untitled - Notepad',
      detectedCategory: 'document'
    }

    const restaurantReq: ExtractedRequirements = {
      technologies: ['HTML5', 'Modern CSS / Tailwind', 'JavaScript'],
      styling: ['Dark luxury theme', 'Mobile responsive'],
      sections: ['Interactive Menu', 'Table Reservation'],
      constraints: [],
      isExplicitCode: true,
      isTask: true
    }

    const speech = 'Create a website for a restaurant landing page. Give me a prompt for that'
    const res = ApplicationAdapterRegistry.routeAndFormat('code', speech, context, restaurantReq, 'smart_assistant')

    expect(res.adapterName).toBe('plaintext')
    expect(res.formattedContent).toContain('TASK:\nCreate a website for a restaurant landing page')
    expect(res.formattedContent).toContain('TECHNOLOGY STACK:')
    expect(res.formattedContent).toContain('CORE SECTIONS & MODULES:')
    expect(res.formattedContent).toContain('DELIVERABLES:')
  })

  it('cleanMetaSpeech strips conversational prefixes ("So here\'s a task for you...", "the end of the goal is to...")', () => {
    const speech =
      "So here's a task for you: so the end of the goal is to check whether the entire system is working or not."
    const cleaned = ApplicationAdapterRegistry.cleanMetaSpeech(speech)
    expect(cleaned).toBe('check whether the entire system is working or not')
  })

  it('formats system audit task prompt for Antigravity Composer cleanly without meta speech', () => {
    const context: SystemContext = {
      activeApp: 'Antigravity IDE',
      windowTitle: 'App.tsx - VESPER',
      detectedCategory: 'code'
    }

    const auditReq: ExtractedRequirements = {
      technologies: ['TypeScript', 'Vitest / Unit Tests', 'Electron IPC'],
      styling: ['Robust, clean, type-safe'],
      sections: [
        'Hold-to-Talk Key Detection (WinKeyServer & Key Release)',
        'Ambient Window Context Tracking & OCR/Vision',
        '3-Way Speech Intent Classifier (Dictation, Query, Task)'
      ],
      constraints: [
        'Ensure 0 TypeScript compilation errors (tsc --noEmit)',
        'Verify all unit and integration test suites pass (137+ tests)'
      ],
      isExplicitCode: true,
      isTask: true
    }

    const speech =
      "So here's a task for you: so the end of the goal is to check whether the entire system is working or not. So based upon what we discussed, what are the features that we discussed earlier and how I want it to be worked, so based upon all those things, fully check each and everything whether these things are working or not, and we need to do something to get those things rightly working on."

    const res = ApplicationAdapterRegistry.routeAndFormat('debug', speech, context, auditReq, 'smart_assistant')

    expect(res.adapterName).toBe('antigravity_composer')
    expect(res.formattedContent).toContain('TASK:\ncheck whether the entire system is working or not')
    expect(res.formattedContent).not.toContain("here's a task for you")
    expect(res.formattedContent).not.toContain('the end of the goal is to')
    expect(res.formattedContent).toContain('TypeScript')
    expect(res.formattedContent).toContain('Ensure 0 TypeScript compilation errors (tsc --noEmit)')
    expect(res.formattedContent).toContain('Verify all unit and integration test suites pass (137+ tests)')
  })

  it('cleanMetaSpeech strips conversational preamble ("So we are working on some application. I want you to...")', () => {
    const speech =
      "So we are working on some application. I want you to verify if everything is okay. These are the logs currently in the terminal. I'm speaking this one so you can see it. I'm not satisfied with the output."
    const cleaned = ApplicationAdapterRegistry.cleanMetaSpeech(speech)
    expect(cleaned).toContain('verify if everything is okay')
    expect(cleaned).not.toContain('So we are working on some application')
    expect(cleaned).not.toContain('These are the logs currently in the terminal')
    expect(cleaned).not.toContain("I'm speaking this one so you can see it")
    expect(cleaned).not.toContain("I'm not satisfied with the output")
  })
})



