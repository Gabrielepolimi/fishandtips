import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spot Pesca Italia - I Migliori Luoghi dove Pescare | FishandTips',
  description: 'Scopri i migliori spot di pesca in Italia: Sardegna, Sicilia, Liguria, Puglia e tutte le regioni. Coordinate GPS, tecniche, specie, stagioni e consigli dei pescatori locali.',
  keywords: 'spot pesca italia, dove pescare, pesca sardegna, pesca sicilia, pesca liguria, pesca puglia, surfcasting italia, spinning mare italia, luoghi pesca, coordinate gps pesca',
  openGraph: {
    title: 'Spot Pesca Italia - I Migliori Luoghi dove Pescare',
    description: 'La guida definitiva agli spot di pesca italiani con coordinate GPS, tecniche e consigli.',
    type: 'website',
    url: 'https://fishandtips.it/spot-pesca-italia',
  },
  alternates: {
    canonical: 'https://fishandtips.it/spot-pesca-italia',
  },
};

export default function SpotPescaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


