import { SileroVAD, VADOptions } from './silero-vad'

export interface RecordingSessionResult {
  blob: Blob | null
  mimeType: string
  durationMs: number
  byteSize: number
  chunkCount: number
  startTimestamp: number
  stopTimestamp: number
  bufferResetConfirmed: boolean
  isMediaRecorderInactive: boolean
}

export class AudioRecorder {
  private mediaStream: MediaStream | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array<ArrayBuffer> | null = null
  private animFrameId: number | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private activeMimeType = 'audio/webm'

  private vad: SileroVAD = new SileroVAD()
  private scriptProcessor: ScriptProcessorNode | null = null

  private startTimestamp = 0
  private stopTimestamp = 0
  private bufferResetConfirmed = false

  public isRecording = false
  public isPaused = false

  async start(
    onVolumeChange: (volume: number) => void,
    onSpeechEnd?: (totalSpeechDurationMs: number) => void,
    vadOptions?: VADOptions
  ): Promise<boolean> {
    try {
      // 1. If currently recording or dirty, ensure clean teardown first
      if (this.isRecording || this.mediaRecorder) {
        await this.forceCleanup()
      }

      // 2. Fresh buffer guaranteed for each Hold-to-Talk session
      this.audioChunks = []
      this.bufferResetConfirmed = true
      this.isPaused = false
      this.startTimestamp = Date.now()
      this.stopTimestamp = 0

      // 3. Request 16kHz mono audio optimized for Whisper STT
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)

      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 64
      source.connect(this.analyser)

      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(new ArrayBuffer(bufferLength))
      this.isRecording = true

      // 4. Resolve best supported audio MIME type
      const supportedMime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
            ? 'audio/ogg;codecs=opus'
            : 'audio/mp4'

      this.activeMimeType = supportedMime

      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType: supportedMime })
      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data)
        }
      }

      this.mediaRecorder.onerror = (err) => {
        console.warn('[QEVRA Audio] MediaRecorder error:', err)
      }

      // Emit slices every 100ms for continuous buffering
      this.mediaRecorder.start(100)

      // 5. Connect Silero Voice Activity Detection (VAD) if onSpeechEnd is specified
      if (onSpeechEnd) {
        if (vadOptions) {
          this.vad = new SileroVAD(vadOptions)
        }
        this.vad.init({
          onSpeechEnd: (durationMs) => {
            console.log(`[QEVRA Audio] VAD auto-cutoff triggered after ${durationMs}ms of speech`)
            onSpeechEnd(durationMs)
          }
        })

        try {
          // 512 frame size at 16kHz is exactly 32ms frame chunk
          this.scriptProcessor = this.audioContext.createScriptProcessor(512, 1, 1)
          this.scriptProcessor.onaudioprocess = (e) => {
            if (!this.isRecording || this.isPaused) return
            const inputData = e.inputBuffer.getChannelData(0)
            this.vad.processFrame(inputData)
          }
          source.connect(this.scriptProcessor)
          this.scriptProcessor.connect(this.audioContext.destination)
        } catch (vadErr) {
          console.warn('[QEVRA Audio] VAD processor setup warning:', vadErr)
        }
      }

      // 6. Volume visualizer polling loop
      const pollAudioLevel = (): void => {
        if (!this.isRecording || this.isPaused || !this.analyser || !this.dataArray) return

        this.analyser.getByteFrequencyData(this.dataArray)
        let sum = 0
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i]
        }
        const avg = sum / this.dataArray.length
        const normalized = Math.min(1, avg / 128)
        onVolumeChange(normalized)

        this.animFrameId = requestAnimationFrame(pollAudioLevel)
      }

      pollAudioLevel()
      return true
    } catch (err) {
      console.warn('[QEVRA Audio] Microphone access error or permission denied:', err)
      this.isRecording = false
      return false
    }
  }

  getAudioBlob(): Blob | null {
    if (this.audioChunks.length === 0) return null
    return new Blob(this.audioChunks, { type: this.activeMimeType })
  }

  pause(): void {
    this.isPaused = true
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    try {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.pause()
      }
    } catch (e) {
      console.warn('[QEVRA Audio] Pause recorder error:', e)
    }
  }

  resume(onVolumeChange: (volume: number) => void): void {
    if (!this.analyser || !this.dataArray) return
    this.isPaused = false
    this.isRecording = true

    try {
      if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume()
      }
    } catch (e) {
      console.warn('[QEVRA Audio] Resume recorder error:', e)
    }

    const pollAudioLevel = (): void => {
      if (!this.isRecording || this.isPaused || !this.analyser || !this.dataArray) return

      this.analyser.getByteFrequencyData(this.dataArray)
      let sum = 0
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i]
      }
      const avg = sum / this.dataArray.length
      const normalized = Math.min(1, avg / 128)
      onVolumeChange(normalized)

      this.animFrameId = requestAnimationFrame(pollAudioLevel)
    }

    pollAudioLevel()
  }

  async stop(): Promise<RecordingSessionResult> {
    this.isRecording = false
    this.isPaused = false
    this.stopTimestamp = Date.now()
    const durationMs = this.startTimestamp > 0 ? this.stopTimestamp - this.startTimestamp : 0

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }

    const recorder = this.mediaRecorder

    const assembleAndCleanup = (): RecordingSessionResult => {
      const chunks = [...this.audioChunks]
      const chunkCount = chunks.length
      const blob = chunks.length > 0 ? new Blob(chunks, { type: this.activeMimeType }) : null
      const byteSize = blob ? blob.size : 0
      const isInactive = !recorder || recorder.state === 'inactive'

      // Clean up MediaStream, AudioContext, and VAD processor
      if (this.scriptProcessor) {
        try {
          this.scriptProcessor.disconnect()
        } catch {}
        this.scriptProcessor.onaudioprocess = null
        this.scriptProcessor = null
      }
      this.vad.stop()

      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((t) => t.stop())
        this.mediaStream = null
      }
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {})
        this.audioContext = null
      }

      // Detach event listeners and clean buffer
      if (recorder) {
        recorder.ondataavailable = null
        recorder.onstop = null
        recorder.onerror = null
      }
      this.mediaRecorder = null
      this.audioChunks = [] // Prevent buffer leak to subsequent recordings

      return {
        blob,
        mimeType: this.activeMimeType,
        durationMs,
        byteSize,
        chunkCount,
        startTimestamp: this.startTimestamp,
        stopTimestamp: this.stopTimestamp,
        bufferResetConfirmed: this.bufferResetConfirmed,
        isMediaRecorderInactive: isInactive
      }
    }

    if (!recorder || recorder.state === 'inactive') {
      return assembleAndCleanup()
    }

    return new Promise<RecordingSessionResult>((resolve) => {
      // Ensure timeout fallback in case onstop does not fire within 1500ms
      const timeoutTimer = setTimeout(() => {
        console.warn('[QEVRA Audio] MediaRecorder onstop timeout fallback')
        resolve(assembleAndCleanup())
      }, 1500)

      recorder.onstop = () => {
        clearTimeout(timeoutTimer)
        resolve(assembleAndCleanup())
      }

      try {
        if (recorder.state === 'recording' || recorder.state === 'paused') {
          recorder.requestData()
          recorder.stop()
        } else {
          clearTimeout(timeoutTimer)
          resolve(assembleAndCleanup())
        }
      } catch (err) {
        console.warn('[QEVRA Audio] Error stopping recorder:', err)
        clearTimeout(timeoutTimer)
        resolve(assembleAndCleanup())
      }
    })
  }

  private async forceCleanup(): Promise<void> {
    this.isRecording = false
    this.isPaused = false
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect()
      } catch {}
      this.scriptProcessor.onaudioprocess = null
      this.scriptProcessor = null
    }
    this.vad.stop()
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop()
      } catch {}
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop())
      this.mediaStream = null
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        await this.audioContext.close()
      } catch {}
      this.audioContext = null
    }
    this.mediaRecorder = null
    this.audioChunks = []
  }
}
