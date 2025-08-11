import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false
});

async function testArticleQuery() {
  console.log('=== TEST QUERY ARTICOLO ===\n');

  const slug = 'primo-articolo-di-fish-and-tips';
  
  console.log(`Cercando articolo con slug: "${slug}"\n`);

  // Test 1: Query esatta come nel codice
  console.log('1️⃣ Query esatta (come nel codice):');
  const post1 = await client.fetch(`
    *[_type == "post" && slug.current == $slug && status == "published"][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "author": author->name,
      status
    }
  `, { slug });
  
  console.log('Risultato:', post1 ? '✅ Trovato' : '❌ Non trovato');
  if (post1) {
    console.log('Dettagli:', JSON.stringify(post1, null, 2));
  }
  console.log('');

  // Test 2: Query senza filtro status
  console.log('2️⃣ Query senza filtro status:');
  const post2 = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      "author": author->name,
      status
    }
  `, { slug });
  
  console.log('Risultato:', post2 ? '✅ Trovato' : '❌ Non trovato');
  if (post2) {
    console.log('Dettagli:', JSON.stringify(post2, null, 2));
  }
  console.log('');

  // Test 3: Tutti i post con questo slug
  console.log('3️⃣ Tutti i post con questo slug:');
  const posts = await client.fetch(`
    *[_type == "post" && slug.current == $slug] {
      _id,
      title,
      "slug": slug.current,
      status,
      "author": author->name
    }
  `, { slug });
  
  console.log(`Trovati ${posts.length} post:`);
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title} (status: ${post.status})`);
  });
  console.log('');

  // Test 4: Tutti i post pubblicati
  console.log('4️⃣ Tutti i post con status "published":');
  const publishedPosts = await client.fetch(`
    *[_type == "post" && status == "published"] {
      _id,
      title,
      "slug": slug.current,
      status,
      excerpt,
      "author": author->name
    }
  `);
  
  console.log(`Trovati ${publishedPosts.length} post pubblicati:`);
  publishedPosts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title} (slug: ${post.slug})`);
    console.log(`   - Excerpt: ${post.excerpt || 'MISSING'}`);
    console.log(`   - Author: ${post.author || 'MISSING'}`);
    console.log(`   - Status: ${post.status}`);
  });

  console.log('\n=== FINE TEST ===');
}

testArticleQuery().catch(console.error);
