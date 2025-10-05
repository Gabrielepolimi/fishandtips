const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function addYouTubeExample() {
  try {
    console.log('🎥 Aggiunta Video YouTube di Esempio\n');

    // Trova un articolo per testare
    const articles = await client.fetch(`
      *[_type == "post" && status == "published" && !defined(youtubeUrl)] [0...3] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    if (articles.length === 0) {
      console.log('❌ Nessun articolo trovato senza video');
      return;
    }

    console.log('📝 Articoli disponibili per test:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.slug})`);
    });

    // Esempi di video YouTube per pesca
    const videoExamples = [
      {
        title: "Come pescare l'orata: tecniche, esche e periodi migliori",
        videoId: "dQw4w9WgXcQ", // Esempio - sostituire con video reale
        videoTitle: "Tutorial pesca all'orata - Tecniche pratiche"
      },
      {
        title: "Pesca a Genova: spot, tecniche e consigli locali", 
        videoId: "dQw4w9WgXcQ", // Esempio - sostituire con video reale
        videoTitle: "Spot di pesca a Genova - Tour completo"
      },
      {
        title: "Migliori canne da spinning 2025 – Economiche e pro",
        videoId: "dQw4w9WgXcQ", // Esempio - sostituire con video reale  
        videoTitle: "Review canne da spinning 2025 - Test pratici"
      }
    ];

    console.log('\n🎯 ESEMPI DI VIDEO YOUTUBE PER PESCA:');
    console.log('(Sostituisci gli ID con video reali)\n');

    videoExamples.forEach((example, index) => {
      console.log(`${index + 1}. Articolo: "${example.title}"`);
      console.log(`   Video ID: ${example.videoId}`);
      console.log(`   Titolo video: ${example.videoTitle}`);
      console.log(`   URL completo: https://www.youtube.com/watch?v=${example.videoId}`);
      console.log('');
    });

    console.log('📋 ISTRUZIONI PER AGGIUNGERE VIDEO:');
    console.log('1. Vai su Sanity Studio');
    console.log('2. Apri un articolo');
    console.log('3. Aggiungi i campi:');
    console.log('   - youtubeUrl: "ID_DEL_VIDEO" o "URL_COMPLETO"');
    console.log('   - youtubeTitle: "Titolo del video"');
    console.log('4. Salva e pubblica');
    console.log('5. Verifica sul sito che il video appaia correttamente');

    console.log('\n🔍 COME TROVARE VIDEO YOUTUBE ADATTI:');
    console.log('1. Cerca su YouTube: "pesca [argomento articolo]"');
    console.log('2. Filtra per:');
    console.log('   - Durata: 3-8 minuti');
    console.log('   - Qualità: HD');
    console.log('   - Canale: Professionale/affidabile');
    console.log('   - Lingua: Italiano');
    console.log('3. Copia l\'ID del video (dopo v=)');
    console.log('4. Aggiungi in Sanity Studio');

    console.log('\n✅ Sistema YouTube Embed pronto per l\'uso!');

  } catch (error) {
    console.error('❌ Errore:', error);
  }
}

addYouTubeExample();
