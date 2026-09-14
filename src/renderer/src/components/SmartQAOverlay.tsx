import React, { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { DisambiguationQuestion } from '../types/task'

interface SmartQAOverlayProps {
  question: DisambiguationQuestion
  onSelectOption: (key: string, value: string) => void
}

export const SmartQAOverlay: React.FC<SmartQAOverlayProps> = ({ question, onSelectOption }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const match = question.options.find((opt) => opt.key === e.key)
      if (match) {
        e.preventDefault()
        onSelectOption(match.key, match.value)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question, onSelectOption])

  return (
    <div className="wf-qa-card">
      <div className="wf-qa-top">
        <div className="wf-qa-question">
          <Sparkles size={14} color="#8b5cf6" />
          <span>{question.question}</span>
        </div>
        <div className="wf-qa-hint">Press 1-4 or click</div>
      </div>

      <div className="wf-qa-grid">
        {question.options.map((opt) => (
          <button
            key={opt.key}
            className="wf-qa-btn"
            onClick={() => onSelectOption(opt.key, opt.value)}
          >
            <span className="wf-key-badge">[{opt.key}]</span>
            <span>{opt.label}</span>
            {opt.isRecommended && (
              <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#10b981' }}>
                Suggested
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
