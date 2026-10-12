import { globalShortcut } from 'electron'

export function registerGlobalShortcuts(
  shortcut: string,
  onTrigger: () => void
): boolean {
  try {
    if (globalShortcut.isRegistered(shortcut)) {
      globalShortcut.unregister(shortcut)
    }

    const success = globalShortcut.register(shortcut, () => {
      onTrigger()
    })
    if (!success) {
      console.warn(`[VESPER] Failed to register global shortcut: ${shortcut}`)
    } else {
      console.log(`[VESPER] Registered global shortcut: ${shortcut}`)
    }
    return success
  } catch (err) {
    console.error(`[VESPER] Error registering shortcut ${shortcut}:`, err)
    return false
  }
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
