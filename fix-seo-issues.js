const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function fixSEOIssues() {
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
      return article.seoTitle.length <= 30 || 
             article.seoDescription.length <= 120 || 
             article.seoDescription.length >= 160;
    });
    
    console.log(`❌ Articoli con problemi SEO: ${problematicArticles.length}`);
    
    if (problematicArticles.length > 0) {
      console.log('\n📋 ARTICOLI CON PROBLEMI SEO:');
      problematicArticles.forEach(article => {
        console.log(`\n📝 ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   SEO Title: ${article.seoTitle ? article.seoTitle.length + ' chars' : 'MISSING'}`);
        console.log(`   SEO Description: ${article.seoDescription ? article.seoDescription.length + ' chars' : 'MISSING'}`);
        console.log(`   SEO Keywords: ${article.seoKeywords ? 'Presenti' : 'Mancanti'}`);
        
        // Suggerimenti per fix
        console.log(`\n💡 SUGGERIMENTI FIX:`);
        
        if (!article.seoTitle || article.seoTitle.length <= 30) {
          console.log(`   🔧 SEO Title: Aggiungere titolo 30-60 caratteri`);
          console.log(`   📝 Suggerimento: "${article.title} - FishandTips"`);
        }
        
        if (!article.seoDescription || article.seoDescription.length <= 120 || article.seoDescription.length >= 160) {
          console.log(`   🔧 SEO Description: Aggiungere descrizione 120-160 caratteri`);
          console.log(`   📝 Suggerimento: "Guida completa alla ${article.title.toLowerCase()}: tecniche, consigli pratici e segreti per migliorare le tue uscite di pesca sportiva."`);
        }
        
        if (!article.seoKeywords) {
          console.log(`   🔧 SEO Keywords: Aggiungere 3-5 parole chiave`);
          console.log(`   📝 Suggerimento: ["pesca", "tecniche", "consigli", "sportiva"]`);
        }
      });
    }

    // 2. RACCOMANDAZIONI SPECIFICHE
    console.log('\n🎯 RACCOMANDAZIONI SPECIFICHE:');
    console.log('1. 🔧 Vai su Sanity Studio');
    console.log('2. 📝 Apri ogni articolo problematico');
    console.log('3. ✏️ Aggiorna SEO Title, Description e Keywords');
    console.log('4. 💾 Salva e pubblica');
    console.log('5. 🔄 Testa che le modifiche siano visibili');

    console.log('\n📊 PRIORITÀ FIX:');
    problematicArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Priorità: ${!article.seoTitle ? '🔴 CRITICA' : '🟡 ALTA'}`);
    });

  } catch (error) {
    console.error('❌ Errore durante il fix SEO:', error);
  }
}

fixSEOIssues();
