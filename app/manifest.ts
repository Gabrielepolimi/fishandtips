import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FishandTips - Consigli di Pesca Esperti',
    short_name: 'FishandTips',
    description: 'Blog di pesca con consigli esperti e contenuti personalizzati',
    start_url: '/',
    display: 'standalone',
    background_color: '#134D85',
    theme_color: '#134D85',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'it',
    categories: ['sports', 'education', 'lifestyle'],
    icons: [
      {
        src: '/images/icononly.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icononly.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
      },
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
    ],
    shortcuts: [
      {
        name: 'Articoli',
        short_name: 'Articoli',
        description: 'Vedi tutti gli articoli',
        url: '/articoli',
        icons: [
          {
            src: '/images/icononly.png',
            sizes: '96x96',
          },
        ],
      },
      {
        name: 'Newsletter',
        short_name: 'Newsletter',
        description: 'Iscriviti alla newsletter',
        url: '/registrazione',
        icons: [
          {
            src: '/images/icononly.png',
            sizes: '96x96',
          },
        ],
      },
    ],
  };
}
