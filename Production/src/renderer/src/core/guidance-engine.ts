import { SystemContext } from '../types/task'
import { GuidanceStep } from '../components/AICursorOverlay'

export interface GuidanceWorkflow {
  id: string
  intent: string
  title: string
  steps: GuidanceStep[]
}

/**
 * VESPER Visual Step-by-Step AI Guidance Engine
 * Translates procedural "how-to" questions into interactive, multi-step screen cursor animations
 * with animated halo indicators, pointer arrows, and floating callout cards.
 */
export class GuidanceEngine {
  /**
   * Checks whether the user's input is a procedural guidance / "how to" request
   */
  public static isGuidanceRequest(rawText: string): boolean {
    const text = rawText.toLowerCase().trim()
    return (
      text.startsWith('how to') ||
      text.startsWith('how do i') ||
      text.startsWith('how can i') ||
      text.startsWith('show me how') ||
      text.startsWith('show me where') ||
      text.startsWith('where is') ||
      text.startsWith('navigate to') ||
      text.startsWith('help me find') ||
      text.startsWith('guide me to') ||
      text.includes('how to close') ||
      text.includes('how do i close') ||
      text.includes('how to export') ||
      text.includes('how to open') ||
      text.includes('how to format') ||
      (text.includes('can you tell me how') && (text.includes('close') || text.includes('tab') || text.includes('export') || text.includes('open')))
    )
  }

  /**
   * Resolves a multi-step GuidanceWorkflow with exact coordinates, halo indicators, and instructions
   */
  public static getWorkflow(query: string, context?: SystemContext): GuidanceWorkflow {
    const text = (query || '').toLowerCase().trim()
    const app = context?.activeApp || 'Antigravity IDE'

    // 1. Workflow: Close Saved Tabs / Close All Tabs (The user's specific request!)
    if (
      (text.includes('close') && (text.includes('tab') || text.includes('file'))) ||
      text.includes('close saved')
    ) {
      return {
        id: 'close_saved_tabs',
        intent: 'close_saved_tabs',
        title: `Close Saved Tabs in ${app}`,
        steps: [
          {
            stepIndex: 1,
            totalSteps: 2,
            title: "Step 1: Click '•••' (More Actions)",
            instruction: "Locate the '•••' (More Actions) button on the editor tab bar, or right-click any open tab header.",
            targetElement: "Tab Actions (•••)",
            coordinates: { x: 310, y: 40 },
            actionButtonText: "Click that"
          },
          {
            stepIndex: 2,
            totalSteps: 2,
            title: "Step 2: Click 'Close Saved'",
            instruction: "Click 'Close Saved' in the dropdown menu (or press shortcut Ctrl+K then U) to close all saved files.",
            targetElement: "Close Saved",
            coordinates: { x: 310, y: 115 },
            actionButtonText: "Click that",
            shortcut: "Ctrl+K U"
          }
        ]
      }
    }

    // 2. Workflow: Export to CSV
    if (text.includes('export') && text.includes('csv')) {
      return {
        id: 'export_to_csv',
        intent: 'export_to_csv',
        title: `Export to CSV in ${app}`,
        steps: [
          {
            stepIndex: 1,
            totalSteps: 2,
            title: "Step 1: Open Table / File Actions",
            instruction: "Right-click the data table or select the action menu header.",
            targetElement: "Data Table Actions",
            coordinates: { x: 270, y: 45 },
            actionButtonText: "Click actions"
          },
          {
            stepIndex: 2,
            totalSteps: 2,
            title: "Step 2: Select 'Export as CSV'",
            instruction: "Select 'Export as CSV' (or generate a Blob URL download) to save the data.",
            targetElement: "Export as CSV",
            coordinates: { x: 270, y: 120 },
            actionButtonText: "Export now"
          }
        ]
      }
    }

    // 3. Workflow: Integrated Terminal
    if (text.includes('terminal') || text.includes('command prompt') || text.includes('console')) {
      return {
        id: 'open_terminal',
        intent: 'open_terminal',
        title: `Open Integrated Terminal in ${app}`,
        steps: [
          {
            stepIndex: 1,
            totalSteps: 2,
            title: "Step 1: Locate Terminal in Menu Bar",
            instruction: "Click 'Terminal' on the top application menu bar.",
            targetElement: "Terminal Menu",
            coordinates: { x: 190, y: 35 },
            actionButtonText: "Click Terminal"
          },
          {
            stepIndex: 2,
            totalSteps: 2,
            title: "Step 2: Click 'New Terminal'",
            instruction: "Select 'New Terminal' (or press Ctrl+` backtick) to launch the shell panel.",
            targetElement: "New Terminal",
            coordinates: { x: 190, y: 105 },
            actionButtonText: "Open shell",
            shortcut: "Ctrl+`"
          }
        ]
      }
    }

    // 4. Workflow: Format Code Document
    if (text.includes('format') || text.includes('prettier') || text.includes('beautify')) {
      return {
        id: 'format_document',
        intent: 'format_document',
        title: `Format Document in ${app}`,
        steps: [
          {
            stepIndex: 1,
            totalSteps: 2,
            title: "Step 1: Right-Click Editor Area",
            instruction: "Right-click inside any code file or open the Command Palette (Ctrl+Shift+P).",
            targetElement: "Code Editor Context",
            coordinates: { x: 240, y: 45 },
            actionButtonText: "Open menu"
          },
          {
            stepIndex: 2,
            totalSteps: 2,
            title: "Step 2: Click 'Format Document'",
            instruction: "Select 'Format Document' (or press shortcut Shift+Alt+F) to format active code.",
            targetElement: "Format Document",
            coordinates: { x: 240, y: 115 },
            actionButtonText: "Format code",
            shortcut: "Shift+Alt+F"
          }
        ]
      }
    }

    // 5. Default Contextual Multi-Step Guidance
    return {
      id: 'general_guidance',
      intent: 'general_guidance',
      title: `Guide: ${app}`,
      steps: [
        {
          stepIndex: 1,
          totalSteps: 2,
          title: "Step 1: Locate Main Action Control",
          instruction: `Locate the primary action control or menu in ${app}. Follow the glowing halo cursor.`,
          targetElement: "Primary Control",
          coordinates: { x: 260, y: 45 },
          actionButtonText: "Click that"
        },
        {
          stepIndex: 2,
          totalSteps: 2,
          title: "Step 2: Select Guided Option",
          instruction: `Choose the target action or press Ctrl+Shift+P to search for "${query.replace(/^(how to|how do i)\s+/i, '')}".`,
          targetElement: "Action Target",
          coordinates: { x: 260, y: 120 },
          actionButtonText: "Complete action"
        }
      ]
    }
  }
}
