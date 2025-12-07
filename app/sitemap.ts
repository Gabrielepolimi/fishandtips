import { MetadataRoute } from 'next';
import { sanityClient } from '../sanityClient';
import fishData from '../data/fish-encyclopedia.json';
import spotsData from '../data/fishing-spots.json';

interface Article {
  slug: { current: string };
  _updatedAt: string;
}

interface Category {
  slug: { current: string };
  _updatedAt: string;
}

interface FishSpecies {
  slug: string;
}

interface Region {
  id: string;
  spots: { id: string }[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fishandtips.it';
  const currentDate = new Date().toISOString();

  // Fetch articles from Sanity
  let articles: Article[] = [];
  let categories: Category[] = [];
  
  try {
    articles = await sanityClient.fetch<Article[]>(`
      *[_type == "post" && defined(slug.current)] | order(_updatedAt desc) {
        slug,
        _updatedAt
      }
    `);
    
    categories = await sanityClient.fetch<Category[]>(`
      *[_type == "category" && defined(slug.current)] {
        slug,
        _updatedAt
      }
    `);
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/articoli`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trova-attrezzatura`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calendario-pesca`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pesci-mediterraneo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/spot-pesca-italia`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/chi-siamo`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mappa-del-sito`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articoli/${article.slug.current}`,
    lastModified: article._updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categoria/${category.slug.current}`,
    lastModified: category._updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fish encyclopedia pages
  const fishPages: MetadataRoute.Sitemap = (fishData.fish as FishSpecies[]).map((fish) => ({
    url: `${baseUrl}/pesci-mediterraneo/${fish.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Fishing spots - Region pages
  const regionPages: MetadataRoute.Sitemap = (spotsData.regions as Region[]).map((region) => ({
    url: `${baseUrl}/spot-pesca-italia/${region.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fishing spots - Individual spot pages
  const spotPages: MetadataRoute.Sitemap = (spotsData.regions as Region[]).flatMap((region) =>
    region.spots.map((spot) => ({
      url: `${baseUrl}/spot-pesca-italia/${region.id}/${spot.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [
    ...staticPages,
    ...articlePages,
    ...categoryPages,
    ...fishPages,
    ...regionPages,
    ...spotPages,
  ];
}

