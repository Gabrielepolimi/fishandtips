import React from 'react';
import Badge from '../ui/Badge';

interface ArticleMetaProps {
  publishedAt?: string;
  author?: string;
  categories?: string[];
  readTime?: number;
}

export default function ArticleMeta({ 
  publishedAt, 
  author, 
  categories = [], 
  readTime = 5 
}: ArticleMetaProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
      {/* Published Date */}
      {publishedAt && (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{formatDate(publishedAt)}</span>
        </div>
      )}

      {/* Author */}
      {author && (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">di {author}</span>
        </div>
      )}

      {/* Read Time */}
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{readTime} min di lettura</span>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <div className="flex space-x-2">
            {categories.map((category, index) => (
              <Badge key={index} variant="primary" size="sm">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
