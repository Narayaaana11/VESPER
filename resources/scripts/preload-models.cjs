const { pipeline, env } = require('@xenova/transformers')
const path = require('path')

async function preload() {
  console.log('[VESPER Asset Downloader] Starting download and verification of local AI models...')
  
  // Configure local cache folder
  const cacheDir = path.join(__dirname, '..', 'models', 'transformers-cache')
  env.cacheDir = cacheDir
  
  console.log(`[VESPER Asset Downloader] Cache directory set to: ${cacheDir}`)
  console.log('[VESPER Asset Downloader] Downloading Xenova/all-MiniLM-L6-v2 (quantized ONNX)...')
  
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    progress_callback: (progress) => {
      if (progress.status === 'progress') {
        const percent = Math.round(progress.progress || 0)
        if (percent % 25 === 0) {
          console.log(`[VESPER Asset Downloader] ${progress.file}: ${percent}%`)
        }
      } else if (progress.status === 'done') {
        console.log(`[VESPER Asset Downloader] Loaded: ${progress.file}`)
      }
    }
  })
  
  console.log('[VESPER Asset Downloader] Running inference test...')
  const result = await extractor('VESPER local semantic vector test', { pooling: 'mean', normalize: true })
  console.log('[VESPER Asset Downloader] [SUCCESS] Embeddings initialized! Dimensions:', result.dims)
  console.log('[VESPER Asset Downloader] First 5 vector weights:', Array.from(result.data.slice(0, 5)).map(n => n.toFixed(4)).join(', '))

  console.log('[VESPER Asset Downloader] Downloading and verifying Xenova/whisper-tiny.en (Local STT ONNX)...')
  const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
    quantized: true,
    progress_callback: (progress) => {
      if (progress.status === 'progress') {
        const percent = Math.round(progress.progress || 0)
        if (percent % 25 === 0) {
          console.log(`[VESPER Asset Downloader] ${progress.file}: ${percent}%`)
        }
      } else if (progress.status === 'done') {
        console.log(`[VESPER Asset Downloader] Loaded: ${progress.file}`)
      }
    }
  })
  console.log('[VESPER Asset Downloader] [SUCCESS] Local Whisper STT model initialized & verified!')
}

preload().catch(err => {
  console.error('[VESPER Asset Downloader] Error preloading model:', err)
  process.exit(1)
})
