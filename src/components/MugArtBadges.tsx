import React from 'react';

interface BadgeProps {
  type: string;
  className?: string;
  customText?: string;
}

export const MugArtBadge: React.FC<BadgeProps> = ({ type, className = "w-28 h-28", customText }) => {
  switch (type) {
    case 'arigato':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <div className="font-extrabold tracking-wider text-black text-center text-xs sm:text-sm uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-['Rubik']">
            ¡ARIGATO!
          </div>
          <svg viewBox="0 0 100 110" className="w-16 h-20 filter drop-shadow">
            {/* Golden Lucky Cat */}
            <circle cx="50" cy="50" r="38" fill="#FBBF24" stroke="#1E293B" strokeWidth="4" />
            {/* Cat Ears */}
            <path d="M 22 26 L 12 6 L 36 16 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="3" />
            <path d="M 78 26 L 88 6 L 64 16 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="3" />
            <path d="M 20 22 L 15 10 L 30 16 Z" fill="#F43F5E" />
            <path d="M 80 22 L 85 10 L 70 16 Z" fill="#F43F5E" />
            {/* Cheerful Eyes & Whiskers */}
            <path d="M 32 44 Q 40 38 48 44" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 52 44 Q 60 38 68 44" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="16" y1="46" x2="30" y2="48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="14" y1="54" x2="28" y2="54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="84" y1="46" x2="70" y2="48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="86" y1="54" x2="72" y2="54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Nose & Mouth */}
            <polygon points="50,49 47,46 53,46" fill="#F43F5E" />
            <path d="M 45 52 Q 50 56 55 52" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Paws */}
            <ellipse cx="28" cy="74" rx="8" ry="12" fill="#FBBF24" stroke="#1E293B" strokeWidth="3" />
            <ellipse cx="72" cy="74" rx="8" ry="12" fill="#FBBF24" stroke="#1E293B" strokeWidth="3" />
            {/* Golden Lucky Coin (Koban) */}
            <rect x="40" y="60" width="20" height="28" rx="6" fill="#0284C7" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="50" cy="74" r="5" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
          </svg>
          {customText && (
            <span className="text-[10px] font-bold text-slate-800 bg-amber-200/90 px-1 rounded mt-0.5 max-w-[80px] truncate">
              {customText}
            </span>
          )}
        </div>
      );

    case 'lamp':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 120" className="w-16 h-20 filter drop-shadow">
            {/* Cat Ears on Lightbulb */}
            <path d="M 28 35 L 20 10 L 42 22 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="3.5" />
            <path d="M 72 35 L 80 10 L 58 22 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="3.5" />
            {/* Bulb Dome */}
            <circle cx="50" cy="50" r="30" fill="#FDE047" stroke="#1E293B" strokeWidth="4" />
            {/* Glow Rays */}
            <line x1="12" y1="35" x2="4" y2="30" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="12" x2="50" y2="4" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="88" y1="35" x2="96" y2="30" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            {/* Cat Face on Bulb */}
            <path d="M 38 48 Q 42 42 46 48" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 54 48 Q 58 42 62 48" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 46 54 Q 50 58 54 54" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Screw base */}
            <rect x="40" y="77" width="20" height="12" rx="2" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
            <rect x="44" y="89" width="12" height="6" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="2" />
          </svg>
          <div className="text-[10px] font-black text-rose-600 bg-white/80 px-1 rounded shadow uppercase font-['Rubik']">
            TALLER VERSÁTIL
          </div>
          {customText && <span className="text-[9px] font-bold text-amber-900">{customText}</span>}
        </div>
      );

    case 'vampire':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 110" className="w-16 h-20 filter drop-shadow">
            {/* Bat Wings Collar */}
            <path d="M 10 50 Q 30 75 50 65 Q 70 75 90 50 L 50 85 Z" fill="#9333EA" stroke="#18181B" strokeWidth="3" />
            {/* Cat Head */}
            <circle cx="50" cy="40" r="26" fill="#FACC15" stroke="#18181B" strokeWidth="3.5" />
            <polygon points="30,25 22,8 40,18" fill="#F59E0B" stroke="#18181B" strokeWidth="2.5" />
            <polygon points="70,25 78,8 60,18" fill="#F59E0B" stroke="#18181B" strokeWidth="2.5" />
            {/* Vampire Eyes */}
            <ellipse cx="42" cy="38" rx="4" ry="6" fill="#DC2626" />
            <ellipse cx="58" cy="38" rx="4" ry="6" fill="#DC2626" />
            {/* Fangs */}
            <polygon points="45,47 47,52 49,47" fill="#FFFFFF" />
            <polygon points="51,47 53,52 55,47" fill="#FFFFFF" />
            {/* Pumpkin below */}
            <circle cx="50" cy="80" r="18" fill="#EA580C" stroke="#18181B" strokeWidth="3" />
            <polygon points="45,78 47,82 43,82" fill="#FDE047" />
            <polygon points="55,78 57,82 53,82" fill="#FDE047" />
            <path d="M 44 86 Q 50 90 56 86" fill="none" stroke="#FDE047" strokeWidth="2" />
          </svg>
          <div className="text-[9px] font-black text-amber-400 bg-purple-950 px-1 rounded border border-orange-500">
            SÚPER SPOOKY
          </div>
          {customText && <span className="text-[9px] font-bold text-orange-400">{customText}</span>}
        </div>
      );

    case 'starry':
      return (
        <div className={`relative flex flex-col items-center justify-center p-1 rounded overflow-hidden ${className}`}>
          <svg viewBox="0 0 100 85" className="w-20 h-16 rounded border-2 border-slate-900 shadow">
            {/* Van Gogh Starry Sky */}
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="50%" stopColor="#1C2541" />
                <stop offset="100%" stopColor="#3A506B" />
              </linearGradient>
            </defs>
            <rect width="100" height="85" fill="url(#skyGrad)" />
            {/* Swirling Yellow Stars */}
            <circle cx="25" cy="20" r="7" fill="#FDE047" opacity="0.9" />
            <circle cx="25" cy="20" r="12" fill="#FEF08A" opacity="0.4" />
            <circle cx="75" cy="18" r="9" fill="#FACC15" opacity="0.9" />
            <circle cx="75" cy="18" r="15" fill="#FEF08A" opacity="0.3" />
            {/* Swirl lines */}
            <path d="M 10 15 Q 35 5 50 20 T 90 15" fill="none" stroke="#67E8F9" strokeWidth="2.5" opacity="0.8" />
            <path d="M 5 25 Q 40 18 60 28 T 95 24" fill="none" stroke="#A5F3FC" strokeWidth="2" opacity="0.6" />
            {/* Cerro de la Silla mountain contour */}
            <polygon points="0,85 15,62 35,50 48,58 65,42 85,60 100,85" fill="#1E1B4B" stroke="#0284C7" strokeWidth="2" />
            <polygon points="15,62 35,50 48,58 65,42 85,60 100,85" fill="#312E81" opacity="0.7" />
          </svg>
          <div className="text-[8px] font-bold text-slate-800 bg-amber-100 px-1 rounded mt-0.5">
            La Silla Estrellada
          </div>
          {customText && <span className="text-[9px] font-bold text-cyan-700">{customText}</span>}
        </div>
      );

    case 'soccer':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-16 h-16 filter drop-shadow">
            {/* Soccer Body */}
            <circle cx="50" cy="54" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
            {/* Pentagon Soccer pattern */}
            <polygon points="50,42 59,48 56,58 44,58 41,48" fill="#0F172A" />
            <line x1="50" y1="42" x2="50" y2="28" stroke="#0F172A" strokeWidth="2" />
            <line x1="59" y1="48" x2="72" y2="44" stroke="#0F172A" strokeWidth="2" />
            <line x1="56" y1="58" x2="68" y2="68" stroke="#0F172A" strokeWidth="2" />
            <line x1="44" y1="58" x2="32" y2="68" stroke="#0F172A" strokeWidth="2" />
            <line x1="41" y1="48" x2="28" y2="44" stroke="#0F172A" strokeWidth="2" />
            {/* Cat Ears */}
            <polygon points="34,32 26,16 42,24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <polygon points="66,32 74,16 58,24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            {/* Face in upper part of ball */}
            <ellipse cx="42" cy="38" rx="2.5" ry="3.5" fill="#0F172A" />
            <ellipse cx="58" cy="38" rx="2.5" ry="3.5" fill="#0F172A" />
            <path d="M 46 43 Q 50 46 54 43" fill="none" stroke="#0F172A" strokeWidth="2" />
            {/* Cute athletic soccer shoes */}
            <ellipse cx="38" cy="86" rx="8" ry="5" fill="#0284C7" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="62" cy="86" rx="8" ry="5" fill="#0284C7" stroke="#0F172A" strokeWidth="2" />
          </svg>
          <div className="text-[9px] font-black text-sky-600 bg-white px-1 rounded shadow">
            ¡GOL CAT!
          </div>
          {customText && <span className="text-[9px] font-bold text-sky-900">{customText}</span>}
        </div>
      );

    case 'gracias':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <div className="relative bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wide font-['Rubik']">
            ★ SÚPER GRACIAS ★
          </div>
          <svg viewBox="0 0 70 40" className="w-14 h-8 mt-1">
            <polygon points="20,5 23,14 32,14 25,19 27,28 20,23 13,28 15,19 8,14 17,14" fill="#FACC15" stroke="#1E293B" strokeWidth="1.5" />
            <polygon points="50,10 52,17 60,17 54,21 56,28 50,24 44,28 46,21 40,17 48,17" fill="#38BDF8" stroke="#1E293B" strokeWidth="1.5" />
          </svg>
          {customText && <span className="text-[9px] font-bold text-red-700">{customText}</span>}
        </div>
      );

    case 'pinkcat':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <svg viewBox="0 0 90 90" className="w-16 h-16 filter drop-shadow">
            <circle cx="45" cy="48" r="32" fill="#F472B6" stroke="#1E293B" strokeWidth="3.5" />
            <polygon points="22,30 14,12 36,20" fill="#EC4899" stroke="#1E293B" strokeWidth="3" />
            <polygon points="68,30 76,12 54,20" fill="#EC4899" stroke="#1E293B" strokeWidth="3" />
            <ellipse cx="36" cy="42" rx="4" ry="6" fill="#1E293B" />
            <ellipse cx="54" cy="42" rx="4" ry="6" fill="#1E293B" />
            <circle cx="38" cy="40" r="1.5" fill="#FFFFFF" />
            <circle cx="56" cy="40" r="1.5" fill="#FFFFFF" />
            <path d="M 40 52 Q 45 56 50 52" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Blushing cheeks */}
            <circle cx="28" cy="49" r="4" fill="#FB7185" opacity="0.7" />
            <circle cx="62" cy="49" r="4" fill="#FB7185" opacity="0.7" />
          </svg>
          <div className="text-[9px] font-extrabold text-pink-700 bg-pink-100 px-1 rounded">
            SUPER ARIGATO
          </div>
          {customText && <span className="text-[9px] font-bold text-pink-900">{customText}</span>}
        </div>
      );

    case 'bluecat':
      return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
          <svg viewBox="0 0 90 90" className="w-16 h-16 filter drop-shadow">
            <circle cx="45" cy="48" r="32" fill="#38BDF8" stroke="#1E293B" strokeWidth="3.5" />
            <polygon points="22,30 14,12 36,20" fill="#0284C7" stroke="#1E293B" strokeWidth="3" />
            <polygon points="68,30 76,12 54,20" fill="#0284C7" stroke="#1E293B" strokeWidth="3" />
            <ellipse cx="36" cy="42" rx="4" ry="6" fill="#0F172A" />
            <ellipse cx="54" cy="42" rx="4" ry="6" fill="#0F172A" />
            <circle cx="38" cy="40" r="1.5" fill="#FFFFFF" />
            <circle cx="56" cy="40" r="1.5" fill="#FFFFFF" />
            <path d="M 40 52 Q 45 56 50 52" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Gold Bell Collar */}
            <ellipse cx="45" cy="74" rx="16" ry="6" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
            <circle cx="45" cy="76" r="4" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
          </svg>
          <div className="text-[9px] font-extrabold text-sky-800 bg-sky-100 px-1 rounded">
            FORTUNA AZUL
          </div>
          {customText && <span className="text-[9px] font-bold text-sky-950">{customText}</span>}
        </div>
      );

    default:
      return (
        <div className="text-center font-bold text-xs p-2">
          {customText || 'SUPER ARIGATO'}
        </div>
      );
  }
};
