import { sanityClient } from '../../sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && publishedAt <= $now] | order(publishedAt desc)[0...20] {
        title,
        slug,
        excerpt,
        publishedAt,
        "author": author->name,
        "mainImage": mainImage.asset->url
      }
    `, { now: new Date().toISOString() });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FishandTips - Blog di Pesca</title>
    <atom:link href="https://fishandtips.it/feed.xml" rel="self" type="application/rss+xml" />
    <link>https://fishandtips.it</link>
    <description>Consigli di pesca esperti e personalizzati. Scopri tecniche, attrezzature e spot di pesca.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>it-IT</language>
    <category>Sports</category>
    <image>
      <url>https://fishandtips.it/images/icononly.png</url>
      <title>FishandTips</title>
      <link>https://fishandtips.it</link>
    </image>
    ${posts.map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://fishandtips.it/articoli/${post.slug}</link>
      <guid>https://fishandtips.it/articoli/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.author}</author>
      ${post.mainImage ? `<enclosure url="${post.mainImage}" type="image/jpeg" />` : ''}
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Errore nella generazione RSS feed:', error);
    return new NextResponse('Errore interno del server', { status: 500 });
  }
}
