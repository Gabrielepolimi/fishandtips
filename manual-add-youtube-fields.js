const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function manualAddYouTubeFields() {
  try {
    console.log('🎥 Aggiunta Manuale Campi YouTube\n');

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

    console.log('\n🎯 ISTRUZIONI DETTAGLIATE:');
    console.log('1. Vai su https://fishandtips-studio.vercel.app');
    console.log('2. Accedi con le tue credenziali');
    console.log('3. Vai su "Content" → "Post"');
    console.log(`4. Apri questo articolo: "${testArticle.title}"`);
    console.log('5. Cerca i campi esistenti (Title, Slug, Excerpt, etc.)');
    console.log('6. Se NON vedi i campi YouTube, aggiungili manualmente:');
    console.log('');
    console.log('   📝 CAMPO 1: YouTube URL');
    console.log('   - Clicca su "Add field" o "+" (di solito in fondo)');
    console.log('   - Nome: youtubeUrl');
    console.log('   - Tipo: String');
    console.log('   - Titolo: YouTube Video URL');
    console.log('   - Descrizione: URL del video YouTube o solo l\'ID del video');
    console.log('');
    console.log('   📝 CAMPO 2: YouTube Title');
    console.log('   - Clicca su "Add field" o "+"');
    console.log('   - Nome: youtubeTitle');
    console.log('   - Tipo: String');
    console.log('   - Titolo: YouTube Video Title');
    console.log('   - Descrizione: Titolo personalizzato per il video (opzionale)');
    console.log('');
    console.log('7. Aggiungi questi valori di test:');
    console.log('   - YouTube URL: dQw4w9WgXcQ');
    console.log('   - YouTube Title: Tutorial pesca - Test video');
    console.log('8. Salva e pubblica');
    console.log('9. Vai sul sito per verificare');

    console.log('\n🔗 URL per test:');
    console.log(`https://fishandtips.it/articoli/${testArticle.slug}`);

    console.log('\n💡 SE NON VEDI "Add field":');
    console.log('- Cerca un pulsante "+" o "Add"');
    console.log('- Oppure cerca "Edit schema" o "Configure"');
    console.log('- I campi potrebbero essere già presenti ma nascosti');

    console.log('\n✅ Una volta aggiunto, il video apparirà sul sito!');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

manualAddYouTubeFields();
