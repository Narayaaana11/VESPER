import React, { useMemo } from 'react'

interface AudioVisualizerProps {
  isRecording: boolean
  audioLevel: number // 0.0 to 1.0
  barCount?: number
}

/**
 * AI Chat 8 inspired Audio Levels Waveform
 * Features rounded pill-shaped bars and dots that organically expand from the center
 * based on live voice levels (React Bits Pro aesthetic).
 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioLevel,
  barCount = 22
}) => {
  // Symmetrical center-weighted distribution matching AI Chat 8 waveform
  const weights = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const center = (barCount - 1) / 2
      const dist = Math.abs(i - center) / center
      const bell = Math.exp(-Math.pow(dist * 1.7, 2))
      const rippleMod = 0.7 + 0.3 * Math.sin((i / barCount) * Math.PI * 3.5)
      return Math.max(0.18, Math.min(1.0, bell * 0.75 + rippleMod * 0.25))
    })
  }, [barCount])

  return (
    <div className="reactbits-waveform-container" title="Audio Levels">
      {weights.map((w, idx) => {
        let height = 5
        let opacity = 0.35

        if (isRecording) {
          const now = Date.now() / 140
          const ripple = Math.sin(now + idx * 0.45) * 0.25 + 0.75
          // Expands dynamically from circular dot (5px) to tall rounded capsule (up to 24px)
          const dynamicHeight = 5 + audioLevel * 22 * w * ripple
          height = Math.max(5, Math.min(24, Math.round(dynamicHeight)))
          opacity = Math.max(0.4, Math.min(1.0, 0.45 + audioLevel * 0.55 * w + ripple * 0.1))
        }

        return (
          <div
            key={idx}
            className="reactbits-waveform-bar"
            style={{
              height: `${height}px`,
              opacity
            }}
          />
        )
      })}
    </div>
  )
}
