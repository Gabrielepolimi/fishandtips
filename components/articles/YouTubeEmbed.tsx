'use client';

import { useState } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Estrae l'ID del video da URL YouTube
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Se viene passato un URL completo, estrae l'ID
  const videoIdFromUrl = videoId.includes('youtube.com') || videoId.includes('youtu.be') 
    ? extractVideoId(videoId) 
    : videoId;

  if (!videoIdFromUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-600">Video YouTube non disponibile</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoIdFromUrl}?rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&fs=1&cc_load_policy=0&start=0&end=0&autoplay=0&mute=0&loop=0`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoIdFromUrl}/maxresdefault.jpg`;

  return (
    <div className={`youtube-embed-container ${className}`}>
      {/* Preload ottimizzato per SEO */}
      <link rel="preload" as="image" href={thumbnailUrl} />
      
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Clicca per riprodurre il video</p>
            </div>
          </div>
        )}
        
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={embedUrl}
          title={title || 'Video YouTube'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    </div>
  );
}
