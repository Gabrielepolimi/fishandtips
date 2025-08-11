import { sanityClient } from './sanityClient.ts';

async function compareArticles() {
  console.log('=== CONFRONTO ARTICOLI ===');
  
  const articles = [
    'primo-articolo-di-fish-and-tips',
    'secondo-articolo'
  ];
  
  for (const slug of articles) {
    console.log(`\n📄 Articolo: ${slug}`);
    
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

      if (!post) {
        console.log('❌ Articolo non trovato');
        continue;
      }
      
      console.log('✅ Articolo trovato');
      console.log('Title:', post.title);
      console.log('Excerpt:', post.excerpt);
      console.log('Author:', post.author);
      console.log('Status:', post.status);
      console.log('MainImage:', post.mainImage);
      console.log('Categories:', post.categories?.length || 0);
      console.log('FishingTechniques:', post.fishingTechniques?.length || 0);
      
      // Controlli di sicurezza
      const checks = {
        title: !!post.title,
        excerpt: !!post.excerpt,
        author: !!post.author,
        status: post.status === 'published'
      };
      
      console.log('Controlli:', checks);
      
      const allChecksPass = Object.values(checks).every(Boolean);
      console.log(allChecksPass ? '✅ Tutti i controlli passano' : '❌ Alcuni controlli falliscono');
      
    } catch (error) {
      console.error('Errore:', error);
    }
  }
}

compareArticles().catch(console.error);
