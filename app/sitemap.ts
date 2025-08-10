import { sanityClient } from '../sanityClient';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishandtips.it';

  // Pagine statiche principali
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/articoli`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chi-siamo`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/registrazione`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mappa-del-sito`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/supporto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Pagine categoria
  const categoryPages = [
    {
      url: `${baseUrl}/categoria/tecniche`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/attrezzature`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/spot`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/consigli`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Articoli dinamici
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published"] {
        slug,
        publishedAt,
        _updatedAt,
        title,
        excerpt,
        "categories": categories[]->title
      }
    `);

    const postPages = posts.map((post: any) => ({
      url: `${baseUrl}/articoli/${post.slug}`,
      lastModified: new Date(post._updatedAt || post.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...categoryPages, ...postPages];
  } catch (error) {
    console.error('Errore nel generare sitemap:', error);
    return [...staticPages, ...categoryPages];
  }
}
