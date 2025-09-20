const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Assicurati di avere il token
});

// Mapping degli slug da aggiornare
const slugUpdates = [
  {
    title: 'Rosa dei Venti: Guida completa, Nomi dei Venti e Funzione della Rosa dei Venti',
    newSlug: 'rosa-dei-venti-pesca'
  },
  {
    title: 'Montature surfcasting: guida completa 2025 con schemi e consigli pratici',
    newSlug: 'montature-surfcasting-2025'
  },
  {
    title: 'Migliori canne da surfcasting 2025: guida e consigli per canne economiche e pro',
    newSlug: 'canne-surfcasting-2025'
  },
  {
    title: 'Traina costiera: tecniche, attrezzatura, guida completa e consigli pratici',
    newSlug: 'traina-costiera-guida'
  },
  {
    title: 'Licenza di pesca in Italia 2025: costi, tipi e come ottenerla',
    newSlug: 'licenza-pesca-italia-2025'
  }
];

async function updateSlugs() {
  try {
    console.log('🔍 Cerco gli articoli da aggiornare...');
    
    for (const update of slugUpdates) {
      console.log(`\n📝 Aggiornando: ${update.title}`);
      
      // Trova l'articolo per titolo
      const articles = await client.fetch(`
        *[_type == "post" && title match $title] {
          _id,
          title,
          "currentSlug": slug.current
        }
      `, { title: update.title });
      
      if (articles.length === 0) {
        console.log(`❌ Articolo non trovato: ${update.title}`);
        continue;
      }
      
      const article = articles[0];
      console.log(`   ID: ${article._id}`);
      console.log(`   Slug attuale: ${article.currentSlug}`);
      console.log(`   Nuovo slug: ${update.newSlug}`);
      
      // Aggiorna lo slug
      const result = await client
        .patch(article._id)
        .set({
          'slug': {
            '_type': 'slug',
            'current': update.newSlug
          }
        })
        .commit();
      
      console.log(`✅ Slug aggiornato con successo!`);
    }
    
    console.log('\n🎉 Tutti gli slug sono stati aggiornati!');
    
  } catch (error) {
    console.error('❌ Errore durante l\'aggiornamento:', error);
  }
}

// Esegui l'aggiornamento
updateSlugs();

