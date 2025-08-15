'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: string;
  publishedAt: string;
  author: string;
  readingTime?: number;
}

interface RelatedArticlesCarouselProps {
  articles: Article[];
}

export default function RelatedArticlesCarousel({ articles }: RelatedArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Numero di articoli da mostrare per volta
  const itemsPerView = 3;
  const maxIndex = Math.max(0, articles.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (articles.length === 0) {
    return (
      <div className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Altri Articoli</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Non ci sono altri articoli disponibili al momento.</p>
          <p className="text-gray-400 text-sm mt-2">Torna presto per nuovi contenuti!</p>
        </div>
      </div>
    );
  }

  // Se abbiamo meno articoli del numero per vista, mostriamo tutti
  const articlesToShow = articles.length <= itemsPerView 
    ? articles 
    : articles.slice(currentIndex, currentIndex + itemsPerView);

  console.log('🎠 Carousel state:', {
    articlesCount: articles.length,
    currentIndex,
    maxIndex,
    itemsPerView,
    articlesToShowCount: articlesToShow.length
  });

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Altri Articoli</h2>
      
      <div className="relative">
        {/* Carousel container */}
        <div className="flex space-x-6 overflow-hidden">
          {articlesToShow.map((article) => (
            <div key={article._id} className="flex-shrink-0 w-80 sm:w-96">
              <Link href={`/articoli/${article.slug}`} className="group">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  {article.mainImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.mainImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <span className="font-medium">di {article.author}</span>
                      <div className="flex items-center space-x-2">
                        <span>{formatDate(article.publishedAt)}</span>
                        {article.readingTime && (
                          <>
                            <span>•</span>
                            <span>{article.readingTime} min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation buttons - solo se abbiamo più articoli del numero per vista */}
        {articles.length > itemsPerView && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10 ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              aria-label="Articolo precedente"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10 ${
                currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
              }`}
              aria-label="Articolo successivo"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator - solo se abbiamo più articoli del numero per vista */}
        {articles.length > itemsPerView && maxIndex > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
                }`}
                aria-label={`Vai al gruppo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
