import { NextResponse } from 'next/server';
import { sanityClient } from '../../../sanityClient';

export async function GET() {
  try {
    // Testiamo alcuni articoli esistenti per vedere come sono salvati i seoKeywords
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published"] | order(publishedAt desc) [0...5] {
        _id,
        title,
        "slug": slug.current,
        seoKeywords,
        seoTitle,
        seoDescription
      }
    `);

    return NextResponse.json({
      success: true,
      message: 'Test SEO keywords completato',
      data: {
        totalPosts: posts.length,
        posts: posts.map(post => ({
          title: post.title,
          slug: post.slug,
          seoKeywords: post.seoKeywords,
          seoKeywordsType: typeof post.seoKeywords,
          isArray: Array.isArray(post.seoKeywords),
          seoKeywordsLength: Array.isArray(post.seoKeywords) ? post.seoKeywords.length : 'N/A',
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription
        }))
      }
    });

  } catch (error) {
    console.error('Errore nel test SEO keywords:', error);
    return NextResponse.json({
      success: false,
      message: 'Errore nel test SEO keywords',
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    }, { status: 500 });
  }
}
