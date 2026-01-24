'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-brand-blue shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/icononly.png"
                alt="FishandTips Icon"
                width={50}
                height={50}
                className="h-12 w-12"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/articoli" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Articoli
              </Link>
              <Link href="/categoria/tecniche-di-pesca" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Categorie
              </Link>
              <Link href="/migliori-pesca-2026" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Migliori 2026
              </Link>
              <Link href="/pesci-mediterraneo" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Pesci
              </Link>
              <Link href="/spot-pesca-italia" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Spot
              </Link>
              <Link href="/calendario-pesca" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Calendario
              </Link>
              <Link href="/contatti" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contatti
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Cerca articoli..."
                className="w-full pl-10 pr-4 py-2 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Newsletter Button */}
          <div className="hidden md:block">
            <Link href="/registrazione">
              <Button variant="secondary" size="sm">
                Newsletter
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-brand-yellow hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-yellow"
            >
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-blue border-t border-white/20">
          <Link href="/" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link href="/articoli" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Articoli
          </Link>
          <Link href="/categoria/tecniche-di-pesca" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Categorie
          </Link>
          <Link href="/migliori-pesca-2026" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Migliori 2026
          </Link>
          <Link href="/pesci-mediterraneo" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Pesci
          </Link>
          <Link href="/spot-pesca-italia" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Spot
          </Link>
          <Link href="/calendario-pesca" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Calendario
          </Link>
          <Link href="/contatti" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Contatti
          </Link>
          
          {/* Mobile Search */}
          <div className="px-3 py-2">
            <input
              type="text"
              placeholder="Cerca articoli..."
              className="w-full pl-8 pr-4 py-2 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
            />
          </div>

          {/* Mobile Newsletter CTA */}
          <div className="px-3 py-2">
            <Link href="/registrazione">
              <Button variant="secondary" size="sm" className="w-full">
                Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
