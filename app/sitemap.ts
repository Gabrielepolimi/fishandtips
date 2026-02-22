import { MetadataRoute } from 'next';
import { sanityClient } from '../sanityClient';
import fishData from '../data/fish-encyclopedia.json';
import spotsData from '../data/fishing-spots.json';
import techniquesData from '../data/fishing-techniques.json';

// Cache la sitemap per 1h per evitare richieste continue a Sanity
export const revalidate = 3600;

// Slug da escludere: pagine 404 o con redirect (non indicizzare in sitemap)
const EXCLUDED_ARTICLE_SLUGS = new Set([
  'pesca-alla-seppia-tecniche-periodi-migliori-e-consigli-pratici', // 404
  'montature-surfcasting-guida-completa-con-le-mie-configurazioni-vincenti', // redirect → /articoli
  // Fluorocarbon: duplicati → guida unica fluorocarbon-guida-definitiva-alla-scelta-perfetta
  'fluorocarbon-invernale-come-non-far-fallire-lamo',
  'come-scegliere-il-fluorocarbon-perfetto',
  'fluorocarbon-invernale-terminali-invisibili',
  'fluorocarbon-inverno-terminali-invisibili-al-top',
  'come-scegliere-il-fluorocarbon-per-i-terminali-invernali',
]);

// Categorie con redirect in vercel.json: in sitemap usiamo l’URL finale (canonico)
const CATEGORY_SLUG_REDIRECTS: Record<string, string> = {
  spot: 'spot-di-pesca',
  tecniche: 'tecniche-di-pesca',
};

type PostForSitemap = {
  slug: string;
  publishedAt?: string;
  _updatedAt?: string;
};

type CategoryForSitemap = {
  slug: string;
  _updatedAt?: string;
  postCount?: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishandtips.it';
  const now = new Date();

  const [posts = [], categories = []] = await Promise.all([
    sanityClient
      .fetch<PostForSitemap[]>(
        `
        *[_type == "post" && status == "published" && defined(slug.current) && publishedAt <= now()] {
          "slug": slug.current,
          publishedAt,
          _updatedAt
        }
      `,
      )
      .catch((err) => {
        console.error('Errore fetch articoli per sitemap:', err);
        return [];
      }),
    sanityClient
      .fetch<CategoryForSitemap[]>(
        `
        *[_type == "category" && defined(slug.current)]{
          "slug": slug.current,
          _updatedAt,
          "postCount": count(*[_type == "post" && status == "published" && references(^._id)])
        }
      `,
      )
      .catch((err) => {
        console.error('Errore fetch categorie per sitemap:', err);
        return [];
      }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/articoli`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/editorial-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const seenCategoryUrls = new Set<string>();
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => (category.postCount || 0) > 0)
    .map((category) => {
      const canonicalSlug = CATEGORY_SLUG_REDIRECTS[category.slug] ?? category.slug;
      return {
        url: `${baseUrl}/categoria/${canonicalSlug}`,
        lastModified: category._updatedAt ? new Date(category._updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    })
    .filter((entry) => {
      if (seenCategoryUrls.has(entry.url)) return false;
      seenCategoryUrls.add(entry.url);
      return true;
    });

  const articlePages: MetadataRoute.Sitemap = posts
    .filter((post) => !EXCLUDED_ARTICLE_SLUGS.has(post.slug))
    .map((post) => ({
    url: `${baseUrl}/articoli/${post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const fishListingPage: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/pesci-mediterraneo`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const fishPages: MetadataRoute.Sitemap = (fishData as any).fish.map((fish: any) => ({
    url: `${baseUrl}/pesci-mediterraneo/${fish.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const calendarMonths = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
  ];

  const calendarListingPage: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/calendario-pesca`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const calendarPages: MetadataRoute.Sitemap = calendarMonths.map((mese) => ({
    url: `${baseUrl}/calendario-pesca/${mese}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const spotsListingPage: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/spot-pesca-italia`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const spotRegionPages: MetadataRoute.Sitemap = (spotsData as any).regions.map((r: any) => ({
    url: `${baseUrl}/spot-pesca-italia/${r.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const spotDetailPages: MetadataRoute.Sitemap = (spotsData as any).regions.flatMap((r: any) =>
    r.spots.map((s: any) => ({
      url: `${baseUrl}/spot-pesca-italia/${r.id}/${s.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  const techniquesListingPage: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tecniche`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const techniquePages: MetadataRoute.Sitemap = techniquesData.techniques.map((t: any) => ({
    url: `${baseUrl}/tecniche/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categoryPages, ...articlePages, ...fishListingPage, ...fishPages, ...calendarListingPage, ...calendarPages, ...spotsListingPage, ...spotRegionPages, ...spotDetailPages, ...techniquesListingPage, ...techniquePages];
}
