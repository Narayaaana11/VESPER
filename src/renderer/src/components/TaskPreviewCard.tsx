import React, { useState } from 'react'
import { Send, Copy, Check, Terminal, Cpu } from 'lucide-react'
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
    setTimeout(() => setCopied(false), 1800)
  }

  const handleInject = () => {
    onExecute(task, true)
  }

  return (
    <div className="wf-output-card">
      <div className="wf-output-header">
        <div className="wf-target-pill">
          <Cpu size={11} strokeWidth={1.75} />
          <span>ROUTING // {task.targetRouting.adapter.replace('_', ' ').toUpperCase()}</span>
        </div>
        <button
          className="wf-btn-subtle"
          style={{ padding: '2px 7px', fontSize: '10px', height: '22px' }}
          onClick={() => setShowJson(!showJson)}
        >
          <Terminal size={10} />
          <span>{showJson ? 'Plain' : 'Schema'}</span>
        </button>
      </div>

      {showJson ? (
        <pre className="wf-text-preview" style={{ color: '#d4d4d8' }}>
          {JSON.stringify(task, null, 2)}
        </pre>
      ) : (
        <div className="wf-text-preview">
          {task.targetRouting.optimizedPrompt}
        </div>
      )}

      <div className="wf-output-actions">
        <div style={{ fontSize: '10px', color: 'var(--wf-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {task.targetRouting.explanation}
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button className="wf-btn-subtle" onClick={handleCopy}>
            {copied ? <Check size={11} color="var(--wf-success)" /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="wf-btn-primary" onClick={handleInject}>
            <Send size={11} />
            <span>Auto-Paste</span>
          </button>
        </div>
      </div>
    </div>
  )
}
