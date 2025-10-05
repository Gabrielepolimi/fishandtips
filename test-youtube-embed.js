const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function testYouTubeEmbed() {
  try {
    console.log('🎥 Test Sistema YouTube Embed\n');

    // Test 1: Controlla se ci sono articoli con video YouTube
    console.log('📊 Controllo articoli con video YouTube...');
    const articlesWithVideo = await client.fetch(`
      *[_type == "post" && status == "published" && defined(youtubeUrl)] {
        _id,
        title,
        "slug": slug.current,
        youtubeUrl,
        youtubeTitle
      }
    `);

    console.log(`✅ Trovati ${articlesWithVideo.length} articoli con video YouTube:`);
    articlesWithVideo.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Video: ${article.youtubeUrl}`);
      console.log(`   Titolo video: ${article.youtubeTitle || 'N/A'}\n`);
    });

    // Test 2: Controlla tutti gli articoli per vedere quali potrebbero beneficiare di un video
    console.log('🔍 Analisi articoli senza video...');
    const allArticles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        youtubeUrl,
        "categories": categories[]->title
      }
    `);

    const articlesWithoutVideo = allArticles.filter(article => !article.youtubeUrl);
    console.log(`📝 Articoli senza video: ${articlesWithoutVideo.length}`);

    // Suggerimenti per video
    console.log('\n🎯 SUGGERIMENTI VIDEO PER ARTICOLI PRIORITARI:');
    const priorityArticles = articlesWithoutVideo.slice(0, 5);
    
    priorityArticles.forEach((article, index) => {
      console.log(`\n${index + 1}. "${article.title}"`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Categorie: ${article.categories?.join(', ') || 'N/A'}`);
      
      // Suggerimenti basati sul titolo
      const title = article.title.toLowerCase();
      if (title.includes('pescare') || title.includes('come')) {
        console.log('   💡 Suggerimento: Video tutorial pratico');
      } else if (title.includes('migliori') || title.includes('recensione')) {
        console.log('   💡 Suggerimento: Video review/confronto');
      } else if (title.includes('spot') || title.includes('genova') || title.includes('liguria')) {
        console.log('   💡 Suggerimento: Video tour spot di pesca');
      } else if (title.includes('canna') || title.includes('mulinello') || title.includes('attrezzatura')) {
        console.log('   💡 Suggerimento: Video test attrezzatura');
      } else {
        console.log('   💡 Suggerimento: Video tutorial generale');
      }
    });

    // Test 3: Esempi di URL YouTube validi
    console.log('\n📺 ESEMPI DI URL YOUTUBE VALIDI:');
    const examples = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'dQw4w9WgXcQ' // Solo ID
    ];
    
    examples.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    console.log('\n✅ Test completato!');
    console.log('\n📋 PROSSIMI PASSI:');
    console.log('1. Aggiungi campo youtubeUrl in Sanity Studio');
    console.log('2. Seleziona video appropriati per gli articoli');
    console.log('3. Testa il componente su un articolo pilota');
    console.log('4. Verifica la responsività su mobile e desktop');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

testYouTubeEmbed();
