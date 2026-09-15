import React, { useEffect, useState, useRef } from 'react'

interface DecryptedTextProps {
  text: string
  speed?: number
  maxIterations?: number
  sequential?: boolean
  revealDirection?: 'start' | 'end' | 'center'
  characters?: string
  className?: string
  encryptedClassName?: string
  animateOn?: 'view' | 'hover'
  style?: React.CSSProperties
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?/'

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = '',
  animateOn = 'view',
  style = {}
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovered, setIsHovered] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const intervalRef = useRef<any>(null)

  const triggerAnimation = () => {
    let iteration = 0
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join('')
      )

      if (iteration >= text.length) {
        clearInterval(intervalRef.current)
        setDisplayText(text)
        setHasAnimated(true)
      }

      iteration += 1 / (maxIterations / text.length || 1)
    }, speed)
  }

  useEffect(() => {
    if (animateOn === 'view' && !hasAnimated) {
      triggerAnimation()
    }
    return () => clearInterval(intervalRef.current)
  }, [text])

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      setIsHovered(true)
      triggerAnimation()
    }
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
      style={{
        display: 'inline-block',
        fontFamily: 'inherit',
        cursor: animateOn === 'hover' ? 'pointer' : 'default',
        ...style
      }}
    >
      {displayText}
    </span>
  )
}
