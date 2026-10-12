import React, { useEffect, useState } from 'react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  separator?: string
  decimals?: number
  className?: string
  style?: React.CSSProperties
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.5,
  separator = ',',
  decimals = 0,
  className = '',
  style = {}
}) => {
  const [current, setCurrent] = useState(from)

  useEffect(() => {
    let startTimestamp: number | null = null
    let frameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      // Ease out expo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const value = from + (to - from) * easeOut
      setCurrent(value)

      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      } else {
        setCurrent(to)
      }
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [to, from, duration])

  const formatted = (val: number) => {
    const fixed = val.toFixed(decimals)
    const [intPart, decPart] = fixed.split('.')
    const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return decPart !== undefined ? `${withSeparator}.${decPart}` : withSeparator
  }

  return (
    <span className={className} style={style}>
      {formatted(current)}
    </span>
  )
}
