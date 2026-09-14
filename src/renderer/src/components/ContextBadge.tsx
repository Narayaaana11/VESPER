import React from 'react'
import { Sparkles, Code, MessageSquare, Globe, FileText, Monitor } from 'lucide-react'
import { SystemContext } from '../types/task'

interface ContextBadgeProps {
  context: SystemContext
}

export const ContextBadge: React.FC<ContextBadgeProps> = ({ context }) => {
  const getIcon = () => {
    switch (context.detectedCategory) {
      case 'code':
        return <Code size={11} color="#38bdf8" />
      case 'communication':
        return <MessageSquare size={11} color="#a855f7" />
      case 'browser':
        return <Globe size={11} color="#22c55e" />
      case 'document':
        return <FileText size={11} color="#f59e0b" />
      default:
        return <Monitor size={11} color="#94a3b8" />
    }
  }

  return (
    <div className="wf-context-pill" title={`Active: ${context.activeApp} - ${context.windowTitle}`}>
      {getIcon()}
      <span>{context.activeApp || 'Desktop'}</span>
    </div>
  )
}
