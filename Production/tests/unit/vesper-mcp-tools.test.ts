import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VesperMcpServer, VESPER_MCP_TOOLS } from '../../src/main/mcp/vesper-mcp-server'
import { ContextStore } from '../../src/main/context/context-store'

describe('VESPER MCP Server (IDE & AI Agent Interop)', () => {
  let mcpServer: VesperMcpServer

  beforeEach(async () => {
    await ContextStore.getInstance().initialize()
    mcpServer = VesperMcpServer.getInstance()
  })

  it('exposes all required MCP tools including screen nav and inject text', () => {
    const toolNames = VESPER_MCP_TOOLS.map((t) => t.name)
    expect(toolNames).toContain('search_user_context')
    expect(toolNames).toContain('get_day_reconstruction')
    expect(toolNames).toContain('get_active_screen_context')
    expect(toolNames).toContain('vesper_inject_text')
    expect(toolNames).toContain('vesper_get_recent_operations')
    expect(toolNames).toContain('vesper_navigate_screen')
  })

  it('handles JSON-RPC tools/list protocol call', async () => {
    const response = await mcpServer.handleJsonRpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    })

    expect(response.jsonrpc).toBe('2.0')
    expect(response.id).toBe(1)
    expect(response.result.tools.length).toBeGreaterThanOrEqual(6)
  })

  it('executes vesper_get_recent_operations and returns formatted markdown entries', async () => {
    ContextStore.getInstance().recordDesktopOperation({
      opType: 'ide_edit',
      activeApp: 'Cursor',
      summary: 'Edited agent-harness.ts in workspace',
      details: {}
    })

    const result = await mcpServer.executeTool('vesper_get_recent_operations', { limit: 5 })
    expect(result).toContain('Recent Desktop Operations')
    expect(result).toContain('Cursor')
  })

  it('executes vesper_navigate_screen and logs operation', async () => {
    const result = await mcpServer.executeTool('vesper_navigate_screen', {
      x: 840,
      y: 120,
      element_label: 'Pull Requests Tab'
    })

    expect(result).toContain('Targeted screen coordinate (840, 120)')
    expect(result).toContain('Pull Requests Tab')
  })
})
