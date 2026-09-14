import { QevraMcpServer } from './mcp/qevra-mcp-server'
import { ContextStore } from './context/context-store'

async function main(): Promise<void> {
  await ContextStore.getInstance().initialize()
  const server = QevraMcpServer.getInstance()
  server.startStdio()
}

main().catch((err) => {
  console.error('[QEVRA MCP Runner] Error:', err)
  process.exit(1)
})
