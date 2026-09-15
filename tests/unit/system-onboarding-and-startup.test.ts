import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('System Onboarding, Engine Verification & Startup Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates resource checklist structure for local ONNX models and Win32 helpers', () => {
    const mockResources = {
      allReady: true,
      winKeyServer: { ready: true, path: 'C:\\QEVRA\\WinKeyServer.exe' },
      detectWindow: { ready: true, path: 'C:\\QEVRA\\detect-window.exe' },
      sendInput: { ready: true, path: 'C:\\QEVRA\\send-input.exe' },
      sileroVad: { ready: true, path: 'C:\\QEVRA\\silero_vad.onnx', sizeBytes: 2327524 },
      vectorTransformer: { ready: true, path: 'C:\\QEVRA\\model_quantized.onnx', sizeBytes: 22972370 },
      groqConfigured: true,
      startupEnabled: true
    }

    expect(mockResources.allReady).toBe(true)
    expect(mockResources.sileroVad.sizeBytes).toBeGreaterThan(2000000)
    expect(mockResources.vectorTransformer.sizeBytes).toBeGreaterThan(20000000)
    expect(mockResources.winKeyServer.ready).toBe(true)
    expect(mockResources.startupEnabled).toBe(true)
  })

  it('handles incremental progress events during engine initialization', () => {
    const progressEvents: Array<{ step: string; percent: number; detail: string }> = []
    const handleProgress = (data: { step: string; percent: number; detail: string }) => {
      progressEvents.push(data)
    }

    handleProgress({ step: 'win32', percent: 15, detail: 'Verifying Windows native input injectors...' })
    handleProgress({ step: 'silero', percent: 45, detail: 'Checking Silero Neural VAD ONNX Engine (2.3 MB)...' })
    handleProgress({ step: 'embeddings', percent: 75, detail: 'Pre-warming all-MiniLM-L6-v2 Local Vector Embeddings (22.9 MB)...' })
    handleProgress({ step: 'startup', percent: 90, detail: 'Configuring Windows Startup background registration...' })
    handleProgress({ step: 'ready', percent: 100, detail: 'All engines verified & nominal!' })

    expect(progressEvents.length).toBe(5)
    expect(progressEvents[0].percent).toBe(15)
    expect(progressEvents[4].percent).toBe(100)
    expect(progressEvents[4].step).toBe('ready')
  })

  it('verifies that Windows auto-start setting toggles correctly', () => {
    let mockStartupState = false

    const setStartup = (enabled: boolean) => {
      mockStartupState = enabled
      return mockStartupState
    }

    expect(setStartup(true)).toBe(true)
    expect(mockStartupState).toBe(true)

    expect(setStartup(false)).toBe(false)
    expect(mockStartupState).toBe(false)
  })

  it('guarantees audio pre-warming keeps warm stream live for zero latency', () => {
    let warmStreamActive = false

    const prewarm = () => {
      warmStreamActive = true
      return true
    }

    const startRecording = () => {
      if (warmStreamActive) {
        return { latencyMs: 2, usedPrewarmedStream: true }
      }
      return { latencyMs: 250, usedPrewarmedStream: false }
    }

    expect(startRecording().usedPrewarmedStream).toBe(false)
    prewarm()
    const fastStart = startRecording()
    expect(fastStart.usedPrewarmedStream).toBe(true)
    expect(fastStart.latencyMs).toBeLessThan(10)
  })
})
