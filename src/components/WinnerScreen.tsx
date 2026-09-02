import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Home, RotateCcw, Award } from 'lucide-react';
import { PlayerConfig, GameSettings } from '../types';
import { soundManager } from '../utils/audio';

interface WinnerScreenProps {
  winnerOrder: number[]; // Player indexes in order of finish
  players: PlayerConfig[];
  settings: GameSettings;
  onHome: () => void;
  onPlayAgain: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({
  winnerOrder,
  players,
  settings,
  onHome,
  onPlayAgain,
}) => {
  const rankedPlayers = winnerOrder.map((pIdx, rank) => {
    const player = players[pIdx];
    const score = Math.max(1000, 4520 - rank * 1420 + Math.floor(Math.random() * 80));
    return {
      ...player,
      score,
      rank: rank + 1,
    };
  });

  const winner = rankedPlayers[0] || players[0];
  const runnersUp = rankedPlayers.slice(1);

  useEffect(() => {
    soundManager.playWinFanfare(settings.soundEffects);

    // Blast celebration confetti
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4648d4', '#6063ee', '#fd761a', '#00885d', '#ffdbca'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4648d4', '#6063ee', '#fd761a', '#00885d', '#ffdbca'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [settings.soundEffects]);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center px-5 py-6 select-none relative overflow-x-hidden">
      <div className="absolute inset-0 bg-pattern z-0" />

      <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-10">
        {/* Winner Title */}
        <div className="text-center mb-6 animate-bounce">
          <Trophy className="w-14 h-14 text-[#fd761a] mx-auto mb-1 fill-[#fd761a]" />
          <h1 className="text-[38px] md:text-[44px] font-extrabold text-[#4648d4] tracking-tight uppercase drop-shadow-xs">
            WINNER!
          </h1>
        </div>

        {/* Winner Card */}
        <div className="glass-card rounded-2xl p-6 w-full flex flex-col items-center mb-5 shadow-lg relative border border-white/70">
          {/* Crown Badge */}
          <div className="absolute -top-5 bg-[#00885d] text-white rounded-full w-11 h-11 flex items-center justify-center shadow-md">
            <Award className="w-6 h-6" />
          </div>

          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4648d4] mb-3 shadow-inner mt-2 bg-[#eceef0]">
            <img
              src={winner.avatar}
              alt={winner.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-[24px] font-extrabold text-[#191c1e] text-center">
            {winner.name}
          </h2>
          <p className="text-[13px] font-bold text-[#6063ee] tracking-wide mt-1 uppercase">
            Score: {winner.score?.toLocaleString() || '4,520'}
          </p>
        </div>

        {/* Runners up list */}
        <div className="w-full flex flex-col gap-2.5 mb-8">
          {runnersUp.map((player) => {
            const borderColors = [
              'border-[#767586]',
              'border-[#fd761a]',
              'border-[#c7c4d7]',
            ];
            const borderClass = borderColors[player.rank - 2] || 'border-[#c7c4d7]';

            return (
              <div
                key={player.id}
                className={`bg-[#eceef0] rounded-xl p-3.5 flex items-center justify-between border-l-4 ${borderClass} shadow-xs`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-bold text-[#464554] w-6 text-center">
                    {player.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#c7c4d7]/40 shadow-xs">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[16px] font-bold text-[#191c1e]">
                    {player.name}
                  </span>
                </div>
                <span className="text-[13px] font-bold text-[#767586]">
                  {player.score?.toLocaleString() || '2,850'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3.5">
          <button
            onClick={() => {
              soundManager.playClick(settings.soundEffects);
              onHome();
            }}
            className="tactile-button flex-1 bg-[#e6e8ea] hover:bg-[#d8dadc] text-[#191c1e] text-[17px] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={() => {
              soundManager.playClick(settings.soundEffects);
              onPlayAgain();
            }}
            className="tactile-button flex-[2] bg-[#4648d4] hover:bg-[#3d3fba] text-white text-[17px] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </main>
    </div>
  );
};
