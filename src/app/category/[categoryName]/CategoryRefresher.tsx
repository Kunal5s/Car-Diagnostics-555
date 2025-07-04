'use client';

import { useEffect } from 'react';
import { triggerCategoryRefresh } from './actions';
import type { Article } from '@/lib/definitions';

// Refresh content if it's older than 5 minutes.
const TTL_MINUTES = 5;

export function CategoryRefresher({ articles, categoryName }: { articles: Article[], categoryName: string }) {
  useEffect(() => {
    const now = Date.now();
    const ttlMilliseconds = TTL_MINUTES * 60 * 1000;

    // Trigger a refresh if there are no articles for this category,
    // or if the *oldest* article in the category is past its TTL.
    const oldestArticleTimestamp = articles.length > 0
      ? Math.min(...articles.map(a => a.generatedAt || 0))
      : 0;

    const isStale = articles.length === 0 || (oldestArticleTimestamp > 0 && (now - oldestArticleTimestamp > ttlMilliseconds));

    if (isStale) {
      console.log(`[Category: ${categoryName}] Content is stale or missing. Triggering background refresh.`);
      // Fire and forget call to the server action.
      // This will not block the UI and runs in the background.
      triggerCategoryRefresh(categoryName);
    }
  }, [articles, categoryName]);

  // This component does not render anything to the DOM.
  return null;
}
