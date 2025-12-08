import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import '../styles/globals.css'
import CookieBanner from '../components/layout/CookieBanner'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
  description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati. Blog di pesca con newsletter personalizzata per spinning, bolognese, feeder e molto altro.',
  authors: [{ name: 'FishandTips Team' }],
  manifest: '/manifest.webmanifest',
  keywords: 'pesca,tecniche di pesca,blog pesca,consigli pesca,spinning,bolognese,feeder,pesca sportiva,attrezzatura pesca,esche pesca,spot pesca',
  creator: 'FishandTips',
  publisher: 'FishandTips',
  robots: 'index, follow',
  category: 'Sports',
  classification: 'Fishing Blog',
  alternates: {
    canonical: 'https://fishandtips.it',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  verification: {
    google: 'i4LMv2IA4qtDXwenLVOI0BHEDsz0pVRjD_2wd',
  },
  openGraph: {
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione. Blog di pesca con newsletter personalizzata.',
    url: 'https://fishandtips.it',
    siteName: 'FishandTips',
    locale: 'it_IT',
    images: [
      {
        url: 'https://fishandtips.it/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FishandTips - Blog di pesca con consigli esperti',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@fishandtips',
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description: 'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione.',
    images: ['https://fishandtips.it/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="it" className={nunito.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="alternate" type="application/rss+xml" title="FishandTips RSS Feed" href="/feed.xml" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="i4LMv2IA4qtDXwenLVOI0BHEDsz0pVRjD_2wd" />
        
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HDF7MPV8ZB"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HDF7MPV8ZB');
            `,
          }}
        />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "FishandTips",
              "url": "https://fishandtips.it",
              "description": "Blog di pesca con consigli esperti e contenuti personalizzati",
              "publisher": {
                "@type": "Organization",
                "name": "FishandTips",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://fishandtips.it/images/icononly.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://fishandtips.it/articoli?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="font-nunito bg-white text-gray-800">
        <CookieBanner />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
