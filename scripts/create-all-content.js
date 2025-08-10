const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const sanityClient = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
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
}

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
}

async function createAllContent() {
  console.log('🚀 Inizio creazione contenuti...\n');
  
  await createFishingTechniques();
  console.log('');
  await createCategories();
  
  console.log('\n🎉 Creazione contenuti completata!');
  console.log('\n📝 Prossimi passi:');
  console.log('1. Vai su http://localhost:3333');
  console.log('2. Modifica i POST esistenti');
  console.log('3. Aggiungi "Tecniche di Pesca" e "Categorie"');
  console.log('4. Testa il sistema newsletter!');
}

createAllContent().catch(console.error);
