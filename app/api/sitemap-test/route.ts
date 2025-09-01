import { NextResponse } from 'next/server';
import { sanityClient } from '../../../sanityClient';

export async function GET() {
  try {
    // Test della connessione a Sanity
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && publishedAt <= $now] {
        slug,
        publishedAt,
        _updatedAt,
        title,
        status
      } | order(publishedAt desc)
    `, { now: new Date().toISOString() });

    // Test della generazione sitemap
    const baseUrl = 'https://fishandtips.it';
    const now = new Date();
    
    const staticPages = [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/articoli`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];

    const postPages = posts.map((post: any) => {
      let slug = '';
      
      if (typeof post.slug === 'string') {
        slug = post.slug;
      } else if (post.slug && typeof post.slug === 'object' && post.slug.current) {
        slug = post.slug.current;
      } else {
        slug = post.title ? post.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim() : 'articolo';
      }
      
      if (!slug || slug.trim() === '') {
        slug = 'articolo';
      }
      
      if (slug.length > 100) {
        slug = slug.substring(0, 100).replace(/-$/, '');
      }

      return {
        url: `${baseUrl}/articoli/${slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    }).filter((page: any) => {
      return page.url && 
             page.url.length < 2048 &&
             !page.url.includes('\n') && 
             !page.url.includes('\r') &&
             page.url.startsWith('https://');
    });

    const allPages = [...staticPages, ...postPages];

    return NextResponse.json({
      success: true,
      message: 'Sitemap test completato con successo',
      data: {
        totalPages: allPages.length,
        staticPages: staticPages.length,
        dynamicPages: postPages.length,
        samplePages: allPages.slice(0, 3),
        sanityConnection: 'OK',
        postsFound: posts.length,
        allPosts: posts
      }
    });

  } catch (error) {
    console.error('Errore nel test sitemap:', error);
    return NextResponse.json({
      success: false,
      message: 'Errore nel test sitemap',
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    }, { status: 500 });
  }
}
