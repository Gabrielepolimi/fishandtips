const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function addYouTubeFieldsDirect() {
  try {
    console.log('🔧 Aggiunta Diretta Campi YouTube al Database\n');

    // Trova tutti gli articoli pubblicati
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log(`📝 Trovati ${articles.length} articoli pubblicati`);

    // Aggiungi campi YouTube a tutti gli articoli
    console.log('\n🎥 Aggiunta campi YouTube a tutti gli articoli...');
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      console.log(`${i + 1}/${articles.length} - ${article.title}`);
      
      try {
        // Aggiungi campi YouTube vuoti a ogni articolo
        const result = await client
          .patch(article._id)
          .set({
            youtubeUrl: '',
            youtubeTitle: ''
          })
          .commit();

        console.log(`   ✅ Campi aggiunti`);
        
      } catch (error) {
        console.log(`   ❌ Errore: ${error.message}`);
      }
    }

    console.log('\n🎯 AGGIUNTA VIDEO DI TEST:');
    
    // Aggiungi video di test al primo articolo
    const testArticle = articles[0];
    console.log(`📝 Articolo di test: ${testArticle.title}`);
    
    try {
      const testResult = await client
        .patch(testArticle._id)
        .set({
          youtubeUrl: 'dQw4w9WgXcQ',
          youtubeTitle: 'Tutorial pesca - Test video'
        })
        .commit();

      console.log('✅ Video di test aggiunto!');
      console.log('🔗 URL per test:', `https://fishandtips.it/articoli/${testArticle.slug}`);
      
    } catch (error) {
      console.log('❌ Errore aggiunta video test:', error.message);
    }

    console.log('\n✅ CAMPOS YOUTUBE AGGIUNTI A TUTTI GLI ARTICOLI!');
    console.log('🎯 Ora vai su Sanity Studio e dovresti vedere i campi YouTube');
    console.log('🌐 Verifica sul sito che il video appaia nell\'articolo di test');

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

addYouTubeFieldsDirect();
