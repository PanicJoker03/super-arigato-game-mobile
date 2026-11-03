import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/audio';
import { MugArtBadge } from './MugArtBadges';
import { Flame, Trophy, Play, RotateCcw, Zap } from 'lucide-react';

interface EndlessPressGameProps {
  highScore: number;
  onSaveHighScore: (score: number) => void;
  onAddCoins: (coins: number) => void;
}

export const EndlessPressGame: React.FC<EndlessPressGameProps> = ({
  highScore,
  onSaveHighScore,
  onAddCoins,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentTemp, setCurrentTemp] = useState(50);
  const [indicatorSpeed, setIndicatorSpeed] = useState(12);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackColor, setFeedbackColor] = useState('text-emerald-500');
  const [activeBadge, setActiveBadge] = useState('arigato');

  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);
  const tempRef = useRef<number>(50);

  const BADGES = ['arigato', 'lamp', 'vampire', 'starry', 'soccer', 'gracias', 'pinkcat', 'bluecat'];

  // Start game
  const startGame = () => {
    sounds.playTap();
    setIsPlaying(true);
    setTimeLeft(30);
    setScore(0);
    setCombo(0);
    setFeedback(null);
    setCurrentTemp(50);
    tempRef.current = 50;
    directionRef.current = 1;
    setIndicatorSpeed(10);
    setActiveBadge('arigato');
  };

  // Timer loop
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying]);

  // Fast gauge oscillation loop (0°C to 400°C)
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      tempRef.current += directionRef.current * (260 * dt * (indicatorSpeed / 10));

      if (tempRef.current >= 400) {
        tempRef.current = 400;
        directionRef.current = -1;
      } else if (tempRef.current <= 50) {
        tempRef.current = 50;
        directionRef.current = 1;
      }

      setCurrentTemp(Math.round(tempRef.current));
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, indicatorSpeed]);

  const handleGameOver = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    sounds.playPerfectFanfare();
    const earnedCoins = Math.floor(score * 1.5);
    onAddCoins(earnedCoins);

    if (score > highScore) {
      onSaveHighScore(score);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Player smashes the press button
  const handleSmashPress = () => {
    if (!isPlaying) return;

    // Sweet spot is 315°C to 350°C (Centered around 333°C!)
    const current = tempRef.current;
    if (current >= 315 && current <= 350) {
      // PERFECT HIT!
      sounds.playLeverClank();
      sounds.playCoin();
      const points = 100 + combo * 25;
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setTimeLeft((t) => Math.min(45, t + 1)); // bonus second!
      setFeedback('⭐ ¡333°C PERFECTO! ⭐');
      setFeedbackColor('text-emerald-500');

      // Random next mug
      const nextBadge = BADGES[Math.floor(Math.random() * BADGES.length)];
      setActiveBadge(nextBadge);

      // Increase speed slightly
      setIndicatorSpeed((s) => Math.min(22, s + 0.5));
    } else if (current > 350) {
      // Overheated / burned
      sounds.playBurnedBuzz();
      setCombo(0);
      setFeedback('🔥 ¡QUEMADO (>350°C)!');
      setFeedbackColor('text-red-500');
    } else {
      // Too cold
      sounds.playBurnedBuzz();
      setCombo(0);
      setFeedback('❄️ ¡MUY FRÍO (<315°C)!');
      setFeedbackColor('text-sky-500');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 select-none">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-2xl border-3 border-black p-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-yellow-300 animate-bounce" />
          <div>
            <h2 className="font-['Bungee'] text-xs sm:text-sm leading-tight">
              FIEBRE DE LA PRENSA
            </h2>
            <p className="text-[10px] text-amber-200 font-bold">
              ¡Detén la palanca justo en los 333°C!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/20">
          <Trophy size={12} className="text-yellow-400" />
          <span className="text-[11px] font-['Rubik'] font-black">
            Récord: {highScore}
          </span>
        </div>
      </div>

      {/* Main Game Screen */}
      {!isPlaying ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 my-4 bg-white/90 rounded-3xl border-3 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-20 h-20 rounded-full bg-red-500 border-4 border-black flex items-center justify-center text-4xl shadow-md animate-bounce">
            🔥
          </div>

          <div>
            <h3 className="font-['Bungee'] text-lg text-slate-900">
              DESAFÍO RÍTMICO EXPRESS
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xs font-['Rubik'] font-bold">
              Demuestra tus reflejos de artesano del Gato de la Suerte.
              Presiona cuando la aguja toque la zona verde (333°C).
            </p>
          </div>

          {score > 0 && (
            <div className="bg-amber-100 rounded-xl p-2.5 border-2 border-black w-full max-w-xs">
              <span className="text-xs font-bold text-slate-600">Puntaje anterior:</span>
              <p className="font-['Rubik'] font-black text-xl text-red-600">
                {score} pts
              </p>
            </div>
          )}

          <button
            onClick={startGame}
            className="w-full max-w-xs bg-red-600 hover:bg-red-500 text-white font-['Rubik'] font-black text-sm py-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play size={18} />
            <span>¡INICIAR FIEBRE (30s)!</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between my-2">
          {/* Status HUD: Time, Score, Combo */}
          <div className="w-full flex items-center justify-between gap-2 px-1">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl border-2 border-black flex items-center gap-1.5 shadow">
              <span className="text-xs">⏱️</span>
              <span className="font-mono font-black text-sm text-amber-300">
                {timeLeft}s
              </span>
            </div>

            <div className="text-center">
              <span className="font-['Rubik'] font-black text-lg text-slate-900 block leading-none">
                {score} PTS
              </span>
              {combo > 1 && (
                <span className="text-[10px] font-black text-red-600 uppercase bg-amber-200 px-2 py-0.2 rounded-full border border-black inline-block mt-0.5 animate-bounce">
                  x{combo} COMBO!
                </span>
              )}
            </div>

            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl border-2 border-black font-['Rubik'] font-black text-xs shadow flex items-center gap-1">
              <Zap size={14} />
              <span>+{100 + combo * 25}</span>
            </div>
          </div>

          {/* Central Target Display & Mug */}
          <div className="relative flex flex-col items-center my-3">
            <div className="w-24 h-24 rounded-2xl bg-white border-3 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center p-2">
              <MugArtBadge type={activeBadge} className="scale-75" />
            </div>

            {/* Feedback message */}
            <div className="h-6 mt-2">
              {feedback && (
                <span
                  className={`font-['Rubik'] font-black text-xs uppercase px-2 py-0.5 rounded bg-black/80 ${feedbackColor}`}
                >
                  {feedback}
                </span>
              )}
            </div>
          </div>

          {/* Precision Heat Meter Gauge */}
          <div className="w-full max-w-xs bg-slate-900 border-3 border-black rounded-2xl p-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
              <span>0°C FRÍO</span>
              <span className="text-emerald-400 font-black">★ 333°C PERFECTO ★</span>
              <span className="text-red-400">400°C QUEMADO</span>
            </div>

            {/* The Track with Sweet Spot highlighted */}
            <div className="relative w-full h-8 bg-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden">
              {/* Sweet Spot Zone (approx 315°C to 350°C on 50-400 scale) */}
              <div
                className="absolute top-0 bottom-0 bg-emerald-500/80 border-x-2 border-emerald-300 flex items-center justify-center"
                style={{
                  left: `${((315 - 50) / 350) * 100}%`,
                  width: `${((350 - 315) / 350) * 100}%`,
                }}
              >
                <span className="text-[9px] font-black text-emerald-950">333</span>
              </div>

              {/* Moving Needle */}
              <div
                className="absolute top-0 bottom-0 w-3 bg-red-500 border-2 border-white rounded-xs shadow-[0_0_8px_rgba(255,0,0,1)] -ml-1.5 transition-none"
                style={{
                  left: `${Math.max(0, Math.min(100, ((currentTemp - 50) / 350) * 100))}%`,
                }}
              />
            </div>

            <div className="text-center font-mono text-xs font-bold text-amber-300">
              Temperatura actual: {currentTemp}°C
            </div>
          </div>

          {/* HUGE SMASH BUTTON FOR MOBILE FINGERS */}
          <button
            onClick={handleSmashPress}
            className="w-full max-w-xs mt-3 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-['Bungee'] text-lg py-4 rounded-3xl border-4 border-black shadow-[0_6px_0_rgba(0,0,0,1)] active:translate-y-1.5 active:shadow-[0_0_0_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="text-2xl">⚡</span>
            <span>¡PRENSAR AHORA!</span>
          </button>
        </div>
      )}

      {/* Footer tip */}
      <div className="text-center text-[10px] text-slate-600 font-bold">
        {isPlaying ? '¡Mantén la calma y frena en el verde!' : '¡Cada acierto suma monedas reales al taller!'}
      </div>
    </div>
  );
};
