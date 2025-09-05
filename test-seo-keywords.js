import { sanityClient } from './sanityClient.js';

async function testSeoKeywords() {
  console.log('=== TEST SEO KEYWORDS ===');
  
  try {
    // Testiamo alcuni articoli esistenti
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published"] | order(publishedAt desc) [0...3] {
        _id,
        title,
        "slug": slug.current,
        seoKeywords,
        seoTitle,
        seoDescription
      }
    `);

    console.log(`Trovati ${posts.length} articoli:`);
    
    posts.forEach((post, index) => {
      console.log(`\n📄 Articolo ${index + 1}: ${post.title}`);
      console.log(`Slug: ${post.slug}`);
      console.log(`SEO Keywords:`, post.seoKeywords);
      console.log(`Tipo seoKeywords:`, typeof post.seoKeywords);
      console.log(`È array:`, Array.isArray(post.seoKeywords));
      if (Array.isArray(post.seoKeywords)) {
        console.log(`Lunghezza array:`, post.seoKeywords.length);
        post.seoKeywords.forEach((keyword, i) => {
          console.log(`  ${i + 1}. "${keyword}" (tipo: ${typeof keyword})`);
        });
      }
      console.log(`SEO Title:`, post.seoTitle);
      console.log(`SEO Description:`, post.seoDescription);
      console.log('---');
    });

  } catch (error) {
    console.error('Errore:', error);
  }
}

testSeoKeywords().catch(console.error);
