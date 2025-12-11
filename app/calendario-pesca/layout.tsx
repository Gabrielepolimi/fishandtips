import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendario Pesca 2025 - Cosa Pescare Mese per Mese | FishandTips',
  description: 'Scopri cosa pescare ogni mese nel Mediterraneo. Calendario pesca completo con specie attive, tecniche consigliate, esche migliori e condizioni ideali per spigola, orata, calamari, seppie e molto altro.',
  keywords: 'calendario pesca, cosa pescare, pesca mediterraneo, spigola quando pescare, stagione calamari, pesca mensile, calendario pescatore, quando pescare orata, periodo migliore pesca',
  openGraph: {
    title: 'Calendario Pesca 2025 - Cosa Pescare Mese per Mese',
    description: 'Scopri cosa pescare ogni mese nel Mediterraneo. Specie attive, tecniche e condizioni ideali.',
    type: 'website',
    url: 'https://fishandtips.it/calendario-pesca',
    images: [
      {
        url: 'https://fishandtips.it/images/calendario-pesca-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Calendario Pesca - FishandTips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendario Pesca 2025 - Cosa Pescare Mese per Mese',
    description: 'Scopri cosa pescare ogni mese nel Mediterraneo!',
  },
  alternates: {
    canonical: 'https://fishandtips.it/calendario-pesca',
  },
};

export default function CalendarioPescaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


