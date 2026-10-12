import React, { useState, useEffect } from 'react'
import { Target, CheckCircle2, ChevronRight, X, MousePointer2 } from 'lucide-react'
import { ScreenNavigationPlan, ScreenElementCandidate } from '../core/screen-navigator'

interface ScreenNavigationBarProps {
  plan: ScreenNavigationPlan
  onExecuteClick: (target: ScreenElementCandidate) => void
  onDismiss: () => void
}

export const ScreenNavigationBar: React.FC<ScreenNavigationBarProps> = ({
  plan,
  onExecuteClick,
  onDismiss
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const candidates = plan.allCandidates
  const currentCandidate = candidates[selectedIndex] || plan.targetElement

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDismiss()
      } else if (e.key === 'Tab' && candidates.length > 1) {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % candidates.length)
      } else if (e.key === ' ' && currentCandidate) {
        // Space to execute if not typing in input
        const tag = (e.target as HTMLElement)?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault()
          onExecuteClick(currentCandidate)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [candidates, currentCandidate, onDismiss, onExecuteClick])

  if (!currentCandidate) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '999px',
        padding: '8px 16px',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.25)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '12px',
        userSelect: 'none',
        maxWidth: '92vw',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Target Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.2)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          color: '#818cf8'
        }}
      >
        <Target size={14} />
      </div>

      {/* Target Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          VESPER Nav:
        </span>
        <span style={{ fontWeight: 600, color: '#ffffff' }}>
          {currentCandidate.label}
        </span>
        <span
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#a5b4fc'
          }}
        >
          x: {currentCandidate.x}, y: {currentCandidate.y}
        </span>
      </div>

      {/* Candidate cycle counter if multiple */}
      {candidates.length > 1 && (
        <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '4px' }}>
          ({selectedIndex + 1}/{candidates.length})
        </span>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
        <button
          onClick={() => onExecuteClick(currentCandidate)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
          }}
          title="Press Space or Click to Execute Click"
        >
          <MousePointer2 size={12} />
          Click Element
          <kbd style={{ fontSize: '9px', opacity: 0.8, background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: '3px' }}>Space</kbd>
        </button>

        {candidates.length > 1 && (
          <button
            onClick={() => setSelectedIndex((prev) => (prev + 1) % candidates.length)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              padding: '4px 9px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Press Tab to cycle candidates"
          >
            Next
            <ChevronRight size={12} />
          </button>
        )}

        <button
          onClick={onDismiss}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer'
          }}
          title="Press Esc to Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
