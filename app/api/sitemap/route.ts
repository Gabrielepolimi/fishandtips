import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const baseUrl = 'https://fishandtips.it';

    // Pagine statiche principali
    const staticPages = [
      { url: baseUrl, priority: 1.0 },
      { url: `${baseUrl}/articoli`, priority: 0.9 },
      { url: `${baseUrl}/chi-siamo`, priority: 0.7 },
      { url: `${baseUrl}/contatti`, priority: 0.7 },
      { url: `${baseUrl}/registrazione`, priority: 0.6 },
      { url: `${baseUrl}/mappa-del-sito`, priority: 0.5 },
      { url: `${baseUrl}/supporto`, priority: 0.5 },
      { url: `${baseUrl}/cookie-policy`, priority: 0.4 },
    ];

    // Pagine categoria
    const categoryPages = [
      { url: `${baseUrl}/categoria/tecniche`, priority: 0.8 },
      { url: `${baseUrl}/categoria/attrezzature`, priority: 0.8 },
      { url: `${baseUrl}/categoria/spot`, priority: 0.8 },
      { url: `${baseUrl}/categoria/consigli`, priority: 0.8 },
    ];

    const allPages = [...staticPages, ...categoryPages];
    const now = new Date().toISOString();

    // Genera XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
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
