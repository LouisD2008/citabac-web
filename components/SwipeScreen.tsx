'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, Share2, ChevronDown, BookOpen, RefreshCw } from 'lucide-react';
import {
  Citation,
  hasExplication,
  themeAccent,
  themeGradientTop,
} from '@/lib/types';
import { fetchCitations } from '@/lib/citations';
import { useLikes } from '@/lib/useLikes';
import { FlippableCard } from './FlippableCard';

type Filters = {
  auteur: string;
  oeuvre: string;
  theme: string;
  objet: string;
  mouvement: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SwipeScreen({ filters }: { filters: Filters }) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isLiked, toggle: toggleLike } = useLikes();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCitations(filters);
      setCitations(shuffle(data));
      setFlipped(new Set());
      setCurrentIndex(0);
      // jump back to top
      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({ top: 0 });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  // Track current index via scroll position (one card per viewport).
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== currentIndex) {
      // auto-unflip the card we're leaving
      const leaving = citations[currentIndex];
      if (leaving) {
        setFlipped((prev) => {
          if (!prev.has(leaving.id)) return prev;
          const next = new Set(prev);
          next.delete(leaving.id);
          return next;
        });
      }
      setCurrentIndex(idx);
    }
  }, [currentIndex, citations]);

  const toggleFlip = (id: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const share = async (c: Citation) => {
    const text = `« ${c.citation} » — ${c.auteur}, ${c.oeuvre}`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'Citabac' });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('Citation copiée dans le presse-papier ✦');
    } catch {
      alert(text);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-black">
        <div className="h-10 w-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-black text-white px-8 text-center">
        <p className="text-white/70">{error}</p>
        <button
          onClick={load}
          className="px-5 py-2 rounded-xl bg-accent text-white font-semibold flex items-center gap-2"
        >
          <RefreshCw size={16} /> Réessayer
        </button>
      </div>
    );
  }

  if (citations.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 bg-black text-white/60 px-8 text-center">
        <BookOpen size={40} className="opacity-60" />
        <p>Aucune citation pour ces filtres.</p>
        <p className="text-xs text-white/40">Essaie une autre combinaison.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="h-full w-full overflow-y-scroll snap-y-mandatory no-scrollbar bg-black"
    >
      {citations.map((c, idx) => {
        const isFlipped = flipped.has(c.id);
        const accent = themeAccent(c.theme);
        const gradTop = themeGradientTop(c.theme);
        const liked = isLiked(c.id);

        return (
          <section
            key={c.id}
            className="snap-start relative h-full w-full"
            style={{ height: '100%' }}
          >
            <FlippableCard
              isFlipped={isFlipped}
              front={
                <FrontFace
                  c={c}
                  accent={accent}
                  gradTop={gradTop}
                  onFlip={() => toggleFlip(c.id)}
                />
              }
              back={
                <BackFace
                  c={c}
                  accent={accent}
                  gradTop={gradTop}
                  onFlip={() => toggleFlip(c.id)}
                />
              }
            />

            {/* Action column — hidden when flipped for cleaner reading */}
            {!isFlipped && (
              <div className="absolute right-4 sm:right-6 bottom-[24%] flex flex-col gap-5 items-center z-10">
                <ActionButton
                  onClick={() => toggleLike(c.id)}
                  label={liked ? 'Aimé' : 'J\'aime'}
                  active={liked}
                  accent={accent}
                >
                  <Heart
                    size={26}
                    fill={liked ? accent : 'transparent'}
                    color={liked ? accent : 'white'}
                  />
                </ActionButton>
                <ActionButton
                  onClick={() => share(c)}
                  label="Partager"
                  accent={accent}
                >
                  <Share2 size={24} color="white" />
                </ActionButton>
              </div>
            )}

            {/* First-card hint */}
            {idx === 0 && currentIndex === 0 && !isFlipped && (
              <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center text-white/40 pointer-events-none">
                <ChevronDown size={26} className="animate-bounce" />
                <span className="text-xs">Swipe pour continuer</span>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function ActionButton({
  onClick,
  children,
  label,
  active,
  accent,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  active?: boolean;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 group"
    >
      <span
        className="h-12 w-12 rounded-full backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-90"
        style={{
          background: active
            ? `${accent}33`
            : 'rgba(255, 255, 255, 0.12)',
          border: `1px solid ${active ? accent : 'rgba(255,255,255,0.18)'}`,
        }}
      >
        {children}
      </span>
      <span className="text-[10px] text-white/70 tracking-wide">{label}</span>
    </button>
  );
}

function FrontFace({
  c,
  accent,
  gradTop,
  onFlip,
}: {
  c: Citation;
  accent: string;
  gradTop: string;
  onFlip: () => void;
}) {
  return (
    <div
      className="w-full h-full flex flex-col px-7 pt-16 pb-20 sm:px-12 sm:pt-20"
      style={{
        background: `linear-gradient(to bottom, ${gradTop}, #000)`,
      }}
    >
      {/* Theme + œuvre badge */}
      <div className="flex items-center gap-2 flex-wrap">
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
        {c.oeuvre && (
          <span className="text-[11px] text-white/50 italic font-body truncate">
            {c.oeuvre}
          </span>
        )}
      </div>

      <div className="flex-1" />

      <div
        className="font-serif text-[60px] leading-none"
        style={{ color: `${accent}4D` }}
      >
        ❝
      </div>

      <p
        className="mt-2 font-body italic font-normal pr-16 text-white text-xl sm:text-2xl"
        style={{ lineHeight: 1.55 }}
      >
        {c.citation}
      </p>

      {hasExplication(c) && (
        <button
          onClick={onFlip}
          className="mt-5 self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            background: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}55`,
          }}
        >
          <BookOpen size={16} />
          Voir l'explication
        </button>
      )}

      <div className="flex-1" />

      <div className="h-px w-full bg-white/10" />
      <div className="mt-5 flex items-baseline gap-3 flex-wrap">
        <span
          className="font-serif font-bold text-lg"
          style={{ color: accent }}
        >
          {c.auteur}
        </span>
        {c.oeuvre && (
          <span className="font-body italic text-white/60 text-sm">
            {c.oeuvre}
          </span>
        )}
      </div>
    </div>
  );
}

function BackFace({
  c,
  accent,
  gradTop,
  onFlip,
}: {
  c: Citation;
  accent: string;
  gradTop: string;
  onFlip: () => void;
}) {
  return (
    <div
      className="w-full h-full flex flex-col px-7 pt-16 pb-20 sm:px-12 sm:pt-20 overflow-y-auto no-scrollbar"
      style={{
        background: `linear-gradient(to bottom, ${gradTop}, #000)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] tracking-[2px] uppercase font-bold px-3 py-1 rounded-full"
          style={{
            background: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
          }}
        >
          Explication
        </span>
        <button
          onClick={onFlip}
          className="text-xs text-white/60 hover:text-white px-3 py-1 rounded-full border border-white/15"
        >
          ↺ Citation
        </button>
      </div>

      <div className="mt-6">
        <p
          className="font-body italic text-white/85 text-base sm:text-lg"
          style={{ lineHeight: 1.7 }}
        >
          « {c.citation} »
        </p>
        <p className="mt-2 text-xs text-white/40">
          — {c.auteur}{c.oeuvre ? `, ${c.oeuvre}` : ''}
        </p>
      </div>

      <div className="my-5 h-px w-full bg-white/10" />

      <p
        className="font-body text-white/90 whitespace-pre-line text-base"
        style={{ lineHeight: 1.7 }}
      >
        {c.explication}
      </p>

      <div className="flex-1" />
    </div>
  );
}
