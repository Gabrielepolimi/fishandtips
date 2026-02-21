import type { Metadata } from 'next';
import HeroSection from '../components/home/HeroSection';
import FeaturedArticles from '../components/home/FeaturedArticles';
import NewsletterSection from '../components/home/NewsletterSection';
import CategoryArticles from '../components/home/CategoryArticles';
import { getPosts } from '../lib/getPosts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
  description:
    'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati. Blog di pesca con newsletter per spinning, bolognese, feeder e molto altro.',
  keywords:
    'pesca, tecniche di pesca, blog pesca, consigli pesca, spinning, bolognese, feeder, pesca sportiva',
  alternates: {
    canonical: 'https://fishandtips.it/',
  },
  openGraph: {
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description:
      'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione.',
    url: 'https://fishandtips.it/',
    siteName: 'FishandTips',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FishandTips - Consigli di Pesca Esperti e Personalizzati',
    description:
      'Scopri le migliori tecniche di pesca, consigli esperti e contenuti personalizzati per la tua passione.',
  },
};

export default async function HomePage() {
  const posts = await getPosts();
  
  // Definisco le categorie
  const categories = [
    { name: 'Tecniche di Pesca', slug: 'tecniche-di-pesca', color: 'blue' },
    { name: 'Attrezzature', slug: 'attrezzature', color: 'green' },
    { name: 'Consigli', slug: 'consigli', color: 'orange' },
    { name: 'Spot di Pesca', slug: 'spot-di-pesca', color: 'purple' }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedArticles articles={posts} />
      
      {/* Sezioni per categoria */}
      {categories.map((category) => (
        <CategoryArticles 
          key={category.slug}
          category={category}
          articles={posts}
        />
      ))}
      
      <NewsletterSection />
    </div>
  );
}
