import { describe, it, expect, beforeEach } from 'vitest'
import { LocalVectorRAG } from '../../src/renderer/src/core/local-vector-rag'

describe('Local Vector Search & Temporal Context RAG Engine', () => {
  let rag: LocalVectorRAG

  beforeEach(() => {
    rag = new LocalVectorRAG()
    // Deterministic 4D semantic embedding simulator for sub-millisecond unit test execution
    rag.setCustomEmbedder(async (text: string) => {
      const lower = text.toLowerCase()
      const v = [
        lower.includes('auth') || lower.includes('oauth') || lower.includes('login') ? 1.0 : 0.0,
        lower.includes('ui') || lower.includes('dashboard') || lower.includes('design') || lower.includes('landing') ? 1.0 : 0.0,
        lower.includes('react') || lower.includes('hooks') ? 1.0 : 0.0,
        lower.includes('sql') || lower.includes('database') || lower.includes('query') ? 1.0 : 0.0
      ]
      const norm = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0))
      return norm > 0 ? v.map((x) => x / norm) : [0.25, 0.25, 0.25, 0.25]
    })
  })

  describe('Cosine Similarity Mathematics', () => {
    it('calculates 1.0 for identical normalized vectors', () => {
      const vecA = [0.5, 0.5, 0.5, 0.5]
      const sim = LocalVectorRAG.cosineSimilarity(vecA, vecA)
      expect(sim).toBeCloseTo(1.0, 4)
    })

    it('calculates 0.0 for orthogonal vectors', () => {
      const vecA = [1, 0, 0]
      const vecB = [0, 1, 0]
      const sim = LocalVectorRAG.cosineSimilarity(vecA, vecB)
      expect(sim).toBeCloseTo(0.0, 4)
    })

    it('calculates -1.0 for diametrically opposed vectors', () => {
      const vecA = [1, 0]
      const vecB = [-1, 0]
      const sim = LocalVectorRAG.cosineSimilarity(vecA, vecB)
      expect(sim).toBeCloseTo(-1.0, 4)
    })

    it('safely returns 0 for mismatched vector dimensions or nulls', () => {
      expect(LocalVectorRAG.cosineSimilarity([1, 2], [1, 2, 3])).toBe(0)
      expect(LocalVectorRAG.cosineSimilarity([], [])).toBe(0)
      expect(LocalVectorRAG.cosineSimilarity(null as any, [1])).toBe(0)
    })
  })

  describe('Document Indexing & Storage', () => {
    it('indexes documents into the vector store', async () => {
      expect(rag.size()).toBe(0)

      await rag.indexDocument({
        id: 'doc_1',
        text: 'Create a dark mode landing page with Tailwind CSS and React',
        category: 'code'
      })

      expect(rag.size()).toBe(1)

      await rag.indexDocument({
        id: 'doc_2',
        text: 'Fix the authentication JWT expiration bug in the Node backend',
        category: 'debug'
      })

      expect(rag.size()).toBe(2)
    })

    it('clears all indexed documents cleanly', async () => {
      await rag.indexDocument({ id: '1', text: 'Sample document' })
      expect(rag.size()).toBe(1)
      rag.clear()
      expect(rag.size()).toBe(0)
    })
  })

  describe('Keyword & Lexical Token Search', () => {
    beforeEach(async () => {
      await rag.indexDocument({
        id: 'doc_react',
        text: 'Refactor the React components to use modern functional hooks and state'
      })
      await rag.indexDocument({
        id: 'doc_sql',
        text: 'Optimize PostgreSQL queries with proper indexes on the orders table'
      })
      await rag.indexDocument({
        id: 'doc_docker',
        text: 'Configure multi-stage Docker build for deploying the microservice'
      })
    })

    it('finds documents matching specific keywords', () => {
      const results = rag.keywordSearch('React hooks and state')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].document.id).toBe('doc_react')
      expect(results[0].matchType).toBe('keyword')
    })

    it('respects topK search limit', () => {
      const results = rag.keywordSearch('the', 1)
      expect(results.length).toBeLessThanOrEqual(1)
    })

    it('returns empty array when no query tokens match', () => {
      const results = rag.keywordSearch('astronomy telescope galaxy')
      expect(results).toEqual([])
    })
  })

  describe('Hybrid Semantic RAG Search', () => {
    beforeEach(async () => {
      await rag.indexDocument({
        id: 'task_auth',
        text: 'Implement OAuth2 login with Google and GitHub providers',
        category: 'feature'
      })
      await rag.indexDocument({
        id: 'task_ui',
        text: 'Design a sleek minimalist dashboard with Tailwind and Framer Motion',
        category: 'ui'
      })
    })

    it('performs hybrid search successfully', async () => {
      const results = await rag.hybridSearch('Google OAuth authentication login')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].document.id).toBe('task_auth')
      expect(results[0].score).toBeGreaterThan(0)
    })

    it('correctly ranks the best match at index 0', async () => {
      const results = await rag.hybridSearch('minimalist dashboard design')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].document.id).toBe('task_ui')
    })
  })
})
