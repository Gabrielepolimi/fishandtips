import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/studio/',
          '/_next/',
          '/newsletter/disiscrizione',
          '/*?search=',
          '/*&search=',
          '/*?q=',
          '/*&q=',
          '/*?filter=',
          '/*&filter=',
        ],
      },
    ],
    sitemap: 'https://fishandtips.it/sitemap.xml',
    host: 'https://fishandtips.it',
  };
}
