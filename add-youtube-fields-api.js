const { createClient } = require('@sanity/client');

// Configurazione Sanity Client con token per scrittura
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Token per scrittura
});

async function addYouTubeFieldsToPost() {
  try {
    console.log('🔧 Aggiunta campi YouTube via API...\n');

    // Test: Aggiungi un video YouTube a un articolo di test
    const testArticleId = '23b727f2-cbdc-4b54-947f-2ccfff677563'; // Pesca a Genova
    
    console.log('📝 Aggiunta video YouTube all\'articolo "Pesca a Genova"...');
    
    const updateResult = await client
      .patch(testArticleId)
      .set({
        youtubeUrl: 'dQw4w9WgXcQ', // ID video di esempio
        youtubeTitle: 'Tutorial pesca a Genova - Spot e tecniche locali'
      })
      .commit();

    console.log('✅ Video YouTube aggiunto con successo!');
    console.log('📊 Risultato:', updateResult);
    
    // Verifica che i campi siano stati aggiunti
    const updatedArticle = await client.fetch(`
      *[_id == $id] {
        _id,
        title,
        youtubeUrl,
        youtubeTitle
      }
    `, { id: testArticleId });

    console.log('\n🎥 Articolo aggiornato:');
    console.log('📝 Titolo:', updatedArticle[0].title);
    console.log('🎥 YouTube URL:', updatedArticle[0].youtubeUrl);
    console.log('📺 YouTube Title:', updatedArticle[0].youtubeTitle);

    console.log('\n✅ TEST COMPLETATO!');
    console.log('🌐 Ora vai sul sito e verifica che il video appaia nell\'articolo:');
    console.log('🔗 https://fishandtips.it/articoli/pesca-genova-consigli-locali');

  } catch (error) {
    console.error('❌ Errore:', error);
    
    if (error.message.includes('token')) {
      console.log('\n🔑 PROBLEMA: Token API mancante');
      console.log('📋 SOLUZIONE:');
      console.log('1. Aggiungi SANITY_API_TOKEN alle variabili d\'ambiente');
      console.log('2. Oppure usa Sanity Studio per aggiungere manualmente i campi');
    }
  }
}

addYouTubeFieldsToPost();


