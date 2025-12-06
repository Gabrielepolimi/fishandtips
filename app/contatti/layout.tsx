import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contatti - FishandTips | Scrivici per Consigli di Pesca',
  description: 'Contatta FishandTips per consigli di pesca personalizzati, domande su tecniche e attrezzature. Il nostro team di esperti è qui per aiutarti.',
  keywords: 'contatti pesca, consigli pesca personalizzati, domande pesca, supporto pesca, FishandTips contatti',
  openGraph: {
    title: 'Contatti - FishandTips | Scrivici per Consigli di Pesca',
    description: 'Contatta FishandTips per consigli di pesca personalizzati, domande su tecniche e attrezzature.',
    type: 'website',
    url: 'https://fishandtips.it/contatti',
    images: [
      {
        url: 'https://fishandtips.it/images/fotocontatti.jpg',
        width: 1200,
        height: 630,
        alt: 'Contatti FishandTips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contatti - FishandTips | Scrivici per Consigli di Pesca',
    description: 'Contatta FishandTips per consigli di pesca personalizzati, domande su tecniche e attrezzature.',
    images: ['https://fishandtips.it/images/fotocontatti.jpg'],
  },
  alternates: {
    canonical: 'https://fishandtips.it/contatti',
  },
};

export default function ContattiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}







