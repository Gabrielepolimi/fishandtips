'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già fatto una scelta sui cookie
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    setShowBanner(false);
    // Abilita Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
      // Invia evento di consenso
      window.gtag('event', 'cookie_consent', {
        'event_category': 'engagement',
        'event_label': 'accepted_all'
      });
    }
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential');
    setShowBanner(false);
    // Mantiene Google Analytics disabilitato
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
      // Invia evento di consenso essenziale
      window.gtag('event', 'cookie_consent', {
        'event_category': 'engagement',
        'event_label': 'essential_only'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Utilizziamo i cookie per migliorare la tua esperienza su FishandTips. 
              Continuando a navigare, accetti la nostra{' '}
              <Link href="/cookie-policy" className="text-brand-blue hover:text-brand-blue-dark underline">
                Cookie Policy
              </Link>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={acceptEssential}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Solo Essenziali
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue-light transition-colors"
            >
              Accetta Tutti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
