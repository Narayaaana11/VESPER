import React from 'react'
import { Code, MessageSquare, Globe, FileText, Monitor } from 'lucide-react'
import { SystemContext } from '../types/task'

interface ContextBadgeProps {
  context: SystemContext
}

export const ContextBadge: React.FC<ContextBadgeProps> = ({ context }) => {
  const getIcon = () => {
    const size = 11
    const color = '#94a3b8'
    switch (context.detectedCategory) {
      case 'code':
        return <Code size={size} color={color} />
      case 'communication':
        return <MessageSquare size={size} color={color} />
      case 'browser':
        return <Globe size={size} color={color} />
      case 'document':
        return <FileText size={size} color={color} />
      default:
        return <Monitor size={size} color={color} />
    }
  }

  return (
    <div className="wf-context-pill" title={`Active: ${context.activeApp} - ${context.windowTitle}`}>
      {getIcon()}
      <span>{context.activeApp || 'Desktop'}</span>
    </div>
  )
}
