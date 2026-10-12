import React, { useRef, useState } from 'react'

interface MagnetProps {
  children: React.ReactNode
  padding?: number
  magnetStrength?: number
  activeTransition?: string
  inactiveTransition?: string
  wrapperClassName?: string
  innerClassName?: string
  style?: React.CSSProperties
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 40,
  magnetStrength = 2,
  activeTransition = 'transform 0.15s ease-out',
  inactiveTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
  wrapperClassName = '',
  innerClassName = '',
  style = {}
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [transition, setTransition] = useState(inactiveTransition)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return
    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2

    const distX = Math.abs(centerX - e.clientX)
    const distY = Math.abs(centerY - e.clientY)

    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      setTransition(activeTransition)
      const moveX = (e.clientX - centerX) / magnetStrength
      const moveY = (e.clientY - centerY) / magnetStrength
      setPosition({ x: moveX, y: moveY })
    } else {
      setTransition(inactiveTransition)
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    setTransition(inactiveTransition)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={wrapperClassName}
      style={{ display: 'inline-block', ...style }}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  )
}
