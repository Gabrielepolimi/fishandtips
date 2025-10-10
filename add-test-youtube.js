const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function addTestYouTube() {
  try {
    console.log('🎥 Aggiunta Video YouTube di Test\n');

    // Trova un articolo per test
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] [0...3] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log('📝 Articoli disponibili per test:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   ID: ${article._id}\n`);
    });

    console.log('🎯 ISTRUZIONI PER AGGIUNGERE VIDEO:');
    console.log('1. Vai su Sanity Studio (dopo aver aggiornato)');
    console.log('2. Apri uno di questi articoli:');
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`);
    });
    console.log('3. Aggiungi questi valori:');
    console.log('   - YouTube URL: dQw4w9WgXcQ');
    console.log('   - YouTube Title: Tutorial pesca - Test video');
    console.log('4. Salva e pubblica');
    console.log('5. Vai sul sito per verificare');

    console.log('\n🔗 URL per test:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. https://fishandtips.it/articoli/${article.slug}`);
    });

    console.log('\n✅ Una volta aggiunto il video, dovresti vederlo sul sito!');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

addTestYouTube();

