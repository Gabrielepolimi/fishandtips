'use client';

import { useEffect } from 'react';

interface GoogleSearchConsoleProps {
  verificationCode?: string;
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  useEffect(() => {
    // Aggiungi il meta tag per Google Search Console se il codice è fornito
    if (verificationCode) {
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-site-verification';
      metaTag.content = verificationCode;
      document.head.appendChild(metaTag);

      console.log('Google Search Console meta tag aggiunto:', verificationCode);

      // Cleanup
      return () => {
        const existingTag = document.querySelector('meta[name="google-site-verification"]');
        if (existingTag) {
          document.head.removeChild(existingTag);
        }
      };
    }
  }, [verificationCode]);

  // Non renderizza nulla nel DOM
  return null;
}







