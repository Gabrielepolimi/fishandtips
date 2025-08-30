import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

async function fixCategories() {
  console.log('=== AGGIORNAMENTO CATEGORIE ===\n');

  const categories = await client.fetch(`
    *[_type == "category"] {
      _id,
      title
    }
  `);

  const categoryUpdates = [
    { title: 'Tecniche', slug: 'tecniche' },
    { title: 'Attrezzature', slug: 'attrezzature' },
    { title: 'Spot', slug: 'spot' },
    { title: 'Consigli Generali', slug: 'consigli' }
  ];

  for (const category of categories) {
    const update = categoryUpdates.find(u => u.title === category.title);
    if (update) {
      try {
        await client.patch(category._id)
          .set({
            slug: {
              _type: 'slug',
              current: update.slug
            }
          })
          .commit();
        console.log(`✅ Categoria "${category.title}" aggiornata con slug: ${update.slug}`);
      } catch (error) {
        console.log(`❌ Errore aggiornamento categoria "${category.title}":`, error.message);
      }
    }
  }

  console.log('\n=== FINE AGGIORNAMENTO ===');
}

fixCategories().catch(console.error);




