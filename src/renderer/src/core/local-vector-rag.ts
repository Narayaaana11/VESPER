/**
 * QEVRA Local Vector Search & Temporal Context RAG Engine
 * High-performance, in-process semantic vector indexing using Transformers.js (all-MiniLM-L6-v2)
 * Embeds desktop activity, clipboard snippets, and past tasks for sub-5ms semantic context retrieval.
 */

export interface IndexedDocument {
  id: string
  text: string
  vector?: number[]
  category?: string
  metadata?: Record<string, any>
  timestamp: number
}

export interface SearchResult {
  document: IndexedDocument
  score: number
  matchType: 'vector' | 'hybrid' | 'keyword'
}

export class LocalVectorRAG {
  private documents: Map<string, IndexedDocument> = new Map()
  private extractor: any = null
  private customEmbedder: ((text: string) => Promise<number[] | null>) | null = null
  private isInitializing = false
  private initPromise: Promise<boolean> | null = null

  /**
   * Allows setting a custom embedding function (useful for tests or custom backends)
   */
  public setCustomEmbedder(embedder: ((text: string) => Promise<number[] | null>) | null): void {
    this.customEmbedder = embedder
  }

  /**
   * Initializes the feature-extraction pipeline (all-MiniLM-L6-v2)
   */
  public async init(): Promise<boolean> {
    if (this.extractor) return true
    if (this.initPromise) return this.initPromise

    this.isInitializing = true
    this.initPromise = (async () => {
      try {
        // Dynamically import @xenova/transformers to prevent bundle lock in SSR/testing
        const { pipeline, env } = await import('@xenova/transformers')

        // Disable remote downloads and prioritize local model cache
        env.allowLocalModels = true
        env.allowRemoteModels = false

        if (typeof window === 'undefined' && typeof process !== 'undefined' && process.cwd) {
          try {
            const nodePath = await (Function('return import("path")')() as Promise<any>)
            env.cacheDir = nodePath.join(process.cwd(), 'resources', 'models', 'transformers-cache')
          } catch {}
        }

        this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          quantized: true
        })

        console.log('[LocalVectorRAG] [OK] all-MiniLM-L6-v2 semantic pipeline initialized')
        return true
      } catch (err) {
        console.warn('[LocalVectorRAG] Local transformer init notice (using local keyword fallback):', err)
        return false
      } finally {
        this.isInitializing = false
      }
    })()

    return this.initPromise
  }

  /**
   * Generates a 384-dimensional dense vector embedding for a given text
   */
  public async embed(text: string): Promise<number[] | null> {
    const clean = text.trim()
    if (!clean) return null

    if (this.customEmbedder) {
      return this.customEmbedder(clean)
    }

    try {
      if (!this.extractor) {
        const ok = await this.init()
        if (!ok || !this.extractor) return null
      }

      const output = await this.extractor(clean, { pooling: 'mean', normalize: true })
      if (output && output.data) {
        return Array.from(output.data)
      }
      return null
    } catch (err) {
      console.warn('[LocalVectorRAG] Embed error:', err)
      return null
    }
  }

  /**
   * Calculates cosine similarity between two normalized vectors
   */
  public static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Indexes a document into the in-memory vector database
   */
  public async indexDocument(doc: {
    id: string
    text: string
    vector?: number[]
    category?: string
    metadata?: Record<string, any>
    timestamp?: number
  }): Promise<IndexedDocument> {
    const vector = doc.vector || (await this.embed(doc.text))

    const indexed: IndexedDocument = {
      id: doc.id,
      text: doc.text,
      vector: vector || undefined,
      category: doc.category || 'general',
      metadata: doc.metadata || {},
      timestamp: doc.timestamp || Date.now()
    }

    this.documents.set(doc.id, indexed)
    return indexed
  }

  /**
   * Semantic Vector Search: finds the closest matches based on embedding cosine similarity
   */
  public async search(query: string, topK = 5, minSimilarity = 0.25): Promise<SearchResult[]> {
    const queryVector = await this.embed(query)

    if (!queryVector) {
      // Fall back to keyword token matching
      return this.keywordSearch(query, topK)
    }

    const results: SearchResult[] = []

    for (const doc of this.documents.values()) {
      if (doc.vector) {
        const sim = LocalVectorRAG.cosineSimilarity(queryVector, doc.vector)
        if (sim >= minSimilarity) {
          results.push({
            document: doc,
            score: sim,
            matchType: 'vector'
          })
        }
      }
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, topK)
  }

  /**
   * Fast lexical/keyword search based on token overlap (BM25 surrogate)
   */
  public keywordSearch(query: string, topK = 5): SearchResult[] {
    const queryTokens = new Set(
      query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((t) => t.length > 2)
    )

    if (queryTokens.size === 0) return []

    const results: SearchResult[] = []

    for (const doc of this.documents.values()) {
      const docTokens = doc.text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(Boolean)

      let matchCount = 0
      for (const token of docTokens) {
        if (queryTokens.has(token)) {
          matchCount++
        }
      }

      if (matchCount > 0) {
        const score = matchCount / (queryTokens.size + docTokens.length * 0.1)
        results.push({
          document: doc,
          score: Math.min(1.0, score),
          matchType: 'keyword'
        })
      }
    }

    results.sort((a, b) => b.score - a.score)
    return results.slice(0, topK)
  }

  /**
   * Hybrid RAG Search: Fuses dense semantic vector search (65%) with exact keyword matching (35%)
   */
  public async hybridSearch(query: string, topK = 5): Promise<SearchResult[]> {
    const vectorResults = await this.search(query, topK * 2, 0.15)
    const keywordResults = this.keywordSearch(query, topK * 2)

    const scoreMap = new Map<string, { doc: IndexedDocument; score: number }>()

    // Blend vector scores (65% weight)
    for (const res of vectorResults) {
      scoreMap.set(res.document.id, {
        doc: res.document,
        score: res.score * 0.65
      })
    }

    // Blend keyword scores (35% weight)
    for (const res of keywordResults) {
      const existing = scoreMap.get(res.document.id)
      if (existing) {
        existing.score += res.score * 0.35
      } else {
        scoreMap.set(res.document.id, {
          doc: res.document,
          score: res.score * 0.35
        })
      }
    }

    const merged = Array.from(scoreMap.values())
      .map(({ doc, score }) => ({
        document: doc,
        score: Math.min(1.0, score),
        matchType: 'hybrid' as const
      }))
      .sort((a, b) => b.score - a.score)

    return merged.slice(0, topK)
  }

  public size(): number {
    return this.documents.size
  }

  public clear(): void {
    this.documents.clear()
  }
}

// Global Singleton for the renderer process
export const localVectorRAG = new LocalVectorRAG()
