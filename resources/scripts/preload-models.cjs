const { pipeline, env } = require('@xenova/transformers')
const path = require('path')

async function preload() {
  console.log('[QEVRA Asset Downloader] Starting download and verification of local AI models...')
  
  // Configure local cache folder
  const cacheDir = path.join(__dirname, '..', 'models', 'transformers-cache')
  env.cacheDir = cacheDir
  
  console.log(`[QEVRA Asset Downloader] Cache directory set to: ${cacheDir}`)
  console.log('[QEVRA Asset Downloader] Downloading Xenova/all-MiniLM-L6-v2 (quantized ONNX)...')
  
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    progress_callback: (progress) => {
      if (progress.status === 'progress') {
        const percent = Math.round(progress.progress || 0)
        if (percent % 25 === 0) {
          console.log(`[QEVRA Asset Downloader] ${progress.file}: ${percent}%`)
        }
      } else if (progress.status === 'done') {
        console.log(`[QEVRA Asset Downloader] Loaded: ${progress.file}`)
      }
    }
  })
  
  console.log('[QEVRA Asset Downloader] Running inference test...')
  const result = await extractor('QEVRA local semantic vector test', { pooling: 'mean', normalize: true })
  console.log('[QEVRA Asset Downloader] [SUCCESS] Embeddings initialized! Dimensions:', result.dims)
  console.log('[QEVRA Asset Downloader] First 5 vector weights:', Array.from(result.data.slice(0, 5)).map(n => n.toFixed(4)).join(', '))
}

preload().catch(err => {
  console.error('[QEVRA Asset Downloader] Error preloading model:', err)
  process.exit(1)
})
