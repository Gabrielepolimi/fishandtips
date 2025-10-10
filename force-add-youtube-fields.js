const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function forceAddYouTubeFields() {
  try {
    console.log('🔧 Forzatura Aggiunta Campi YouTube\n');

    // Trova un articolo per test
    const testArticle = await client.fetch(`
      *[_type == "post" && status == "published"] [0] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log('📝 Articolo selezionato per test:');
    console.log(`   Titolo: ${testArticle.title}`);
    console.log(`   Slug: ${testArticle.slug}`);
    console.log(`   ID: ${testArticle._id}`);

    console.log('\n🎯 ISTRUZIONI MANUALI:');
    console.log('1. Vai su Sanity Studio');
    console.log('2. Apri questo articolo:', testArticle.title);
    console.log('3. Se NON vedi i campi YouTube, aggiungili manualmente:');
    console.log('   - Clicca su "Add field" o "+"');
    console.log('   - Nome: youtubeUrl');
    console.log('   - Tipo: String');
    console.log('   - Titolo: YouTube Video URL');
    console.log('   - Aggiungi anche youtubeTitle (stesso processo)');
    console.log('4. Aggiungi questi valori:');
    console.log('   - YouTube URL: dQw4w9WgXcQ');
    console.log('   - YouTube Title: Tutorial pesca - Test video');
    console.log('5. Salva e pubblica');

    console.log('\n🔗 URL per test:');
    console.log(`https://fishandtips.it/articoli/${testArticle.slug}`);

    console.log('\n✅ Una volta aggiunto, il video apparirà sul sito!');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

forceAddYouTubeFields();

