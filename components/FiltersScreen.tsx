'use client';

import { useEffect, useState } from 'react';
import {
  Users, BookOpen, Tag, GraduationCap, Sparkles, CheckCircle2,
  Sun, Moon, X,
} from 'lucide-react';
import {
  THEMES, OBJETS, MOUVEMENTS, OEUVRES_PAR_AUTEUR, themeAccent,
} from '@/lib/types';
import { fetchAuteurs } from '@/lib/citations';
import { useTheme } from '@/lib/useTheme';

type Filters = {
  auteur: string;
  oeuvre: string;
  theme: string;
  objet: string;
  mouvement: string;
};

type Tab = 'auteur' | 'theme' | 'bac' | 'mouvement';

export function FiltersScreen({
  filters,
  onChange,
  onGoToSwipe,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onGoToSwipe: () => void;
}) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [auteurs, setAuteurs] = useState<string[]>(['Tous']);
  const [tab, setTab] = useState<Tab>('auteur');

  useEffect(() => {
    fetchAuteurs().then(setAuteurs).catch(() => setAuteurs(['Tous']));
  }, []);

  const hasActive =
    filters.auteur !== 'Tous' ||
    filters.oeuvre !== 'Toutes' ||
    filters.theme !== 'Tous' ||
    filters.objet !== 'Tous' ||
    filters.mouvement !== 'Tous';

  const summary = [
    filters.auteur !== 'Tous' ? filters.auteur : null,
    filters.oeuvre !== 'Toutes' ? filters.oeuvre : null,
    filters.theme !== 'Tous' ? filters.theme : null,
    filters.objet !== 'Tous' ? filters.objet : null,
    filters.mouvement !== 'Tous' ? filters.mouvement : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const reset = () =>
    onChange({
      auteur: 'Tous',
      oeuvre: 'Toutes',
      theme: 'Tous',
      objet: 'Tous',
      mouvement: 'Tous',
    });

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-7 pb-2 flex items-start justify-between">
        <div>
          <h1
            className="font-serif font-bold text-[34px] sm:text-4xl tracking-tight"
            style={{ color: isDark ? '#fff' : '#1A1A2E', letterSpacing: '-1px' }}
          >
            Citations
          </h1>
          <p className="font-body text-sm tracking-wider" style={{ color: isDark ? '#8888AA' : '#6B6B7B' }}>
            Bac de Français 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Changer le thème"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl"
            style={{ background: isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)' }}
          >
            {isDark ? <Sun size={18} color="#8888AA" /> : <Moon size={18} color="#6B6B7B" />}
          </button>
          {hasActive && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              style={{
                background: 'rgba(108, 99, 255, 0.15)',
                color: '#6C63FF',
              }}
            >
              <X size={14} /> Réinit.
            </button>
          )}
        </div>
      </div>

      {/* Active filter summary */}
      {hasActive && (
        <div className="px-6 pb-2">
          <div
            className="text-xs px-3 py-2 rounded-xl"
            style={{
              background: isDark ? 'rgba(108,99,255,.10)' : 'rgba(108,99,255,.08)',
              color: '#6C63FF',
            }}
          >
            {summary}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="px-4 pt-2">
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)' }}
        >
          <TabButton active={tab === 'auteur'} onClick={() => setTab('auteur')} isDark={isDark} icon={<Users size={15} />} label="Auteur" />
          <TabButton active={tab === 'theme'} onClick={() => setTab('theme')} isDark={isDark} icon={<Tag size={15} />} label="Thème" />
          <TabButton active={tab === 'bac'} onClick={() => setTab('bac')} isDark={isDark} icon={<GraduationCap size={15} />} label="Bac 2026" />
          <TabButton active={tab === 'mouvement'} onClick={() => setTab('mouvement')} isDark={isDark} icon={<Sparkles size={15} />} label="Mouv." />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-scroll smooth-scroll px-5 py-5 pb-4">
        {tab === 'auteur' && <AuteurTab filters={filters} onChange={onChange} auteurs={auteurs} isDark={isDark} />}
        {tab === 'theme' && <ThemeTab filters={filters} onChange={onChange} isDark={isDark} />}
        {tab === 'bac' && <BacTab filters={filters} onChange={onChange} isDark={isDark} />}
        {tab === 'mouvement' && <MouvementTab filters={filters} onChange={onChange} isDark={isDark} />}
      </div>

      {/* CTA is now a real flex child, not absolute */}
      <div className="px-5 pb-3 pt-2 shrink-0">
        <button
          onClick={onGoToSwipe}
          className="w-full h-12 rounded-2xl text-white font-semibold tracking-wide"
          style={{ background: '#6C63FF', boxShadow: '0 8px 24px rgba(108,99,255,.3)' }}
        >
          Lancer le swipe →
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active, onClick, icon, label, isDark,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
      style={{
        background: active ? (isDark ? '#0F0F1A' : '#fff') : 'transparent',
        color: active ? '#6C63FF' : (isDark ? '#8888AA' : '#6B6B7B'),
        boxShadow: active ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function SectionLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div
      className="text-[11px] font-bold tracking-[2px]"
      style={{ color: isDark ? '#8888AA' : '#6B6B7B' }}
    >
      {label.toUpperCase()}
    </div>
  );
}

function Row({
  label, icon, selected, color, onClick, isDark,
}: {
  label: string; icon: React.ReactNode; selected: boolean; color: string;
  onClick: () => void; isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full mb-2.5 px-5 py-3.5 rounded-2xl flex items-center gap-3.5 transition-colors text-left"
      style={{
        background: selected ? `${color}26` : (isDark ? '#1A1A2E' : '#fff'),
        border: `1px solid ${selected ? color : (isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)')}`,
      }}
    >
      <span style={{ color: selected ? color : (isDark ? '#8888AA' : '#6B6B7B') }}>{icon}</span>
      <span
        className="flex-1 text-[15px]"
        style={{
          color: selected ? (isDark ? '#fff' : '#1A1A2E') : (isDark ? '#8888AA' : '#6B6B7B'),
          fontWeight: selected ? 700 : 400,
        }}
      >
        {label}
      </span>
      {selected && <CheckCircle2 size={20} color={color} />}
    </button>
  );
}

function AuteurTab({
  filters, onChange, auteurs, isDark,
}: {
  filters: Filters; onChange: (f: Partial<Filters>) => void; auteurs: string[]; isDark: boolean;
}) {
  const oeuvres = filters.auteur !== 'Tous' ? (OEUVRES_PAR_AUTEUR[filters.auteur] ?? ['Toutes']) : [];

  return (
    <div>
      <SectionLabel label="Auteur" isDark={isDark} />
      <div className="h-4" />
      {auteurs.map((a) => (
        <Row
          key={a}
          label={a}
          icon={<Users size={18} />}
          selected={filters.auteur === a}
          color="#6C63FF"
          isDark={isDark}
          onClick={() => onChange({ auteur: a, oeuvre: 'Toutes' })}
        />
      ))}
      {filters.auteur !== 'Tous' && oeuvres.length > 0 && (
        <>
          <div className="h-3" />
          <SectionLabel label="Œuvre" isDark={isDark} />
          <div className="h-4" />
          {oeuvres.map((o) => (
            <Row
              key={o}
              label={o}
              icon={<BookOpen size={18} />}
              selected={filters.oeuvre === o}
              color="#00B4D8"
              isDark={isDark}
              onClick={() => onChange({ oeuvre: o })}
            />
          ))}
        </>
      )}
    </div>
  );
}

function ThemeTab({ filters, onChange, isDark }: { filters: Filters; onChange: (f: Partial<Filters>) => void; isDark: boolean }) {
  return (
    <div>
      <SectionLabel label="Thème" isDark={isDark} />
      <div className="h-4" />
      {THEMES.map((t) => (
        <Row
          key={t}
          label={t}
          icon={<Tag size={18} />}
          selected={filters.theme === t}
          color={themeAccent(t)}
          isDark={isDark}
          onClick={() => onChange({ theme: t })}
        />
      ))}
    </div>
  );
}

function BacTab({ filters, onChange, isDark }: { filters: Filters; onChange: (f: Partial<Filters>) => void; isDark: boolean }) {
  return (
    <div>
      <SectionLabel label="Objet d'étude — Bac 2026" isDark={isDark} />
      <p className="text-xs mt-1.5 mb-4" style={{ color: isDark ? '#8888AA' : '#6B6B7B' }}>
        Les 4 objets d'étude officiels du programme
      </p>
      {OBJETS.map((o) => (
        <Row
          key={o}
          label={o}
          icon={<GraduationCap size={18} />}
          selected={filters.objet === o}
          color="#6C63FF"
          isDark={isDark}
          onClick={() => onChange({ objet: o })}
        />
      ))}
    </div>
  );
}

function MouvementTab({ filters, onChange, isDark }: { filters: Filters; onChange: (f: Partial<Filters>) => void; isDark: boolean }) {
  return (
    <div>
      <SectionLabel label="Mouvement littéraire" isDark={isDark} />
      <div className="h-4" />
      {MOUVEMENTS.map((m) => (
        <Row
          key={m}
          label={m}
          icon={<Sparkles size={18} />}
          selected={filters.mouvement === m}
          color="#FF6584"
          isDark={isDark}
          onClick={() => onChange({ mouvement: m })}
        />
      ))}
    </div>
  );
}
