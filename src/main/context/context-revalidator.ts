import { DeviceContext } from './context-types'
import { ContextCollector } from './context-collector'

export interface ContextRevalidationResult {
  isValid: boolean
  action: 'proceed' | 'pause_for_user' | 'abort'
  reason?: string
  initialContext: DeviceContext
  currentContext: DeviceContext
}

export class ContextRevalidator {
  /**
   * Revalidates whether the current foreground context still matches the target context
   * before executing any text insertion or macro.
   */
  public static async revalidate(
    initialContext: DeviceContext
  ): Promise<ContextRevalidationResult> {
    // Invalidate cache to force a fresh reading right before action
    ContextCollector.invalidateCache()
    const currentContext = await ContextCollector.collect()

    // 1. Check if application is protected (Privacy Shield)
    if (currentContext.isProtected) {
      return {
        isValid: false,
        action: 'abort',
        reason: `Target is a protected application (${currentContext.activeApp}). Action blocked.`,
        initialContext,
        currentContext
      }
    }

    // 2. Check if active application changed
    const initialApp = (initialContext.activeApp || '').toLowerCase().trim()
    const currentApp = (currentContext.activeApp || '').toLowerCase().trim()

    // Ignore transitions to/from desktop overlay window or unknown/empty
    const isOverlayOrDesktop = (a: string) =>
      !a || a === 'qevra' || a === 'vayro' || a === 'electron' || a === 'desktop' || a === 'unknown'

    if (
      !isOverlayOrDesktop(initialApp) &&
      !isOverlayOrDesktop(currentApp) &&
      currentApp !== initialApp
    ) {
      return {
        isValid: false,
        action: 'pause_for_user',
        reason: `Context changed: Application switched from ${initialContext.activeApp} to ${currentContext.activeApp}`,
        initialContext,
        currentContext
      }
    }

    // 3. If in code editor, check if workspace drastically changed
    if (
      initialContext.category === 'code' &&
      currentContext.category === 'code' &&
      initialContext.projectWorkspace &&
      currentContext.projectWorkspace &&
      initialContext.projectWorkspace !== currentContext.projectWorkspace
    ) {
      return {
        isValid: false,
        action: 'pause_for_user',
        reason: `Workspace changed: Switched from ${initialContext.projectWorkspace} to ${currentContext.projectWorkspace}`,
        initialContext,
        currentContext
      }
    }

    return {
      isValid: true,
      action: 'proceed',
      initialContext,
      currentContext
    }
  }
}
