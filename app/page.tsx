import HeroSection from '../components/home/HeroSection';
import FeaturedArticles from '../components/home/FeaturedArticles';
import NewsletterSection from '../components/home/NewsletterSection';
import CategoryArticles from '../components/home/CategoryArticles';
import { getPosts } from '../lib/getPosts';

export default async function HomePage() {
  const posts = await getPosts();
  
  // Definisco le categorie
  const categories = [
    { name: 'Tecniche', slug: 'tecniche', color: 'blue' },
    { name: 'Attrezzature', slug: 'attrezzature', color: 'green' },
    { name: 'Consigli', slug: 'consigli', color: 'orange' },
    { name: 'Spot', slug: 'spot', color: 'purple' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
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
