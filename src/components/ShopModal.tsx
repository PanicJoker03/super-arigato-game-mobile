import React, { useState } from 'react';
import { MUG_DESIGNS } from '../data/designs';
import { WORKSHOP_UPGRADES } from '../data/customers';
import { MugArtBadge } from './MugArtBadges';
import { sounds } from '../services/audio';
import { MugDesign } from '../types/game';
import { X, Store, Lock, Check, Sparkles } from 'lucide-react';

interface ShopModalProps {
  coins: number;
  unlockedDesignIds: string[];
  upgrades: Record<string, number>;
  onBuyDesign: (design: MugDesign) => void;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  unlockedDesignIds,
  upgrades,
  onBuyDesign,
  onBuyUpgrade,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'designs' | 'upgrades'>('designs');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-sm bg-amber-50 rounded-3xl border-4 border-slate-950 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3.5 border-b-3 border-slate-950 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Store size={22} className="text-amber-200" />
            <div>
              <h2 className="font-['Bungee'] text-sm tracking-wide leading-tight">
                TIENDA DE MEJORAS
              </h2>
              <p className="text-[10px] text-emerald-100 font-bold">
                Monedas disponibles: <span className="text-amber-300 font-black">{coins} 🪙</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Cerrar tienda"
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 border border-white/30 flex items-center justify-center active:scale-95 transition-transform"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b-2 border-slate-900 bg-amber-100 p-1.5 gap-1.5">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('designs');
            }}
            className={`flex-1 py-1.5 rounded-xl font-['Rubik'] font-black text-xs uppercase transition-colors ${
              activeTab === 'designs'
                ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-xs'
                : 'bg-white/60 text-slate-700'
            }`}
          >
            🎨 Nuevos Diseños
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('upgrades');
            }}
            className={`flex-1 py-1.5 rounded-xl font-['Rubik'] font-black text-xs uppercase transition-colors ${
              activeTab === 'upgrades'
                ? 'bg-amber-400 text-slate-950 border-2 border-black shadow-xs'
                : 'bg-white/60 text-slate-700'
            }`}
          >
            ⚙️ Mejoras de Prensa
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {activeTab === 'designs' ? (
            <div className="grid grid-cols-1 gap-2">
              {MUG_DESIGNS.map((design) => {
                const isUnlocked = unlockedDesignIds.includes(design.id) || design.unlocked;
                const canAfford = coins >= design.price;

                return (
                  <div
                    key={design.id}
                    className="bg-white rounded-2xl border-2 border-black p-2.5 flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-slate-900/30 flex items-center justify-center">
                        <MugArtBadge type={design.badgeType} className="scale-60" />
                      </div>
                      <div>
                        <h4 className="font-['Rubik'] font-black text-xs text-slate-900 leading-tight">
                          {design.name}
                        </h4>
                        <p className="text-[10px] text-slate-600 line-clamp-1">
                          {design.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-400 flex items-center gap-1 font-['Rubik']">
                          <Check size={12} /> Desbloqueado
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              sounds.playCoin();
                              onBuyDesign(design);
                            } else {
                              sounds.playBurnedBuzz();
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl font-['Rubik'] font-black text-xs flex items-center gap-1 border-2 border-black transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:translate-y-0.5 shadow-xs cursor-pointer'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                          }`}
                        >
                          <Lock size={12} />
                          <span>{design.price} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {WORKSHOP_UPGRADES.map((upgrade) => {
                const currentLevel = upgrades[upgrade.id] || 0;
                const cost = upgrade.cost * (currentLevel + 1);
                const isMax = currentLevel >= upgrade.maxLevel;
                const canAfford = coins >= cost;

                return (
                  <div
                    key={upgrade.id}
                    className="bg-white rounded-2xl border-2 border-black p-3 flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-200 border border-black flex items-center justify-center text-xl shadow-inner">
                        {upgrade.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-['Rubik'] font-black text-xs text-slate-900">
                            {upgrade.name}
                          </h4>
                          <span className="text-[9px] bg-slate-900 text-white font-bold px-1.5 py-0.2 rounded">
                            Nv. {currentLevel}/{upgrade.maxLevel}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {upgrade.bonusText}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isMax ? (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md">
                          Máx. Nivel
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              sounds.playCoin();
                              onBuyUpgrade(upgrade.id, cost);
                            } else {
                              sounds.playBurnedBuzz();
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded-xl font-['Rubik'] font-black text-xs flex items-center gap-1 border-2 border-black transition-all ${
                            canAfford
                              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 active:translate-y-0.5 shadow-xs cursor-pointer'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                          }`}
                        >
                          <Sparkles size={12} />
                          <span>{cost} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-amber-100 border-t-2 border-slate-900 flex justify-end">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-['Rubik'] font-black text-xs py-2 rounded-xl border border-black cursor-pointer"
          >
            Volver al Taller
          </button>
        </div>
      </div>
    </div>
  );
};
