import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Hold-to-Talk and Double-Tap Persistent Mode Logic', () => {
  it('detects Fn, Function, Right Alt, and Alt Gr keys as valid push-to-talk triggers', () => {
    const isKeyMatch = (keyName: string, targetKey = 'RIGHT ALT'): boolean => {
      const norm = keyName.toUpperCase().trim()
      const target = targetKey.toUpperCase().trim()

      if (norm === target) return true
      if (target.includes('FN') || target.includes('FUNCTION')) {
        if (norm.includes('FN') || norm.includes('FUNCTION')) return true
      }
      if (target.includes('ALT')) {
        if (target === 'RIGHT ALT' && (norm === 'RIGHT ALT' || norm === 'ALT' || norm === 'RALT' || norm === 'ALT GR')) return true
        if (target === 'LEFT ALT' && (norm === 'LEFT ALT' || norm === 'LALT')) return true
        if (norm.includes('ALT') && !target.includes('RIGHT') && !target.includes('LEFT')) return true
      }
      if ((target === 'FN' || target === 'RIGHT ALT') && (norm.includes('FN') || norm.includes('FUNCTION') || norm === 'RIGHT ALT' || norm === 'ALT GR')) {
        return true
      }
      return false
    }

    expect(isKeyMatch('RIGHT ALT', 'RIGHT ALT')).toBe(true)
    expect(isKeyMatch('ALT GR', 'RIGHT ALT')).toBe(true)
    expect(isKeyMatch('FN', 'RIGHT ALT')).toBe(true)
    expect(isKeyMatch('FUNCTION', 'RIGHT ALT')).toBe(true)
    expect(isKeyMatch('FN', 'FN')).toBe(true)
    expect(isKeyMatch('RIGHT ALT', 'FN')).toBe(true)
    expect(isKeyMatch('SPACE', 'RIGHT ALT')).toBe(false)
    expect(isKeyMatch('ENTER', 'FN')).toBe(false)
  })

  it('correctly discriminates between Hold-to-Talk (press >= 180ms) and short tap (< 180ms)', () => {
    const HOLD_MIN_DURATION_MS = 180
    const evaluatePress = (durationMs: number) => {
      if (durationMs >= HOLD_MIN_DURATION_MS) {
        return 'HOLD_TO_TALK'
      }
      return 'SHORT_TAP'
    }

    expect(evaluatePress(500)).toBe('HOLD_TO_TALK')
    expect(evaluatePress(180)).toBe('HOLD_TO_TALK')
    expect(evaluatePress(90)).toBe('SHORT_TAP')
    expect(evaluatePress(140)).toBe('SHORT_TAP')
  })

  it('triggers persistent mode when two taps occur within 380ms (Double-Tap)', () => {
    const DOUBLE_TAP_THRESHOLD_MS = 380

    const isDoubleTap = (lastRelease: number, currentPress: number) => {
      return (currentPress - lastRelease) <= DOUBLE_TAP_THRESHOLD_MS
    }

    const t1_release = 1000
    const t2_press_quick = 1200 // 200ms gap
    const t2_press_slow = 1500  // 500ms gap

    expect(isDoubleTap(t1_release, t2_press_quick)).toBe(true)
    expect(isDoubleTap(t1_release, t2_press_slow)).toBe(false)
  })

  it('preserves and appends accumulated transcript across pause and resume cycles', () => {
    let baseTranscript = ''
    let currentFullTranscript = ''
    let isPaused = false

    const onSpeechPart = (newText: string) => {
      if (isPaused) return
      currentFullTranscript = (baseTranscript ? baseTranscript + ' ' : '') + newText.trim()
    }

    const pause = () => {
      isPaused = true
      baseTranscript = currentFullTranscript.trim()
    }

    const resume = () => {
      isPaused = false
    }

    // Step 1: Speak first sentence
    onSpeechPart('Draft a reply')
    expect(currentFullTranscript).toBe('Draft a reply')

    // Step 2: User pauses recording
    pause()
    expect(isPaused).toBe(true)
    expect(baseTranscript).toBe('Draft a reply')

    // Speech incoming during pause is ignored
    onSpeechPart('some background noise')
    expect(currentFullTranscript).toBe('Draft a reply')

    // Step 3: User resumes recording and speaks second sentence
    resume()
    expect(isPaused).toBe(false)
    onSpeechPart('confirming the meeting at 3 PM')

    expect(currentFullTranscript).toBe('Draft a reply confirming the meeting at 3 PM')
  })
})
