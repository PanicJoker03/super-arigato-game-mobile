import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Customer, MugDesign, PlayerStats } from '../types/game';
import { MUG_DESIGNS } from '../data/designs';
import { CUSTOMER_NAMES, CUSTOMER_DIALOGUES } from '../data/customers';
import { sounds } from '../services/audio';
import { HeatPressMachine } from './HeatPressMachine';
import { MugRenderer } from './MugRenderer';
import { MugArtBadge } from './MugArtBadges';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

interface WorkshopRushGameProps {
  stats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onOpenShop: () => void;
}

type Step = 'pick_mug' | 'pick_paper' | 'tape' | 'press' | 'peel' | 'deliver' | 'day_complete';

export const WorkshopRushGame: React.FC<WorkshopRushGameProps> = ({
  stats,
  onUpdateStats,
  onOpenShop,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('pick_mug');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [combo, setCombo] = useState(0);
  const [selectedMugType, setSelectedMugType] = useState<'white' | 'magic' | 'golden' | 'neon'>('white');
  const [selectedDesign, setSelectedDesign] = useState<MugDesign | null>(null);
  const [isTaped, setIsTaped] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [pressQuality, setPressQuality] = useState<'perfect' | 'good' | 'faint' | 'burned'>('good');
  const [dayOrdersCompleted, setDayOrdersCompleted] = useState(0);
  const [dayTotalCoinsEarned, setDayTotalCoinsEarned] = useState(0);

  const ORDERS_PER_DAY = 4;
  const patienceTimerRef = useRef<number | null>(null);

  // Generate a random customer
  const spawnNewCustomer = useCallback(() => {
    const unlockedDesigns = MUG_DESIGNS.filter((d) => d.unlocked);
    const randomDesign = unlockedDesigns[Math.floor(Math.random() * unlockedDesigns.length)];
    const randomName = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const avatarCats: Array<'golden' | 'pink' | 'blue' | 'vampire' | 'soccer' | 'grandma'> = [
      'golden', 'pink', 'blue', 'vampire', 'soccer', 'grandma'
    ];
    const randomCat = avatarCats[Math.floor(Math.random() * avatarCats.length)];
    const dialogues = CUSTOMER_DIALOGUES[randomDesign.id] || ['¡Quiero una taza genial del taller!'];
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];

    const mugTypes: Array<'white' | 'magic' | 'golden' | 'neon'> = ['white', 'white', 'magic', 'golden'];
    const chosenMugType = mugTypes[Math.floor(Math.random() * mugTypes.length)];

    const baseReward = randomDesign.price + (chosenMugType === 'golden' ? 25 : chosenMugType === 'magic' ? 15 : 0);

    const newCustomer: Customer = {
      id: String(Date.now()),
      name: randomName,
      avatarBg: '#fef08a',
      avatarCat: randomCat,
      dialogue: randomDialogue,
      patience: 45,
      currentPatience: 45,
      order: {
        mugType: chosenMugType,
        designId: randomDesign.id,
      },
      reward: baseReward,
      tip: 15,
    };

    setCustomer(newCustomer);
    setCurrentStep('pick_mug');
    setSelectedDesign(null);
    setIsTaped(false);
    setIsPressed(false);
  }, []);

  // Spawn customer on first mount or reset
  useEffect(() => {
    if (!customer && currentStep !== 'day_complete') {
      spawnNewCustomer();
    }
  }, [customer, currentStep, spawnNewCustomer]);

  // Patience countdown
  useEffect(() => {
    if (customer && currentStep !== 'day_complete') {
      patienceTimerRef.current = window.setInterval(() => {
        setCustomer((prev) => {
          if (!prev) return null;
          const nextPatience = prev.currentPatience - 1;
          if (nextPatience <= 0) {
            // Customer left upset
            sounds.playBurnedBuzz();
            setCombo(0);
            onUpdateStats({
              reputation: Math.max(10, stats.reputation - 5),
            });
            setTimeout(spawnNewCustomer, 1000);
            return null;
          }
          return { ...prev, currentPatience: nextPatience };
        });
      }, 1000);
    }

    return () => {
      if (patienceTimerRef.current) clearInterval(patienceTimerRef.current);
    };
  }, [customer, currentStep, onUpdateStats, stats.reputation, spawnNewCustomer]);

  // Customer order target design
  const targetDesign = customer ? MUG_DESIGNS.find((d) => d.id === customer.order.designId) : null;

  // Step 1: User selects blank mug
  const handleSelectMug = (type: 'white' | 'magic' | 'golden' | 'neon') => {
    sounds.playTap();
    setSelectedMugType(type);
    setCurrentStep('pick_paper');
  };

  // Step 2: User applies transfer paper
  const handleSelectPaper = (design: MugDesign) => {
    sounds.playTap();
    setSelectedDesign(design);
    setCurrentStep('tape');
  };

  // Step 3: Fasten thermal tape
  const handleApplyTape = () => {
    sounds.playPeelSound();
    setIsTaped(true);
    setTimeout(() => {
      setCurrentStep('press');
    }, 400);
  };

  // Step 4: Press complete
  const handlePressComplete = (quality: 'perfect' | 'good' | 'faint' | 'burned') => {
    setPressQuality(quality);
    setIsPressed(true);
    setCurrentStep('peel');
  };

  // Step 5: Peel transfer paper
  const handlePeelPaper = () => {
    sounds.playPeelSound();
    if (pressQuality === 'perfect') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#fbbf24', '#f59e0b', '#dc2626', '#38bdf8'],
      });
    }
    setCurrentStep('deliver');
  };

  // Step 6: Deliver to customer
  const handleDeliver = () => {
    if (!customer || !selectedDesign) return;

    const isCorrectMug = selectedMugType === customer.order.mugType;
    const isCorrectDesign = selectedDesign.id === customer.order.designId;

    let earnedCoins = customer.reward;
    let earnedRep = 2;

    if (pressQuality === 'perfect') {
      earnedCoins += customer.tip + combo * 5;
      earnedRep += 3;
      setCombo((c) => c + 1);
      sounds.playCoin();
    } else if (pressQuality === 'good') {
      earnedCoins += Math.floor(customer.tip / 2);
      earnedRep += 1;
      setCombo(0);
      sounds.playCoin();
    } else if (pressQuality === 'faint') {
      earnedCoins = Math.floor(earnedCoins * 0.6);
      earnedRep = -2;
      setCombo(0);
      sounds.playBurnedBuzz();
    } else if (pressQuality === 'burned') {
      earnedCoins = 0;
      earnedRep = -6;
      setCombo(0);
      sounds.playBurnedBuzz();
    }

    if (!isCorrectMug || !isCorrectDesign) {
      earnedCoins = Math.max(5, Math.floor(earnedCoins * 0.4));
      earnedRep -= 5;
    }

    const nextCompleted = dayOrdersCompleted + 1;
    const nextTotalCoins = dayTotalCoinsEarned + earnedCoins;

    setDayOrdersCompleted(nextCompleted);
    setDayTotalCoinsEarned(nextTotalCoins);

    onUpdateStats({
      coins: stats.coins + earnedCoins,
      reputation: Math.min(100, Math.max(5, stats.reputation + earnedRep)),
      totalMugsMade: stats.totalMugsMade + 1,
      perfectMugs: stats.perfectMugs + (pressQuality === 'perfect' ? 1 : 0),
      burnedMugs: stats.burnedMugs + (pressQuality === 'burned' ? 1 : 0),
    });

    if (nextCompleted >= ORDERS_PER_DAY) {
      sounds.playPerfectFanfare();
      setCurrentStep('day_complete');
    } else {
      spawnNewCustomer();
    }
  };

  // Start next shift day
  const handleNextDay = () => {
    sounds.playTap();
    onUpdateStats({
      day: stats.day + 1,
    });
    setDayOrdersCompleted(0);
    setDayTotalCoinsEarned(0);
    spawnNewCustomer();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 relative select-none">
      {/* Customer Order Bar */}
      {customer && currentStep !== 'day_complete' && (
        <div className="w-full bg-white/95 rounded-2xl border-3 border-slate-900 p-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] mb-3 flex flex-col gap-1.5">
          {/* Customer info & patience bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-amber-200 border-2 border-slate-900 flex items-center justify-center text-lg shadow-inner">
                {customer.avatarCat === 'vampire'
                  ? '🧛'
                  : customer.avatarCat === 'soccer'
                  ? '⚽'
                  : customer.avatarCat === 'pink'
                  ? '🌸'
                  : customer.avatarCat === 'blue'
                  ? '💎'
                  : customer.avatarCat === 'grandma'
                  ? '👵'
                  : '🐱'}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-['Rubik'] font-black text-xs text-slate-900">
                    {customer.name}
                  </span>
                  {combo > 1 && (
                    <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full animate-bounce">
                      x{combo} Combo!
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-600 line-clamp-1 italic">
                  "{customer.dialogue}"
                </p>
              </div>
            </div>

            {/* Reward Preview */}
            <div className="text-right">
              <span className="text-[11px] font-black text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full font-['Rubik']">
                +{customer.reward + customer.tip} 🪙
              </span>
            </div>
          </div>

          {/* Patience Bar */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-900/20">
            <div
              className={`h-full transition-all duration-1000 ${
                customer.currentPatience > 20
                  ? 'bg-emerald-500'
                  : customer.currentPatience > 10
                  ? 'bg-amber-500'
                  : 'bg-red-500 animate-pulse'
              }`}
              style={{
                width: `${(customer.currentPatience / customer.patience) * 100}%`,
              }}
            />
          </div>

          {/* Wanted Item Callout */}
          {targetDesign && (
            <div className="bg-amber-50 rounded-xl p-1.5 border border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded">
                  Pedido:
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {targetDesign.name} ({customer.order.mugType === 'golden' ? 'Taza Oro' : customer.order.mugType === 'magic' ? 'Taza Mágica' : 'Taza Blanca'})
                </span>
              </div>
              <div className="w-6 h-6 flex items-center justify-center">
                <MugArtBadge type={targetDesign.badgeType} className="w-6 h-6 scale-50" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Work Area based on Current Step */}
      <div className="flex-1 flex flex-col items-center justify-center my-1">
        {/* STEP 1: PICK MUG */}
        {currentStep === 'pick_mug' && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="bg-amber-400 text-slate-900 font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow">
              PASO 1: ESCOGE LA TAZA BASE
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <button
                onClick={() => handleSelectMug('white')}
                className="bg-white hover:bg-slate-50 border-3 border-slate-900 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                <div className="w-14 h-16 bg-white border-2 border-slate-900 rounded-t-md rounded-b-xl shadow-xs" />
                <span className="font-['Rubik'] font-black text-xs text-slate-900">
                  Blanca Clásica
                </span>
                <span className="text-[10px] text-slate-500">Sublimación pura</span>
              </button>

              <button
                onClick={() => handleSelectMug('magic')}
                className="bg-slate-900 hover:bg-slate-800 text-white border-3 border-slate-900 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                <div className="w-14 h-16 bg-indigo-950 border-2 border-indigo-400 rounded-t-md rounded-b-xl shadow-xs" />
                <span className="font-['Rubik'] font-black text-xs text-amber-300">
                  Mágica Térmica
                </span>
                <span className="text-[10px] text-slate-300">Cambia con calor</span>
              </button>

              <button
                onClick={() => handleSelectMug('golden')}
                className="bg-amber-400 hover:bg-amber-300 border-3 border-slate-900 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                <div className="w-14 h-16 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-2 border-slate-900 rounded-t-md rounded-b-xl shadow-xs" />
                <span className="font-['Rubik'] font-black text-xs text-amber-950">
                  Dorada VIP
                </span>
                <span className="text-[10px] text-amber-900 font-bold">+25 🪙 Valor</span>
              </button>

              <button
                onClick={() => handleSelectMug('neon')}
                className="bg-pink-100 hover:bg-pink-200 border-3 border-slate-900 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
              >
                <div className="w-14 h-16 bg-pink-500 border-2 border-slate-900 rounded-t-md rounded-b-xl shadow-xs" />
                <span className="font-['Rubik'] font-black text-xs text-pink-900">
                  Rosa Neón
                </span>
                <span className="text-[10px] text-pink-700">Edición Kawaii</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PICK TRANSFER PAPER */}
        {currentStep === 'pick_paper' && (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="bg-amber-400 text-slate-900 font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow">
              PASO 2: SELECCIONA EL PAPEL TRANSFER
            </div>
            <p className="text-[11px] font-bold text-slate-700">
              {customer ? `El cliente pidió: ${targetDesign?.name}` : 'Elige un diseño'}
            </p>

            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm max-h-72 overflow-y-auto p-1">
              {MUG_DESIGNS.filter((d) => d.unlocked).map((design) => {
                const isTarget = targetDesign?.id === design.id;
                return (
                  <button
                    key={design.id}
                    onClick={() => handleSelectPaper(design)}
                    className={`relative rounded-2xl border-3 border-slate-900 p-2.5 flex flex-col items-center justify-between gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform active:scale-95 ${
                      isTarget
                        ? 'bg-amber-100 ring-3 ring-amber-500'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    {isTarget && (
                      <span className="absolute -top-2 bg-red-600 text-white font-black text-[9px] px-2 py-0.2 rounded-full uppercase shadow">
                        ★ Pedido
                      </span>
                    )}
                    <div className="w-16 h-16 flex items-center justify-center">
                      <MugArtBadge type={design.badgeType} className="scale-75" />
                    </div>
                    <span className="font-['Rubik'] font-black text-[11px] text-slate-900 text-center leading-tight">
                      {design.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: APPLY THERMAL TAPE */}
        {currentStep === 'tape' && selectedDesign && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="bg-amber-400 text-slate-900 font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow">
              PASO 3: FIJA EL PAPEL CON CINTA TÉRMICA
            </div>

            <div className="my-2">
              <MugRenderer
                mugType={selectedMugType}
                badgeType={selectedDesign.badgeType}
                isPaperApplied={true}
                hasTape={isTaped}
                scale={1.1}
              />
            </div>

            {/* Tape Dispenser Button (Matches the yellow tape roll in the illustration!) */}
            <button
              onClick={handleApplyTape}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-['Rubik'] font-black text-xs px-5 py-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2 active:translate-y-0.5 animate-bounce cursor-pointer"
            >
              <span className="text-xl">🟡</span>
              <span>¡PEGAR CINTA TÉRMICA AMARILLA!</span>
            </button>
            <span className="text-[10px] text-slate-600 font-bold">
              Toca para fijar los bordes y evitar fantasmas en la impresión
            </span>
          </div>
        )}

        {/* STEP 4: HEAT PRESS */}
        {currentStep === 'press' && selectedDesign && (
          <div className="w-full flex flex-col items-center">
            <div className="bg-red-600 text-white font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow mb-2 animate-pulse">
              PASO 4: ¡CALIENTA A 333°C!
            </div>

            <HeatPressMachine
              isLoaded={true}
              mugType={selectedMugType}
              badgeType={selectedDesign.badgeType}
              hasTape={isTaped}
              onPressComplete={handlePressComplete}
            />
          </div>
        )}

        {/* STEP 5: PEEL TRANSFER PAPER */}
        {currentStep === 'peel' && selectedDesign && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="bg-emerald-500 text-white font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow">
              PASO 5: DESPEGA EL PAPEL TÉRMICO
            </div>

            <div className="my-2">
              <MugRenderer
                mugType={selectedMugType}
                badgeType={selectedDesign.badgeType}
                isPaperApplied={false}
                quality={pressQuality}
                isSteaming={pressQuality === 'perfect' || pressQuality === 'good'}
                scale={1.15}
              />
            </div>

            <div className="text-center">
              <span
                className={`font-['Bungee'] text-sm uppercase px-3 py-1 rounded-lg border-2 border-black shadow inline-block ${
                  pressQuality === 'perfect'
                    ? 'bg-amber-300 text-amber-950'
                    : pressQuality === 'good'
                    ? 'bg-emerald-300 text-emerald-950'
                    : pressQuality === 'faint'
                    ? 'bg-slate-300 text-slate-800'
                    : 'bg-red-500 text-white'
                }`}
              >
                {pressQuality === 'perfect' && '★ ¡CALIDAD PERFECTA A 333°C! ★'}
                {pressQuality === 'good' && '✓ Buen Prensado'}
                {pressQuality === 'faint' && '⚠️ Faltó calor (Diseño tenue)'}
                {pressQuality === 'burned' && '🔥 Taza sobrecalentada'}
              </span>
            </div>

            <button
              onClick={handlePeelPaper}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-['Rubik'] font-black text-xs px-6 py-2.5 rounded-2xl border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>¡DESPEGAR Y REVELAR TAZA!</span>
            </button>
          </div>
        )}

        {/* STEP 6: DELIVER TO CUSTOMER */}
        {currentStep === 'deliver' && selectedDesign && customer && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="bg-emerald-500 text-white font-['Bungee'] text-xs px-3 py-1 rounded-full border-2 border-black shadow">
              PASO 6: ¡ENTREGA AL CLIENTE!
            </div>

            <div className="my-2">
              <MugRenderer
                mugType={selectedMugType}
                badgeType={selectedDesign.badgeType}
                quality={pressQuality}
                scale={1.2}
              />
            </div>

            <div className="bg-white/95 rounded-2xl border-3 border-slate-900 p-3 max-w-xs w-full text-center shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <p className="font-['Rubik'] font-black text-xs text-slate-900 mb-1">
                {customer.name} dice:
              </p>
              <p className="text-xs italic text-slate-700">
                {pressQuality === 'perfect'
                  ? '¡¡GUAU!! ¡Quedó absolutamente perfecta! ¡Súper Arigato!'
                  : pressQuality === 'good'
                  ? '¡Me encanta! Gracias por atender tan rápido.'
                  : pressQuality === 'faint'
                  ? 'Mmm, el color se ve algo apagado, pero me la llevaré.'
                  : '¡Ay no! ¡Huele a quemado! Qué lástima...'}
              </p>

              <button
                onClick={handleDeliver}
                className="mt-3 w-full bg-red-500 hover:bg-red-400 text-white font-['Rubik'] font-black text-xs py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5"
              >
                <span>Cobrar y Entregar</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* DAY COMPLETE SUMMARY */}
        {currentStep === 'day_complete' && (
          <div className="w-full flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-400 border-4 border-black flex items-center justify-center shadow-lg">
              <Trophy size={32} className="text-slate-900" />
            </div>

            <h2 className="font-['Bungee'] text-lg text-slate-900 text-center leading-tight">
              ¡JORNADA DÍA {stats.day} COMPLETADA!
            </h2>
            <p className="text-xs font-bold text-slate-700 -mt-2">
              El Taller Versátil cierra por hoy con éxito.
            </p>

            <div className="w-full max-w-xs bg-white rounded-2xl border-3 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Pedidos atendidos:</span>
                <span className="font-['Rubik'] font-black text-sm text-slate-900">
                  {dayOrdersCompleted} tazas
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600">Monedas del día:</span>
                <span className="font-['Rubik'] font-black text-sm text-amber-600">
                  +{dayTotalCoinsEarned} 🪙
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-xs font-bold text-slate-600">Reputación Taller:</span>
                <span className="font-['Rubik'] font-black text-sm text-emerald-600">
                  {stats.reputation}% ⭐
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full max-w-xs mt-2">
              <button
                onClick={onOpenShop}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-['Rubik'] font-black text-xs py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
              >
                Visitar Tienda
              </button>
              <button
                onClick={handleNextDay}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-['Rubik'] font-black text-xs py-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Día {stats.day + 1}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Progress Bar for Orders of the Day */}
      {currentStep !== 'day_complete' && (
        <div className="w-full bg-white/80 rounded-xl border-2 border-slate-900/60 p-2 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📅</span>
            <span className="text-[11px] font-bold text-slate-800">
              Día {stats.day} • Pedido {Math.min(ORDERS_PER_DAY, dayOrdersCompleted + 1)} de {ORDERS_PER_DAY}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: ORDERS_PER_DAY }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full border border-black ${
                  idx < dayOrdersCompleted ? 'bg-emerald-400' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
