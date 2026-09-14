import http from 'http'
import readline from 'readline'
import { ContextStore } from '../context/context-store'
import { ContextCollector } from '../context/context-collector'
import { SearchUserContextOptions } from '../context/context-types'

export interface McpToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export const QEVRA_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'search_user_context',
    description:
      'Hybrid semantic & keyword recall over everything QEVRA captured from the user desktop timeline, active windows, and speech. Returns evidence with verifiable receipts [Timestamp | App | Window Title] conforming to Littlebird standards.',
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
  }
]

export class QevraMcpServer {
  private static instance: QevraMcpServer | null = null
  private httpServer: http.Server | null = null
  private port: number = 32123
  private store: ContextStore

  private constructor() {
    this.store = ContextStore.getInstance()
  }

  public static getInstance(): QevraMcpServer {
    if (!QevraMcpServer.instance) {
      QevraMcpServer.instance = new QevraMcpServer()
    }
    return QevraMcpServer.instance
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
            name: 'qevra-mcp-server',
            version: '1.0.0',
            description: 'QEVRA Open-Source Ambient Computer Context MCP Server (Littlebird Parity)'
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
          tools: QEVRA_MCP_TOOLS
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
   * Executes one of the QEVRA ambient context tools
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

    throw new Error(`Unknown tool name: ${name}`)
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
        res.end(JSON.stringify({ status: 'ok', server: 'qevra-mcp-server', version: '1.0.0' }))
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
      res.end('QEVRA MCP Server. Connect via POST /mcp or stdio.')
    })

    this.httpServer.listen(this.port, '127.0.0.1', () => {
      console.log(`[QEVRA MCP] Local MCP server running on http://127.0.0.1:${this.port}/mcp`)
    })

    this.httpServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[QEVRA MCP] Port ${this.port} in use, skipping HTTP listener`)
      } else {
        console.warn('[QEVRA MCP] Server error:', err)
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
