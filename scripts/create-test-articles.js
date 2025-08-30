import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN // Aggiungi il tuo token qui
});

const testArticles = [
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
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Le Esche Artificiali Migliori'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'Le esche artificiali per lo spinning includono cucchiaini, minnow, spinnerbait e soft bait. Ogni tipo ha le sue caratteristiche specifiche e funziona meglio in determinate condizioni.'
          }
        ]
      }
    ],
    publishedAt: new Date().toISOString(),
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-1' // Assicurati che questo autore esista
    },
    categories: [
      {
        _type: 'reference',
        _ref: 'category-tecniche' // Assicurati che questa categoria esista
      }
    ],
    fishingTechniques: [
      {
        _type: 'reference',
        _ref: 'technique-spinning'
      }
    ],
    seoTitle: 'Guida Completa alla Pesca a Spinning - FishandTips',
    seoDescription: 'Scopri tutti i segreti della pesca a spinning con la nostra guida completa. Tecniche, esche e consigli esperti.',
    seoKeywords: ['pesca spinning', 'esche artificiali', 'tecniche pesca', 'cucchiaini', 'minnow'],
    readingTime: 8
  },
  {
    _type: 'post',
    title: 'Come Scegliere la Canna da Pesca Perfetta',
    slug: {
      _type: 'slug',
      current: 'scegliere-canna-pesca'
    },
    excerpt: 'Una guida dettagliata per scegliere la canna da pesca ideale per le tue esigenze e il tuo budget.',
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
      },
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Lunghezza e Azione'
          }
        ]
      },
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: 'La lunghezza della canna influisce sulla distanza di lancio e sul controllo. L\'azione determina la sensibilità e la potenza di recupero.'
          }
        ]
      }
    ],
    publishedAt: new Date().toISOString(),
    status: 'published',
    author: {
      _type: 'reference',
      _ref: 'author-1'
    },
    categories: [
      {
        _type: 'reference',
        _ref: 'category-attrezzature'
      }
    ],
    fishingTechniques: [
      {
        _type: 'reference',
        _ref: 'technique-generale'
      }
    ],
    seoTitle: 'Come Scegliere la Canna da Pesca Perfetta - FishandTips',
    seoDescription: 'Guida completa per scegliere la canna da pesca ideale. Scopri lunghezza, azione, materiali e prezzi.',
    seoKeywords: ['canna pesca', 'attrezzatura pesca', 'lunghezza canna', 'azione canna'],
    readingTime: 6
  }
];

async function createTestArticles() {
  try {
    console.log('Creazione articoli di test...');
    
    for (const article of testArticles) {
      const result = await client.create(article);
      console.log(`Articolo creato: ${result.title} (ID: ${result._id})`);
    }
    
    console.log('Tutti gli articoli di test sono stati creati con successo!');
  } catch (error) {
    console.error('Errore nella creazione degli articoli:', error);
  }
}

createTestArticles();




