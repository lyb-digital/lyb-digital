import {client} from '@/lib/sanity'

export interface SanityPillar {
  _id: string
  title: string
  slug: {current: string}
  description?: string
  color: string
}

export interface SanityAuthor {
  _id: string
  name: string
  slug: {current: string}
  bio?: string
  image?: any
  email?: string
}

export interface SanityArticle {
  _id: string
  title: string
  slug: {current: string}
  subtitle?: string
  author: SanityAuthor
  pillar: SanityPillar
  publishedAt: string
  featuredImage?: any
  body: any[]
  isFeatured: boolean
  status: 'draft' | 'published' | 'archived'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  ogImage?: any
}

/**
 * Get all pillars (Mind, Body, Soul)
 */
export async function getPillars(): Promise<SanityPillar[]> {
  return client.fetch(`
    *[_type == "pillar"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color
    }
  `)
}

/**
 * Get a single pillar by slug with its articles
 */
export async function getPillarBySlug(slug: string): Promise<any> {
  return client.fetch(
    `
    *[_type == "pillar" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      color,
      "articles": *[_type == "article" && references(^._id) && status == "published"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        subtitle,
        author->,
        pillar->,
        publishedAt,
        featuredImage,
        isFeatured,
        status
      }
    }
    `,
    {slug},
  )
}

/**
 * Get all published articles
 */
export async function getArticles(): Promise<SanityArticle[]> {
  return client.fetch(`
    *[_type == "article" && status == "published"] | order(publishedAt desc) {
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
      ogImage
    }
  `)
}

/**
 * Get featured articles for homepage
 */
export async function getFeaturedArticles(): Promise<SanityArticle[]> {
  return client.fetch(`
    *[_type == "article" && status == "published" && isFeatured == true] | order(publishedAt desc)[0..2] {
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
      ogImage
    }
  `)
}

/**
 * Get latest articles for homepage
 */
export async function getLatestArticles(limit: number = 9): Promise<SanityArticle[]> {
  return client.fetch(`
    *[_type == "article" && status == "published"] | order(publishedAt desc)[0..${limit}] {
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
      ogImage
    }
  `)
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  return client.fetch(
    `
    *[_type == "article" && slug.current == $slug && status == "published"][0] {
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
      ogImage
    }
    `,
    {slug},
  )
}

/**
 * Get articles by pillar slug
 */
export async function getArticlesByPillarSlug(pillarSlug: string): Promise<SanityArticle[]> {
  return client.fetch(
    `
    *[_type == "article" && pillar->slug.current == $pillarSlug && status == "published"] | order(publishedAt desc) {
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
      ogImage
    }
    `,
    {pillarSlug},
  )
}

/**
 * Get all authors
 */
export async function getAuthors(): Promise<SanityAuthor[]> {
  return client.fetch(`
    *[_type == "author"] | order(name asc) {
      _id,
      name,
      slug,
      bio,
      image,
      email
    }
  `)
}

/**
 * Get a single author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<SanityAuthor | null> {
  return client.fetch(
    `
    *[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      bio,
      image,
      email
    }
    `,
    {slug},
  )
}

