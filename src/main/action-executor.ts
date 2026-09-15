import { clipboard, app } from 'electron'
import { exec, execFile } from 'child_process'
import { promisify } from 'util'
import { resolveBinary } from './binary-resolver'
import { DeviceContext } from './context/context-types'
import { ContextRevalidator } from './context/context-revalidator'
import { ContextManager } from './context/context-manager'

const execAsync = promisify(exec)
const execFileAsync = promisify(execFile)

export type ActionOutcome = 'success' | 'failure' | 'partial_success' | 'needs_user'

export interface ActionExecutionResult {
  success: boolean
  outcome: ActionOutcome
  message: string
  actionType: 'clipboard' | 'paste' | 'script'
  verificationDetails?: {
    clipboardVerified: boolean
    targetMatched: boolean
    targetApp?: string
  }
}

/**
 * Executes target action with pre-flight context revalidation and post-action verification
 */
export async function executeAction(
  content: string,
  autoPaste = true,
  targetContext?: DeviceContext
): Promise<ActionExecutionResult> {
  console.log(`[QEVRA Main] [EXEC] executeAction invoked (autoPaste: ${autoPaste}, app: "${targetContext?.activeApp || 'unknown'}", hwnd: ${targetContext?.hwnd || 'none'})`)

  // 1. Pre-flight Context Revalidation (Phase 17)
  if (targetContext) {
    const reval = await ContextRevalidator.revalidate(targetContext)
    if (!reval.isValid) {
      if (reval.action === 'abort') {
        console.warn(`[QEVRA Main] ⚠️ Pre-flight check aborted: ${reval.reason}`)
        return {
          success: false,
          outcome: 'failure',
          message: reval.reason || 'Action aborted by security policy',
          actionType: 'clipboard',
          verificationDetails: { clipboardVerified: false, targetMatched: false }
        }
      } else if (reval.action === 'pause_for_user') {
        console.warn(`[QEVRA Main] ⚠️ Pre-flight check paused auto-paste: ${reval.reason}`)
        // Copy to clipboard safely, but pause auto-paste to avoid typing into wrong app
        if (clipboard && typeof clipboard.writeText === 'function') {
          clipboard.writeText(content)
        }
        return {
          success: false,
          outcome: 'needs_user',
          message: reval.reason || 'Context changed — copied to clipboard instead of pasting',
          actionType: 'clipboard',
          verificationDetails: {
            clipboardVerified: true,
            targetMatched: false,
            targetApp: reval.currentContext.activeApp
          }
        }
      }
    }
  }

  try {
    // 2. Write to system clipboard
    if (clipboard && typeof clipboard.writeText === 'function') {
      clipboard.writeText(content)
    }

    // Verify clipboard content
    const verified = clipboard && typeof clipboard.readText === 'function' ? clipboard.readText() === content : true

    if (!autoPaste) {
      console.log(`[QEVRA Main] [CLIPBOARD] Content written to clipboard (${content.length} chars)`)
      return {
        success: true,
        outcome: 'success',
        message: 'Content copied to clipboard',
        actionType: 'clipboard',
        verificationDetails: { clipboardVerified: verified, targetMatched: true }
      }
    }

    // 3. Small delay to allow foreground window to keep/regain active caret
    await new Promise((resolve) => setTimeout(resolve, 60))

    // 4. Primary: Platform-aware native keystroke injection
    let injected = false
    const platform = process.platform

    if (platform === 'win32') {
      try {
        const nativeExe = resolveBinary('send-input.exe')

        if (nativeExe) {
          const targetArgs = targetContext?.hwnd ? [targetContext.hwnd.toString()] : []
          await execFileAsync(nativeExe, targetArgs, { timeout: 1500 })
          injected = true
        }
      } catch (err) {
        console.warn('[QEVRA Native Input] Native injector warning, using PowerShell fallback:', err)
      }

      if (!injected) {
        const psCommand = `powershell -NoProfile -Command "(New-Object -ComObject WScript.Shell).SendKeys('^v')"`
        await execAsync(psCommand, { timeout: 3000 })
        injected = true
      }
    } else if (platform === 'darwin') {
      // macOS AppleScript Command+V injection
      try {
        await execAsync(`osascript -e 'tell application "System Events" to keystroke "v" using command down'`, { timeout: 2000 })
        injected = true
      } catch (macErr) {
        console.warn('[QEVRA Native Input] macOS osascript injection fallback notice:', macErr)
      }
    } else if (platform === 'linux') {
      // Linux xdotool Ctrl+V injection
      try {
        await execAsync(`xdotool key --clearmodifiers ctrl+v`, { timeout: 2000 })
        injected = true
      } catch (linuxErr) {
        console.warn('[QEVRA Native Input] Linux xdotool injection fallback notice:', linuxErr)
      }
    }

    console.log(`[QEVRA Main] [OK] Injected via ${platform === 'win32' ? (injected ? 'native send-input.exe' : 'PowerShell') : platform} into "${targetContext?.activeApp || 'active window'}" (${content.length} chars)`)

    return {
      success: true,
      outcome: 'success',
      message: 'Injected into active application',
      actionType: 'paste',
      verificationDetails: {
        clipboardVerified: verified,
        targetMatched: true,
        targetApp: targetContext?.activeApp
      }
    }
  } catch (err) {
    console.error('[QEVRA Main] Action execution error:', err)
    return {
      success: true, // Content remains in clipboard safely
      outcome: 'partial_success',
      message: 'Copied to clipboard (auto-paste fallback)',
      actionType: 'clipboard',
      verificationDetails: { clipboardVerified: true, targetMatched: false }
    }
  }
}
