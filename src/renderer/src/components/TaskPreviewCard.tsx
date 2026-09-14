import React, { useState } from 'react'
import { Send, Copy, Check, Terminal, Sparkles } from 'lucide-react'
import { UniversalTaskObject } from '../types/task'

interface TaskPreviewCardProps {
  task: UniversalTaskObject
  onExecute: (task: UniversalTaskObject, autoPaste: boolean) => void
}

export const TaskPreviewCard: React.FC<TaskPreviewCardProps> = ({ task, onExecute }) => {
  const [copied, setCopied] = useState(false)
  const [showJson, setShowJson] = useState(false)

  const handleCopy = () => {
    onExecute(task, false)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInject = () => {
    onExecute(task, true)
  }

  return (
    <div className="wf-output-card">
      <div className="wf-output-header">
        <div className="wf-target-pill">
          <Sparkles size={13} color="#06b6d4" />
          <span>POLISHED FOR {task.targetRouting.adapter.replace('_', ' ').toUpperCase()}</span>
        </div>
        <button
          className="wf-btn-subtle"
          style={{ padding: '2px 8px', fontSize: '10.5px' }}
          onClick={() => setShowJson(!showJson)}
        >
          <Terminal size={11} />
          <span>{showJson ? 'View Text' : 'View UTO'}</span>
        </button>
      </div>

      {showJson ? (
        <pre className="wf-text-preview" style={{ color: '#a5d6ff' }}>
          {JSON.stringify(task, null, 2)}
        </pre>
      ) : (
        <div className="wf-text-preview">
          {task.targetRouting.optimizedPrompt}
        </div>
      )}

      <div className="wf-output-actions">
        <div style={{ fontSize: '11px', color: 'var(--wf-text-muted)' }}>
          {task.targetRouting.explanation}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="wf-btn-subtle" onClick={handleCopy}>
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="wf-btn-primary" onClick={handleInject}>
            <Send size={13} />
            <span>Insert</span>
          </button>
        </div>
      </div>
    </div>
  )
}
