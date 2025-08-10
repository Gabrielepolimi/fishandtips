import { Nunito } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CookieBanner from '../components/layout/CookieBanner';
import GoogleAnalytics from '../components/analytics/GoogleAnalytics';
import { Metadata } from 'next';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito'
});

export const metadata: Metadata = {
  title: {
    default: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    template: '%s | FishandTips'
  },
  description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati. Blog di pesca con newsletter personalizzata per spinning, bolognese, feeder e molto altro.',
  keywords: [
    'pesca',
    'tecniche di pesca',
    'blog pesca',
    'consigli pesca',
    'spinning',
    'bolognese',
    'feeder',
    'carp fishing',
    'fly fishing',
    'pesca sportiva',
    'pesca in mare',
    'pesca in lago',
    'pesca in fiume',
    'attrezzatura pesca',
    'esche pesca',
    'spot pesca',
    'pesca italiana'
  ],
  authors: [{ name: 'FishandTips Team' }],
  creator: 'FishandTips',
  publisher: 'FishandTips',
  category: 'Sports',
  classification: 'Fishing Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fishandtips.it'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://fishandtips.it',
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione. Blog di pesca con newsletter personalizzata.',
    siteName: 'FishandTips',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FishandTips - Blog di pesca con consigli esperti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione.',
    images: ['/og-image.jpg'],
    creator: '@fishandtips',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'geo.region': 'IT',
    'geo.placename': 'Italy',
    'geo.position': '41.9028;12.4964',
    'ICBM': '41.9028, 12.4964',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FishandTips',
  url: 'https://fishandtips.it',
  description: 'Blog di pesca con consigli esperti e contenuti personalizzati',
  publisher: {
    '@type': 'Organization',
    name: 'FishandTips',
    logo: {
      '@type': 'ImageObject',
      url: 'https://fishandtips.it/images/icononly.png'
    }
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://fishandtips.it/articoli?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={nunito.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="alternate" type="application/rss+xml" title="FishandTips RSS Feed" href="/feed.xml" />
        
        {/* Google Analytics */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-nunito bg-white text-gray-800">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
