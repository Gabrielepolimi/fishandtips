import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function checkExistingContent() {
  console.log('=== CONTROLLO CONTENUTO ESISTENTE ===\n');

  // Controlla tutti i post
  console.log('📝 POST:');
  const posts = await client.fetch(`
    *[_type == "post"] {
      _id,
      title,
      "slug": slug.current,
      status,
      publishedAt,
      "author": author->name,
      "categories": categories[]->title
    }
  `);
  
  posts.forEach(post => {
    console.log(`- ${post.title}`);
    console.log(`  Slug: ${post.slug}`);
    console.log(`  Status: ${post.status}`);
    console.log(`  Author: ${post.author || 'N/A'}`);
    console.log(`  Categories: ${post.categories?.join(', ') || 'N/A'}`);
    console.log('');
  });

  // Controlla tutti gli author
  console.log('👤 AUTHOR:');
  const authors = await client.fetch(`
    *[_type == "author"] {
      _id,
      name,
      bio
    }
  `);
  
  authors.forEach(author => {
    console.log(`- ${author.name} (ID: ${author._id})`);
  });
  console.log('');

  // Controlla tutte le categorie
  console.log('📂 CATEGORIES:');
  const categories = await client.fetch(`
    *[_type == "category"] {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `);
  
  categories.forEach(category => {
    console.log(`- ${category.title} (slug: ${category.slug})`);
  });
  console.log('');

  // Controlla tutte le tecniche di pesca
  console.log('🎣 FISHING TECHNIQUES:');
  const techniques = await client.fetch(`
    *[_type == "fishingTechnique"] {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `);
  
  techniques.forEach(technique => {
    console.log(`- ${technique.title} (slug: ${technique.slug})`);
  });
  console.log('');

  console.log('=== FINE CONTROLLO ===');
}

checkExistingContent().catch(console.error);











