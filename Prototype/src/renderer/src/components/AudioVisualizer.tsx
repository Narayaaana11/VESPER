import React, { useMemo } from 'react'

interface AudioVisualizerProps {
  isRecording: boolean
  audioLevel: number // 0.0 to 1.0
  barCount?: number
}

/**
 * Minimalist Monochromatic Waveform
 * Slender, precision-spaced micro-capsules with subtle grayscale opacity transitions.
 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioLevel,
  barCount = 16
}) => {
  const weights = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const center = (barCount - 1) / 2
      const dist = Math.abs(i - center) / center
      const bell = Math.exp(-Math.pow(dist * 1.7, 2))
      return Math.max(0.25, Math.min(1.0, bell))
    })
  }, [barCount])

  return (
    <div className="reactbits-waveform-container" title="Audio Activity">
      {weights.map((w, idx) => {
        let height = 3
        let opacity = 0.2

        if (isRecording) {
          const now = Date.now() / 160
          const ripple = Math.sin(now + idx * 0.45) * 0.18 + 0.82
          const dynamicHeight = 3 + audioLevel * 16 * w * ripple
          height = Math.max(3, Math.min(20, Math.round(dynamicHeight)))
          opacity = Math.max(0.35, Math.min(0.95, 0.35 + audioLevel * 0.6 * w))
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
