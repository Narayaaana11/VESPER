process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
import dotenv from 'dotenv'
dotenv.config({ quiet: true } as any)

import { AppLogger } from './logger'
AppLogger.initialize()

// Force UTF-8 encoding in Windows console to avoid mojibake like ƒÄÖ´©Å / Ô£ô
if (process.platform === 'win32') {
  try {
    const { execSync } = require('child_process')
    execSync('chcp 65001>nul', { stdio: 'ignore' })
  } catch {}
}

import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { registerGlobalShortcuts, unregisterAllShortcuts } from './hotkey'
import { registerIpcHandlers } from './ipc-handlers'
import { HoldToTalkManager } from './hold-to-talk'

import { ContextManager } from './context/context-manager'
import { QevraMcpServer } from './mcp/qevra-mcp-server'

// Enforce single-instance lock so clicking app in Windows search / desktop focuses existing dashboard
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

let dashboardWindow: BrowserWindow | null = null
let capsuleWindow: BrowserWindow | null = null
let holdToTalkManager: HoldToTalkManager | null = null
let tray: Tray | null = null
let isQuitting = false

export function getHoldToTalkManager(): HoldToTalkManager | null {
  return holdToTalkManager
}

export function getDashboardWindow(): BrowserWindow | null {
  return dashboardWindow
}

export function getCapsuleWindow(): BrowserWindow | null {
  return capsuleWindow
}

export function showDashboard(): void {
  if (!dashboardWindow || dashboardWindow.isDestroyed()) {
    createDashboardWindow()
    return
  }
  if (dashboardWindow.isMinimized()) dashboardWindow.restore()
  dashboardWindow.show()
  dashboardWindow.focus()
}

export function hideDashboard(): void {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.hide()
  }
}

function createDashboardWindow(): void {
  dashboardWindow = new BrowserWindow({
    width: 1040,
    height: 680,
    minWidth: 840,
    minHeight: 560,
    show: false,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0b0e',
    title: 'QEVRA Flow',
    skipTaskbar: false,
    hasShadow: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  dashboardWindow.center()

  dashboardWindow.on('ready-to-show', () => {
    dashboardWindow?.show()
    dashboardWindow?.focus()
  })

  dashboardWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      dashboardWindow?.hide()
    }
  })

  // Explicitly grant microphone media permission
  const ses = dashboardWindow.webContents.session
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') return callback(true)
    callback(false)
  })
  ses.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media'
  })

  dashboardWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  AppLogger.attachWindow(dashboardWindow, 'Dashboard')

  if (process.env['ELECTRON_RENDERER_URL']) {
    dashboardWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#dashboard`)
  } else {
    dashboardWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'dashboard' })
  }
}

function createCapsuleWindow(): void {
  capsuleWindow = new BrowserWindow({
    width: 140,
    height: 58,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Position at top center of primary display
  capsuleWindow.center()
  const [x] = capsuleWindow.getPosition()
  capsuleWindow.setPosition(x, 45)

  capsuleWindow.setAlwaysOnTop(true, 'screen-saver')
  capsuleWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  capsuleWindow.on('ready-to-show', () => {
    capsuleWindow?.setAlwaysOnTop(true, 'screen-saver')
  })

  AppLogger.attachWindow(capsuleWindow, 'Capsule')

  const ses = capsuleWindow.webContents.session
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') return callback(true)
    callback(false)
  })
  ses.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media'
  })

  capsuleWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    capsuleWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#capsule`)
  } else {
    capsuleWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'capsule' })
  }
}

function createTray(): void {
  try {
    const icon = nativeImage.createFromBuffer(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHBJREFUOE+1k9ENwCAIQ91/007hCprtHw0xUUu15uMCT48DkHJEkk5EPNq+1n1E7gDk5Zwb1jrvfZwzA3C910RkDdBaA6VUpJSklJ35hHvvE5b3z8A5F2utMMbknJExRj8g/1G+i8zM1Vo7/5vIB2HlTzHkPjUfAAAAAElFTkSuQmCC',
        'base64'
      )
    )

    tray = new Tray(icon)
    tray.setToolTip('QEVRA Flow — Voice Dictation & Hub')

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Flow Dashboard',
        click: () => showDashboard()
      },
      {
        label: 'Voice Dictation Active (Hold Right Alt)',
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Quit QEVRA',
        click: () => {
          isQuitting = true
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)
    tray.on('double-click', () => showDashboard())
    tray.on('click', () => showDashboard())
  } catch (err) {
    console.warn('[QEVRA] Tray init warning:', err)
  }
}

// Silence internal Chromium network upload stream verbose errors
app.commandLine.appendSwitch('log-level', '3')

app.whenReady().then(() => {
  // 0. Initialize Central Context Engine & Local MCP Server
  ContextManager.getInstance().initialize().catch((err) => {
    console.warn('[QEVRA ContextManager] Background init warning:', err)
  })
  try {
    QevraMcpServer.getInstance().startHttpServer(32123)
  } catch (err) {
    console.warn('[QEVRA MCP] Startup warning:', err)
  }

  // 1. Create Dashboard Window (Primary UI when user launches application)
  createDashboardWindow()

  // 2. Create Floating Voice Capsule Window
  createCapsuleWindow()

  // 3. Create System Tray
  createTray()

  // 4. Register IPC Bridges
  if (capsuleWindow) {
    registerIpcHandlers(capsuleWindow)
  }

  // 5. Register Global Hold-to-Talk Listener attached to Capsule
  if (capsuleWindow) {
    holdToTalkManager = new HoldToTalkManager(capsuleWindow, 'RIGHT ALT')
  }

  // 6. Global hotkeys for toggle
  const toggleHUD = (): void => {
    if (capsuleWindow && !capsuleWindow.isDestroyed()) {
      if (capsuleWindow.isVisible()) {
        capsuleWindow.webContents.send('qevra:hotkey-triggered')
      } else {
        capsuleWindow.setAlwaysOnTop(true, 'screen-saver')
        capsuleWindow.show()
        capsuleWindow.moveTop()
        capsuleWindow.webContents.send('qevra:hotkey-triggered')
      }
    }
  }

  registerGlobalShortcuts('CommandOrControl+Shift+Space', toggleHUD)
  registerGlobalShortcuts('F8', toggleHUD)

  ipcMain.on('qevra:set-hold-key', (_, key: string) => {
    holdToTalkManager?.setTargetKey(key)
  })

  // Second instance handler (when user searches QEVRA in Windows and clicks it)
  app.on('second-instance', () => {
    showDashboard()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createDashboardWindow()
      createCapsuleWindow()
    } else {
      showDashboard()
    }
  })
})

app.on('will-quit', () => {
  unregisterAllShortcuts()
  holdToTalkManager?.destroy()
  ContextManager.getInstance().destroy()
  QevraMcpServer.getInstance().stop()
  if (tray && !tray.isDestroyed()) {
    tray.destroy()
  }
})

app.on('window-all-closed', () => {
  // On Windows, keep app alive in background/tray for 24/7 Alt hotkey dictation
  // Quit only if user explicitly called quitApp
  if (isQuitting) {
    app.quit()
  }
})
