import React, { useState, useEffect } from 'react'
import { Check, X, Sparkles, Send } from 'lucide-react'
import { ScreenAgentResult } from '../core/screen-agent'

interface AgentApprovalCardProps {
  proposal: ScreenAgentResult
  onApprove: (finalText: string) => void
  onEdit: (updatedText: string) => void
  onDisapprove: () => void
}

export const AgentApprovalCard: React.FC<AgentApprovalCardProps> = ({
  proposal,
  onApprove,
  onEdit,
  onDisapprove
}) => {
  const [currentText, setCurrentText] = useState(proposal.draftedReply)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDisapprove()
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || document.activeElement?.tagName !== 'TEXTAREA')) {
        e.preventDefault()
        onApprove(currentText)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentText, onApprove, onDisapprove])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value)
    onEdit(e.target.value)
  }

  return (
    <div className="wf-approval-card">
      {/* Header with App Badge & Context */}
      <div className="wf-approval-header">
        <div className="wf-approval-title">
          <Sparkles size={13} color="#818cf8" />
          <span>Screen Copilot Proposal</span>
          <span className="wf-target-app-pill">{proposal.targetApp}</span>
        </div>
        <div className="wf-approval-badge">{proposal.contextSummary}</div>
      </div>

      {/* Editable Response Preview Box */}
      <div className="wf-approval-body">
        <textarea
          className="wf-approval-textarea"
          value={currentText}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              onApprove(currentText)
            }
          }}
          rows={3}
          placeholder="Review or edit drafted reply before sending..."
        />
      </div>

      {/* Footer Controls */}
      <div className="wf-approval-footer">
        <div className="wf-approval-hint">
          Ctrl+Enter to Approve · Esc to Reject
        </div>
        <div className="wf-approval-actions">
          <button className="wf-approval-btn wf-btn-reject" onClick={onDisapprove}>
            <X size={12} />
            <span>Discard</span>
          </button>
          <button className="wf-approval-btn wf-btn-approve" onClick={() => onApprove(currentText)}>
            <Send size={12} />
            <span>Approve & Paste</span>
          </button>
        </div>
      </div>
    </div>
  )
}
