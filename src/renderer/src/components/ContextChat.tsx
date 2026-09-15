import React, { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, ArrowRight, Activity, Terminal } from 'lucide-react'
import { AppSettings } from '../types/task'

interface ContextChatProps {
  settings: AppSettings
  activeApp?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  receipts?: string[]
}

const SUGGESTIONS = [
  'What was I working on recently?',
  'Draft my standup update based on today\'s activity',
  'What files did I edit in Cursor today?',
  'Summarize the errors and debugging steps I took'
]

export const ContextChat: React.FC<ContextChatProps> = ({ settings, activeApp = 'Desktop' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Ambient context assistant initialized. Direct access to local SQLite memory, screen activity, and active window processes.`,
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || isLoading) return

    setInput('')
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      // 1. Retrieve ambient context from SQLite ContextStore
      let contextEvidence = ''
      let receipts: string[] = []
      if (window.electronAPI?.searchUserContext) {
        const searchRes = await window.electronAPI.searchUserContext({
          standaloneQuery: query,
          limit: 6
        })
        if (searchRes && searchRes.results && searchRes.results.length > 0) {
          receipts = searchRes.results.map((r: any) => r.receipt).filter(Boolean)
          contextEvidence = searchRes.results
            .map((r: any, idx: number) => `<#${idx + 1}> [${r.receipt}]\n${r.matchedSnippet}\n</#${idx + 1}>`)
            .join('\n\n')
        }
      }

      // Also get recent screen activities if available
      if ((window.electronAPI as any)?.getRecentScreenActivities) {
        const recent = await (window.electronAPI as any).getRecentScreenActivities(5)
        if (recent && recent.length > 0) {
          const recentText = recent
            .map((r: any) => `[${r.receipt}] ${r.activitySummary}`)
            .join('\n')
          contextEvidence = `Recent Screen Snapshots:\n${recentText}\n\nHistorical Search Matches:\n${contextEvidence}`
        }
      }

      // 2. Call LLM (Groq Llama 3.3 or local Ollama)
      let replyContent = ''
      const systemPrompt = `You are QEVRA Ambient Memory Assistant. You answer questions about what the user worked on, what is on their screen, and their computer activity.
Current active app: ${activeApp}.
Ambient memory records:
${contextEvidence || 'No matching historical context records found.'}

Rules:
1. Always base factual statements about the user's past actions on the provided context evidence.
2. Whenever you state an action the user took, cite the Littlebird receipt [Timestamp | App | Window Title] or the reference tag <#n>.
3. If no evidence exists for something, clearly state that you do not see records of it.
4. Be direct, concise, professional, and factual. Do not apologize or add conversational filler.`

      if (settings.aiProvider === 'ollama') {
        const endpoint = settings.ollamaEndpoint || 'http://localhost:11434'
        const model = settings.ollamaModel || 'llama3.2'
        const res = await fetch(`${endpoint}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ],
            stream: false
          })
        })
        if (res.ok) {
          const json = await res.json()
          replyContent = json.message?.content || 'No response from local Ollama.'
        } else {
          replyContent = `Ollama error: ${res.statusText}. Verify Ollama is running on ${endpoint}.`
        }
      } else {
        const apiKey = settings.apiKey?.trim()
        if (!apiKey) {
          replyContent = `Local RAG memory search completed (${receipts.length} receipts found), but Groq API key is not configured for LLM summarization. Please enter a Groq API key in Settings or switch to Ollama for 100% offline generation.\n\nMatching Receipts:\n${receipts.map((r) => `• ${r}`).join('\n')}`
        } else {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
              ],
              temperature: 0.1,
              max_tokens: 600
            })
          })
          if (res.ok) {
            const json = await res.json()
            replyContent = json.choices?.[0]?.message?.content || 'No answer generated.'
          } else {
            const err = await res.json().catch(() => ({}))
            replyContent = `Groq API Error: ${err.error?.message || res.statusText}`
          }
        }
      }

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
        receipts: receipts.length > 0 ? receipts : undefined
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      console.warn('[QEVRA ContextChat] Error:', err)
      const errorMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: `Error retrieving memory: ${err.message || String(err)}`,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="wfd-tab-pane" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wfd-pane-header">
        <div>
          <h2>Ambient Context Terminal</h2>
          <p>Query your local SQLite memory, screen activity, and active application events.</p>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '12px 14px',
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid var(--wf-border)',
          borderRadius: 'var(--wf-radius-md)',
          minHeight: 380,
          maxHeight: 460
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '84%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--wf-text-muted)', fontWeight: 550 }}>
                {msg.role === 'user' ? 'YOU' : 'MEMORY'}
              </span>
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--wf-text-muted)' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              style={{
                background: msg.role === 'user' ? '#18181b' : 'rgba(255, 255, 255, 0.025)',
                border: msg.role === 'user' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid var(--wf-border)',
                borderRadius: 'var(--wf-radius-sm)',
                padding: '9px 12px',
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'var(--wf-text-primary)',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}

              {msg.receipts && msg.receipts.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--wf-border)' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--wf-text-muted)', fontWeight: 600, marginBottom: 3 }}>
                    EVIDENCE RECEIPTS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {msg.receipts.map((r, idx) => (
                      <span key={idx} style={{ fontSize: '9.5px', color: 'var(--wf-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginTop: 2 }}>
              <button
                onClick={() => handleCopy(msg.content, msg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedId === msg.id ? 'var(--wf-success)' : 'var(--wf-text-muted)',
                  fontSize: '9.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer',
                  padding: 2
                }}
              >
                {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--wf-text-muted)', fontWeight: 550 }}>MEMORY</span>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid var(--wf-border)',
                borderRadius: 'var(--wf-radius-sm)',
                padding: '9px 12px',
                fontSize: '11.5px',
                color: 'var(--wf-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Activity size={12} className="animate-pulse" style={{ color: 'var(--wf-text-muted)' }} />
              <span>Scanning local memory receipts...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', gap: 5, overflowX: 'auto', padding: '6px 0' }}>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="wfd-chip"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
          >
            <span>{s}</span>
            <ArrowRight size={9} style={{ opacity: 0.5 }} />
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 6, marginTop: 2 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about screen history, edited files, or active window..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--wf-border)',
            borderRadius: 'var(--wf-radius-sm)',
            padding: '7px 11px',
            fontSize: '11.5px',
            color: 'var(--wf-text-primary)',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="wfd-btn-primary"
          style={{ padding: '0 12px' }}
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  )
}
