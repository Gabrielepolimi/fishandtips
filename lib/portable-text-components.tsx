import Image from 'next/image';
import type { PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../sanityClient';

export const articleProseClassName =
  'prose prose-lg sm:prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-p:mb-4 sm:prose-p:mb-6 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 sm:prose-img:my-8 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4 prose-ul:my-4 sm:prose-ul:my-6 prose-ol:my-4 sm:prose-ol:my-6 prose-li:text-base sm:prose-li:text-lg prose-li:mb-1 sm:prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-brand-blue prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:rounded-r-lg';

export const articlePortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (value?.asset) {
        const imageUrl = urlFor(value).url();
        return (
          <div className="my-6 sm:my-8">
            <Image
              src={imageUrl}
              alt={value.alt || value.caption || 'Immagine articolo'}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {value.caption && (
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">
                {value.caption}
              </p>
            )}
          </div>
        );
      }

      let imageUrl = '';
      if (typeof value === 'string') {
        imageUrl = value;
      } else if (value?.url) {
        imageUrl = value.url;
      } else if (value?.src) {
        imageUrl = value.src;
      }

      if (!imageUrl) return null;

      return (
        <div className="my-6 sm:my-8">
          <Image
            src={imageUrl}
            alt={value.alt || value.caption || 'Immagine articolo'}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {value.caption && (
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-10 mb-3 sm:mb-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-5 sm:mt-8 mb-2 sm:mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 sm:my-6 space-y-1 sm:space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 sm:my-6 space-y-1 sm:space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-base sm:text-lg text-gray-700 ml-3 sm:ml-4">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-base sm:text-lg text-gray-700 ml-3 sm:ml-4">{children}</li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 decoration-blue-400 hover:decoration-blue-600 transition-all duration-200 font-medium"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
};
