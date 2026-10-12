import { shell, clipboard } from 'electron'
import { spawn, exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { UniversalActionPayload, UniversalActionResult, ActionRiskLevel } from './action-types'
import { executeAction } from '../action-executor'
import { ContextRevalidator } from '../context/context-revalidator'

const execAsync = promisify(exec)

export class UniversalActionSystem {
  private static undoStack: UniversalActionPayload[] = []
  private static MAX_UNDO_STACK = 50

  /**
   * Evaluates risk level for an action
   */
  public static evaluateRisk(actionType: string, parameters: Record<string, any>): ActionRiskLevel {
    switch (actionType) {
      case 'typeText':
      case 'pasteText':
      case 'openApp':
      case 'openURL':
        return 'low'

      case 'createFile':
      case 'saveFile':
      case 'editFile':
        return 'medium'

      case 'runCommand':
        // Check command for destructive operations
        const cmd = (parameters.command || '').toLowerCase()
        if (
          cmd.includes('rm ') ||
          cmd.includes('del ') ||
          cmd.includes('remove-item') ||
          cmd.includes('format ') ||
          cmd.includes('drop ') ||
          cmd.includes('shutdown') ||
          cmd.includes('restart')
        ) {
          return 'high'
        }
        return 'medium'

      case 'composeEmail':
        return parameters.autoSend ? 'high' : 'low'

      case 'sendMessage':
        return parameters.autoSend ? 'high' : 'low'

      default:
        return 'medium'
    }
  }

  /**
   * Executes a universal action with precondition checks, verification, and undo recording
   */
  public static async execute(action: UniversalActionPayload): Promise<UniversalActionResult> {
    const startTime = Date.now()
    console.log(`[VESPER UniversalAction] Executing "${action.actionType}" on target "${action.target}" (risk: ${action.riskLevel})`)

    try {
      switch (action.actionType) {
        case 'pasteText':
        case 'typeText': {
          const content = action.parameters.content || ''
          const autoPaste = action.parameters.autoPaste !== false
          const targetContext = action.parameters.targetContext

          const res = await executeAction(content, autoPaste, targetContext)
          return {
            success: res.success,
            actionId: action.actionId,
            actionType: action.actionType,
            outcome: res.outcome,
            message: res.message,
            verification: {
              verified: res.verificationDetails?.targetMatched || false,
              checks: ['clipboard_verified', res.verificationDetails?.targetMatched ? 'target_matched' : 'target_diverged'],
              timestamp: Date.now()
            },
            reversalAvailable: false
          }
        }

        case 'openApp': {
          const appTarget = (action.target || action.parameters.appName || '').trim()
          if (!appTarget) {
            return this.failureResult(action, 'No application name specified')
          }

          // Windows app launching: handle common names or full paths
          let launched = false
          if (process.platform === 'win32') {
            try {
              // Try via shell start command
              const child = spawn('cmd.exe', ['/c', 'start', '', appTarget], {
                detached: true,
                stdio: 'ignore',
                windowsHide: true
              })
              child.unref()
              launched = true
            } catch (spawnErr) {
              console.warn('[VESPER Action] Windows spawn notice:', spawnErr)
            }
          } else {
            shell.openPath(appTarget)
            launched = true
          }

          return {
            success: launched,
            actionId: action.actionId,
            actionType: 'openApp',
            outcome: launched ? 'success' : 'failure',
            message: launched ? `Launched ${appTarget}` : `Failed to launch ${appTarget}`,
            verification: {
              verified: launched,
              checks: ['process_spawned'],
              timestamp: Date.now()
            },
            reversalAvailable: false
          }
        }

        case 'openURL': {
          const url = (action.target || action.parameters.url || '').trim()
          if (!url || !url.startsWith('http')) {
            return this.failureResult(action, 'Invalid URL format')
          }
          await shell.openExternal(url)
          return {
            success: true,
            actionId: action.actionId,
            actionType: 'openURL',
            outcome: 'success',
            message: `Opened ${url} in default browser`,
            verification: {
              verified: true,
              checks: ['url_dispatched_to_os'],
              timestamp: Date.now()
            },
            reversalAvailable: false
          }
        }

        case 'createFile':
        case 'saveFile': {
          const filePath = action.target || action.parameters.filePath
          const fileContent = action.parameters.content ?? ''

          if (!filePath) {
            return this.failureResult(action, 'File path must be specified')
          }

          const resolvedPath = path.resolve(filePath)
          const dir = path.dirname(resolvedPath)
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }

          // Record previous content if file already exists
          let prevContent: string | undefined = undefined
          if (fs.existsSync(resolvedPath)) {
            prevContent = fs.readFileSync(resolvedPath, 'utf-8')
          }

          fs.writeFileSync(resolvedPath, fileContent, 'utf-8')

          // Record to undo stack
          this.recordUndo({
            ...action,
            reversalInfo: {
              isReversible: true,
              previousContent: prevContent,
              targetPath: resolvedPath,
              reversalActionType: prevContent !== undefined ? 'editFile' : 'createFile'
            }
          })

          const verified = fs.existsSync(resolvedPath) && fs.readFileSync(resolvedPath, 'utf-8') === fileContent
          return {
            success: verified,
            actionId: action.actionId,
            actionType: action.actionType,
            outcome: 'success',
            message: `File saved successfully: ${path.basename(resolvedPath)}`,
            verification: {
              verified,
              checks: ['file_exists', 'content_matches'],
              timestamp: Date.now()
            },
            reversalAvailable: true
          }
        }

        case 'editFile': {
          const targetFile = action.target || action.parameters.filePath
          const newContent = action.parameters.content ?? ''
          if (!targetFile || !fs.existsSync(targetFile)) {
            return this.failureResult(action, `File not found: ${targetFile}`)
          }

          const previousContent = fs.readFileSync(targetFile, 'utf-8')
          fs.writeFileSync(targetFile, newContent, 'utf-8')

          this.recordUndo({
            ...action,
            reversalInfo: {
              isReversible: true,
              previousContent,
              targetPath: targetFile,
              reversalActionType: 'editFile'
            }
          })

          const verified = fs.readFileSync(targetFile, 'utf-8') === newContent
          return {
            success: verified,
            actionId: action.actionId,
            actionType: 'editFile',
            outcome: 'success',
            message: `File updated: ${path.basename(targetFile)}`,
            verification: {
              verified,
              checks: ['content_verified'],
              timestamp: Date.now()
            },
            reversalAvailable: true
          }
        }

        case 'runCommand': {
          const command = action.parameters.command || action.target
          if (!command) {
            return this.failureResult(action, 'No command specified')
          }

          const timeoutMs = action.parameters.timeoutMs || 8000
          const cwd = action.parameters.cwd || process.cwd()

          const { stdout, stderr } = await execAsync(command, { timeout: timeoutMs, cwd })
          return {
            success: true,
            actionId: action.actionId,
            actionType: 'runCommand',
            outcome: 'success',
            message: 'Command executed successfully',
            details: {
              stdout: stdout?.trim(),
              stderr: stderr?.trim()
            },
            verification: {
              verified: true,
              checks: ['exit_code_zero'],
              timestamp: Date.now()
            },
            reversalAvailable: false
          }
        }

        default:
          return this.failureResult(action, `Unsupported action type: ${action.actionType}`)
      }
    } catch (err: any) {
      console.error(`[VESPER UniversalAction] Execution error:`, err)
      return {
        success: false,
        actionId: action.actionId,
        actionType: action.actionType,
        outcome: 'failure',
        message: err?.message || 'Execution error',
        verification: {
          verified: false,
          checks: ['exception_thrown'],
          timestamp: Date.now()
        },
        reversalAvailable: false
      }
    }
  }

  /**
   * Reverts the most recent reversible action
   */
  public static async undoLastAction(): Promise<{ success: boolean; message: string }> {
    const item = this.undoStack.pop()
    if (!item || !item.reversalInfo?.isReversible) {
      return { success: false, message: 'No reversible action in undo history' }
    }

    try {
      const targetPath = item.reversalInfo.targetPath
      if (!targetPath) return { success: false, message: 'Invalid target path for undo' }

      if (item.reversalInfo.previousContent !== undefined) {
        fs.writeFileSync(targetPath, item.reversalInfo.previousContent, 'utf-8')
        return { success: true, message: `Reverted changes to ${path.basename(targetPath)}` }
      } else {
        // File was newly created, undo means removing it safely
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath)
        }
        return { success: true, message: `Removed created file ${path.basename(targetPath)}` }
      }
    } catch (err: any) {
      return { success: false, message: `Undo failed: ${err.message}` }
    }
  }

  private static recordUndo(action: UniversalActionPayload): void {
    if (this.undoStack.length >= this.MAX_UNDO_STACK) {
      this.undoStack.shift()
    }
    this.undoStack.push(action)
  }

  private static failureResult(action: UniversalActionPayload, reason: string): UniversalActionResult {
    return {
      success: false,
      actionId: action.actionId,
      actionType: action.actionType,
      outcome: 'failure',
      message: reason,
      verification: {
        verified: false,
        checks: ['precondition_failed'],
        timestamp: Date.now()
      },
      reversalAvailable: false
    }
  }
}
