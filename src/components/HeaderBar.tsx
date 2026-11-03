import React, { useState } from 'react';
import { GameMode, PlayerStats } from '../types/game';
import { sounds } from '../services/audio';
import { Volume2, VolumeX, Music, Flame, Palette, Store, Image as ImageIcon } from 'lucide-react';

interface HeaderBarProps {
  stats: PlayerStats;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenShop: () => void;
  onOpenArtViewer: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  stats,
  currentMode,
  onSelectMode,
  onOpenShop,
  onOpenArtViewer,
}) => {
  const [soundOn, setSoundOn] = useState(sounds.soundEnabled);
  const [musicOn, setMusicOn] = useState(sounds.musicEnabled);

  const toggleSound = () => {
    sounds.soundEnabled = !soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) sounds.playTap();
  };

  const toggleMusic = () => {
    const nextState = sounds.toggleMusic();
    setMusicOn(nextState);
    sounds.playTap();
  };

  return (
    <header className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 border-b-4 border-slate-900 shadow-md px-3 py-2 flex flex-col gap-2 select-none">
      {/* Top Row: Workshop Branding, Coins, Reputation, Audio toggles */}
      <div className="flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onSelectMode('rush')}>
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-black flex items-center justify-center shadow-xs">
            <span className="text-sm">🐱</span>
          </div>
          <div>
            <h1 className="font-['Bungee'] text-xs sm:text-sm text-slate-900 leading-tight tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
              TALLER VERSÁTIL
            </h1>
            <p className="text-[9px] font-black text-red-700 tracking-wider font-['Rubik'] uppercase">
              Laboratorio de Ideas
            </p>
          </div>
        </div>

        {/* Stats: Coins & Rep */}
        <div className="flex items-center gap-2">
          {/* Coins */}
          <div className="bg-amber-100/90 border-2 border-slate-900 rounded-full px-2.5 py-0.5 flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <span className="text-amber-500 text-xs font-black">🪙</span>
            <span className="font-['Rubik'] font-black text-xs text-slate-900">
              {stats.coins}
            </span>
          </div>

          {/* Reputation / Stars */}
          <div className="bg-amber-100/90 border-2 border-slate-900 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            <span className="text-amber-500 text-xs">⭐</span>
            <span className="font-['Rubik'] font-black text-xs text-slate-900">
              {stats.reputation}%
            </span>
          </div>

          {/* Sound Buttons */}
          <div className="flex items-center gap-1 bg-amber-600/30 p-1 rounded-full border border-amber-700/40">
            <button
              onClick={toggleSound}
              aria-label="Efectos de sonido"
              className="p-1 rounded-full hover:bg-white/40 active:scale-95 text-slate-900 transition-transform"
              title="Efectos"
            >
              {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button
              onClick={toggleMusic}
              aria-label="Música arcade"
              className={`p-1 rounded-full hover:bg-white/40 active:scale-95 transition-transform ${
                musicOn ? 'text-red-700 font-bold animate-pulse' : 'text-slate-900/60'
              }`}
              title="Música Chiptune"
            >
              <Music size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Mode Selector Tabs */}
      <nav className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-1">
        <button
          onClick={() => {
            sounds.playTap();
            onSelectMode('rush');
          }}
          className={`flex-1 min-w-[72px] py-1 px-1.5 rounded-lg font-['Rubik'] font-black text-[11px] uppercase tracking-tight border-2 border-slate-900 flex items-center justify-center gap-1 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
            currentMode === 'rush'
              ? 'bg-red-500 text-white shadow-none translate-y-0.5'
              : 'bg-white/80 hover:bg-white text-slate-900'
          }`}
        >
          <span>🏪</span>
          <span>Taller</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onSelectMode('lab');
          }}
          className={`flex-1 min-w-[72px] py-1 px-1.5 rounded-lg font-['Rubik'] font-black text-[11px] uppercase tracking-tight border-2 border-slate-900 flex items-center justify-center gap-1 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
            currentMode === 'lab'
              ? 'bg-amber-300 text-slate-900 shadow-none translate-y-0.5'
              : 'bg-white/80 hover:bg-white text-slate-900'
          }`}
        >
          <Palette size={12} />
          <span>Diseñar</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onSelectMode('endless');
          }}
          className={`flex-1 min-w-[72px] py-1 px-1.5 rounded-lg font-['Rubik'] font-black text-[11px] uppercase tracking-tight border-2 border-slate-900 flex items-center justify-center gap-1 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${
            currentMode === 'endless'
              ? 'bg-orange-500 text-white shadow-none translate-y-0.5'
              : 'bg-white/80 hover:bg-white text-slate-900'
          }`}
        >
          <Flame size={12} />
          <span>Fiebre</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onOpenShop();
          }}
          className="flex-1 min-w-[65px] py-1 px-1.5 rounded-lg font-['Rubik'] font-black text-[11px] uppercase tracking-tight border-2 border-slate-900 flex items-center justify-center gap-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
        >
          <Store size={12} />
          <span>Tienda</span>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onOpenArtViewer();
          }}
          className="py-1 px-2 rounded-lg font-['Rubik'] font-black text-[11px] uppercase tracking-tight border-2 border-slate-900 flex items-center justify-center gap-1 bg-purple-400 hover:bg-purple-300 text-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
          title="Ver arte original"
        >
          <ImageIcon size={12} />
          <span>Arte</span>
        </button>
      </nav>
    </header>
  );
};
