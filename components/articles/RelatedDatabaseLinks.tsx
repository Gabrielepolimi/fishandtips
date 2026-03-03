import Link from 'next/link';
import type { RelatedLink } from '../../lib/extract-related-links';

export default function RelatedDatabaseLinks({ links }: { links: RelatedLink[] }) {
  if (!links || links.length === 0) return null;

  const icon = (type: RelatedLink['type']) => {
    switch (type) {
      case 'technique': return '🎣';
      case 'species': return '🐟';
      case 'region': return '📍';
      default: return '🔗';
    }
  };

  return (
    <section className="mt-10 py-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Approfondisci su FishandTips</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-brand-blue/10 hover:text-brand-blue transition text-sm"
            >
              <span>{icon(link.type)}</span>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
