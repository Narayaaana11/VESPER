import React, { useMemo } from 'react'

interface AudioVisualizerProps {
  isRecording: boolean
  audioLevel: number // 0.0 to 1.0
  barCount?: number
}

/**
 * Minimalist Monochromatic Waveform
 * Features slender vertical capsules with smooth center-weighted height expansion.
 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioLevel,
  barCount = 18
}) => {
  const weights = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const center = (barCount - 1) / 2
      const dist = Math.abs(i - center) / center
      const bell = Math.exp(-Math.pow(dist * 1.8, 2))
      return Math.max(0.2, Math.min(1.0, bell))
    })
  }, [barCount])

  return (
    <div className="reactbits-waveform-container" title="Audio Levels">
      {weights.map((w, idx) => {
        let height = 4
        let opacity = 0.25

        if (isRecording) {
          const now = Date.now() / 150
          const ripple = Math.sin(now + idx * 0.4) * 0.2 + 0.8
          const dynamicHeight = 4 + audioLevel * 18 * w * ripple
          height = Math.max(4, Math.min(22, Math.round(dynamicHeight)))
          opacity = Math.max(0.35, Math.min(0.95, 0.4 + audioLevel * 0.55 * w))
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
