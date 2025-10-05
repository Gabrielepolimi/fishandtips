const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function forceAddYouTubeCheckbox() {
  try {
    console.log('🔧 Forzatura Aggiunta Checkbox YouTube\n');

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
          showYouTubeVideo: true,
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
        console.log('\n🔑 PROBLEMA: Permessi API insufficienti');
        console.log('📋 SOLUZIONE ALTERNATIVA:');
        console.log('1. Vai su https://fishandtips-studio.vercel.app');
        console.log('2. Apri un articolo');
        console.log('3. Cerca i campi YouTube (potrebbero essere in fondo)');
        console.log('4. Se non li vedi, aspetta 2-3 minuti per la sincronizzazione');
      }
    }

    console.log('\n💡 METODO ALTERNATIVO:');
    console.log('Se l\'API non funziona, prova questo:');
    console.log('1. Vai su https://fishandtips-studio.vercel.app');
    console.log('2. Apri un articolo');
    console.log('3. Cerca "Mostra Video YouTube" (potrebbe essere in fondo)');
    console.log('4. Se non lo vedi, aspetta 2-3 minuti per la sincronizzazione');

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

forceAddYouTubeCheckbox();
