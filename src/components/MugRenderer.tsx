import React from 'react';
import { MugArtBadge } from './MugArtBadges';

interface MugRendererProps {
  mugType?: 'white' | 'magic' | 'golden' | 'neon';
  badgeType: string;
  customText?: string;
  hasTape?: boolean;
  isPaperApplied?: boolean;
  quality?: 'perfect' | 'good' | 'faint' | 'burned' | 'raw';
  isSmoking?: boolean;
  isSteaming?: boolean;
  scale?: number;
  className?: string;
  customColor?: string;
}

export const MugRenderer: React.FC<MugRendererProps> = ({
  mugType = 'white',
  badgeType,
  customText,
  hasTape = false,
  isPaperApplied = false,
  quality = 'perfect',
  isSmoking = false,
  isSteaming = false,
  scale = 1,
  className = '',
  customColor,
}) => {
  // Base colors
  const getMugBg = () => {
    if (customColor) return customColor;
    switch (mugType) {
      case 'magic':
        return '#1e1b4b'; // deep indigo magic mug
      case 'golden':
        return '#f59e0b'; // golden ceramic
      case 'neon':
        return '#ec4899'; // bright hot pink
      case 'white':
      default:
        return '#f8fafc'; // glossy clean white
    }
  };

  const baseBg = getMugBg();

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
    >
      {/* Steam / Smoke particles */}
      {isSteaming && (
        <div className="absolute -top-12 flex space-x-2 pointer-events-none animate-pulse">
          <span className="text-xl animate-bounce">♨️</span>
          <span className="text-sm text-slate-300 font-mono italic animate-ping">~pss~</span>
          <span className="text-2xl animate-bounce">♨️</span>
        </div>
      )}
      {isSmoking && (
        <div className="absolute -top-12 flex space-x-1 pointer-events-none">
          <span className="text-2xl animate-spin">💨</span>
          <span className="text-2xl animate-pulse">🔥</span>
          <span className="text-xs bg-red-600 text-white font-bold px-1 rounded animate-bounce">
            ¡QUEMADO!
          </span>
        </div>
      )}

      {/* The Mug Body and Handle Container */}
      <div className="relative flex items-center">
        {/* Cylindrical Mug Body */}
        <div
          className={`relative w-36 h-44 rounded-t-lg rounded-b-2xl border-4 border-slate-900 shadow-[6px_8px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ${
            quality === 'burned' ? 'contrast-125 brightness-50 sepia' : ''
          }`}
          style={{
            backgroundColor: baseBg,
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.12) 100%)`,
          }}
        >
          {/* Mug Rim Inner Oval */}
          <div className="absolute top-0 left-0 right-0 h-4 border-b-2 border-slate-900/30 bg-slate-300/40 rounded-full mx-1" />

          {/* Glaze reflection line */}
          <div className="absolute top-4 left-3 bottom-4 w-2 bg-white/40 rounded-full blur-[1px] pointer-events-none" />

          {/* Sublimation Transfer / Art Content */}
          <div
            className={`relative z-10 w-28 h-32 flex flex-col items-center justify-center rounded transition-all duration-300 ${
              isPaperApplied
                ? 'bg-amber-50/95 border-2 border-dashed border-amber-400 p-1 shadow-inner rotate-[-1deg]'
                : ''
            } ${quality === 'faint' ? 'opacity-35 blur-[0.5px]' : ''} ${
              quality === 'burned' ? 'opacity-40 grayscale saturate-200' : ''
            }`}
          >
            {/* If transfer paper is taped on */}
            {isPaperApplied && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-[8px] font-black uppercase text-amber-950 px-1 rounded shadow-sm">
                Papel Transfer
              </div>
            )}

            {/* The Badge Artwork */}
            <MugArtBadge type={badgeType} customText={customText} />

            {/* Thermal Yellow Tape Stickers */}
            {hasTape && isPaperApplied && (
              <>
                <div className="absolute -top-1 -left-2 w-5 h-2 bg-yellow-400/90 border border-yellow-600 rotate-[-25deg] shadow-xs" />
                <div className="absolute -top-1 -right-2 w-5 h-2 bg-yellow-400/90 border border-yellow-600 rotate-[25deg] shadow-xs" />
                <div className="absolute -bottom-1 -left-2 w-5 h-2 bg-yellow-400/90 border border-yellow-600 rotate-[20deg] shadow-xs" />
                <div className="absolute -bottom-1 -right-2 w-5 h-2 bg-yellow-400/90 border border-yellow-600 rotate-[-20deg] shadow-xs" />
              </>
            )}
          </div>

          {/* Burn marks overlay if overcooked */}
          {quality === 'burned' && (
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-amber-900/40 to-transparent pointer-events-none flex items-center justify-center">
              <span className="text-yellow-400 font-extrabold text-xs rotate-[-12deg] border-2 border-yellow-400 px-2 py-0.5 bg-black/60 rounded">
                SOBRECALENTADO
              </span>
            </div>
          )}

          {/* Quality sparkle star if perfect */}
          {quality === 'perfect' && !isPaperApplied && (
            <div className="absolute top-2 right-2 text-yellow-400 font-black text-sm pointer-events-none animate-spin">
              ★
            </div>
          )}
        </div>

        {/* Mug Handle on Right Side */}
        <div className="relative -ml-1 w-10 h-28 border-4 border-l-0 border-slate-900 rounded-r-3xl flex items-center justify-center bg-transparent shadow-[4px_4px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div
            className="w-full h-full rounded-r-2xl"
            style={{
              backgroundColor: baseBg,
              boxShadow: 'inset -3px 0px 4px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
