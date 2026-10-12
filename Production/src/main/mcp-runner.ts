import { VesperMcpServer } from './mcp/vesper-mcp-server'
import { ContextStore } from './context/context-store'

async function main(): Promise<void> {
  await ContextStore.getInstance().initialize()
  const server = VesperMcpServer.getInstance()
  server.startStdio()
}

main().catch((err) => {
  console.error('[VESPER MCP Runner] Error:', err)
  process.exit(1)
})
