import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset?: { url: string } };
  publishedAt?: string;
  author?: string;
  categories?: string[];
  excerpt?: string;
}

interface Category {
  name: string;
  slug: string;
  color: string;
}

interface CategoryArticlesProps {
  category: Category;
  articles: Article[];
}

export default function CategoryArticles({ category, articles }: CategoryArticlesProps) {
  // Filtra articoli per categoria
  const categoryArticles = articles.filter(article => 
    article.categories?.some(cat => 
      cat.toLowerCase().includes(category.slug.toLowerCase())
    )
  );

  // Se non ci sono articoli per questa categoria, non mostrare la sezione
  if (categoryArticles.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          hover: 'hover:text-blue-700'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          hover: 'hover:text-green-700'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          border: 'border-orange-200',
          hover: 'hover:text-orange-700'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-200',
          hover: 'hover:text-purple-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          hover: 'hover:text-gray-700'
        };
    }
  };

  const colors = getColorClasses(category.color);

  return (
    <section className={`py-16 ${colors.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Categoria */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h2>
            <p className="text-gray-600">
              Scopri i migliori articoli su {category.name.toLowerCase()}
            </p>
          </div>
          <Link href={`/categoria/${category.slug}`}>
            <button className={`${colors.text} ${colors.hover} font-semibold flex items-center gap-2 transition-colors`}>
              Vedi tutti
              <ChevronRight size={20} />
            </button>
          </Link>
        </div>

        {/* Articoli in Riga Orizzontale */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {categoryArticles.map((article) => (
            <article
              key={article._id}
              className="flex-shrink-0 w-80 group"
            >
              <Link href={`/articoli/${article.slug.current}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Immagine */}
                  <div className="relative h-48 overflow-hidden">
                    {article.mainImage?.asset?.url ? (
                      <Image
                        src={article.mainImage.asset.url}
                        alt={article.title}
                        width={320}
                        height={192}
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
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt || 'Scopri i segreti e le tecniche per migliorare la tua pesca sportiva...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className={`text-xs font-medium ${colors.text}`}>
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
  );
}
