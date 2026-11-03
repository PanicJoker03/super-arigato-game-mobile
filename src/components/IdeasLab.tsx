import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MugRenderer } from './MugRenderer';
import { MugArtBadge } from './MugArtBadges';
import { MUG_DESIGNS } from '../data/designs';
import { sounds } from '../services/audio';
import { CustomMugProject } from '../types/game';
import { Palette, Sparkles, Check, Trash2, Download } from 'lucide-react';

interface IdeasLabProps {
  onAddCoins: (amount: number) => void;
}

export const IdeasLab: React.FC<IdeasLabProps> = ({ onAddCoins }) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('lamp');
  const [mugColor, setMugColor] = useState<string>('#ffffff');
  const [customText, setCustomText] = useState<string>('MI TAZA FAVORITA');
  const [isSublimating, setIsSublimating] = useState<boolean>(false);
  const [sublimationFinished, setSublimationFinished] = useState<boolean>(false);

  // Saved collection
  const [savedMugs, setSavedMugs] = useState<CustomMugProject[]>([
    {
      id: 'demo-1',
      mugColor: '#ffffff',
      badge: 'arigato',
      customText: '¡ARIGATO!',
      textColor: '#000000',
      hasGlitter: true,
      createdAt: Date.now() - 50000,
    },
    {
      id: 'demo-2',
      mugColor: '#f59e0b',
      badge: 'lamp',
      customText: 'TALLER VERSÁTIL',
      textColor: '#000000',
      hasGlitter: false,
      createdAt: Date.now() - 25000,
    },
  ]);

  const COLOR_PALETTE = [
    { label: 'Blanco Puro', color: '#ffffff' },
    { label: 'Oro Fortuna', color: '#f59e0b' },
    { label: 'Rosa Neón', color: '#ec4899' },
    { label: 'Azul Noche', color: '#1e1b4b' },
    { label: 'Menta Fresca', color: '#10b981' },
    { label: 'Naranja Taller', color: '#f97316' },
  ];

  const BADGES = [
    { id: 'lamp', label: 'Foco de Ideas' },
    { id: 'arigato', label: 'Gato Arigato' },
    { id: 'vampire', label: 'Gato Vampiro' },
    { id: 'starry', label: 'La Silla Estrellada' },
    { id: 'soccer', label: 'Gato Futbolero' },
    { id: 'gracias', label: 'Súper Gracias' },
    { id: 'pinkcat', label: 'Gatito Rosa' },
    { id: 'bluecat', label: 'Gato Azul' },
  ];

  const handleStartSublimation = () => {
    sounds.playLeverClank();
    setIsSublimating(true);
    setSublimationFinished(false);

    // Sublimation timer sequence
    setTimeout(() => {
      sounds.playDigitalBeep(true);
    }, 1000);

    setTimeout(() => {
      sounds.playSteamHiss();
      sounds.playPeelSound();
      setIsSublimating(false);
      setSublimationFinished(true);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#0284c7', '#22c55e'],
      });

      // Save to shelf
      const newMug: CustomMugProject = {
        id: String(Date.now()),
        mugColor,
        badge: selectedBadge,
        customText,
        textColor: '#000000',
        hasGlitter: true,
        createdAt: Date.now(),
      };
      setSavedMugs((prev) => [newMug, ...prev.slice(0, 7)]);
      onAddCoins(20); // reward for creating in lab
    }, 2200);
  };

  const handleDeleteSavedMug = (id: string) => {
    sounds.playTap();
    setSavedMugs((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto no-scrollbar select-none">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-3 border-black rounded-2xl p-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-lg shadow-xs">
            💡
          </div>
          <div>
            <h2 className="font-['Bungee'] text-xs sm:text-sm text-slate-900 leading-tight">
              LABORATORIO DE IDEAS
            </h2>
            <p className="text-[10px] font-bold text-amber-900">
              Crea tu taza personalizada y hornéala a 333°C
            </p>
          </div>
        </div>
        <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
          Modo Libre
        </span>
      </div>

      {/* Mug Preview in Studio */}
      <div className="bg-white/95 rounded-2xl border-3 border-black p-4 flex flex-col items-center justify-center relative shadow-[3px_3px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Heat steam or glowing aura when sublimating */}
        {isSublimating && (
          <div className="absolute inset-0 bg-red-600/20 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 animate-pulse">
            <span className="font-['Bungee'] text-red-600 text-lg animate-bounce">
              ¡SUBLIMANDO A 333°C!
            </span>
            <span className="text-xs font-bold text-slate-800">Cerrando prensa térmica...</span>
          </div>
        )}

        <div className="my-2">
          <MugRenderer
            badgeType={selectedBadge}
            customText={customText}
            customColor={mugColor}
            isPaperApplied={false}
            quality="perfect"
            isSteaming={sublimationFinished}
            scale={1.25}
          />
        </div>

        {/* Action Button: Sublimate */}
        <button
          onClick={handleStartSublimation}
          disabled={isSublimating}
          className="mt-2 w-full max-w-xs bg-red-600 hover:bg-red-500 text-white font-['Rubik'] font-black text-xs py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={14} />
          <span>¡SUBLIMAR MI DISEÑO EN LA PRENSA!</span>
        </button>
      </div>

      {/* Customizer Controls */}
      <div className="bg-white/90 rounded-2xl border-3 border-black p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
        {/* 1. Pick Graphic Badge */}
        <div>
          <label className="text-[11px] font-['Rubik'] font-black text-slate-800 uppercase flex items-center gap-1 mb-1.5">
            <Palette size={12} className="text-amber-600" />
            1. Insignia o Gráfico del Taller
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {BADGES.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  sounds.playTap();
                  setSelectedBadge(b.id);
                  setSublimationFinished(false);
                }}
                className={`p-1 rounded-xl border-2 border-black flex flex-col items-center transition-all ${
                  selectedBadge === b.id
                    ? 'bg-amber-300 ring-2 ring-red-500 shadow-sm'
                    : 'bg-white hover:bg-slate-100'
                }`}
              >
                <div className="w-9 h-9 flex items-center justify-center">
                  <MugArtBadge type={b.id} className="scale-50" />
                </div>
                <span className="text-[9px] font-bold text-slate-800 text-center truncate w-full mt-0.5">
                  {b.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Pick Ceramic Mug Color */}
        <div>
          <label className="text-[11px] font-['Rubik'] font-black text-slate-800 uppercase flex items-center gap-1 mb-1.5">
            <span>🎨</span>
            2. Color de la Taza Cerámica
          </label>
          <div className="flex items-center justify-between gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.color}
                onClick={() => {
                  sounds.playTap();
                  setMugColor(c.color);
                  setSublimationFinished(false);
                }}
                className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center shadow-xs transition-transform active:scale-95 ${
                  mugColor === c.color ? 'ring-3 ring-amber-500 scale-110' : ''
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              >
                {mugColor === c.color && (
                  <Check
                    size={14}
                    className={c.color === '#ffffff' ? 'text-black' : 'text-white'}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Personalized Text */}
        <div>
          <label className="text-[11px] font-['Rubik'] font-black text-slate-800 uppercase flex items-center gap-1 mb-1">
            <span>✏️</span>
            3. Frase o Nombre Personalizado
          </label>
          <input
            type="text"
            maxLength={18}
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value.toUpperCase());
              setSublimationFinished(false);
            }}
            placeholder="ESCRIBE TU MENSAJE..."
            className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-['Rubik'] font-bold text-slate-900 shadow-inner uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Showcase Shelf of Saved Custom Mugs (Estantería de Colección) */}
      <div className="bg-amber-200/90 rounded-2xl border-3 border-black p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏆</span>
            <span className="font-['Bungee'] text-xs text-slate-900">
              ESTANTERÍA DEL TALLER ({savedMugs.length})
            </span>
          </div>
          <span className="text-[9px] font-bold text-amber-900">Tus creaciones</span>
        </div>

        {/* Shelf display with wooden look */}
        <div className="bg-[#b45309] border-2 border-black rounded-xl p-2 shadow-inner">
          <div className="grid grid-cols-3 gap-2">
            {savedMugs.map((mug) => (
              <div
                key={mug.id}
                className="bg-white/90 rounded-xl border-2 border-black p-1.5 flex flex-col items-center relative group shadow-sm"
              >
                <button
                  onClick={() => handleDeleteSavedMug(mug.id)}
                  aria-label="Eliminar taza guardada"
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                >
                  <Trash2 size={10} />
                </button>
                <div className="w-16 h-16 flex items-center justify-center">
                  <MugRenderer
                    badgeType={mug.badge}
                    customColor={mug.mugColor}
                    customText={mug.customText}
                    scale={0.5}
                  />
                </div>
                <span className="text-[9px] font-black text-slate-900 truncate w-full text-center mt-1">
                  {mug.customText || 'Taza Taller'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
