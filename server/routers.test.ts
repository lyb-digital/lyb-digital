import { describe, it, expect, beforeEach, vi } from 'vitest'
import { appRouter } from './routers'

// Mock the Sanity queries
vi.mock('./sanity-queries', () => ({
  getPillars: vi.fn(),
  getPillarBySlug: vi.fn(),
  getArticles: vi.fn(),
  getFeaturedArticles: vi.fn(),
  getLatestArticles: vi.fn(),
  getArticleBySlug: vi.fn(),
  getArticlesByPillarSlug: vi.fn(),
  getAuthors: vi.fn(),
  getAuthorBySlug: vi.fn(),
}))

import * as sanityQueries from './sanity-queries'

describe('tRPC Router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('content router', () => {
    it('should have getPillars procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getPillars).toBeDefined()
    })

    it('should have getPillarBySlug procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getPillarBySlug).toBeDefined()
    })

    it('should have getArticles procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getArticles).toBeDefined()
    })

    it('should have getFeaturedArticles procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getFeaturedArticles).toBeDefined()
    })

    it('should have getLatestArticles procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getLatestArticles).toBeDefined()
    })

    it('should have getArticleBySlug procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getArticleBySlug).toBeDefined()
    })

    it('should have getArticlesByPillarSlug procedure', () => {
      expect(appRouter._def.procedures.content._def.procedures.getArticlesByPillarSlug).toBeDefined()
    })
  })

  describe('authors router', () => {
    it('should have getAuthors procedure', () => {
      expect(appRouter._def.procedures.authors._def.procedures.getAuthors).toBeDefined()
    })

    it('should have getAuthorBySlug procedure', () => {
      expect(appRouter._def.procedures.authors._def.procedures.getAuthorBySlug).toBeDefined()
    })
  })

  describe('newsletter router', () => {
    it('should have subscribe procedure', () => {
      expect(appRouter._def.procedures.newsletter._def.procedures.subscribe).toBeDefined()
    })
  })

  describe('preview router', () => {
    it('should have preview router', () => {
      expect(appRouter._def.procedures.preview).toBeDefined()
    })

    it('should have getArticlePreview procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getArticlePreview).toBeDefined()
    })

    it('should have getAllArticlesPreview procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getAllArticlesPreview).toBeDefined()
    })

    it('should have getArticlesByPillarPreview procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getArticlesByPillarPreview).toBeDefined()
    })

    it('should have getPublishingStats procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getPublishingStats).toBeDefined()
    })

    it('should have getRecentArticles procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getRecentArticles).toBeDefined()
    })

    it('should have getArticlesByAuthor procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getArticlesByAuthor).toBeDefined()
    })

    it('should have getFeaturedArticlesPreview procedure', () => {
      expect(appRouter._def.procedures.preview._def.procedures.getFeaturedArticlesPreview).toBeDefined()
    })
  })

  describe('auth router', () => {
    it('should have me procedure', () => {
      expect(appRouter._def.procedures.auth._def.procedures.me).toBeDefined()
    })

    it('should have logout procedure', () => {
      expect(appRouter._def.procedures.auth._def.procedures.logout).toBeDefined()
    })
  })
})

