import { sanityClient } from '../sanityClient';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishandtips.it';
  
  // Forza aggiornamento cache con timestamp unico
  const now = new Date();
  const timestamp = now.getTime(); // Timestamp unico per forzare refresh

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
      lastModified: new Date(timestamp),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chi-siamo`,
      lastModified: new Date(timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date(timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/registrazione`,
      lastModified: new Date(timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mappa-del-sito`,
      lastModified: new Date(timestamp),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/supporto`,
      lastModified: new Date(timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(timestamp),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Pagine categoria
  const categoryPages = [
    {
      url: `${baseUrl}/categoria/tecniche`,
      lastModified: new Date(timestamp),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/attrezzature`,
      lastModified: new Date(timestamp),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/spot`,
      lastModified: new Date(timestamp),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categoria/consigli`,
      lastModified: new Date(timestamp),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Articoli dinamici
  let postPages: any[] = [];
  
  try {
                  const posts = await sanityClient.fetch(`
                *[_type == "post" && status == "published" && publishedAt <= $now] {
                  slug,
                  publishedAt,
                  _updatedAt,
                  title,
                  excerpt,
                  "categories": categories[]->title
                }
              `, { now: new Date().toISOString() });

    postPages = posts.map((post: any) => {
      // Assicuriamoci che slug sia una stringa valida e non contenga caratteri problematici
      let slug = '';
      
      if (typeof post.slug === 'string') {
        slug = post.slug;
      } else if (post.slug && typeof post.slug === 'object' && post.slug.current) {
        slug = post.slug.current;
      } else {
        // Se non c'è slug valido, usa il titolo per generarne uno
        slug = post.title ? post.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Rimuovi caratteri speciali
          .replace(/\s+/g, '-') // Sostituisci spazi con trattini
          .replace(/-+/g, '-') // Rimuovi trattini multipli
          .trim() : 'articolo';
      }
      
      // Assicurati che lo slug non sia vuoto
      if (!slug || slug.trim() === '') {
        slug = 'articolo';
      }
      
      // Limita la lunghezza dello slug per evitare URL troppo lunghi
      if (slug.length > 100) {
        slug = slug.substring(0, 100).replace(/-$/, '');
      }

      return {
        url: `${baseUrl}/articoli/${slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt || timestamp),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    }).filter((page: any) => {
      // Filtra URL che potrebbero essere problematici
      return page.url && 
             page.url.length < 2048 && // Limite URL
             !page.url.includes('\n') && 
             !page.url.includes('\r') &&
             page.url.startsWith('https://');
    });
  } catch (error) {
    console.error('Errore nel generare sitemap:', error);
    // In caso di errore, continuiamo senza gli articoli dinamici
  }

  return [...staticPages, ...categoryPages, ...postPages];
}
