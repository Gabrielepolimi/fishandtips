'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    // Carica Google Analytics solo se l'ID è valido
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.warn('Google Analytics ID non configurato');
      return;
    }

    // Carica lo script di Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Inizializza gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    
    // Configura Google Analytics direttamente (senza consenso)
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log('Google Analytics caricato con ID:', measurementId);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [measurementId]);

  // Non renderizza nulla nel DOM
  return null;
}
