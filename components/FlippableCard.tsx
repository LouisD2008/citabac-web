'use client';

import { ReactNode } from 'react';

export function FlippableCard({
  front,
  back,
  isFlipped,
}: {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
}) {
  return (
    <div className="perspective w-full h-full">
      <div
        className="relative w-full h-full preserve-3d transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
