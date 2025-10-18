const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function fixSEOArticles() {
  try {
    console.log('🔧 FIX SEO ARTICOLI PROBLEMATICI\n');

    // 1. IDENTIFICA ARTICOLI CON PROBLEMI SEO
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription,
        seoKeywords
      }
    `);

    console.log(`📝 Articoli totali: ${articles.length}`);
    
    // Verifica articoli con problemi SEO
    const problematicArticles = articles.filter(article => {
      if (!article.seoTitle || !article.seoDescription) return true;
      return article.seoTitle.length > 60 || 
             article.seoDescription.length < 120 || 
             article.seoDescription.length > 160;
    });
    
    console.log(`❌ Articoli con problemi SEO: ${problematicArticles.length}`);
    
    if (problematicArticles.length > 0) {
      console.log('\n📋 ARTICOLI CON PROBLEMI SEO:');
      problematicArticles.forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   SEO Title: ${article.seoTitle ? article.seoTitle.length + ' chars' : 'MISSING'}`);
        console.log(`   SEO Description: ${article.seoDescription ? article.seoDescription.length + ' chars' : 'MISSING'}`);
        
        // Suggerimenti specifici
        console.log(`\n💡 SUGGERIMENTI FIX:`);
        
        if (!article.seoTitle || article.seoTitle.length > 60) {
          console.log(`   🔧 SEO Title: Ridurre a 30-60 caratteri`);
          console.log(`   📝 Suggerimento: "${article.title.split(':')[0]} - FishandTips"`);
        }
        
        if (!article.seoDescription || article.seoDescription.length < 120 || article.seoDescription.length > 160) {
          console.log(`   🔧 SEO Description: Aggiustare a 120-160 caratteri`);
          console.log(`   📝 Suggerimento: "Guida completa alla ${article.title.toLowerCase()}: tecniche, consigli pratici e segreti per migliorare le tue uscite di pesca sportiva."`);
        }
      });
    }

    // 2. ISTRUZIONI MANUALI
    console.log('\n🔧 ISTRUZIONI MANUALI:');
    console.log('1. Vai su Sanity Studio: https://fishandtips-studio.vercel.app');
    console.log('2. Apri ogni articolo problematico');
    console.log('3. Aggiorna SEO Title e Description');
    console.log('4. Salva e pubblica');
    console.log('5. Verifica che le modifiche siano visibili');

    console.log('\n🎯 IMPATTO DEL FIX:');
    console.log('✅ SEO ottimizzato per tutti gli articoli');
    console.log('✅ Indicizzazione migliorata');
    console.log('✅ Health Score aumentato');
    console.log('✅ Posizionamento Google migliorato');

    console.log('\n⏰ TEMPO STIMATO: 15 minuti');
    console.log('🟡 PRIORITÀ: ALTA');

  } catch (error) {
    console.error('❌ Errore durante il fix SEO:', error);
  }
}

fixSEOArticles();

