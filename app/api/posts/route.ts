import { NextRequest, NextResponse } from 'next/server';
import client from '../../../sanityClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '12', 10), 1), 50);

    const total = await client.fetch(
      'count(*[_type == "post" && status == "published" && publishedAt <= now()])'
    );

    const posts = await client.fetch(
      `
      *[_type == "post" && status == "published" && publishedAt <= now()] 
      | order(publishedAt desc) [$start...$end]{
        _id,
        title,
        slug,
        mainImage{
          asset->{url}
        },
        publishedAt,
        "categories": categories[]->{title, "slug": slug.current},
        excerpt
      }
    `,
      { start: offset, end: offset + limit }
    );

    return NextResponse.json({ posts, total });
  } catch (error: any) {
    console.error('Errore API posts:', error);
    return NextResponse.json({ error: 'Errore nel recupero degli articoli' }, { status: 500 });
  }
}
