export interface STTCallback {
  onInterimResult: (transcript: string) => void
  onFinalResult: (transcript: string) => void
  onError: (error: string) => void
}

export class SpeechToTextService {
  private recognition: any = null
  private isListening = false
  private isPaused = false
  private callbacks: STTCallback | null = null
  private baseTranscript = ''
  private currentFullTranscript = ''

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
    }
  }

  start(callbacks: STTCallback): boolean {
    if (!this.recognition) {
      callbacks.onError('Web Speech API is not supported in this runtime environment.')
      return false
    }

    this.callbacks = callbacks
    this.isListening = true
    this.isPaused = false
    this.baseTranscript = ''
    this.currentFullTranscript = ''
    let sessionTranscript = ''

    this.recognition.onresult = (event: any) => {
      if (this.isPaused) return

      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          sessionTranscript += event.results[i][0].transcript + ' '
        } else {
          interim += event.results[i][0].transcript
        }
      }
      const full = (this.baseTranscript ? this.baseTranscript + ' ' : '') + (sessionTranscript + interim).trim()
      this.currentFullTranscript = full.trim()
      this.callbacks?.onInterimResult(this.currentFullTranscript)
    }

    this.recognition.onerror = (event: any) => {
      console.warn('[VESPER STT] Speech error:', event.error)
      this.callbacks?.onError(event.error)
    }

    this.recognition.onend = () => {
      if (this.isListening && !this.isPaused) {
        const full = (this.baseTranscript ? this.baseTranscript + ' ' : '') + sessionTranscript.trim()
        if (full.trim()) {
          this.callbacks?.onFinalResult(full.trim())
        }
      }
      this.isListening = false
    }

    try {
      this.recognition.start()
      return true
    } catch (err) {
      console.error('[VESPER STT] Start failed:', err)
      return false
    }
  }

  pause(): void {
    if (!this.isListening || this.isPaused) return
    this.isPaused = true
    this.baseTranscript = this.currentFullTranscript.trim()
    try {
      this.recognition?.stop()
    } catch (e) {
      // ignore
    }
  }

  resume(): void {
    if (!this.isPaused) return
    this.isPaused = false
    this.isListening = true
    try {
      this.recognition?.start()
    } catch (e) {
      console.warn('[VESPER STT] Resume error:', e)
    }
  }

  stop(): void {
    this.isListening = false
    this.isPaused = false
    this.baseTranscript = ''
    this.currentFullTranscript = ''
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch (e) {
        // ignore
      }
    }
  }
}

