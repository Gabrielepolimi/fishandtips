import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pesci del Mediterraneo - Guida Completa alle Specie | FishandTips',
  description: 'Scopri tutti i pesci del Mediterraneo italiano: spigola, orata, sarago, dentice, calamaro, seppia e molte altre specie. Guida completa con tecniche di pesca, esche migliori, stagioni e consigli per catturarli.',
  keywords: 'pesci mediterraneo, pesci mare italia, spigola, orata, sarago, dentice, calamaro, seppia, serra, leccia, ricciola, come pescare, guida pesca mare, pesci italiani',
  openGraph: {
    title: 'Pesci del Mediterraneo - Guida Completa alle Specie',
    description: 'Scopri tutti i pesci del Mediterraneo: caratteristiche, tecniche di pesca e stagioni migliori.',
    type: 'website',
    url: 'https://fishandtips.it/pesci-mediterraneo',
  },
  alternates: {
    canonical: 'https://fishandtips.it/pesci-mediterraneo',
  },
};

export default function PesciMediterraneoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
