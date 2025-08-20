import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '../../../lib/getPosts';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = [
    { slug: 'tecniche-di-pesca' },
    { slug: 'attrezzature' },
    { slug: 'consigli' },
    { slug: 'spot-di-pesca' }
  ];
  
  return categories;
}

// Disabilita il build statico per ora
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getPosts();
  
  // Filtra articoli per categoria - logica semplificata
  const categoryPosts = posts.filter(post => {
    if (!post.categories || post.categories.length === 0) return false;
    
    return post.categories.some(cat => {
      // Debug: log per vedere la struttura
      console.log('Category:', cat, 'Type:', typeof cat);
      
      if (typeof cat === 'object' && cat.slug) {
        return cat.slug === slug;
      }
      
      if (typeof cat === 'string') {
        const categorySlug = cat.toLowerCase().replace(/\s+/g, '-');
        const targetSlug = slug.toLowerCase();
        return categorySlug.includes(targetSlug) || targetSlug.includes(categorySlug);
      }
      
      return false;
    });
  });

  // Se non ci sono articoli per questa categoria, mostra 404
  if (categoryPosts.length === 0) {
    notFound();
  }

  const getCategoryInfo = (slug: string) => {
    switch (slug) {
      case 'tecniche-di-pesca':
        return {
          name: 'Tecniche di Pesca',
          description: 'Scopri le tecniche più efficaci per migliorare la tua pesca',
          color: 'blue'
        };
      case 'attrezzature':
        return {
          name: 'Attrezzature',
          description: 'Guide complete su canne, mulinelli, esche e accessori',
          color: 'green'
        };
      case 'consigli':
        return {
          name: 'Consigli Generali',
          description: 'Trucchi e segreti per diventare un pescatore esperto',
          color: 'orange'
        };
      case 'spot-di-pesca':
        return {
          name: 'Spot di Pesca',
          description: 'I migliori luoghi per pescare in Italia',
          color: 'purple'
        };
      default:
        return {
          name: 'Categoria',
          description: 'Articoli della categoria',
          color: 'gray'
        };
    }
  };

  const categoryInfo = getCategoryInfo(slug);
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          border: 'border-orange-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const colors = getColorClasses(categoryInfo.color);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`py-16 ${colors.bg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              ← Torna alla Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {categoryInfo.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {categoryInfo.description}
            </p>
            <div className="mt-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${colors.text} ${colors.bg} ${colors.border}`}>
                {categoryPosts.length} articoli
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Articoli */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <article key={post._id} className="group">
                <Link href={`/articoli/${post.slug.current}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Immagine */}
                    <div className="relative h-48 overflow-hidden">
                      {post.mainImage?.asset?.url ? (
                        <Image
                          src={post.mainImage.asset.url}
                          alt={post.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Contenuto */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.categories && post.categories.length > 0 ? (
                          post.categories.slice(0, 2).map((category, index) => (
                            <span 
                              key={index} 
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                index === 0 ? colors.text + ' ' + colors.bg : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {typeof category === 'object' ? category.title : category}
                            </span>
                          ))
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg}`}>
                            {categoryInfo.name}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || 'Scopri i segreti e le tecniche per migliorare la tua pesca sportiva...'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className={`text-sm font-medium ${colors.text}`}>
                          Leggi di più →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
