const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const sanityClient = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Assicurati di avere questo token
});

const fishingTechniques = [
  {
    title: 'Spinning',
    slug: 'spinning',
    description: 'Tecnica di pesca con esche artificiali e canna da spinning',
    difficulty: 'intermediate'
  },
  {
    title: 'Bolognese',
    slug: 'bolognese',
    description: 'Tecnica di pesca con canna fissa e galleggiante',
    difficulty: 'beginner'
  },
  {
    title: 'Feeder',
    slug: 'feeder',
    description: 'Tecnica di pesca con pasturatore e canna da feeder',
    difficulty: 'intermediate'
  },
  {
    title: 'Carp Fishing',
    slug: 'carp-fishing',
    description: 'Tecnica di pesca alla carpa con esche naturali',
    difficulty: 'advanced'
  },
  {
    title: 'Fly Fishing',
    slug: 'fly-fishing',
    description: 'Tecnica di pesca con mosca artificiale',
    difficulty: 'expert'
  }
];

async function createFishingTechniques() {
  console.log('🎣 Creazione tecniche di pesca...');
  
  for (const technique of fishingTechniques) {
    try {
      const result = await sanityClient.create({
        _type: 'fishingTechnique',
        title: technique.title,
        slug: {
          _type: 'slug',
          current: technique.slug
        },
        description: technique.description,
        difficulty: technique.difficulty
      });
      
      console.log(`✅ Creata: ${technique.title} (ID: ${result._id})`);
    } catch (error) {
      console.error(`❌ Errore creando ${technique.title}:`, error.message);
    }
  }
  
  console.log('🎣 Creazione completata!');
}

createFishingTechniques().catch(console.error);
