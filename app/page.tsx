import HeroSection from '../components/home/HeroSection';
import FeaturedArticles from '../components/home/FeaturedArticles';
import NewsletterSection from '../components/home/NewsletterSection';
import CategoryArticles from '../components/home/CategoryArticles';
import { getPosts } from '../lib/getPosts';

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
