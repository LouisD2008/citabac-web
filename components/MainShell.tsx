'use client';

import { useState } from 'react';
import { SlidersHorizontal, PlayCircle, Heart } from 'lucide-react';
import { FiltersScreen } from './FiltersScreen';
import { SwipeScreen } from './SwipeScreen';
import { FavorisScreen } from './FavorisScreen';
import { useTheme } from '@/lib/useTheme';

type Tab = 0 | 1 | 2;
type Filters = {
  auteur: string;
  oeuvre: string;
  theme: string;
  objet: string;
  mouvement: string;
};

const DEFAULT_FILTERS: Filters = {
  auteur: 'Tous',
  oeuvre: 'Toutes',
  theme: 'Tous',
  objet: 'Tous',
  mouvement: 'Tous',
};

export function MainShell() {
  const { isDark } = useTheme();
  const [current, setCurrent] = useState<Tab>(0);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const onFiltersChange = (patch: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: isDark ? '#0F0F1A' : '#F5F1E8' }}
    >
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <Pane visible={current === 0}>
          <FiltersScreen
            filters={filters}
            onChange={onFiltersChange}
            onGoToSwipe={() => setCurrent(1)}
          />
        </Pane>
        <Pane visible={current === 1}>
          <SwipeScreen filters={filters} isActive={current === 1} />
        </Pane>
        <Pane visible={current === 2}>
          <FavorisScreen />
        </Pane>
      </div>

      <BottomNav current={current} onChange={setCurrent} isDark={isDark} />
    </div>
  );
}

function Pane({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}

function BottomNav({
  current,
  onChange,
  isDark,
}: {
  current: Tab;
  onChange: (t: Tab) => void;
  isDark: boolean;
}) {
  const bg = isDark ? '#0A0A14' : '#fff';
  const border = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)';

  return (
    <nav style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="h-[60px] flex">
        <NavItem active={current === 0} onClick={() => onChange(0)} icon={<SlidersHorizontal size={22} />} label="Filtres" isDark={isDark} />
        <NavItem active={current === 1} onClick={() => onChange(1)} icon={<PlayCircle size={24} />} label="Swipe" isDark={isDark} />
        <NavItem active={current === 2} onClick={() => onChange(2)} icon={<Heart size={22} />} label="Favoris" isDark={isDark} />
      </div>
    </nav>
  );
}

function NavItem({
  active, onClick, icon, label, isDark,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDark: boolean;
}) {
  const inactive = isDark ? '#555570' : '#999999';
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
      style={{ color: active ? '#6C63FF' : inactive }}
    >
      <span
        className="px-4 py-1 rounded-xl transition-colors"
        style={{ background: active ? 'rgba(108, 99, 255, 0.15)' : 'transparent' }}
      >
        {icon}
      </span>
      <span className="text-[10px] tracking-wider" style={{ fontWeight: active ? 700 : 400 }}>
        {label}
      </span>
    </button>
  );
}