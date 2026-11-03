/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, PlayerStats, MugDesign } from './types/game';
import { MUG_DESIGNS } from './data/designs';
import { MobileFrame } from './components/MobileFrame';
import { HeaderBar } from './components/HeaderBar';
import { WorkshopRushGame } from './components/WorkshopRushGame';
import { IdeasLab } from './components/IdeasLab';
import { EndlessPressGame } from './components/EndlessPressGame';
import { ShopModal } from './components/ShopModal';
import { ArtHotspotsModal } from './components/ArtHotspotsModal';

const STORAGE_KEY = 'taller_versatil_game_save_v1';

export default function App() {
  // Initial stats
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          coins: parsed.coins ?? 120,
          reputation: parsed.reputation ?? 95,
          totalMugsMade: parsed.totalMugsMade ?? 0,
          perfectMugs: parsed.perfectMugs ?? 0,
          burnedMugs: parsed.burnedMugs ?? 0,
          day: parsed.day ?? 1,
          highScoreEndless: parsed.highScoreEndless ?? 0,
        };
      }
    } catch {
      // fallback
    }
    return {
      coins: 120,
      reputation: 95,
      totalMugsMade: 0,
      perfectMugs: 0,
      burnedMugs: 0,
      day: 1,
      highScoreEndless: 0,
    };
  });

  const [currentMode, setCurrentMode] = useState<GameMode>('rush');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isArtViewerOpen, setIsArtViewerOpen] = useState(false);

  // Unlocked designs
  const [unlockedDesignIds, setUnlockedDesignIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_designs`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['arigato_gold', 'taller_foco', 'gato_vampiro'];
  });

  // Workshop upgrades
  const [upgrades, setUpgrades] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_upgrades`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { turbo_press: 1 };
  });

  // Persist game state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_designs`, JSON.stringify(unlockedDesignIds));
    } catch {
      // ignore
    }
  }, [unlockedDesignIds]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_upgrades`, JSON.stringify(upgrades));
    } catch {
      // ignore
    }
  }, [upgrades]);

  // Sync unlocked flag in global designs array
  useEffect(() => {
    MUG_DESIGNS.forEach((d) => {
      if (unlockedDesignIds.includes(d.id)) {
        d.unlocked = true;
      }
    });
  }, [unlockedDesignIds]);

  const handleUpdateStats = (newStats: Partial<PlayerStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const handleBuyDesign = (design: MugDesign) => {
    if (stats.coins >= design.price && !unlockedDesignIds.includes(design.id)) {
      setStats((prev) => ({ ...prev, coins: prev.coins - design.price }));
      setUnlockedDesignIds((prev) => [...prev, design.id]);
      design.unlocked = true;
    }
  };

  const handleBuyUpgrade = (upgradeId: string, cost: number) => {
    if (stats.coins >= cost) {
      setStats((prev) => ({ ...prev, coins: prev.coins - cost }));
      setUpgrades((prev) => ({
        ...prev,
        [upgradeId]: (prev[upgradeId] || 0) + 1,
      }));
    }
  };

  const handleSaveHighScore = (score: number) => {
    setStats((prev) => ({
      ...prev,
      highScoreEndless: Math.max(prev.highScoreEndless, score),
    }));
  };

  const handleAddCoins = (amount: number) => {
    setStats((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  return (
    <MobileFrame>
      {/* Header with coins, reputation, sound, and modes */}
      <HeaderBar
        stats={stats}
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenArtViewer={() => setIsArtViewerOpen(true)}
      />

      {/* Main Game Screen depending on mode */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {currentMode === 'rush' && (
          <WorkshopRushGame
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onOpenShop={() => setIsShopOpen(true)}
          />
        )}

        {currentMode === 'lab' && (
          <IdeasLab onAddCoins={handleAddCoins} />
        )}

        {currentMode === 'endless' && (
          <EndlessPressGame
            highScore={stats.highScoreEndless}
            onSaveHighScore={handleSaveHighScore}
            onAddCoins={handleAddCoins}
          />
        )}
      </div>

      {/* Shop Modal */}
      {isShopOpen && (
        <ShopModal
          coins={stats.coins}
          unlockedDesignIds={unlockedDesignIds}
          upgrades={upgrades}
          onBuyDesign={handleBuyDesign}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* Original Art Hotspots Viewer Modal */}
      {isArtViewerOpen && (
        <ArtHotspotsModal
          onClose={() => setIsArtViewerOpen(false)}
          onDiscoverSecret={(coins) => handleAddCoins(coins)}
        />
      )}
    </MobileFrame>
  );
}
