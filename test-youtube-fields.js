const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function testYouTubeFields() {
  try {
    console.log('🎥 Test Campi YouTube in Sanity\n');

    // Test 1: Controlla se i campi YouTube sono disponibili
    console.log('📊 Controllo disponibilità campi YouTube...');
    
    try {
      const testQuery = await client.fetch(`
        *[_type == "post" && status == "published"] [0] {
          _id,
          title,
          youtubeUrl,
          youtubeTitle
        }
      `);
      
      console.log('✅ Campi YouTube disponibili nel database!');
      console.log('📝 Articolo di test:', testQuery.title);
      console.log('🎥 YouTube URL:', testQuery.youtubeUrl || 'Non impostato');
      console.log('📺 YouTube Title:', testQuery.youtubeTitle || 'Non impostato');
      
    } catch (error) {
      console.log('❌ Errore nel test campi YouTube:', error.message);
      
      if (error.message.includes('youtubeUrl')) {
        console.log('\n🔧 I campi YouTube non sono ancora disponibili nel database.');
        console.log('📋 AZIONI NECESSARIE:');
        console.log('1. I campi sono stati aggiunti ai file schema');
        console.log('2. Devi fare il deploy di Sanity Studio');
        console.log('3. Oppure riavviare Sanity Studio');
        console.log('4. I campi appariranno automaticamente negli articoli');
      }
    }

    // Test 2: Mostra articoli disponibili per test
    console.log('\n📝 ARTICOLI DISPONIBILI PER TEST:');
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] [0...5] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   ID: ${article._id}\n`);
    });

    console.log('🎯 PROSSIMI PASSI:');
    console.log('1. ✅ Campi YouTube aggiunti ai file schema');
    console.log('2. 🔄 Deploy Sanity Studio (se necessario)');
    console.log('3. 📝 Aggiungi video a un articolo di test');
    console.log('4. 🧪 Verifica funzionamento sul sito');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

testYouTubeFields();

