"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bookmarked-posts";
const SYNC_EVENT = "bookmarks-changed";

function readFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {
    // ignore
  }
  return new Set();
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBookmarks(readFromStorage());
    setLoaded(true);

    const onSync = () => setBookmarks(readFromStorage());
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const persist = useCallback((next: Set<string>) => {
    setBookmarks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      const next = new Set(bookmarks);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      persist(next);
    },
    [bookmarks, persist]
  );

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.has(slug),
    [bookmarks]
  );

  return { bookmarks, toggle, isBookmarked, loaded };
}
