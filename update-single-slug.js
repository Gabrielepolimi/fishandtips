const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function updateSingleSlug(articleId, newSlug, title) {
  try {
    console.log(`\n🔄 Aggiornando: ${title}`);
    console.log(`   ID: ${articleId}`);
    console.log(`   Nuovo slug: ${newSlug}`);
    
    // Aggiorna lo slug
    const result = await client
      .patch(articleId)
      .set({
        'slug': {
          '_type': 'slug',
          'current': newSlug
        }
      })
      .commit();
    
    console.log(`✅ Slug aggiornato con successo!`);
    console.log(`   Nuovo slug: ${result.slug.current}`);
    
  } catch (error) {
    console.error(`❌ Errore durante l'aggiornamento di ${title}:`, error);
  }
}

// Aggiorna gli articoli con slug troppo lunghi
async function updateAllSlugs() {
  const updates = [
    {
      id: 'e4d7ec43-6475-4594-85f9-4185638a6bb5',
      newSlug: 'rosa-dei-venti-pesca',
      title: 'Rosa dei Venti'
    },
    {
      id: '9e876109-f99f-4d10-bf12-8fade429cf31', 
      newSlug: 'montature-surfcasting-2025',
      title: 'Montature surfcasting'
    },
    {
      id: 'c4cc407b-0371-46c4-b151-563dd0ba0ce5',
      newSlug: 'mulinelli-spinning-2025',
      title: 'Mulinelli da spinning'
    },
    {
      id: 'c35fc1f8-cf2a-48db-9d4f-80b9f36644b7',
      newSlug: 'canne-surfcasting-2025',
      title: 'Canne da surfcasting'
    }
  ];
  
  console.log('🚀 Inizio aggiornamento slug...');
  
  for (const update of updates) {
    await updateSingleSlug(update.id, update.newSlug, update.title);
  }
  
  console.log('\n🎉 Tutti gli slug sono stati aggiornati!');
}

updateAllSlugs();




