import React from 'react'
import { Code, MessageSquare, Globe, FileText, Monitor } from 'lucide-react'
import { SystemContext } from '../types/task'

interface ContextBadgeProps {
  context: SystemContext
}

export const ContextBadge: React.FC<ContextBadgeProps> = ({ context }) => {
  const getIcon = () => {
    const size = 11
    switch (context.detectedCategory) {
      case 'code':
        return <Code size={size} strokeWidth={1.75} />
      case 'communication':
        return <MessageSquare size={size} strokeWidth={1.75} />
      case 'browser':
        return <Globe size={size} strokeWidth={1.75} />
      case 'document':
        return <FileText size={size} strokeWidth={1.75} />
      default:
        return <Monitor size={size} strokeWidth={1.75} />
    }
  }

  return (
    <div
      className="wf-context-pill"
      title={`Target Process: ${context.activeApp || 'Desktop'} — ${context.windowTitle || ''}`}
    >
      {getIcon()}
      <span>{context.activeApp || 'Desktop'}</span>
    </div>
  )
}
