const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const sanityClient = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const categories = [
  {
    title: 'Tecniche',
    slug: 'tecniche',
    description: 'Articoli sulle diverse tecniche di pesca'
  },
  {
    title: 'Attrezzature',
    slug: 'attrezzature',
    description: 'Guide e recensioni su canne, mulinelli, esche e accessori'
  },
  {
    title: 'Spot',
    slug: 'spot',
    description: 'Luoghi di pesca, laghi, fiumi e spot segreti'
  },
  {
    title: 'Consigli Generali',
    slug: 'consigli-generali',
    description: 'Consigli utili per migliorare la pesca'
  }
];

async function createCategories() {
  console.log('🏷️ Creazione categorie...');
  
  for (const category of categories) {
    try {
      const result = await sanityClient.create({
        _type: 'category',
        title: category.title,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        description: category.description
      });
      
      console.log(`✅ Creata: ${category.title} (ID: ${result._id})`);
    } catch (error) {
      console.error(`❌ Errore creando ${category.title}:`, error.message);
    }
  }
  
  console.log('🏷️ Creazione categorie completata!');
}

createCategories().catch(console.error);
