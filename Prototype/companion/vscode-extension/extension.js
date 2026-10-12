const vscode = require('vscode')
const http = require('http')

let debounceTimer = null

function sendContextToVesper(editor) {
  if (!editor || !editor.document) return

  const doc = editor.document
  const sel = editor.selection
  const selectedText = sel && !sel.isEmpty ? doc.getText(sel) : ''
  const line = sel ? sel.active.line + 1 : 1
  const col = sel ? sel.active.character + 1 : 1

  const workspaceFolders = vscode.workspace.workspaceFolders
  const projectName = workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].name : ''

  const payload = JSON.stringify({
    source: 'vscode',
    file: doc.fileName.split(/[\\/]/).pop(),
    filePath: doc.fileName,
    project: projectName,
    cursor: { line, col },
    selection: selectedText.substring(0, 1000)
  })

  const req = http.request(
    {
      hostname: '127.0.0.1',
      port: 32123,
      path: '/api/context/feed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 500
    },
    (res) => {
      // consume response to free socket
      res.on('data', () => {})
    }
  )

  req.on('error', () => {
    // VESPER app not running, ignore quietly
  })

  req.write(payload)
  req.end()
}

function activate(context) {
  console.log('[VESPER Companion] Activated')

  const triggerSync = (editor) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => sendContextToVesper(editor), 300)
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) triggerSync(editor)
    }),
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (event.textEditor) triggerSync(event.textEditor)
    }),
    vscode.commands.registerCommand('vesper.syncContext', () => {
      if (vscode.window.activeTextEditor) {
        sendContextToVesper(vscode.window.activeTextEditor)
        vscode.window.showInformationMessage('VESPER: Context synced.')
      }
    })
  )

  // Send initial context if editor is already open
  if (vscode.window.activeTextEditor) {
    sendContextToVesper(vscode.window.activeTextEditor)
  }
}

function deactivate() {
  if (debounceTimer) clearTimeout(debounceTimer)
}

module.exports = {
  activate,
  deactivate
}
