import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// Prima creiamo un autore
const createAuthor = async () => {
  try {
    const author = await client.create({
      _type: 'author',
      name: 'FishandTips Team',
      bio: 'Il team di esperti di FishandTips'
    });
    console.log('Autore creato:', author._id);
    return author._id;
  } catch (error) {
    console.log('Autore già esistente o errore:', error.message);
    // Se l'autore esiste già, prova a trovarlo
    const authors = await client.fetch('*[_type == "author"]');
    if (authors.length > 0) {
      return authors[0]._id;
    }
    return null;
  }
};

// Creiamo una categoria
const createCategory = async () => {
  try {
    const category = await client.create({
      _type: 'category',
      title: 'Tecniche di Pesca',
      slug: {
        _type: 'slug',
        current: 'tecniche'
      },
      description: 'Articoli sulle tecniche di pesca'
    });
    console.log('Categoria creata:', category._id);
    return category._id;
  } catch (error) {
    console.log('Categoria già esistente o errore:', error.message);
    const categories = await client.fetch('*[_type == "category"]');
    if (categories.length > 0) {
      return categories[0]._id;
    }
    return null;
  }
};

// Creiamo una tecnica di pesca
const createFishingTechnique = async () => {
  try {
    const technique = await client.create({
      _type: 'fishingTechnique',
      title: 'Spinning',
      slug: {
        _type: 'slug',
        current: 'spinning'
      },
      description: 'Tecnica di pesca con esche artificiali'
    });
    console.log('Tecnica creata:', technique._id);
    return technique._id;
  } catch (error) {
    console.log('Tecnica già esistente o errore:', error.message);
    const techniques = await client.fetch('*[_type == "fishingTechnique"]');
    if (techniques.length > 0) {
      return techniques[0]._id;
    }
    return null;
  }
};

// Creiamo articoli di test
const createTestArticles = async (authorId, categoryId, techniqueId) => {
  const articles = [
    {
      _type: 'post',
      title: 'Guida Completa alla Pesca a Spinning',
      slug: {
        _type: 'slug',
        current: 'guida-pesca-spinning'
      },
      excerpt: 'Scopri tutti i segreti della pesca a spinning, dalle esche migliori alle tecniche più efficaci.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'La pesca a spinning è una delle tecniche più emozionanti e versatili che un pescatore possa praticare. Questa guida ti accompagnerà attraverso tutti gli aspetti fondamentali di questa tecnica.'
            }
          ]
        }
      ],
      publishedAt: new Date().toISOString(),
      status: 'published',
      author: {
        _type: 'reference',
        _ref: authorId
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryId
        }
      ],
      fishingTechniques: [
        {
          _type: 'reference',
          _ref: techniqueId
        }
      ],
      seoTitle: 'Guida Completa alla Pesca a Spinning - FishandTips',
      seoDescription: 'Scopri tutti i segreti della pesca a spinning con la nostra guida completa.',
      readingTime: 8
    },
    {
      _type: 'post',
      title: 'Come Scegliere la Canna da Pesca Perfetta',
      slug: {
        _type: 'slug',
        current: 'scegliere-canna-pesca'
      },
      excerpt: 'Una guida dettagliata per scegliere la canna da pesca ideale per le tue esigenze.',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Scegliere la canna da pesca giusta è fondamentale per il successo della tua pesca. In questa guida ti aiuteremo a capire quali caratteristiche considerare.'
            }
          ]
        }
      ],
      publishedAt: new Date().toISOString(),
      status: 'published',
      author: {
        _type: 'reference',
        _ref: authorId
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryId
        }
      ],
      fishingTechniques: [
        {
          _type: 'reference',
          _ref: techniqueId
        }
      ],
      seoTitle: 'Come Scegliere la Canna da Pesca Perfetta - FishandTips',
      seoDescription: 'Guida completa per scegliere la canna da pesca ideale.',
      readingTime: 6
    }
  ];

  for (const article of articles) {
    try {
      const result = await client.create(article);
      console.log(`Articolo creato: ${result.title} (ID: ${result._id})`);
    } catch (error) {
      console.error(`Errore nella creazione dell'articolo ${article.title}:`, error.message);
    }
  }
};

// Esegui tutto
async function main() {
  console.log('Iniziando creazione contenuto di test...');
  
  const authorId = await createAuthor();
  const categoryId = await createCategory();
  const techniqueId = await createFishingTechnique();
  
  if (authorId && categoryId && techniqueId) {
    await createTestArticles(authorId, categoryId, techniqueId);
    console.log('Contenuto di test creato con successo!');
  } else {
    console.log('Impossibile creare il contenuto di test - mancano riferimenti');
  }
}

main().catch(console.error);












