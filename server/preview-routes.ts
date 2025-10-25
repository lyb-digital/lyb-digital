/**
 * Preview Routes for Sanity Draft Content
 * 
 * These routes enable live preview of draft articles in Sanity Studio
 * and allow content creators to preview articles before publishing
 */

import {publicProcedure, router} from './_core/trpc'
import {z} from 'zod'
import {client} from '@/lib/sanity'

/**
 * Preview router for handling draft content preview
 */
export const previewRouter = router({
  /**
   * Get article by slug including draft versions
   * Used for preview functionality
   */
  getArticlePreview: publicProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({input}) => {
      try {
        // Query includes both published and draft documents
        const article = await client.fetch(
          `
          *[_type == "article" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            subtitle,
            author->,
            pillar->,
            publishedAt,
            featuredImage,
            body,
            isFeatured,
            status,
            seoTitle,
            seoDescription,
            seoKeywords,
            ogImage,
            _createdAt,
            _updatedAt
          }
          `,
          {slug: input.slug},
        )

        return article || null
      } catch (error) {
        console.error('Error fetching article preview:', error)
        return null
      }
    }),

  /**
   * Get all articles including drafts
   * Used for preview list in Sanity Studio
   */
  getAllArticlesPreview: publicProcedure.query(async () => {
    try {
      const articles = await client.fetch(`
        *[_type == "article"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          subtitle,
          author->,
          pillar->,
          publishedAt,
          featuredImage,
          isFeatured,
          status,
          _createdAt,
          _updatedAt
        }
      `)

      return articles || []
    } catch (error) {
      console.error('Error fetching articles preview:', error)
      return []
    }
  }),

  /**
   * Get articles by pillar including drafts
   * Used for pillar preview pages
   */
  getArticlesByPillarPreview: publicProcedure
    .input(z.object({pillarSlug: z.string()}))
    .query(async ({input}) => {
      try {
        const articles = await client.fetch(
          `
          *[_type == "article" && pillar->slug.current == $pillarSlug] | order(publishedAt desc) {
            _id,
            title,
            slug,
            subtitle,
            author->,
            pillar->,
            publishedAt,
            featuredImage,
            isFeatured,
            status,
            _createdAt,
            _updatedAt
          }
          `,
          {pillarSlug: input.pillarSlug},
        )

        return articles || []
      } catch (error) {
        console.error('Error fetching pillar articles preview:', error)
        return []
      }
    }),

  /**
   * Get publishing statistics
   * Shows draft, published, and scheduled articles
   */
  getPublishingStats: publicProcedure.query(async () => {
    try {
      const stats = await client.fetch(`
        {
          "draft": count(*[_type == "article" && status == "draft"]),
          "published": count(*[_type == "article" && status == "published"]),
          "scheduled": count(*[_type == "article" && status == "published" && publishedAt > now()]),
          "archived": count(*[_type == "article" && status == "archived"]),
          "total": count(*[_type == "article"])
        }
      `)

      return stats
    } catch (error) {
      console.error('Error fetching publishing stats:', error)
      return {
        draft: 0,
        published: 0,
        scheduled: 0,
        archived: 0,
        total: 0,
      }
    }
  }),

  /**
   * Get recent articles (published and draft)
   * Shows recently created or updated articles
   */
  getRecentArticles: publicProcedure
    .input(z.object({limit: z.number().optional()}))
    .query(async ({input}) => {
      try {
        const limit = input.limit || 10
        const articles = await client.fetch(`
          *[_type == "article"] | order(_updatedAt desc)[0..${limit}] {
            _id,
            title,
            slug,
            subtitle,
            author->,
            pillar->,
            publishedAt,
            featuredImage,
            status,
            _createdAt,
            _updatedAt
          }
        `)

        return articles || []
      } catch (error) {
        console.error('Error fetching recent articles:', error)
        return []
      }
    }),

  /**
   * Get articles by author
   * Shows all articles written by a specific author
   */
  getArticlesByAuthor: publicProcedure
    .input(z.object({authorSlug: z.string()}))
    .query(async ({input}) => {
      try {
        const articles = await client.fetch(
          `
          *[_type == "article" && author->slug.current == $authorSlug] | order(publishedAt desc) {
            _id,
            title,
            slug,
            subtitle,
            author->,
            pillar->,
            publishedAt,
            featuredImage,
            isFeatured,
            status,
            _createdAt,
            _updatedAt
          }
          `,
          {authorSlug: input.authorSlug},
        )

        return articles || []
      } catch (error) {
        console.error('Error fetching author articles:', error)
        return []
      }
    }),

  /**
   * Get featured articles including drafts
   * Used for homepage preview
   */
  getFeaturedArticlesPreview: publicProcedure.query(async () => {
    try {
      const articles = await client.fetch(`
        *[_type == "article" && isFeatured == true] | order(publishedAt desc)[0..2] {
          _id,
          title,
          slug,
          subtitle,
          author->,
          pillar->,
          publishedAt,
          featuredImage,
          isFeatured,
          status,
          _createdAt,
          _updatedAt
        }
      `)

      return articles || []
    } catch (error) {
      console.error('Error fetching featured articles preview:', error)
      return []
    }
  }),
})

export type PreviewRouter = typeof previewRouter

