import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enciclopedia Pesci Italia - Guida Completa alle Specie | FishandTips',
  description: 'Enciclopedia completa dei pesci del Mediterraneo italiano. Scopri caratteristiche, habitat, tecniche di pesca, esche migliori e stagioni per catturare spigola, orata, sarago, dentice, calamari e molte altre specie.',
  keywords: 'enciclopedia pesci, pesci mediterraneo, pesci italia, spigola, orata, sarago, dentice, calamaro, seppia, serra, leccia, ricciola, come pescare, guida pesca',
  openGraph: {
    title: 'Enciclopedia Pesci Italia - Guida Completa',
    description: 'Scopri tutte le specie del Mediterraneo: caratteristiche, tecniche e stagioni migliori.',
    type: 'website',
    url: 'https://fishandtips.it/enciclopedia-pesci',
  },
  alternates: {
    canonical: 'https://fishandtips.it/enciclopedia-pesci',
  },
};

export default function EnciclopediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

