'use client';

import { useEffect, useState } from 'react';
import { Heart, BookOpen, Trash2 } from 'lucide-react';
import { Citation, themeAccent } from '@/lib/types';
import { fetchByIds } from '@/lib/citations';
import { useLikes } from '@/lib/useLikes';
import { useTheme } from '@/lib/useTheme';

export function FavorisScreen() {
  const { isDark } = useTheme();
  const { liked, toggle: toggleLike, count } = useLikes();
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = Array.from(liked);
    if (ids.length === 0) {
      setCitations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchByIds(ids)
      .then((data) => {
        setCitations(data);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, [liked]);

  const bg = isDark ? '#0F0F1A' : '#F5F1E8';
  const fg = isDark ? '#fff' : '#1A1A2E';
  const muted = isDark ? '#8888AA' : '#6B6B7B';
  const cardBg = isDark ? '#1A1A2E' : '#fff';
  const borderColor = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)';

  return (
    <div className="h-full w-full flex flex-col" style={{ background: bg }}>
      {/* Header */}
      <div className="px-6 pt-7 pb-3">
        <h1
          className="font-serif font-bold text-[34px] sm:text-4xl tracking-tight"
          style={{ color: fg, letterSpacing: '-1px' }}
        >
          Favoris
        </h1>
        <p className="font-body text-sm tracking-wider" style={{ color: muted }}>
          {count === 0
            ? 'Aucune citation sauvegardée'
            : `${count} citation${count > 1 ? 's' : ''} sauvegardée${count > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* min-h-0 lets this flex child shrink so it can scroll on mobile */}
      <div className="flex-1 min-h-0 overflow-y-scroll smooth-scroll px-5 pb-24">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && citations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)' }}
            >
              <Heart size={32} color={muted} />
            </div>
            <p className="text-center" style={{ color: muted }}>
              Tu n'as pas encore de favoris.
            </p>
            <p className="text-xs text-center" style={{ color: muted }}>
              Tape sur ♡ depuis le swipe pour en ajouter.
            </p>
          </div>
        )}

        {!loading && !error && citations.map((c) => {
          const accent = themeAccent(c.theme);
          return (
            <div
              key={c.id}
              className="mb-3 rounded-2xl p-5"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className="text-[10px] tracking-[2px] uppercase font-bold px-3 py-1 rounded-full"
                  style={{
                    background: `${accent}22`,
                    color: accent,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  {c.theme || '—'}
                </span>
                <button
                  onClick={() => toggleLike(c.id)}
                  aria-label="Retirer des favoris"
                  className="p-2 rounded-full hover:bg-black/5"
                  style={{ color: accent }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p
                className="mt-3 font-body italic text-base sm:text-lg"
                style={{ color: fg, lineHeight: 1.6 }}
              >
                « {c.citation} »
              </p>

              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="font-serif font-bold text-sm" style={{ color: accent }}>
                  {c.auteur}
                </span>
                {c.oeuvre && (
                  <span className="font-body italic text-xs" style={{ color: muted }}>
                    {c.oeuvre}
                  </span>
                )}
              </div>

              {c.explication && (
                <details className="mt-3">
                  <summary
                    className="cursor-pointer text-xs flex items-center gap-1.5"
                    style={{ color: accent }}
                  >
                    <BookOpen size={14} />
                    Voir l'explication
                  </summary>
                  <p
                    className="mt-2 text-sm font-body whitespace-pre-line"
                    style={{ color: fg, lineHeight: 1.6 }}
                  >
                    {c.explication}
                  </p>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
