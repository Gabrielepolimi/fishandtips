import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/articoli',
          '/chi-siamo',
          '/contatti',
          '/registrazione',
          '/categoria/*',
          '/articoli/*',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
          '/newsletter/unsubscribe',
          '/articoli?search=*',
          '/favicon.ico',
          '/manifest.webmanifest',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://fishandtips.it/sitemap.xml',
    host: 'https://fishandtips.it',
  };
}
