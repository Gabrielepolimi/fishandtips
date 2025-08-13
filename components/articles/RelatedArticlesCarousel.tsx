'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient } from '../../sanityClient';

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
  currentArticleId: string;
}

export default function RelatedArticlesCarousel({ currentArticleId }: RelatedArticlesCarouselProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles for:', currentArticleId);
        const query = `
          *[_type == "post" && status == "published" && _id != $currentId] | order(publishedAt desc) [0...6] {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "mainImage": mainImage.asset->url,
            publishedAt,
            "author": author->name,
            readingTime
          }
        `;
        
        const result = await sanityClient.fetch(query, { currentId: currentArticleId });
        console.log('Fetched articles:', result);
        setArticles(result);
      } catch (error) {
        console.error('Error fetching related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentArticleId]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, articles.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, articles.length - 2)) % Math.max(1, articles.length - 2));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Altri Articoli</h2>
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 sm:w-96 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Altri Articoli</h2>
      
      <div className="relative">
        {/* Carousel container */}
        <div className="flex space-x-6 overflow-hidden">
          {articles.slice(currentIndex, currentIndex + 3).map((article) => (
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

        {/* Navigation buttons */}
        {articles.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Articolo precedente"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
              aria-label="Articolo successivo"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots indicator */}
        {articles.length > 3 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, articles.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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
