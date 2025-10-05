const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function diagnoseYouTubeIssue() {
  try {
    console.log('🔍 DIAGNOSI COMPLETA SISTEMA YOUTUBE\n');

    // Test 1: Verifica schema Post
    console.log('📊 1. Verifica Schema Post...');
    try {
      const postSchema = await client.fetch(`
        *[_type == "post"] [0] {
          _id,
          title,
          _type
        }
      `);
      console.log('✅ Schema Post funzionante');
      console.log('📝 Articolo di test:', postSchema.title);
    } catch (error) {
      console.log('❌ Errore schema Post:', error.message);
    }

    // Test 2: Verifica campi YouTube esistenti
    console.log('\n🎥 2. Verifica Campi YouTube...');
    try {
      const youtubeFields = await client.fetch(`
        *[_type == "post" && defined(youtubeUrl)] [0] {
          _id,
          title,
          youtubeUrl,
          youtubeTitle
        }
      `);
      
      if (youtubeFields) {
        console.log('✅ Campi YouTube trovati in database');
        console.log('📝 Articolo:', youtubeFields.title);
        console.log('🎥 URL:', youtubeFields.youtubeUrl);
        console.log('📺 Title:', youtubeFields.youtubeTitle);
      } else {
        console.log('⚠️ Nessun articolo con campi YouTube trovato');
      }
    } catch (error) {
      console.log('❌ Errore campi YouTube:', error.message);
    }

    // Test 3: Verifica tutti i campi disponibili
    console.log('\n🔍 3. Verifica Campi Disponibili...');
    try {
      const allFields = await client.fetch(`
        *[_type == "post"] [0] {
          _id,
          title,
          slug,
          excerpt,
          author,
          mainImage,
          categories,
          publishedAt,
          body,
          seoTitle,
          seoDescription,
          seoKeywords,
          readingTime,
          status,
          initialLikes,
          showFishingRodComparison,
          fishingRodComparisonTitle,
          selectedProducts,
          youtubeUrl,
          youtubeTitle
        }
      `);
      
      console.log('📋 Campi disponibili:');
      Object.keys(allFields).forEach(field => {
        const value = allFields[field];
        const status = value !== undefined ? '✅' : '❌';
        console.log(`   ${status} ${field}: ${value !== undefined ? typeof value : 'undefined'}`);
      });
      
    } catch (error) {
      console.log('❌ Errore verifica campi:', error.message);
    }

    // Test 4: Verifica file schema
    console.log('\n📁 4. Verifica File Schema...');
    const fs = require('fs');
    const path = require('path');
    
    const schemaPath = '/Users/gabrielegiugliano/FishandTips.it/fishandtips-studio-temp/schemaTypes/post.ts';
    
    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      if (schemaContent.includes('youtubeUrl')) {
        console.log('✅ Campo youtubeUrl trovato nel file schema');
      } else {
        console.log('❌ Campo youtubeUrl NON trovato nel file schema');
      }
      
      if (schemaContent.includes('youtubeTitle')) {
        console.log('✅ Campo youtubeTitle trovato nel file schema');
      } else {
        console.log('❌ Campo youtubeTitle NON trovato nel file schema');
      }
      
      // Conta le righe del file
      const lines = schemaContent.split('\n').length;
      console.log(`📊 File schema: ${lines} righe`);
      
    } catch (error) {
      console.log('❌ Errore lettura file schema:', error.message);
    }

    // Test 5: Verifica Sanity Studio
    console.log('\n🖥️ 5. Verifica Sanity Studio...');
    console.log('📋 Controlla manualmente:');
    console.log('   1. Vai su https://fishandtips-studio.vercel.app');
    console.log('   2. Apri un articolo');
    console.log('   3. Cerca i campi YouTube');
    console.log('   4. Se non li vedi, aggiungili manualmente');

    // Test 6: Suggerimenti
    console.log('\n💡 6. SUGGERIMENTI:');
    console.log('🔧 Se i campi non sono visibili:');
    console.log('   1. Riavvia Sanity Studio');
    console.log('   2. Aggiorna le versioni (come richiesto)');
    console.log('   3. Aggiungi i campi manualmente');
    console.log('   4. Verifica che Sanity Studio sia sincronizzato');

    console.log('\n✅ DIAGNOSI COMPLETATA!');

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

diagnoseYouTubeIssue();
