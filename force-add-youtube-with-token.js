const { createClient } = require('@sanity/client');

// Configurazione Sanity Client con token per scrittura
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || 'sk_test_token', // Token per scrittura
});

async function forceAddYouTubeWithToken() {
  try {
    console.log('🔧 Forzatura Aggiunta YouTube con Token\n');

    // Trova un articolo per test
    const testArticle = await client.fetch(`
      *[_type == "post" && status == "published"] [0] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log('📝 Articolo selezionato:', testArticle.title);
    console.log('🎯 Tentativo di aggiunta diretta...');

    try {
      // Prova ad aggiungere i campi direttamente
      const result = await client
        .patch(testArticle._id)
        .set({
          youtubeUrl: 'dQw4w9WgXcQ',
          youtubeTitle: 'Tutorial pesca - Test video'
        })
        .commit();

      console.log('✅ Campi YouTube aggiunti con successo!');
      console.log('📊 Risultato:', result);
      
      console.log('\n🔗 Verifica sul sito:');
      console.log(`https://fishandtips.it/articoli/${testArticle.slug}`);
      
      console.log('\n✅ Il video dovrebbe apparire sul sito!');
      console.log('🎯 Ora vai su Sanity Studio e dovresti vedere i campi popolati');

    } catch (apiError) {
      console.log('❌ Errore API:', apiError.message);
      
      if (apiError.message.includes('permission')) {
        console.log('\n🔑 PROBLEMA: Token API mancante o insufficiente');
        console.log('📋 SOLUZIONE ALTERNATIVA:');
        console.log('1. Vai su https://sanity.io/manage/project/3nnnl6gi');
        console.log('2. Crea un token API con permessi di scrittura');
        console.log('3. Aggiungi SANITY_API_TOKEN alle variabili d\'ambiente');
        console.log('4. Oppure usa Sanity Studio per aggiungere manualmente');
      }
    }

    console.log('\n💡 METODO ALTERNATIVO:');
    console.log('Se l\'API non funziona, prova questo:');
    console.log('1. Vai su https://fishandtips-studio.vercel.app');
    console.log('2. Apri un articolo');
    console.log('3. Cerca i campi YouTube (potrebbero essere in fondo)');
    console.log('4. Se non li vedi, aspetta 2-3 minuti per la sincronizzazione');

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

forceAddYouTubeWithToken();
