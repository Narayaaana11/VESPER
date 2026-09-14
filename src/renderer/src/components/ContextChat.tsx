import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, User, Copy, Check, Clock, Layers, ArrowRight } from 'lucide-react'
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
      content: `Hello! I am your ambient context assistant. I have direct access to your local SQLite memory, screen activity, and active applications. You can ask me what you were doing, to summarize your work, or to find specific context from earlier today.`,
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

      const apiKey = settings.apiKey
      if (apiKey) {
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content: query }
            ],
            temperature: 0.3,
            max_tokens: 600
          })
        })

        if (resp.ok) {
          const data = await resp.json()
          replyContent = data.choices?.[0]?.message?.content || ''
        } else {
          const errData = await resp.json().catch(() => ({}))
          replyContent = `Error querying AI provider: ${errData?.error?.message || resp.statusText}`
        }
      } else {
        replyContent = `Please configure your Groq API key in Settings to chat with ambient memory.`
      }

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
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
          content: `Failed to process query: ${err?.message || 'Unknown error'}`,
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 520, padding: '20px 24px', color: '#f4f4f5' }}>
      {/* Messages Container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 6 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'user' ? (
                <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 600 }}>You</span>
              ) : (
                <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={12} /> QEVRA Memory
                </span>
              )}
              <span style={{ fontSize: '10px', color: '#71717a' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : 'rgba(24, 25, 32, 0.9)',
                border: msg.role === 'user' ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#f4f4f5',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              {msg.content}

              {msg.receipts && msg.receipts.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>
                    VERIFIED CONTEXT RECEIPTS:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {msg.receipts.map((r, idx) => (
                      <span key={idx} style={{ fontSize: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginTop: 3 }}>
              <button
                onClick={() => handleCopy(msg.content, msg.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedId === msg.id ? '#34d399' : '#71717a',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer',
                  padding: 2
                }}
              >
                {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                {copiedId === msg.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>QEVRA Memory</span>
            </div>
            <div
              style={{
                background: 'rgba(24, 25, 32, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: '13px',
                color: '#a1a1aa',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Sparkles size={14} className="animate-spin" color="#a78bfa" />
              Scanning ambient memory receipts and synthesizing answer...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            style={{
              whiteSpace: 'nowrap',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 20,
              padding: '5px 12px',
              fontSize: '11px',
              color: '#d4d4d8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {s} <ArrowRight size={11} style={{ opacity: 0.6 }} />
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your screen, work history, or code..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(10, 11, 14, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 10,
            padding: '11px 16px',
            fontSize: '13px',
            color: '#ffffff',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: 10,
            color: '#ffffff',
            padding: '0 18px',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
