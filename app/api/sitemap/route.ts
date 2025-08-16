import { NextResponse } from 'next/server';
import { sanityClient } from '../../../sanityClient';

export async function GET() {
  try {
    const baseUrl = 'https://fishandtips.it';

    // Pagine statiche principali
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/articoli`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/chi-siamo`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contatti`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/registrazione`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/mappa-del-sito`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/supporto`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/cookie-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];

    // Pagine categoria
    const categoryPages = [
      {
        url: `${baseUrl}/categoria/tecniche`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categoria/attrezzature`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categoria/spot`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categoria/consigli`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
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

      postPages = posts.map((post: any) => ({
        url: `${baseUrl}/articoli/${post.slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } catch (error) {
      console.error('Errore nel generare sitemap:', error);
    }

    const allPages = [...staticPages, ...categoryPages, ...postPages];

    // Genera XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Errore nel generare sitemap:', error);
    return new NextResponse('Errore interno del server', { status: 500 });
  }
}
