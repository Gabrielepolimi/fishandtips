import React from 'react';
import Link from 'next/link';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

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

interface FeaturedArticlesProps {
  articles: Article[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Se non ci sono articoli, mostra un messaggio
  if (!articles || articles.length === 0) {
    return (
      <section id="articoli" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Articoli in Evidenza
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scopri le tecniche più efficaci e i consigli degli esperti per migliorare la tua pesca
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun articolo disponibile</h3>
              <p className="text-gray-600 mb-6">
                Gli articoli saranno presto disponibili. Torna presto per scoprire i nostri consigli sulla pesca!
              </p>
              <Button variant="primary" size="lg">
                Iscriviti alla Newsletter
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articoli" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Articoli in Evidenza
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri le tecniche più efficaci e i consigli degli esperti per migliorare la tua pesca
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.slice(0, 6).map((article) => (
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
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || 'Scopri i segreti e le tecniche per migliorare la tua pesca sportiva...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="text-primary-600 font-medium text-sm">
                      Leggi di più →
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/articoli">
            <Button variant="primary" size="lg" className="text-lg px-8 py-4">
              Vedi Tutti gli Articoli
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
