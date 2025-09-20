const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function checkArticles() {
  try {
    console.log('🔍 Controllo articoli esistenti...\n');
    
    // Trova tutti gli articoli pubblicati
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "currentSlug": slug.current,
        publishedAt
      } | order(publishedAt desc)
    `);
    
    console.log(`📊 Trovati ${articles.length} articoli pubblicati:\n`);
    
    articles.forEach((article, index) => {
      const slugLength = article.currentSlug ? article.currentSlug.length : 0;
      const isLong = slugLength > 70;
      const status = isLong ? '🔴 TROPPO LUNGO' : '✅ OK';
      
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.currentSlug} (${slugLength} caratteri) ${status}`);
      console.log(`   ID: ${article._id}\n`);
    });
    
  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

checkArticles();
