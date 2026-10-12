import React from 'react'

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string
  speed?: string
  thickness?: number
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export const StarBorder: React.FC<StarBorderProps> = ({
  color = '#38bdf8',
  speed = '4s',
  thickness = 1.5,
  className = '',
  children,
  style = {},
  ...props
}) => {
  return (
    <button
      className={`relative inline-flex overflow-hidden rounded-xl p-[1.5px] ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        overflow: 'hidden',
        padding: `${thickness}px`,
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        ...style
      }}
      {...props}
    >
      <span
        style={{
          position: 'absolute',
          inset: '-1000%',
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 60%, ${color} 90%, transparent 100%)`,
          animation: `spin-slow ${speed} linear infinite`,
          zIndex: 0
        }}
      />
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '9px',
          background: '#090a0f',
          color: '#f4f4f5',
          zIndex: 1
        }}
      >
        {children}
      </span>
    </button>
  )
}
