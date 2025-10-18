import { sanityClient } from '../../sanityClient'

export default async function sitemap() {
  const baseUrl = 'https://fishandtips.it'
  
  try {
    // Fetch articoli pubblicati da Sanity
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && publishedAt <= $now] | order(publishedAt desc) {
        _id,
        slug,
        publishedAt,
        "categories": categories[]->slug.current
      }
    `, { now: new Date().toISOString() }, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    // Fetch categorie attive da Sanity
    const categories = await sanityClient.fetch(`
      *[_type == "category" && defined(slug.current)] {
        slug,
        _updatedAt
      }
    `, {}, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })

    // Pagine statiche principali
    const staticPages = [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/articoli`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/chi-siamo`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contatti`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/registrazione`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/mappa-del-sito`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/supporto`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/cookie-policy`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      },
    ]

    // Categorie dinamiche
    const categoryPages = categories.map((category: any) => ({
      url: `${baseUrl}/categoria/${category.slug.current}`,
      lastModified: new Date(category._updatedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Articoli dinamici
    const articlePages = posts.map((post: any) => ({
      url: `${baseUrl}/articoli/${post.slug.current}`,
      lastModified: new Date(post.publishedAt).toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...categoryPages, ...articlePages]
    
  } catch (error) {
    console.error('Errore nella generazione sitemap:', error)
    
    // Fallback con pagine essenziali in caso di errore
    return [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/articoli`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ]
  }
}
