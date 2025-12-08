import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'I Migliori della Pesca 2025 | Selezione Ufficiale FishandTips',
  description: 'Candidati per entrare nella selezione ufficiale dei migliori negozi, charter e scuole di pesca in Italia. Visibilità gratuita e permanente.',
  keywords: ['migliori negozi pesca', 'charter pesca Italia', 'scuole pesca', 'pesca sportiva Italia', 'negozi pesca online'],
  openGraph: {
    title: '🏆 I Migliori della Pesca 2025 | FishandTips',
    description: 'Candidati per entrare nella selezione ufficiale. Solo 30 posti disponibili!',
    type: 'website',
  },
};

export default function MiglioriPescaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

