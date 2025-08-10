import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/background.jpg"
          alt="Fishing background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay per leggibilità del testo */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8">
          <Image
            src="/images/grayscale_transparent.png"
            alt="FishandTips Logo"
            width={600}
            height={200}
            className="max-w-full h-auto mx-auto drop-shadow-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}
