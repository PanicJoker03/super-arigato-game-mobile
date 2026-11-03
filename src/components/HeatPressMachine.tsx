import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../services/audio';
import { MugRenderer } from './MugRenderer';

interface HeatPressMachineProps {
  isLoaded: boolean;
  mugType?: 'white' | 'magic' | 'golden' | 'neon';
  badgeType: string;
  customText?: string;
  hasTape?: boolean;
  onPressComplete: (quality: 'perfect' | 'good' | 'faint' | 'burned') => void;
  speedMultiplier?: number;
}

export const HeatPressMachine: React.FC<HeatPressMachineProps> = ({
  isLoaded,
  mugType = 'white',
  badgeType,
  customText,
  hasTape = true,
  onPressComplete,
  speedMultiplier = 1,
}) => {
  const [isClamped, setIsClamped] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [resultQuality, setResultQuality] = useState<'perfect' | 'good' | 'faint' | 'burned' | null>(null);
  const timerRef = useRef<number | null>(null);

  // Target temperature is 333°C (as seen prominently in the illustration!)
  const TARGET_TEMP = 333;
  const PERFECT_MIN = 320;
  const PERFECT_MAX = 345;
  const BURN_THRESHOLD = 370;

  // Heating process loop
  useEffect(() => {
    if (isClamped && isHeating) {
      timerRef.current = window.setInterval(() => {
        setTemperature((prev) => {
          const increment = Math.floor((12 + Math.random() * 8) * speedMultiplier);
          const next = prev + increment;

          // Sound beeps as it approaches 333°C
          if (next >= 280 && next <= 360 && Math.random() > 0.4) {
            sounds.playDigitalBeep(next >= PERFECT_MIN && next <= PERFECT_MAX);
          }

          // Auto-emergency release if burns too much
          if (next > 410) {
            handleOpenPress(next);
            return next;
          }

          return next;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isClamped, isHeating, speedMultiplier]);

  const handlePullLever = () => {
    if (!isLoaded || isClamped) return;
    sounds.playLeverClank();
    setIsClamped(true);
    setIsHeating(true);
    setResultQuality(null);
  };

  const handleOpenPress = (overrideTemp?: number) => {
    if (!isClamped) return;
    sounds.playLeverClank();
    setIsClamped(false);
    setIsHeating(false);

    const finalTemp = overrideTemp !== undefined ? overrideTemp : temperature;
    sounds.playSteamHiss();

    let quality: 'perfect' | 'good' | 'faint' | 'burned' = 'good';
    if (finalTemp >= PERFECT_MIN && finalTemp <= PERFECT_MAX) {
      quality = 'perfect';
      sounds.playPerfectFanfare();
    } else if (finalTemp < 280) {
      quality = 'faint';
      sounds.playBurnedBuzz();
    } else if (finalTemp > BURN_THRESHOLD) {
      quality = 'burned';
      sounds.playBurnedBuzz();
    } else {
      quality = 'good';
      sounds.playCoin();
    }

    setResultQuality(quality);
    onPressComplete(quality);

    // Reset temperature gradually after press
    setTimeout(() => {
      setTemperature(25);
    }, 1500);
  };

  // Temperature status string
  const getTempStatus = () => {
    if (temperature < 200) return 'Calentando...';
    if (temperature < PERFECT_MIN) return '¡Casi listo!';
    if (temperature <= PERFECT_MAX) return '⭐ ¡ZONA PERFECTA! ⭐';
    if (temperature <= BURN_THRESHOLD) return '⚠️ ¡Cuidado, muy caliente!';
    return '🔥 ¡QUEMÁNDOSE! 🔥';
  };

  return (
    <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Top Banner / Machine Brand */}
      <div className="w-full bg-slate-900 text-amber-300 px-3 py-1.5 rounded-t-xl border-3 border-b-0 border-black flex items-center justify-between shadow-md">
        <span className="font-['Bungee'] text-xs tracking-wider flex items-center gap-1.5 text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          PRENSA TÉRMICA 333
        </span>
        <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase">
          SUPER ARIGATO
        </span>
      </div>

      {/* Main Heat Press Body (Illustration-accurate red & dark metal industrial press) */}
      <div className="relative w-full bg-gradient-to-b from-red-600 via-red-700 to-red-800 border-4 border-black rounded-b-2xl p-4 shadow-[0_10px_0_rgba(0,0,0,0.35)] flex flex-col items-center">
        {/* Machine Head Arch & Lever */}
        <div className="w-full flex items-center justify-between mb-3 px-2">
          {/* Digital 7-Segment Temperature Display */}
          <div className="bg-black border-2 border-slate-700 rounded-lg px-3 py-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex flex-col items-center min-w-[90px]">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">
              TEMP °C
            </span>
            <span
              className={`font-mono text-2xl font-black tracking-widest leading-none drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] ${
                temperature >= PERFECT_MIN && temperature <= PERFECT_MAX
                  ? 'text-emerald-400'
                  : temperature > BURN_THRESHOLD
                  ? 'text-red-500 animate-pulse'
                  : 'text-red-500'
              }`}
            >
              {String(temperature).padStart(3, '0')}
            </span>
          </div>

          {/* Status badge */}
          <div className="flex-1 mx-2 text-center">
            <span
              className={`inline-block text-[11px] font-black px-2 py-1 rounded-md border border-black/30 shadow-xs uppercase font-['Rubik'] transition-colors duration-200 ${
                temperature >= PERFECT_MIN && temperature <= PERFECT_MAX
                  ? 'bg-emerald-400 text-emerald-950 animate-bounce'
                  : temperature > BURN_THRESHOLD
                  ? 'bg-amber-300 text-red-700 animate-pulse'
                  : 'bg-black/30 text-white'
              }`}
            >
              {isHeating ? getTempStatus() : isLoaded ? 'Listo para prensar' : 'Inserta una taza'}
            </span>
          </div>

          {/* Big Physical Lever with Black Rubber Grip */}
          <button
            onClick={isClamped ? () => handleOpenPress() : handlePullLever}
            disabled={!isLoaded}
            aria-label={isClamped ? 'Abrir prensa térmica' : 'Bajar palanca'}
            className={`group relative flex flex-col items-center cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {/* Lever Arm */}
            <div
              className={`w-4 h-12 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-2 border-black rounded transition-transform duration-300 origin-bottom shadow-md ${
                isClamped ? 'rotate-[-35deg] translate-y-1' : 'rotate-[15deg]'
              }`}
            >
              {/* Rubber Grip Handle */}
              <div className="absolute -top-3 -left-2 w-8 h-6 bg-slate-900 border-2 border-black rounded-lg shadow-inner flex items-center justify-center">
                <div className="w-6 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
            <span className="text-[10px] font-black text-amber-200 uppercase mt-2 tracking-tight">
              {isClamped ? '¡ABRIR!' : 'BAJAR'}
            </span>
          </button>
        </div>

        {/* The Mug Cradle / Silicone Heating Chamber */}
        <div className="relative w-full h-56 bg-slate-900 rounded-xl border-3 border-black p-2 flex items-center justify-center overflow-hidden shadow-inner">
          {/* Background Industrial Screws and Bolts */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-700 border border-black" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-700 border border-black" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-700 border border-black" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-700 border border-black" />

          {/* Heating Coil Glow Effect when active */}
          {isHeating && (
            <div className="absolute inset-0 bg-radial from-red-500/25 via-amber-500/10 to-transparent animate-pulse pointer-events-none" />
          )}

          {/* Silicon Heating Clamp Wrap (Red/Orange flexible sleeve in front of/around mug) */}
          {isLoaded ? (
            <div className="relative flex items-center justify-center transition-transform duration-300">
              <MugRenderer
                mugType={mugType}
                badgeType={badgeType}
                customText={customText}
                hasTape={hasTape}
                isPaperApplied={!resultQuality}
                quality={resultQuality || 'raw'}
                isSmoking={resultQuality === 'burned' || temperature > BURN_THRESHOLD}
                isSteaming={resultQuality === 'perfect' || resultQuality === 'good'}
                scale={0.9}
              />

              {/* Clamp Sleeve wrapping over the mug when locked */}
              {isClamped && (
                <div className="absolute inset-y-4 -left-2 -right-2 bg-gradient-to-r from-red-700/85 via-amber-600/70 to-red-700/85 rounded-xl border-2 border-amber-400 shadow-lg pointer-events-none flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <span className="text-white font-['Bungee'] text-sm tracking-wider uppercase text-center drop-shadow px-2">
                    SUBLIMANDO A {temperature}°C
                  </span>
                  <div className="w-3/4 h-2 bg-slate-900 rounded-full mt-2 overflow-hidden border border-amber-300">
                    <div
                      className={`h-full transition-all duration-100 ${
                        temperature >= PERFECT_MIN && temperature <= PERFECT_MAX
                          ? 'bg-emerald-400'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (temperature / TARGET_TEMP) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500 text-center px-4">
              <span className="text-4xl mb-2 opacity-60">☕</span>
              <span className="text-xs font-bold text-slate-400">
                Prensa vacía. Selecciona y prepara una taza para comenzar.
              </span>
            </div>
          )}
        </div>

        {/* Machine Base with "SUPER ARIGATO" Logo Plate */}
        <div className="w-full mt-3 flex items-center justify-between bg-black/60 px-3 py-1.5 rounded-lg border border-black/40">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🐱</span>
            <span className="font-['Bungee'] text-xs text-red-400 tracking-wider">
              SUPER ARIGATO
            </span>
          </div>

          {/* Quick Action Button for Mobile Convenience */}
          {isLoaded && (
            <button
              onClick={isClamped ? () => handleOpenPress() : handlePullLever}
              className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all ${
                isClamped
                  ? temperature >= PERFECT_MIN && temperature <= PERFECT_MAX
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 animate-pulse'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-red-500 hover:bg-red-400 text-white'
              }`}
            >
              {isClamped ? '¡ABRIR PRENSA!' : '¡BAJAR PALANCA!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
