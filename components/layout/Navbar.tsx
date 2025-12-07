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
              <Link href="/trova-attrezzatura" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Quiz Attrezzatura
              </Link>
              <Link href="/calendario-pesca" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Calendario
              </Link>
              <Link href="/chi-siamo" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Chi Siamo
              </Link>
              <Link href="/contatti" className="text-white hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contatti
              </Link>
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
          <Link href="/trova-attrezzatura" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Quiz Attrezzatura
          </Link>
          <Link href="/calendario-pesca" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Calendario
          </Link>
          <Link href="/chi-siamo" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Chi Siamo
          </Link>
          <Link href="/contatti" className="text-white hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium">
            Contatti
          </Link>

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
