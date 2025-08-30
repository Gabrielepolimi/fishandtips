import { NextResponse } from 'next/server';
import { sanityClient } from '../../../sanityClient';

export async function GET() {
  try {
    // Query 1: Tutti gli articoli con status published
    const allPublished = await sanityClient.fetch(`
      *[_type == "post" && status == "published"] {
        title,
        slug,
        publishedAt,
        _updatedAt,
        status
      } | order(publishedAt desc)
    `);

    // Query 2: Articoli con date passate
    const pastArticles = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && publishedAt <= $now] {
        title,
        slug,
        publishedAt,
        _updatedAt,
        status
      } | order(publishedAt desc)
    `, { now: new Date().toISOString() });

    // Query 3: Tutti gli articoli (senza filtri)
    const allArticles = await sanityClient.fetch(`
      *[_type == "post"] {
        title,
        slug,
        publishedAt,
        _updatedAt,
        status
      } | order(publishedAt desc)
    `);

    return NextResponse.json({
      success: true,
      data: {
        totalArticles: allArticles.length,
        publishedArticles: allPublished.length,
        pastArticles: pastArticles.length,
        allArticles: allArticles,
        publishedArticles: allPublished,
        pastArticles: pastArticles
      }
    });
  } catch (error) {
    console.error('Errore nel debug articoli:', error);
    return NextResponse.json({
      success: false,
      message: 'Errore nel debug articoli',
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    }, { status: 500 });
  }
}
