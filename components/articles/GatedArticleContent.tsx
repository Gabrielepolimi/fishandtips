'use client';

import { PortableText } from '@portabletext/react';
import type { TypedObject } from '@portabletext/types';
import { useCallback, useEffect, useState } from 'react';
import type { ArticleGateConfig } from '../../lib/article-gate-config';
import {
  articlePortableTextComponents,
  articleProseClassName,
} from '../../lib/portable-text-components';
import ContentGate from './ContentGate';

type GatedArticleContentProps = {
  gateConfig: ArticleGateConfig;
  previewBlocks: TypedObject[];
  gatedBlocks: TypedObject[];
};

export default function GatedArticleContent({
  gateConfig,
  previewBlocks,
  gatedBlocks,
}: GatedArticleContentProps) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(gateConfig.storageKey) === '1') {
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, [gateConfig.storageKey]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  const hasGatedContent = gatedBlocks.length > 0;
  const showPreview = previewBlocks.length > 0;
  const isInline = gateConfig.inlineCta;

  return (
    <>
      {showPreview && (
        <div className={articleProseClassName}>
          <PortableText value={previewBlocks} components={articlePortableTextComponents} />
        </div>
      )}

      {!unlocked && (
        <ContentGate gateConfig={gateConfig} onSuccess={handleUnlock} />
      )}

      {hasGatedContent && (
        <div
          className={isInline || unlocked ? articleProseClassName : 'sr-only'}
          aria-hidden={!isInline && !unlocked}
        >
          <PortableText value={gatedBlocks} components={articlePortableTextComponents} />
        </div>
      )}

      {!isInline && (
        <noscript>
          {hasGatedContent && (
            <div className={articleProseClassName}>
              <PortableText value={gatedBlocks} components={articlePortableTextComponents} />
            </div>
          )}
        </noscript>
      )}
    </>
  );
}
