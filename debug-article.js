import { sanityClient } from './sanityClient.ts';

async function debugArticle() {
  console.log('=== DEBUG ARTICOLO ===');
  
  const slug = 'primo-articolo-di-fish-and-tips';
  
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        body,
        publishedAt,
        "mainImage": mainImage.asset->url,
        "author": author->name,
        categories[]->{
          title,
          "slug": slug.current
        },
        fishingTechniques[]->{
          title,
          "slug": slug.current
        },
        seoTitle,
        seoDescription,
        seoKeywords,
        "seoImage": seoImage.asset->url,
        readingTime,
        status
      }
    `, { slug });

    console.log('Risultato query:', JSON.stringify(post, null, 2));
    
    if (!post) {
      console.log('❌ Articolo non trovato');
      return;
    }
    
    console.log('✅ Articolo trovato');
    console.log('Title:', post.title);
    console.log('Excerpt:', post.excerpt);
    console.log('Author:', post.author);
    console.log('Status:', post.status);
    
    // Controlli di sicurezza
    if (!post.title) console.log('❌ Title mancante');
    if (!post.excerpt) console.log('❌ Excerpt mancante');
    if (!post.author?.name) console.log('❌ Author.name mancante');
    
  } catch (error) {
    console.error('Errore:', error);
  }
}

debugArticle().catch(console.error);
