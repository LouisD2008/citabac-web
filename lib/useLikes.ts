'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'liked_citation_ids';

function readStored(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map((n) => Number(n)).filter((n) => Number.isFinite(n)));
  } catch {
    return new Set();
  }
}

function writeStored(s: Set<number>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
}

// Simple cross-component event so likes update everywhere when toggled.
const EVENT = 'citabac:likes-changed';

export function useLikes() {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLiked(readStored());
    const onChange = () => setLiked(readStored());
    window.addEventListener(EVENT, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    const next = new Set(readStored());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    writeStored(next);
    setLiked(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isLiked = useCallback((id: number) => liked.has(id), [liked]);

  return { liked, isLiked, toggle, count: liked.size };
}
