import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getPillars,
  getPillarBySlug,
  getArticles,
  getFeaturedArticles,
  getLatestArticles,
  getArticleBySlug,
  getArticlesByPillarSlug,
  getAuthors,
  getAuthorBySlug,
} from './sanity-queries'

// Mock the Sanity client
vi.mock('@/lib/sanity', () => ({
  client: {
    fetch: vi.fn(),
  },
}))

import { client } from '@/lib/sanity'

describe('Sanity Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPillars', () => {
    it('should fetch all pillars', async () => {
      const mockPillars = [
        { _id: '1', title: 'Mind', slug: { current: 'mind' }, color: 'blue' },
        { _id: '2', title: 'Body', slug: { current: 'body' }, color: 'green' },
        { _id: '3', title: 'Soul', slug: { current: 'soul' }, color: 'orange' },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockPillars)

      const result = await getPillars()

      expect(result).toEqual(mockPillars)
      expect(client.fetch).toHaveBeenCalled()
    })

    it('should return empty array if no pillars found', async () => {
      vi.mocked(client.fetch).mockResolvedValue([])

      const result = await getPillars()

      expect(result).toEqual([])
    })
  })

  describe('getPillarBySlug', () => {
    it('should fetch pillar by slug with articles', async () => {
      const mockPillar = {
        _id: '1',
        title: 'Mind',
        slug: { current: 'mind' },
        color: 'blue',
        articles: [
          {
            _id: 'art1',
            title: 'Article 1',
            slug: { current: 'article-1' },
            status: 'published',
          },
        ],
      }

      vi.mocked(client.fetch).mockResolvedValue(mockPillar)

      const result = await getPillarBySlug('mind')

      expect(result).toEqual(mockPillar)
      expect(client.fetch).toHaveBeenCalledWith(expect.any(String), { slug: 'mind' })
    })

    it('should return null if pillar not found', async () => {
      vi.mocked(client.fetch).mockResolvedValue(null)

      const result = await getPillarBySlug('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getArticles', () => {
    it('should fetch all published articles', async () => {
      const mockArticles = [
        {
          _id: '1',
          title: 'Article 1',
          slug: { current: 'article-1' },
          status: 'published',
        },
        {
          _id: '2',
          title: 'Article 2',
          slug: { current: 'article-2' },
          status: 'published',
        },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockArticles)

      const result = await getArticles()

      expect(result).toEqual(mockArticles)
      expect(result).toHaveLength(2)
    })

    it('should return empty array if no articles found', async () => {
      vi.mocked(client.fetch).mockResolvedValue([])

      const result = await getArticles()

      expect(result).toEqual([])
    })
  })

  describe('getFeaturedArticles', () => {
    it('should fetch featured articles', async () => {
      const mockFeatured = [
        {
          _id: '1',
          title: 'Featured Article 1',
          slug: { current: 'featured-1' },
          isFeatured: true,
          status: 'published',
        },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockFeatured)

      const result = await getFeaturedArticles()

      expect(result).toEqual(mockFeatured)
    })

    it('should limit featured articles to 3', async () => {
      const mockFeatured = [
        { _id: '1', title: 'Featured 1', isFeatured: true },
        { _id: '2', title: 'Featured 2', isFeatured: true },
        { _id: '3', title: 'Featured 3', isFeatured: true },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockFeatured)

      const result = await getFeaturedArticles()

      expect(result.length).toBeLessThanOrEqual(3)
    })
  })

  describe('getLatestArticles', () => {
    it('should fetch latest articles with default limit', async () => {
      const mockLatest = Array.from({ length: 9 }, (_, i) => ({
        _id: `${i}`,
        title: `Article ${i}`,
        slug: { current: `article-${i}` },
      }))

      vi.mocked(client.fetch).mockResolvedValue(mockLatest)

      const result = await getLatestArticles()

      expect(result).toHaveLength(9)
    })

    it('should fetch latest articles with custom limit', async () => {
      const mockLatest = Array.from({ length: 5 }, (_, i) => ({
        _id: `${i}`,
        title: `Article ${i}`,
      }))

      vi.mocked(client.fetch).mockResolvedValue(mockLatest)

      const result = await getLatestArticles(5)

      expect(result).toHaveLength(5)
    })
  })

  describe('getArticleBySlug', () => {
    it('should fetch article by slug', async () => {
      const mockArticle = {
        _id: '1',
        title: 'Test Article',
        slug: { current: 'test-article' },
        status: 'published',
        body: [{ _type: 'block', children: [{ _type: 'span', text: 'Content' }] }],
      }

      vi.mocked(client.fetch).mockResolvedValue(mockArticle)

      const result = await getArticleBySlug('test-article')

      expect(result).toEqual(mockArticle)
      expect(client.fetch).toHaveBeenCalledWith(expect.any(String), { slug: 'test-article' })
    })

    it('should return null if article not found', async () => {
      vi.mocked(client.fetch).mockResolvedValue(null)

      const result = await getArticleBySlug('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getArticlesByPillarSlug', () => {
    it('should fetch articles by pillar slug', async () => {
      const mockArticles = [
        {
          _id: '1',
          title: 'Mind Article',
          slug: { current: 'mind-article' },
          pillar: { slug: { current: 'mind' } },
        },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockArticles)

      const result = await getArticlesByPillarSlug('mind')

      expect(result).toEqual(mockArticles)
      expect(client.fetch).toHaveBeenCalledWith(expect.any(String), { pillarSlug: 'mind' })
    })

    it('should return empty array if no articles for pillar', async () => {
      vi.mocked(client.fetch).mockResolvedValue([])

      const result = await getArticlesByPillarSlug('nonexistent')

      expect(result).toEqual([])
    })
  })

  describe('getAuthors', () => {
    it('should fetch all authors', async () => {
      const mockAuthors = [
        { _id: '1', name: 'John Doe', slug: { current: 'john-doe' } },
        { _id: '2', name: 'Jane Smith', slug: { current: 'jane-smith' } },
      ]

      vi.mocked(client.fetch).mockResolvedValue(mockAuthors)

      const result = await getAuthors()

      expect(result).toEqual(mockAuthors)
      expect(result).toHaveLength(2)
    })
  })

  describe('getAuthorBySlug', () => {
    it('should fetch author by slug', async () => {
      const mockAuthor = {
        _id: '1',
        name: 'John Doe',
        slug: { current: 'john-doe' },
        bio: 'Author bio',
      }

      vi.mocked(client.fetch).mockResolvedValue(mockAuthor)

      const result = await getAuthorBySlug('john-doe')

      expect(result).toEqual(mockAuthor)
      expect(client.fetch).toHaveBeenCalledWith(expect.any(String), { slug: 'john-doe' })
    })

    it('should return null if author not found', async () => {
      vi.mocked(client.fetch).mockResolvedValue(null)

      const result = await getAuthorBySlug('nonexistent')

      expect(result).toBeNull()
    })
  })
})

