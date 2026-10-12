/**
 * VESPER Audio Chimes System
 * Generates immediate, pleasant auditory cues using the Web Audio API without external audio files.
 */
class AudioChimes {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) this.ctx = new AudioCtx()
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return this.ctx
    } catch {
      return null
    }
  }

  /**
   * Warm rising chime played when voice recording begins (440Hz -> 660Hz)
   */
  public playStart(enabled = true): void {
    if (!enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const now = ctx.currentTime
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.08)
    } catch {}
  }

  /**
   * Soft falling tone played when voice recording stops and processing begins (660Hz -> 440Hz)
   */
  public playStop(enabled = true): void {
    if (!enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const now = ctx.currentTime
      osc.frequency.setValueAtTime(660, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.07)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } catch {}
  }

  /**
   * Crisp dual-ping chime played on successful insertion / auto-paste (880Hz, 1175Hz)
   */
  public playSuccess(enabled = true): void {
    if (!enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      ;[880, 1175].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const t = now + i * 0.06
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0.07, t)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.07)
      })
    } catch {}
  }

  /**
   * Gentle low tone played on error or block (220Hz)
   */
  public playError(enabled = true): void {
    if (!enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      const now = ctx.currentTime
      osc.frequency.setValueAtTime(220, now)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.12)
    } catch {}
  }
}

export const audioChimes = new AudioChimes()
