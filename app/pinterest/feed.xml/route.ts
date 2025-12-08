import { NextResponse } from 'next/server';
import pinsData from '../../../data/pinterest-pins.json';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const pins = pinsData.pins.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const rssItems = pins.map(pin => `
    <item>
      <title><![CDATA[${pin.title}]]></title>
      <link>${pin.link}</link>
      <guid isPermaLink="false">${pin.id}</guid>
      <pubDate>${new Date(pin.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${pin.description}]]></description>
      <enclosure url="${pin.imageUrl}" type="image/png" length="0"/>
      <media:content 
        url="${pin.imageUrl}" 
        type="image/png" 
        medium="image"
        width="1000"
        height="1500"
      />
      <media:thumbnail url="${pin.imageUrl}" width="1000" height="1500"/>
      <category>${pin.board}</category>
    </item>
  `).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
  <channel>
    <title>FishandTips - Pin di Pesca Sportiva</title>
    <link>https://fishandtips.it/pinterest</link>
    <description>Pin di pesca sportiva ottimizzati per Pinterest: tecniche, spot, attrezzature e consigli per pescatori italiani.</description>
    <language>it-IT</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://fishandtips.it/pinterest/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://fishandtips.it/logo.png</url>
      <title>FishandTips</title>
      <link>https://fishandtips.it</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

