import React, { useState } from 'react';
import { sounds } from '../services/audio';
import { X, Sparkles, Info, Eye } from 'lucide-react';

interface ArtHotspotsModalProps {
  onClose: () => void;
  onDiscoverSecret: (coins: number) => void;
}

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  rewardCoins: number;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'sign',
    x: 52,
    y: 12,
    title: 'Rótulo "Taller Versátil: Laboratorio de Ideas"',
    description: 'El corazón creativo del taller. El foco con orejitas de gato simboliza la chispa de creatividad para sublimar productos únicos.',
    rewardCoins: 25,
  },
  {
    id: 'press',
    x: 65,
    y: 65,
    title: 'Prensa Térmica Super Arigato (333°C)',
    description: 'La máquina de sublimación industrial de alta presión. Su termostato digital marca 333°C, la temperatura mágica para fijar los pigmentos cerámicos.',
    rewardCoins: 30,
  },
  {
    id: 'artisan',
    x: 32,
    y: 45,
    title: 'Maestro Gato Artesano (Maneki-Neko)',
    description: 'El felino de la buena fortuna con su mandil de trabajo, botones rojos y placa dorada. Experto en sacar tazas perfectas y sonrisas.',
    rewardCoins: 25,
  },
  {
    id: 'silla_mug',
    x: 88,
    y: 42,
    title: 'Taza "La Silla Estrellada"',
    description: 'En el estante superior descansa la obra maestra inspirada en el Cerro de la Silla de Monterrey con cielos al estilo Van Gogh.',
    rewardCoins: 20,
  },
  {
    id: 'vampire_poster',
    x: 9,
    y: 20,
    title: 'Póster Gato Vampiro Halloween',
    description: '¡Edición especial nocturna! Gato con colmillitos, capa de conde y calabaza de la suerte.',
    rewardCoins: 15,
  },
  {
    id: 'tape_dispenser',
    x: 8,
    y: 92,
    title: 'Cinta Térmica Amarilla',
    description: 'Rollo de cinta térmica de poliamida resistente al calor para fijar el papel transfer a la taza antes de prensar.',
    rewardCoins: 15,
  },
];

export const ArtHotspotsModal: React.FC<ArtHotspotsModalProps> = ({
  onClose,
  onDiscoverSecret,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);

  const handleSelectSpot = (spot: Hotspot) => {
    sounds.playTap();
    setSelectedHotspot(spot);

    if (!discoveredIds.includes(spot.id)) {
      sounds.playCoin();
      setDiscoveredIds((prev) => [...prev, spot.id]);
      onDiscoverSecret(spot.rewardCoins);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="w-full max-w-lg bg-amber-50 rounded-3xl border-4 border-black shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-3 border-b-3 border-black flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Eye size={20} className="text-amber-300" />
            <div>
              <h2 className="font-['Bungee'] text-xs sm:text-sm tracking-wide leading-tight">
                ILUSTRACIÓN ORIGINAL DEL TALLER
              </h2>
              <p className="text-[10px] text-purple-200 font-bold">
                Toca los puntos amarillos para descubrir detalles ({discoveredIds.length}/{HOTSPOTS.length})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/30 flex items-center justify-center active:scale-95 transition-transform"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable container with image and interactive hotspots */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-900 flex flex-col items-center">
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-black shadow-lg">
            {/* The user's uploaded illustration embedded directly */}
            <img
              src="/assets/aistudio/Taller_Versatil_Laboratorio_de_Ideas_294db90f.jpg"
              alt="Taller Versatil Laboratorio de Ideas Ilustracion"
              className="w-full h-auto block select-none pointer-events-none"
            />

            {/* Pulsing Hotspot pins */}
            {HOTSPOTS.map((spot) => {
              const isFound = discoveredIds.includes(spot.id);
              const isSelected = selectedHotspot?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  onClick={() => handleSelectSpot(spot)}
                  aria-label={spot.title}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-black flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-125 z-20 ${
                    isSelected
                      ? 'bg-red-500 scale-125 ring-4 ring-yellow-400'
                      : isFound
                      ? 'bg-amber-400 ring-2 ring-white animate-pulse'
                      : 'bg-yellow-300 ring-2 ring-red-500 animate-bounce'
                  }`}
                >
                  <span className="text-[11px] font-black text-slate-950 font-['Rubik']">
                    ★
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hotspot details info card */}
          {selectedHotspot && (
            <div className="w-full max-w-md bg-white rounded-2xl border-3 border-black p-3 mt-2 shadow-md animate-fade-in text-slate-900">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="font-['Rubik'] font-black text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="text-amber-500">✨</span>
                  {selectedHotspot.title}
                </h4>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  +{selectedHotspot.rewardCoins} 🪙
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {selectedHotspot.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-amber-100 border-t-2 border-black flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700">
            ¡Gana monedas explorando el taller!
          </span>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="bg-purple-700 hover:bg-purple-600 text-white font-['Rubik'] font-black px-4 py-1.5 rounded-xl border border-black cursor-pointer active:translate-y-0.5"
          >
            Volver a Jugar
          </button>
        </div>
      </div>
    </div>
  );
};
