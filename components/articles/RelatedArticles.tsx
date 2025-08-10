import React from 'react';
import Link from 'next/link';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

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

interface RelatedArticlesProps {
  articles: Article[];
  currentArticleId: string;
}

export default function RelatedArticles({ articles, currentArticleId }: RelatedArticlesProps) {
  // Filter out current article and get up to 3 related articles
  const relatedArticles = articles
    .filter(article => article._id !== currentArticleId)
    .slice(0, 3);

  if (relatedArticles.length === 0) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Articoli Correlati
          </h2>
          <p className="text-xl text-gray-600">
            Continua a esplorare le tecniche di pesca sportiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedArticles.map((article) => (
            <Card key={article._id} variant="elevated" className="h-full">
              <Link href={`/articoli/${article.slug.current}`}>
                {/* Image */}
                <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
                  {article.mainImage?.asset?.url ? (
                    <img
                      src={article.mainImage.asset.url}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.categories && article.categories.length > 0 ? (
                      article.categories.slice(0, 2).map((category, index) => (
                        <Badge 
                          key={index} 
                          variant={index === 0 ? "primary" : "secondary"} 
                          size="sm"
                        >
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <>
                        <Badge variant="primary" size="sm">Tecnica</Badge>
                        <Badge variant="secondary" size="sm">Consigli</Badge>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                    {article.excerpt || 'Scopri i segreti e le tecniche per migliorare la tua pesca sportiva...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-primary-600 font-medium text-sm">
                      Leggi →
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/articoli"
            className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-200"
          >
            Vedi Tutti gli Articoli
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
