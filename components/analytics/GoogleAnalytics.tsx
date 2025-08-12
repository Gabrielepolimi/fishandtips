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
    
    // Imposta il consenso di default a "denied"
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });

    // Configura Google Analytics
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Funzione per aggiornare il consenso
    const updateConsent = () => {
      const cookieConsent = localStorage.getItem('cookieConsent');
      if (cookieConsent === 'all') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        });
        // Invia pageview dopo aver aggiornato il consenso
        gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    };

    // Controlla il consenso iniziale
    updateConsent();

    // Ascolta i cambiamenti di localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent') {
        updateConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      document.head.removeChild(script);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [measurementId]);

  // Non renderizza nulla nel DOM
  return null;
}
