import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [usePhoneFrame, setUsePhoneFrame] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#1e140d] bg-[radial-gradient(#3a2517_1px,transparent_1px)] [background-size:16px_16px] flex flex-col items-center justify-center sm:p-4 text-slate-900 overflow-x-hidden">
      {/* Desktop Helper Toggle */}
      <div className="hidden sm:flex items-center gap-2 mb-2 bg-amber-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-600/40 text-amber-200 text-xs font-bold shadow-md">
        <span>Vista del Juego:</span>
        <button
          onClick={() => setUsePhoneFrame(!usePhoneFrame)}
          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full transition-colors font-['Rubik']"
        >
          {usePhoneFrame ? (
            <>
              <Maximize2 size={12} /> Pantalla Completa
            </>
          ) : (
            <>
              <Smartphone size={12} /> Celular Simulador
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          usePhoneFrame
            ? 'max-w-[420px] h-[860px] rounded-[48px] border-[10px] border-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative ring-4 ring-amber-500/20'
            : 'max-w-md min-h-screen sm:min-h-[840px] sm:rounded-3xl sm:border-4 sm:border-slate-900 sm:shadow-2xl flex flex-col overflow-hidden relative bg-amber-50'
        }`}
      >
        {/* Smartphone Notch / Top Status Bar */}
        {usePhoneFrame && (
          <div className="w-full bg-slate-950 text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono select-none z-50">
            <span>07:30</span>
            {/* Camera speaker notch */}
            <div className="w-20 h-4 bg-black rounded-full border border-slate-800 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2" />
              <div className="w-6 h-1 bg-slate-800 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
              <span className="w-4 h-2 bg-emerald-500 rounded-xs inline-block" />
            </div>
          </div>
        )}

        {/* Game Viewport Content */}
        <main className="flex-1 flex flex-col bg-amber-100 overflow-y-auto no-scrollbar relative">
          {children}
        </main>

        {/* Mobile Home Bar Pill Indicator */}
        {usePhoneFrame && (
          <div className="w-full bg-slate-950 py-2 flex justify-center items-center z-50">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
