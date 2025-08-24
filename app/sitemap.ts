import { sanityClient } from '../sanityClient';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishandtips.it';
  
  // Forza aggiornamento cache
  const now = new Date();

  // Pagine statiche principali
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
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
  let postPages: any[] = [];
  
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



    postPages = posts.map((post: any) => {
      // Assicuriamoci che slug sia una stringa
      const slug = typeof post.slug === 'string' ? post.slug : 
                   (post.slug && typeof post.slug === 'object' && post.slug.current) ? post.slug.current : 
                   'articolo';
      
      return {
        url: `${baseUrl}/articoli/${slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error('Errore nel generare sitemap:', error);
    // In caso di errore, continuiamo senza gli articoli dinamici
  }

  return [...staticPages, ...categoryPages, ...postPages];
}
