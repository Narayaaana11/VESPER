import { globalShortcut, BrowserWindow } from 'electron'

export function registerGlobalShortcuts(
  shortcut: string,
  onTrigger: () => void
): boolean {
  globalShortcut.unregisterAll()

  try {
    const success = globalShortcut.register(shortcut, () => {
      onTrigger()
    })
    if (!success) {
      console.warn(`[QEVRA] Failed to register global shortcut: ${shortcut}`)
    } else {
      console.log(`[QEVRA] Registered global shortcut: ${shortcut}`)
    }
    return success
  } catch (err) {
    console.error(`[QEVRA] Error registering shortcut ${shortcut}:`, err)
    return false
  }
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
