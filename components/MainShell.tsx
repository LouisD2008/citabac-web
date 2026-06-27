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
  
  // State to track if the Android notification is visible
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hideAndroidPrompt') !== 'true';
    }
    return true;
  });

  const dismissPrompt = () => {
    setShowAndroidPrompt(false);
    localStorage.setItem('hideAndroidPrompt', 'true');
  };

  const onFiltersChange = (patch: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div
      className="fixed flex flex-col"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100dvh',        // ← KEY: dynamic viewport height, Safari-safe
        background: isDark ? '#0F0F1A' : '#F5F1E8',
      }}
    >
      {/* FLOATING ANDROID NOTIFICATION */}
      {showAndroidPrompt && (
        <div 
          className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between gap-3 p-3 rounded-xl shadow-lg border"
          style={{
            background: isDark ? '#1A1A2E' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }}
        >
          <a 
            href="https://play.google.com/store/apps/details?id=com.citabac.app&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm flex-1 hover:underline"
            style={{ color: isDark ? '#E2E2E9' : '#2D2D3A' }}
          >
            Are you by any chance on Android? If so, then{' '}
            <span style={{ color: '#6C63FF', fontWeight: 600 }}>click here</span> to download the app!
          </a>
          
          <button 
            onClick={dismissPrompt}
            className="p-1 rounded-lg transition-colors text-sm font-semibold"
            style={{ 
              color: isDark ? '#A0A0B5' : '#707080',
              background: 'transparent'
            }}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

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
    <nav style={{
      background: bg,
      borderTop: `1px solid ${border}`,
      paddingBottom: 'env(safe-area-inset-bottom)',  // ← notch phones
    }}>
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