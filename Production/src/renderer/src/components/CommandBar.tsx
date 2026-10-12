import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Terminal, Sparkles, X, ArrowRight, CornerDownLeft, Layers, ShieldCheck } from 'lucide-react'
import { SystemContext } from '../types/task'

interface CommandBarProps {
  activeApp: string
  windowTitle?: string
  context: SystemContext
  onSubmitText: (text: string) => void
  onStartVoice: () => void
  onClose: () => void
  isProcessing?: boolean
  statusMessage?: string | null
}

export const CommandBar: React.FC<CommandBarProps> = ({
  activeApp,
  windowTitle,
  context,
  onSubmitText,
  onStartVoice,
  onClose,
  isProcessing = false,
  statusMessage
}) => {
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Autofocus input when Command Bar appears
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isProcessing) return
    onSubmitText(trimmed)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div className="vesper-command-bar-root">
      <div className="vesper-command-bar-surface">
        {/* Left Badge: Active Context */}
        <div className="vesper-cmd-context-pill" title={`Active Application: ${activeApp} (${windowTitle || ''})`}>
          <Layers size={12} className="vesper-cmd-context-icon" />
          <span className="vesper-cmd-context-text">{activeApp || 'Desktop'}</span>
        </div>

        {/* Center: Command Input */}
        <div className="vesper-cmd-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="vesper-cmd-input"
            placeholder={
              isProcessing
                ? (statusMessage || 'Processing task...')
                : `Command VESPER in ${activeApp}... (e.g. "Reply to email", "Fix error")`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
        </div>

        {/* Right Actions: Voice Mic + Submit + Close */}
        <div className="vesper-cmd-actions">
          {inputText.trim().length > 0 ? (
            <button
              className="vesper-cmd-btn vesper-cmd-btn-submit"
              onClick={() => handleSubmit()}
              disabled={isProcessing}
              title="Execute Command (Enter)"
            >
              <CornerDownLeft size={13} />
            </button>
          ) : (
            <button
              className="vesper-cmd-btn vesper-cmd-btn-mic"
              onClick={onStartVoice}
              title="Hold Right Alt or Click to Speak"
            >
              <Mic size={14} />
            </button>
          )}

          <button
            className="vesper-cmd-btn vesper-cmd-btn-close"
            onClick={onClose}
            title="Close Command Bar (Escape)"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Sub-footer Hint */}
      <div className="vesper-cmd-footer">
        <span className="vesper-cmd-hint">
          <strong>Enter</strong> to run
        </span>
        <span className="vesper-cmd-hint-separator">•</span>
        <span className="vesper-cmd-hint">
          <strong>Right Alt</strong> voice hold
        </span>
        <span className="vesper-cmd-hint-separator">•</span>
        <span className="vesper-cmd-hint">
          <strong>Esc</strong> close
        </span>
      </div>
    </div>
  )
}
