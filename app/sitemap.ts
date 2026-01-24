import { MetadataRoute } from 'next';
import { sanityClient } from '../sanityClient';

// Cache la sitemap per 1h per evitare richieste continue a Sanity
export const revalidate = 3600;

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

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => (category.postCount || 0) > 0)
    .map((category) => ({
      url: `${baseUrl}/categoria/${category.slug}`,
      lastModified: category._updatedAt ? new Date(category._updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const articlePages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/articoli/${post.slug}`,
    lastModified: post._updatedAt ? new Date(post._updatedAt) : post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
