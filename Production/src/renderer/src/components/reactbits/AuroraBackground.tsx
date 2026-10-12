import React from 'react'

interface AuroraBackgroundProps {
  children?: React.ReactNode
  className?: string
  showRadialGradient?: boolean
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className = '',
  showRadialGradient = true
}) => {
  return (
    <div
      className={`aurora-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#07080b',
        width: '100%',
        minHeight: '100%'
      }}
    >
      <div
        className="aurora-blobs"
        style={{
          position: 'absolute',
          inset: '-20%',
          opacity: 0.45,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, rgba(56, 189, 248, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(99, 102, 241, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)
          `,
          animation: 'auroraRotate 25s ease-in-out infinite alternate'
        }}
      />
      {showRadialGradient && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 0%, #07080b 85%)',
            pointerEvents: 'none'
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
