'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

export default function LikeButton({ articleId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Controlla se l'utente ha già messo like e calcola il contatore corretto
  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem('fishandtips_liked_articles') || '[]');
    const userHasLiked = likedArticles.includes(articleId);
    setIsLiked(userHasLiked);
    
    // Calcola il contatore corretto: like iniziali + like dell'utente
    const userLikes = userHasLiked ? 1 : 0;
    setLikes(initialLikes + userLikes);
  }, [articleId, initialLikes]);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const likedArticles = JSON.parse(localStorage.getItem('fishandtips_liked_articles') || '[]');
      
      if (isLiked) {
        // Rimuovi like
        const newLikedArticles = likedArticles.filter((id: string) => id !== articleId);
        localStorage.setItem('fishandtips_liked_articles', JSON.stringify(newLikedArticles));
        setLikes(initialLikes); // Torna ai like iniziali
        setIsLiked(false);
      } else {
        // Aggiungi like
        const newLikedArticles = [...likedArticles, articleId];
        localStorage.setItem('fishandtips_liked_articles', JSON.stringify(newLikedArticles));
        setLikes(initialLikes + 1); // Like iniziali + 1
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nascondi il contatore quando non c'è traffico reale (initialLikes 0 e nessun like utente)
  const showCounter = initialLikes > 0 || likes > 0;

  return (
    <div className="flex items-center space-x-3">
      {showCounter && (
        <span className="text-sm text-gray-600 font-medium">
          Utenti che apprezzano questo contenuto:
        </span>
      )}
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
          isLiked 
            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
            : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label={isLiked ? 'Rimuovi like' : 'Metti like'}
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-200 ${
            isLiked ? 'fill-red-600 text-red-600' : 'text-gray-600'
          }`} 
        />
        {showCounter && (
          <span className="font-medium">
            {Math.max(0, likes)}
          </span>
        )}
      </button>
    </div>
  );
}
