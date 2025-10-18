import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function fixArticles() {
  console.log('=== AGGIORNAMENTO ARTICOLI ===\n');

  // Trova articoli con status null
  const articles = await client.fetch(`
    *[_type == "post" && !defined(status)] {
      _id,
      title,
      "slug": slug.current
    }
  `);

  console.log(`Trovati ${articles.length} articoli senza status`);

  for (const article of articles) {
    try {
      await client.patch(article._id)
        .set({
          status: 'published'
        })
        .commit();
      console.log(`✅ Articolo "${article.title}" aggiornato con status: published`);
    } catch (error) {
      console.log(`❌ Errore aggiornamento articolo "${article.title}":`, error.message);
    }
  }

  console.log('\n=== FINE AGGIORNAMENTO ===');
}

fixArticles().catch(console.error);













