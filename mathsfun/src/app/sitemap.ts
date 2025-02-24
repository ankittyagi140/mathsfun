import { MetadataRoute } from 'next'
import { allPuzzleApps } from '@/utils/allPuzzleApps'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maths2fun.com'

type StaticPage = {
  url: string
  lastModified: Date
  priority: number
  changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily',
  alternates?: {
    languages: {
      [key: string]: string
    }
  }
}

type DynamicPage = {
  url: string
  lastModified: Date
  changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily'
  priority: number
  alternates?: {
    languages: {
      [key: string]: string
    }
  }
  description?: string
}

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily'
  priority: number
  alternates?: {
    languages: {
      [key: string]: string
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Define static pages with strict typing
    const staticPages: StaticPage[] = [
      {
        url: '/',
        lastModified: new Date(),
        priority: 1.0,
        changeFrequency: 'yearly'
      },
      {
        url: '/about',
        lastModified: new Date('2024-01-01'),
        priority: 0.8,
        changeFrequency: 'monthly'
      },
      {
        url: '/contact',
        lastModified: new Date('2024-01-01'),
        priority: 0.7,
        changeFrequency: 'monthly'
      },
      {
        url: '/privacy',
        lastModified: new Date('2024-01-01'),
        priority: 0.3,
        changeFrequency: 'yearly'
      }
    ]

    // Generate dynamic pages from puzzle apps
    const dynamicPages: DynamicPage[] = allPuzzleApps.map(quiz => ({
      url: quiz.path, // Use the path directly from the puzzle app data
      lastModified: quiz.createdAt,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${quiz.path}`
        }
      },
      description: quiz.description
    }))

    // Transform and combine all pages into final sitemap format
    const sitemapEntries: SitemapEntry[] = [...staticPages, ...dynamicPages].map(page => ({
      url: `${BASE_URL}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.alternates && { alternates: page.alternates })
    }))

    return sitemapEntries

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return []
  }
}