import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Copy, Check, ArrowRight } from 'lucide-react'
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
      content: `Hello! I am your ambient context assistant. I have access to your local SQLite memory, screen activity, and active applications. You can ask me what you were doing, to summarize your work, or to retrieve specific context from earlier today.`,
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
4. Be direct, professional, and helpful.`

      const apiKey = settings.apiKey || ''
      if (settings.aiProvider === 'ollama') {
        try {
          const res = await fetch(`${settings.ollamaEndpoint || 'http://localhost:11434'}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: settings.ollamaModel || 'llama3.2',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
              ],
              stream: false
            })
          })
          if (res.ok) {
            const data = await res.json()
            replyContent = data.message?.content || ''
          }
        } catch (e) {
          console.warn('[Ollama ContextChat error]', e)
        }
      }

      if (!replyContent && apiKey) {
        try {
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
              temperature: 0.2
            })
          })
          if (res.ok) {
            const data = await res.json()
            replyContent = data.choices?.[0]?.message?.content || ''
          }
        } catch (e) {
          console.warn('[Groq ContextChat error]', e)
        }
      }

      if (!replyContent) {
        replyContent = contextEvidence
          ? `Based on your recent ambient memory records:\n\n${contextEvidence}\n\n(Add your Groq API key in Settings to synthesize conversational answers.)`
          : `I checked your ambient memory for "${query}", but found no matching records in the local SQLite database.`
      }

      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
        receipts: receipts.slice(0, 3)
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Unable to query ambient memory: ${err?.message || 'Unknown error'}`,
          timestamp: Date.now()
        }
      ])
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 480, color: '#f8fafc' }}>
      {/* Messages Container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <span style={{ fontSize: '10.5px', color: msg.role === 'user' ? '#94a3b8' : '#818cf8', fontWeight: 550 }}>
                {msg.role === 'user' ? 'You' : 'QEVRA Memory'}
              </span>
              <span style={{ fontSize: '9.5px', color: '#64748b' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              style={{
                background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.025)',
                border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: '12.5px',
                lineHeight: 1.5,
                color: '#f8fafc',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.content}

              {msg.receipts && msg.receipts.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600, marginBottom: 3 }}>
                    RECEIPTS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {msg.receipts.map((r, idx) => (
                      <span key={idx} style={{ fontSize: '9.5px', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
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
                  color: copiedId === msg.id ? '#34d399' : '#64748b',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer',
                  padding: 2
                }}
              >
                {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <span style={{ fontSize: '10.5px', color: '#818cf8', fontWeight: 550 }}>QEVRA Memory</span>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: '12px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Sparkles size={13} color="#818cf8" />
              Scanning ambient memory receipts...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="wfd-chip"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
          >
            <span>{s}</span>
            <ArrowRight size={10} style={{ opacity: 0.5 }} />
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your screen, work history, or code..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 7,
            padding: '8px 12px',
            fontSize: '12px',
            color: '#f8fafc',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="wfd-btn-primary"
          style={{ padding: '0 14px' }}
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  )
}
