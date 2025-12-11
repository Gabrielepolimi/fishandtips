import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trova Attrezzatura da Pesca - Quiz Personalizzato | FishandTips',
  description: 'Scopri quale attrezzatura da pesca fa per te! Rispondi a 3 semplici domande e ricevi consigli personalizzati su canne, mulinelli, fili ed accessori per spinning, surfcasting, bolognese, eging e feeder.',
  keywords: 'attrezzatura pesca, canna da pesca, mulinello, spinning, surfcasting, bolognese, eging, feeder, quale canna comprare, migliore attrezzatura pesca, kit pesca principianti',
  openGraph: {
    title: 'Trova Attrezzatura da Pesca - Quiz Personalizzato',
    description: 'Scopri quale attrezzatura da pesca fa per te! Rispondi a 3 semplici domande e ricevi consigli personalizzati.',
    type: 'website',
    url: 'https://fishandtips.it/trova-attrezzatura',
    images: [
      {
        url: 'https://fishandtips.it/images/quiz-attrezzatura-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Quiz Attrezzatura da Pesca - FishandTips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trova Attrezzatura da Pesca - Quiz Personalizzato',
    description: 'Scopri quale attrezzatura da pesca fa per te!',
  },
  alternates: {
    canonical: 'https://fishandtips.it/trova-attrezzatura',
  },
};

export default function TrovaAttrezzaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


