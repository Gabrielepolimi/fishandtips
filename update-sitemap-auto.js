const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configurazione Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3nnnl6gi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function updateSitemap() {
  const baseUrl = 'https://fishandtips.it';
  
  try {
    console.log('🔄 Aggiornamento sitemap in corso...');
    
    // Fetch articoli pubblicati da Sanity
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && publishedAt <= $now] | order(publishedAt desc) {
        _id,
        slug,
        publishedAt,
        "categories": categories[]->slug.current
      }
    `, { now: new Date().toISOString() });

    // Fetch categorie attive da Sanity
    const categories = await sanityClient.fetch(`
      *[_type == "category" && defined(slug.current)] {
        slug,
        _updatedAt
      }
    `);

    console.log(`📄 Trovati ${posts.length} articoli e ${categories.length} categorie`);

    // Pagine statiche principali
    const staticPages = [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/articoli`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/chi-siamo`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contatti`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/registrazione`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/mappa-del-sito`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/supporto`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/cookie-policy`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
    ];

    // Categorie dinamiche
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categoria/${category.slug.current}`,
      lastModified: new Date(category._updatedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Articoli dinamici
    const articlePages = posts.map(post => ({
      url: `${baseUrl}/articoli/${post.slug.current}`,
      lastModified: new Date(post.publishedAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Genera XML sitemap
    const allPages = [...staticPages, ...categoryPages, ...articlePages];
    
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    allPages.forEach(page => {
      sitemapXml += `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    sitemapXml += `
</urlset>`;

    // Salva sitemap
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);
    
    console.log(`✅ Sitemap aggiornata con ${allPages.length} pagine`);
    console.log(`📁 Salvata in: ${sitemapPath}`);
    
    return allPages.length;
    
  } catch (error) {
    console.error('❌ Errore nella generazione sitemap:', error);
    throw error;
  }
}

// Esegui se chiamato direttamente
if (require.main === module) {
  updateSitemap()
    .then(count => {
      console.log(`🎯 Sitemap aggiornata con successo: ${count} pagine`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Errore:', error);
      process.exit(1);
    });
}

module.exports = { updateSitemap };


