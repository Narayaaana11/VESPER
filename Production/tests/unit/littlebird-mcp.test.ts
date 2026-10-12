import { describe, it, expect, beforeEach } from 'vitest'
import { ContextStore } from '../../src/main/context/context-store'
import { VesperMcpServer, VESPER_MCP_TOOLS } from '../../src/main/mcp/vesper-mcp-server'

describe('Littlebird MCP Parity & Ambient Memory Tests', () => {
  let store: ContextStore
  let server: VesperMcpServer

  beforeEach(async () => {
    store = ContextStore.getInstance()
    await store.initialize()
    server = VesperMcpServer.getInstance()
  })

  it('exposes the standard Littlebird MCP tool inventory', () => {
    const toolNames = VESPER_MCP_TOOLS.map((t) => t.name)
    expect(toolNames).toContain('search_user_context')
    expect(toolNames).toContain('get_day_reconstruction')
    expect(toolNames).toContain('get_active_screen_context')
  })

  it('formats evidence receipts with strict timestamp, app, and title structure', () => {
    const ts = new Date('2026-09-14T10:30:00Z').getTime()
    const receipt = store.formatReceipt(ts, 'Cursor', 'App.tsx - VESPER')

    expect(receipt.app).toBe('Cursor')
    expect(receipt.title).toBe('App.tsx - VESPER')
    expect(receipt.formatted).toMatch(/\[.*\| Cursor \| App\.tsx - VESPER\]/)
  })

  it('handles MCP initialize handshake conforming to JSON-RPC 2.0', async () => {
    const initReq = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05' }
    }

    const res = await server.handleJsonRpc(initReq)
    expect(res.jsonrpc).toBe('2.0')
    expect(res.id).toBe(1)
    expect(res.result.serverInfo.name).toBe('vesper-mcp-server')
    expect(res.result.capabilities.tools).toBeDefined()
  })

  it('handles MCP tools/list and returns search_user_context schema', async () => {
    const listReq = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }

    const res = await server.handleJsonRpc(listReq)
    expect(res.result.tools.length).toBeGreaterThanOrEqual(3)
    const searchTool = res.result.tools.find((t: any) => t.name === 'search_user_context')
    expect(searchTool).toBeDefined()
    expect(searchTool.inputSchema.properties.standalone_query).toBeDefined()
  })

  it('executes search_user_context tool via MCP JSON-RPC call', async () => {
    // Insert a test event
    store.insertEvent({
      id: 'test_mcp_evt_1',
      type: 'CONTEXT_UPDATED',
      timestamp: Date.now(),
      context: {
        activeApp: 'Cursor',
        windowTitle: 'PaymentGateway.ts - Checkout',
        category: 'code',
        confidence: 0.95,
        timestamp: Date.now()
      }
    })

    const callReq = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search_user_context',
        arguments: {
          standalone_query: 'PaymentGateway Checkout'
        }
      }
    }

    const res = await server.handleJsonRpc(callReq)
    expect(res.result.content[0].type).toBe('text')
    expect(res.result.content[0].text).toContain('PaymentGateway')
    expect(res.result.content[0].text).toContain('Cursor')
  })

  it('generates a day reconstruction dev log with changelog block', async () => {
    const recon = store.getDayReconstruction()
    expect(recon.date).toBeDefined()
    expect(recon.summary).toBeDefined()
    expect(recon.changelogBlock).toContain('Work Session Summary')
  })
})
