const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function directAPIAddYouTube() {
  try {
    console.log('🔧 Aggiunta Diretta via API\n');

    // Trova un articolo per test
    const testArticle = await client.fetch(`
      *[_type == "post" && status == "published"] [0] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log('📝 Articolo selezionato:', testArticle.title);
    console.log('🎯 Tentativo di aggiunta diretta via API...');

    try {
      // Prova ad aggiungere i campi direttamente
      const result = await client
        .patch(testArticle._id)
        .set({
          youtubeUrl: 'dQw4w9WgXcQ',
          youtubeTitle: 'Tutorial pesca - Test video'
        })
        .commit();

      console.log('✅ Campi YouTube aggiunti con successo via API!');
      console.log('📊 Risultato:', result);
      
      console.log('\n🔗 Verifica sul sito:');
      console.log(`https://fishandtips.it/articoli/${testArticle.slug}`);
      
      console.log('\n✅ Il video dovrebbe apparire sul sito!');

    } catch (apiError) {
      console.log('❌ Errore API:', apiError.message);
      
      if (apiError.message.includes('permission')) {
        console.log('\n🔑 PROBLEMA: Permessi API insufficienti');
        console.log('📋 SOLUZIONE: Usa Sanity Studio online per aggiungere manualmente');
        console.log('1. Vai su https://fishandtips-studio.vercel.app');
        console.log('2. Apri un articolo');
        console.log('3. Aggiungi i campi manualmente');
      }
    }

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

directAPIAddYouTube();

