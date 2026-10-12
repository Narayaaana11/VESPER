import React from 'react'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
  style?: React.CSSProperties
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
  color = '#a1a1aa',
  shineColor = '#ffffff',
  style = {}
}) => {
  if (disabled) {
    return <span className={className} style={{ color, ...style }}>{text}</span>
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        color,
        backgroundImage: `linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, ${shineColor} 50%, rgba(255, 255, 255, 0) 70%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animation: `shiny-sweep ${speed}s infinite linear`,
        ...style
      }}
    >
      {text}
    </span>
  )
}
