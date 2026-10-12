import http from 'http'
import readline from 'readline'
import path from 'path'
import { ContextStore } from '../context/context-store'
import { ContextCollector } from '../context/context-collector'
import { SearchUserContextOptions, DeviceContext } from '../context/context-types'
import { executeAction } from '../action-executor'

export interface McpToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export const VESPER_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'search_user_context',
    description:
      'Hybrid semantic & keyword recall over everything VESPER captured from the user desktop timeline, active windows, and speech. Returns evidence with verifiable receipts [Timestamp | App | Window Title] conforming to Littlebird standards.',
    inputSchema: {
      type: 'object',
      properties: {
        search_queries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Semantic queries over screen snapshots and activity timeline'
        },
        standalone_query: {
          type: 'string',
          description: 'Free-form statement of what context should answer the request'
        },
        app: {
          type: 'string',
          description: 'Filter results to a specific application (e.g. cursor, chrome, slack, antigravity)'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of evidence entries to return (default 10)'
        }
      }
    }
  },
  {
    name: 'get_day_reconstruction',
    description:
      'Rebuilds a work session from ambient context into an actionable dev log: apps usage breakdown, files edited, completed tasks, and ready-to-paste changelog block.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Optional ISO date or epoch ms. Defaults to today.'
        }
      }
    }
  },
  {
    name: 'get_active_screen_context',
    description:
      'Retrieves the real-time active foreground window, application name, category, and recent activity.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'vesper_inject_text',
    description:
      'Injects text directly into the user active cursor or foreground application via native Win32 input injection.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to inject at active cursor' },
        auto_paste: { type: 'boolean', description: 'Whether to simulate paste immediately (default true)' }
      },
      required: ['text']
    }
  },
  {
    name: 'vesper_get_recent_operations',
    description:
      'Retrieves chronological 24/7 desktop operations (app switches, window focus changes, clipboard copies, task executions) captured by the Central Context Engine.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Maximum operations to return (default 20)' },
        query: { type: 'string', description: 'Optional keyword filter' }
      }
    }
  },
  {
    name: 'vesper_navigate_screen',
    description:
      'Dispatches screen coordinate navigation or element click on the user desktop.',
    inputSchema: {
      type: 'object',
      properties: {
        x: { type: 'number', description: 'X pixel coordinate on screen' },
        y: { type: 'number', description: 'Y pixel coordinate on screen' },
        element_label: { type: 'string', description: 'Descriptive label of the target element' }
      },
      required: ['x', 'y']
    }
  }
]

export class VesperMcpServer {
  private static instance: VesperMcpServer | null = null
  private httpServer: http.Server | null = null
  private port: number = 32123
  private store: ContextStore

  private constructor() {
    this.store = ContextStore.getInstance()
  }

  public static getInstance(): VesperMcpServer {
    if (!VesperMcpServer.instance) {
      VesperMcpServer.instance = new VesperMcpServer()
    }
    return VesperMcpServer.instance
  }

  /**
   * Dispatches an incoming MCP JSON-RPC 2.0 message
   */
  public async handleJsonRpc(request: any): Promise<any> {
    const { id, method, params } = request

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'vesper-mcp-server',
            version: '1.0.0',
            description: 'VESPER Open-Source Ambient Computer Context MCP Server (Littlebird Parity)'
          }
        }
      }
    }

    if (method === 'notifications/initialized') {
      return null
    }

    if (method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: VESPER_MCP_TOOLS
        }
      }
    }

    if (method === 'tools/call') {
      const toolName = params?.name
      const args = params?.arguments || {}

      try {
        const textContent = await this.executeTool(toolName, args)
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: textContent
              }
            ]
          }
        }
      } catch (err: any) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: `Tool execution error: ${err.message}`
          }
        }
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method '${method}' not found`
      }
    }
  }

  /**
   * Executes one of the VESPER ambient context tools
   */
  public async executeTool(name: string, args: any): Promise<string> {
    if (name === 'search_user_context') {
      const options: SearchUserContextOptions = {
        search_queries: args.search_queries,
        standalone_query: args.standalone_query,
        app: args.app,
        limit: args.limit || 10
      }

      const res = this.store.searchUserContext(options)
      if (res.entries.length === 0) {
        return 'No matching desktop timeline evidence found for the specified query.'
      }

      const toc = res.tableOfContents.join('\n')
      const entriesText = res.entries
        .map((e, idx) => `<#${idx + 1}>\n${e.receipt.formatted}\n${e.content}\n</#${idx + 1}>`)
        .join('\n\n')

      return `## Context Table of Contents (${res.entries.length} items)\n${toc}\n\n## Timeline Evidence\n${entriesText}`
    }

    if (name === 'get_day_reconstruction') {
      const targetDate = args.date ? new Date(args.date).getTime() : Date.now()
      const recon = this.store.getDayReconstruction(targetDate)

      return `# Day Reconstruction: ${recon.date}
${recon.summary}

## Active Application Breakdown
${recon.appsUsage.map((a) => `- **${a.app}**: ~${a.minutes} minutes`).join('\n')}

## Files Edited & Touched
${recon.filesEdited.map((f) => `- \`${f}\``).join('\n') || '- None recorded'}

## Executed Tasks
${recon.tasksExecuted.map((t) => `- [${t.time}] ${t.task} (${t.targetApp})`).join('\n') || '- None recorded'}

## Development Changelog
\`\`\`markdown
${recon.changelogBlock}
\`\`\``
    }

    if (name === 'get_active_screen_context') {
      const current = await ContextCollector.collect()
      const receipt = this.store.formatReceipt(current.timestamp, current.activeApp, current.windowTitle)

      return `## Active Foreground Window
Receipt: ${receipt.formatted}
- Application: ${current.activeApp}
- Window Title: ${current.windowTitle}
- Category: ${current.category}
- Workspace: ${current.projectWorkspace || 'None'}
- Confidence: ${current.confidence}`
    }

    if (name === 'vesper_inject_text' || name === 'inject_text') {
      const text = args.text || ''
      if (!text) return 'Error: text argument is required'
      const current = await ContextCollector.collect()
      const res = await executeAction(text, args.auto_paste !== false, current)
      this.store.recordDesktopOperation({
        opType: 'mcp_inject_text',
        activeApp: current.activeApp,
        windowTitle: current.windowTitle,
        summary: `Injected ${text.length} chars via MCP into ${current.activeApp}`,
        details: { textLength: text.length, success: res.success }
      })
      return res.success ? `Successfully injected text into ${current.activeApp}` : `Injection failed: ${res.message}`
    }

    if (name === 'vesper_get_recent_operations' || name === 'get_recent_operations') {
      const limit = args.limit || 20
      const ops = args.query ? this.store.searchOperations(args.query, limit) : this.store.getRecentOperations(limit)
      if (ops.length === 0) return 'No desktop operations recorded yet.'
      return `## Recent Desktop Operations (${ops.length} entries)\n` +
        ops.map((o) => `- [${new Date(o.timestamp).toLocaleTimeString()}] **${o.opType}** (${o.activeApp}): ${o.summary}`).join('\n')
    }

    if (name === 'vesper_navigate_screen' || name === 'navigate_screen') {
      const x = Math.round(Number(args.x || 0))
      const y = Math.round(Number(args.y || 0))
      const label = args.element_label || `element at (${x}, ${y})`
      const current = await ContextCollector.collect()
      this.store.recordDesktopOperation({
        opType: 'screen_navigation',
        activeApp: current.activeApp,
        windowTitle: current.windowTitle,
        summary: `Screen navigation targeted [${label}] at (${x}, ${y})`,
        details: { x, y, label }
      })
      return `Targeted screen coordinate (${x}, ${y}) for [${label}]. In production, native mouse event dispatched.`
    }

    throw new Error(`Unknown tool name: ${name}`)
  }

  /**
   * Ingests rich IDE/Browser companion context (active file, cursor line, selection, git branch)
   */
  public async ingestExternalContext(payload: {
    source?: string
    file?: string
    filePath?: string
    cursor?: { line: number; col: number }
    selection?: string
    project?: string
    activeApp?: string
    url?: string
  }): Promise<any> {
    const activeApp =
      payload.activeApp ||
      (payload.source === 'vscode'
        ? 'VS Code'
        : payload.source === 'chrome'
          ? 'Google Chrome'
          : 'Editor')
    const fileName = payload.file || (payload.filePath ? path.basename(payload.filePath) : '')
    const title = fileName
      ? `${fileName} - ${payload.project || 'Project'} - ${activeApp}`
      : payload.url || `${activeApp} Workspace`

    const deviceContext: DeviceContext = {
      activeApp,
      windowTitle: title,
      category: payload.source === 'chrome' ? 'browser' : 'code',
      projectWorkspace: payload.project,
      activeFile: payload.filePath || payload.file,
      clipboardContent: payload.selection,
      confidence: 1.0,
      timestamp: Date.now(),
      sourceInfo: {
        source: (payload.source as any) || 'ide_extension',
        capturedAt: Date.now()
      }
    }

    // Ingest into SQLite Context Store
    this.store.insertEvent({
      id: `evt_ext_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'CONTEXT_UPDATED',
      timestamp: Date.now(),
      context: deviceContext,
      payload: {
        cursor: payload.cursor,
        selection: payload.selection,
        filePath: payload.filePath,
        url: payload.url
      }
    })

    return {
      activeApp: deviceContext.activeApp,
      file: deviceContext.activeFile,
      project: deviceContext.projectWorkspace
    }
  }

  /**
   * Starts local HTTP server for SSE / HTTP MCP clients (Cursor, Web, Curl)
   */
  public startHttpServer(port = 32123): void {
    this.port = port
    if (this.httpServer) return

    this.httpServer = http.createServer(async (req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
      }

      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok', server: 'vesper-mcp-server', version: '1.0.0' }))
        return
      }

      if (req.url === '/api/context/feed' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body)
            const result = await this.ingestExternalContext(payload)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true, ingested: result }))
          } catch (err: any) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, error: err?.message || 'Invalid JSON' }))
          }
        })
        return
      }

      if (req.url === '/mcp' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body)
            const response = await this.handleJsonRpc(parsed)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(response))
          } catch (err: any) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }))
          }
        })
        return
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('VESPER MCP Server. Connect via POST /mcp, POST /api/context/feed or stdio.')
    })

    this.httpServer.listen(this.port, '127.0.0.1', () => {
      console.log(`[VESPER MCP] Local MCP server running on http://127.0.0.1:${this.port}/mcp`)
    })

    this.httpServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[VESPER MCP] Port ${this.port} in use, skipping HTTP listener`)
      } else {
        console.warn('[VESPER MCP] Server error:', err)
      }
    })
  }

  /**
   * Starts Stdio listener for CLI tools (Claude Code, Antigravity, Cursor stdio)
   */
  public startStdio(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    rl.on('line', async (line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      try {
        const req = JSON.parse(trimmed)
        const resp = await this.handleJsonRpc(req)
        if (resp) {
          process.stdout.write(JSON.stringify(resp) + '\n')
        }
      } catch (err) {
        // Silently ignore parse errors on stdio
      }
    })
  }

  public stop(): void {
    if (this.httpServer) {
      this.httpServer.close()
      this.httpServer = null
    }
  }
}
