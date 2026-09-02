import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, ArrowLeft, Star, Dices, RotateCcw } from 'lucide-react';
import { PlayerConfig, Token, GameSettings, PlayerColor } from '../types';
import { soundManager } from '../utils/audio';
import { ASSETS } from '../utils/assets';
import {
  TRACK_COORDINATES,
  SAFE_TRACK_INDICES,
  COLOR_START_INDICES,
  HOME_CORRIDORS,
  YARD_COORDINATES,
  TOTAL_STEPS_TO_HOME,
  getTokenCoordinates,
  getGlobalTrackIndex,
  canTokenMove,
  getMoveableTokens,
  chooseBotMove,
} from '../utils/ludoEngine';

interface GameBoardProps {
  players: PlayerConfig[];
  settings: GameSettings;
  onPause: () => void;
  onGameOver: (winnerOrder: number[]) => void;
  onExit: () => void;
}

const COLOR_CLASSES: Record<
  PlayerColor,
  {
    bg: string;
    border: string;
    text: string;
    tokenGradient: string;
    glow: string;
    yardBg: string;
  }
> = {
  blue: {
    bg: 'bg-[#4648d4]',
    border: 'border-[#4648d4]',
    text: 'text-[#4648d4]',
    tokenGradient: 'from-[#4648d4] to-[#2f2ebe]',
    glow: 'ring-[#4648d4] shadow-[#4648d4]/50',
    yardBg: 'bg-[#e1e0ff]/60 border-[#4648d4]',
  },
  red: {
    bg: 'bg-[#e63946]',
    border: 'border-[#e63946]',
    text: 'text-[#e63946]',
    tokenGradient: 'from-[#ef4444] to-[#b91c1c]',
    glow: 'ring-[#e63946] shadow-[#e63946]/50',
    yardBg: 'bg-[#ffe4e6]/60 border-[#e63946]',
  },
  green: {
    bg: 'bg-[#00885d]',
    border: 'border-[#00885d]',
    text: 'text-[#00885d]',
    tokenGradient: 'from-[#10b981] to-[#047857]',
    glow: 'ring-[#00885d] shadow-[#00885d]/50',
    yardBg: 'bg-[#dcfce7]/60 border-[#00885d]',
  },
  yellow: {
    bg: 'bg-[#fd761a]',
    border: 'border-[#fd761a]',
    text: 'text-[#fd761a]',
    tokenGradient: 'from-[#f59e0b] to-[#b45309]',
    glow: 'ring-[#fd761a] shadow-[#fd761a]/50',
    yardBg: 'bg-[#ffdbca]/60 border-[#fd761a]',
  },
};

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  settings,
  onPause,
  onGameOver,
  onExit,
}) => {
  // Initialize 4 tokens for each player
  const [tokens, setTokens] = useState<Token[]>(() => {
    const list: Token[] = [];
    players.forEach((player, pIdx) => {
      for (let i = 0; i < 4; i++) {
        list.push({
          id: i,
          playerIndex: pIdx,
          color: player.color,
          step: -1, // in yard
          isHome: false,
        });
      }
    });
    return list;
  });

  const [currentTurnIdx, setCurrentTurnIdx] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Roll the dice to move');
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [winnerOrder, setWinnerOrder] = useState<number[]>([]);
  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  const activePlayer = players[currentTurnIdx] || players[0];
  const isHumanTurn = activePlayer.type === 'human';

  // Moveable tokens for current rolled value
  const moveableTokens =
    hasRolled && diceValue !== null
      ? getMoveableTokens(
          tokens.filter((t) => t.playerIndex === currentTurnIdx && !t.isHome),
          diceValue
        )
      : [];

  // Pass turn to next player
  const nextTurn = useCallback(
    (bonusTurn = false) => {
      setHasRolled(false);
      setDiceValue(null);

      if (bonusTurn) {
        setStatusMessage(
          isHumanTurn
            ? 'Bonus Turn! Roll again.'
            : `${activePlayer.name} gets a bonus turn!`
        );
        return;
      }

      setConsecutiveSixes(0);
      let nextIdx = (currentTurnIdx + 1) % players.length;

      // Skip players who have already completed the game
      let attempts = 0;
      while (winnerOrder.includes(nextIdx) && attempts < players.length) {
        nextIdx = (nextIdx + 1) % players.length;
        attempts++;
      }

      setCurrentTurnIdx(nextIdx);
      const nextPlayer = players[nextIdx];
      setStatusMessage(
        nextPlayer.type === 'human'
          ? 'Your Turn! Roll the dice to move.'
          : `${nextPlayer.name}'s turn...`
      );
    },
    [currentTurnIdx, players, winnerOrder, isHumanTurn, activePlayer]
  );

  // Execute a token move
  const executeMove = useCallback(
    (token: Token) => {
      if (diceValue === null) return;

      const currentStep = token.step;
      const isUnlockingFromYard = currentStep === -1 && diceValue === 6;
      const nextStep = isUnlockingFromYard ? 0 : currentStep + diceValue;
      const isFinishing = nextStep === TOTAL_STEPS_TO_HOME;

      // Sound
      if (isUnlockingFromYard) {
        soundManager.playTokenUnlock(settings.soundEffects);
      } else if (isFinishing) {
        soundManager.playHomeChime(settings.soundEffects);
      } else {
        soundManager.playTokenMove(settings.soundEffects);
      }
      soundManager.vibrate(settings.vibration, 30);

      // Check capture on main track (0..50)
      let capturedOpponent = false;
      let targetTrackIndex: number | null = null;

      if (nextStep <= 50) {
        const startIdx = COLOR_START_INDICES[token.color];
        targetTrackIndex = (startIdx + nextStep) % 52;
      }

      setTokens((prev) => {
        let didCapture = false;
        const updated = prev.map((t) => {
          // Move this token
          if (t.playerIndex === token.playerIndex && t.id === token.id) {
            return {
              ...t,
              step: nextStep,
              isHome: isFinishing,
            };
          }

          // Check if another token is captured
          if (
            targetTrackIndex !== null &&
            t.playerIndex !== token.playerIndex &&
            !t.isHome &&
            !SAFE_TRACK_INDICES.includes(targetTrackIndex)
          ) {
            const oppTrack = getGlobalTrackIndex(t);
            if (oppTrack === targetTrackIndex) {
              didCapture = true;
              return {
                ...t,
                step: -1, // send back to yard
              };
            }
          }

          return t;
        });

        if (didCapture) {
          capturedOpponent = true;
          soundManager.playCapture(settings.soundEffects);
          setLastActionToast('🎯 Captured opponent piece!');
        }

        return updated;
      });

      // Check if this player finished all 4 tokens
      setTimeout(() => {
        setTokens((currentLatest) => {
          const myRemaining = currentLatest.filter(
            (t) => t.playerIndex === currentTurnIdx && !t.isHome
          );
          if (myRemaining.length === 0 && !winnerOrder.includes(currentTurnIdx)) {
            const updatedWinners = [...winnerOrder, currentTurnIdx];
            setWinnerOrder(updatedWinners);
            if (updatedWinners.length >= players.length - 1 || players.length === 2) {
              onGameOver(updatedWinners);
              return currentLatest;
            }
          }
          return currentLatest;
        });

        // Determine if player gets a bonus turn:
        // 1. Rolled a 6
        // 2. Captured an opponent
        // 3. Reached home base
        const getsBonus = diceValue === 6 || capturedOpponent || isFinishing;
        nextTurn(getsBonus);
      }, settings.animationSpeed === 'fast' ? 200 : settings.animationSpeed === 'slow' ? 550 : 350);
    },
    [diceValue, settings, currentTurnIdx, winnerOrder, players.length, onGameOver, nextTurn]
  );

  // Roll Dice Action
  const handleRollDice = useCallback(() => {
    if (isRolling || hasRolled) return;

    setIsRolling(true);
    soundManager.playDiceRoll(settings.soundEffects);
    soundManager.vibrate(settings.vibration, 40);

    const rollDuration = settings.diceAnimation ? (settings.animationSpeed === 'fast' ? 300 : 500) : 100;

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setIsRolling(false);
      setHasRolled(true);

      const consecutive = rolled === 6 ? consecutiveSixes + 1 : 0;
      setConsecutiveSixes(consecutive);

      // Max 3 consecutive sixes penalty rule
      if (consecutive === 3) {
        setLastActionToast('3 Sixes in a row! Turn skipped.');
        setTimeout(() => nextTurn(false), 900);
        return;
      }

      // Check available moves for current player
      const myTokens = tokens.filter(
        (t) => t.playerIndex === currentTurnIdx && !t.isHome
      );
      const possible = getMoveableTokens(myTokens, rolled);

      if (possible.length === 0) {
        setStatusMessage(`Rolled ${rolled}. No moves possible.`);
        setTimeout(() => {
          nextTurn(false);
        }, 800);
      } else if (possible.length === 1 && isHumanTurn) {
        setStatusMessage(`Rolled ${rolled}. Moving token...`);
        // Auto-move single choice for smooth fast gameplay
        setTimeout(() => {
          executeMove(possible[0]);
        }, 350);
      } else if (isHumanTurn) {
        setStatusMessage(`Rolled ${rolled}. Tap a highlighted token to move.`);
      }
    }, rollDuration);
  }, [
    isRolling,
    hasRolled,
    settings,
    consecutiveSixes,
    tokens,
    currentTurnIdx,
    isHumanTurn,
    nextTurn,
    executeMove,
  ]);

  // Handle Bot AI turn automated loop
  useEffect(() => {
    if (!isHumanTurn && !isRolling && !hasRolled) {
      const timer = setTimeout(() => {
        handleRollDice();
      }, 700);
      return () => clearTimeout(timer);
    }

    if (!isHumanTurn && hasRolled && diceValue !== null) {
      const botTimer = setTimeout(() => {
        const botMove = chooseBotMove(
          activePlayer,
          tokens,
          diceValue,
          activePlayer.difficulty || 'medium'
        );
        if (botMove) {
          executeMove(botMove);
        } else {
          nextTurn(false);
        }
      }, 600);
      return () => clearTimeout(botTimer);
    }
  }, [
    isHumanTurn,
    isRolling,
    hasRolled,
    diceValue,
    activePlayer,
    tokens,
    handleRollDice,
    executeMove,
    nextTurn,
  ]);

  // Cleanup action toast
  useEffect(() => {
    if (lastActionToast) {
      const timer = setTimeout(() => setLastActionToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [lastActionToast]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#2c251e] relative select-none pb-40 overflow-hidden">
      {/* Tabletop Wood Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none"
        style={{ backgroundImage: `url(${ASSETS.woodBackground})` }}
      />
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />

      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-40 flex items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md shadow-xs border-b border-[#c7c4d7]/20 justify-between">
        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onPause();
          }}
          aria-label="Back / Pause"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#464554] hover:bg-[#eceef0] active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full shadow-xs border-2 ${
              COLOR_CLASSES[activePlayer.color].border
            } relative overflow-hidden bg-white p-0.5`}
          >
            <img
              src={activePlayer.avatar}
              alt={activePlayer.name}
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#4edea3] rounded-full border-2 border-white animate-ping" />
          </div>
          <h1 className="font-extrabold text-[20px] md:text-[24px] text-[#4648d4] tracking-tight">
            {isHumanTurn ? 'Your Turn' : `${activePlayer.name}'s Turn`}
          </h1>
        </div>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onPause();
          }}
          aria-label="Pause Game"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#464554] hover:bg-[#eceef0] active:scale-95 transition-all cursor-pointer"
        >
          <Pause className="w-6 h-6" />
        </button>
      </header>

      {/* Main Board Stage */}
      <main className="flex-1 mt-16 flex flex-col items-center justify-center p-3 relative z-10 max-w-lg mx-auto w-full">
        {/* Top 2 Player Floating Cards */}
        <div className="w-full flex justify-between px-1 mb-2">
          {/* Top-Left Player (Red / Player 2) */}
          {players[1] ? (
            <div
              className={`flex items-center gap-2.5 glass-card p-2 rounded-xl transition-all duration-200 ${
                currentTurnIdx === 1
                  ? 'ring-3 ring-[#e63946] shadow-lg scale-102 bg-white'
                  : 'opacity-85'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 ${
                  COLOR_CLASSES[players[1].color].border
                } shadow-xs flex items-center justify-center overflow-hidden bg-white`}
              >
                <img
                  src={players[1].avatar}
                  alt={players[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col pr-1">
                <span className="text-[11px] font-bold text-[#767586] uppercase">
                  {players[1].type === 'bot' ? 'Bot' : 'Player 2'}
                </span>
                <span className="text-[15px] font-extrabold text-[#191c1e] leading-tight max-w-[90px] truncate">
                  {players[1].name}
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}

          {/* Top-Right Player (Green / Player 3) */}
          {players[2] ? (
            <div
              className={`flex items-center gap-2.5 glass-card p-2 rounded-xl transition-all duration-200 ${
                currentTurnIdx === 2
                  ? 'ring-3 ring-[#00885d] shadow-lg scale-102 bg-white'
                  : 'opacity-85'
              }`}
            >
              <div className="flex flex-col items-end pl-1">
                <span className="text-[11px] font-bold text-[#767586] uppercase">
                  {players[2].type === 'bot' ? 'Bot' : 'Player 3'}
                </span>
                <span className="text-[15px] font-extrabold text-[#191c1e] leading-tight max-w-[90px] truncate">
                  {players[2].name}
                </span>
              </div>
              <div
                className={`w-10 h-10 rounded-full border-2 ${
                  COLOR_CLASSES[players[2].color].border
                } shadow-xs flex items-center justify-center overflow-hidden bg-white`}
              >
                <img
                  src={players[2].avatar}
                  alt={players[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* LUDO BOARD CANVAS */}
        <div className="w-full aspect-square max-w-[440px] bg-white rounded-2xl shadow-2xl p-1.5 border-4 border-[#2c251e] relative overflow-hidden">
          {/* 15x15 Interactive Grid */}
          <div className="w-full h-full grid grid-cols-15 grid-rows-15 gap-[1px] bg-[#e0e3e5] rounded-xl overflow-hidden relative">
            {/* Top-Left Red Yard (6x6) */}
            <div className="col-span-6 row-span-6 bg-[#ffe4e6] border-2 border-[#e63946] p-2 flex flex-col items-center justify-center relative">
              <div className="w-full h-full bg-white/70 rounded-xl border border-[#e63946]/40 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {[0, 1, 2, 3].map((spotIdx) => (
                  <div
                    key={spotIdx}
                    className="rounded-full bg-[#ffe4e6] border-2 border-[#e63946]/30 flex items-center justify-center shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Top Corridor (3 cols x 6 rows) */}
            <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 gap-[1px] bg-[#e0e3e5]">
              {Array.from({ length: 18 }).map((_, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const isHomeRun = col === 1 && row > 0;
                const isStart = col === 2 && row === 1;
                const isStar = (col === 0 && row === 2) || isStart;

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center relative ${
                      isHomeRun
                        ? 'bg-[#00885d]'
                        : isStart
                        ? 'bg-[#00885d]/40'
                        : 'bg-white'
                    }`}
                  >
                    {isStar && (
                      <Star className="w-3.5 h-3.5 text-[#767586]/60 fill-[#767586]/40" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Top-Right Green Yard (6x6) */}
            <div className="col-span-6 row-span-6 bg-[#dcfce7] border-2 border-[#00885d] p-2 flex flex-col items-center justify-center relative">
              <div className="w-full h-full bg-white/70 rounded-xl border border-[#00885d]/40 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {[0, 1, 2, 3].map((spotIdx) => (
                  <div
                    key={spotIdx}
                    className="rounded-full bg-[#dcfce7] border-2 border-[#00885d]/30 flex items-center justify-center shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Left Corridor (6 cols x 3 rows) */}
            <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 gap-[1px] bg-[#e0e3e5]">
              {Array.from({ length: 18 }).map((_, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                const isHomeRun = row === 1 && col > 0;
                const isStart = col === 1 && row === 0;
                const isStar = (col === 2 && row === 2) || isStart;

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center relative ${
                      isHomeRun
                        ? 'bg-[#e63946]'
                        : isStart
                        ? 'bg-[#e63946]/40'
                        : 'bg-white'
                    }`}
                  >
                    {isStar && (
                      <Star className="w-3.5 h-3.5 text-[#767586]/60 fill-[#767586]/40" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Center Home Base Triangle (3x3) */}
            <div className="col-span-3 row-span-3 bg-white relative flex items-center justify-center overflow-hidden border border-white">
              {/* Conic Colored Triangles */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'conic-gradient(from 45deg, #00885d 0deg 90deg, #fd761a 90deg 180deg, #4648d4 180deg 270deg, #e63946 270deg 360deg)',
                }}
              />
              <div className="w-6 h-6 rounded-full bg-white/90 shadow-md flex items-center justify-center z-10 border border-black/10">
                <span className="text-[9px] font-extrabold text-[#191c1e]">👑</span>
              </div>
            </div>

            {/* Right Corridor (6 cols x 3 rows) */}
            <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3 gap-[1px] bg-[#e0e3e5]">
              {Array.from({ length: 18 }).map((_, i) => {
                const col = i % 6;
                const row = Math.floor(i / 6);
                const isHomeRun = row === 1 && col < 5;
                const isStart = col === 4 && row === 2;
                const isStar = (col === 3 && row === 0) || isStart;

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center relative ${
                      isHomeRun
                        ? 'bg-[#fd761a]'
                        : isStart
                        ? 'bg-[#fd761a]/40'
                        : 'bg-white'
                    }`}
                  >
                    {isStar && (
                      <Star className="w-3.5 h-3.5 text-[#767586]/60 fill-[#767586]/40" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom-Left Blue Yard (6x6) */}
            <div className="col-span-6 row-span-6 bg-[#e1e0ff] border-2 border-[#4648d4] p-2 flex flex-col items-center justify-center relative">
              <div className="w-full h-full bg-white/70 rounded-xl border border-[#4648d4]/40 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {[0, 1, 2, 3].map((spotIdx) => (
                  <div
                    key={spotIdx}
                    className="rounded-full bg-[#e1e0ff] border-2 border-[#4648d4]/30 flex items-center justify-center shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Bottom Corridor (3 cols x 6 rows) */}
            <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6 gap-[1px] bg-[#e0e3e5]">
              {Array.from({ length: 18 }).map((_, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                const isHomeRun = col === 1 && row < 5;
                const isStart = col === 0 && row === 4;
                const isStar = (col === 2 && row === 3) || isStart;

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center relative ${
                      isHomeRun
                        ? 'bg-[#4648d4]'
                        : isStart
                        ? 'bg-[#4648d4]/40'
                        : 'bg-white'
                    }`}
                  >
                    {isStar && (
                      <Star className="w-3.5 h-3.5 text-[#767586]/60 fill-[#767586]/40" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom-Right Yellow Yard (6x6) */}
            <div className="col-span-6 row-span-6 bg-[#ffdbca] border-2 border-[#fd761a] p-2 flex flex-col items-center justify-center relative">
              <div className="w-full h-full bg-white/70 rounded-xl border border-[#fd761a]/40 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {[0, 1, 2, 3].map((spotIdx) => (
                  <div
                    key={spotIdx}
                    className="rounded-full bg-[#ffdbca] border-2 border-[#fd761a]/30 flex items-center justify-center shadow-xs"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* REAL-TIME TOKENS RENDER LAYER */}
          <div className="absolute inset-1.5 pointer-events-none">
            {tokens.map((token) => {
              const [gx, gy] = getTokenCoordinates(token);
              const isMoveable =
                isHumanTurn &&
                hasRolled &&
                moveableTokens.some(
                  (m) => m.id === token.id && m.playerIndex === token.playerIndex
                );

              // Position percentage (15x15 coordinates mapped to 0..100%)
              const leftPercent = (gx / 14) * 88 + 6;
              const topPercent = (gy / 14) * 88 + 6;

              return (
                <div
                  key={`${token.playerIndex}-${token.id}`}
                  onClick={() => {
                    if (isMoveable) {
                      executeMove(token);
                    }
                  }}
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute w-7 h-7 md:w-8 md:h-8 rounded-full z-20 flex items-center justify-center transition-all duration-300 ease-out shadow-md border-2 border-white pointer-events-auto cursor-pointer ${
                    COLOR_CLASSES[token.color].bg
                  } ${
                    isMoveable
                      ? 'ring-4 ring-white animate-bounce scale-120 shadow-xl z-30'
                      : ''
                  }`}
                >
                  {/* Glossy inner pawn circle */}
                  <div className="w-3.5 h-3.5 rounded-full bg-white/40 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom 2 Player Floating Cards */}
        <div className="w-full flex justify-between px-1 mt-2">
          {/* Bottom-Left Player (You / Player 1 / Blue) */}
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-200 ${
              currentTurnIdx === 0
                ? 'bg-[#4648d4] text-white shadow-lg ring-3 ring-white/50 scale-102'
                : 'glass-card'
            }`}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-xs flex items-center justify-center overflow-hidden bg-white">
              <img
                src={players[0].avatar}
                alt={players[0].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col pr-1">
              <span
                className={`text-[11px] font-bold uppercase ${
                  currentTurnIdx === 0 ? 'text-[#e1e0ff]' : 'text-[#767586]'
                }`}
              >
                You
              </span>
              <span
                className={`text-[15px] font-extrabold leading-tight max-w-[90px] truncate ${
                  currentTurnIdx === 0 ? 'text-white' : 'text-[#191c1e]'
                }`}
              >
                {players[0].name}
              </span>
            </div>
          </div>

          {/* Bottom-Right Player (Yellow / Player 4) */}
          {players[3] ? (
            <div
              className={`flex items-center gap-2.5 glass-card p-2 rounded-xl transition-all duration-200 ${
                currentTurnIdx === 3
                  ? 'ring-3 ring-[#fd761a] shadow-lg scale-102 bg-white'
                  : 'opacity-85'
              }`}
            >
              <div className="flex flex-col items-end pl-1">
                <span className="text-[11px] font-bold text-[#767586] uppercase">
                  {players[3].type === 'bot' ? 'Bot' : 'Player 4'}
                </span>
                <span className="text-[15px] font-extrabold text-[#191c1e] leading-tight max-w-[90px] truncate">
                  {players[3].name}
                </span>
              </div>
              <div
                className={`w-10 h-10 rounded-full border-2 ${
                  COLOR_CLASSES[players[3].color].border
                } shadow-xs flex items-center justify-center overflow-hidden bg-white`}
              >
                <img
                  src={players[3].avatar}
                  alt={players[3].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
      </main>

      {/* Action Notification Toast */}
      {lastActionToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#191c1e]/90 text-white px-4 py-2 rounded-full text-[14px] font-bold shadow-xl animate-in fade-in slide-in-from-top-3 backdrop-blur-md">
          {lastActionToast}
        </div>
      )}

      {/* BOTTOM ACTION HUD */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-xl border-t border-[#c7c4d7]/30 pb-[max(20px,env(safe-area-inset-bottom))] rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col items-center px-6 pt-4 pb-2 gap-3.5 max-w-md mx-auto">
          {/* Turn status & Dice display */}
          <div className="flex items-center justify-between w-full glass-card p-3 rounded-2xl border border-white/60">
            <div className="flex flex-col">
              <span
                className={`text-[12px] font-extrabold uppercase tracking-widest ${
                  COLOR_CLASSES[activePlayer.color].text
                }`}
              >
                {isHumanTurn ? 'YOUR TURN' : `${activePlayer.name.toUpperCase()}'S TURN`}
              </span>
              <span className="text-[14px] font-semibold text-[#464554]">
                {statusMessage}
              </span>
            </div>

            {/* 3D Dice Object */}
            <div
              onClick={() => {
                if (isHumanTurn && !isRolling && !hasRolled) {
                  handleRollDice();
                }
              }}
              className={`w-14 h-14 rounded-2xl bg-white shadow-lg border border-[#c7c4d7]/40 flex items-center justify-center relative cursor-pointer transform transition-transform ${
                isRolling ? 'animate-spin' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {diceValue === null ? (
                <Dices className="w-8 h-8 text-[#4648d4]" />
              ) : (
                /* Dynamic Pips for Rolled Value */
                <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2 w-full h-full">
                  {[1, 3, 5].includes(diceValue) && (
                    <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-2 row-start-2 shadow-inner" />
                  )}
                  {[2, 3, 4, 5, 6].includes(diceValue) && (
                    <>
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-1 row-start-1 shadow-inner" />
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-3 row-start-3 shadow-inner" />
                    </>
                  )}
                  {[4, 5, 6].includes(diceValue) && (
                    <>
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-3 row-start-1 shadow-inner" />
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-1 row-start-3 shadow-inner" />
                    </>
                  )}
                  {diceValue === 6 && (
                    <>
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-1 row-start-2 shadow-inner" />
                      <div className="w-2.5 h-2.5 bg-[#191c1e] rounded-full col-start-3 row-start-2 shadow-inner" />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            disabled={!isHumanTurn || isRolling || hasRolled}
            onClick={handleRollDice}
            className={`tactile-button w-full text-white text-[20px] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-150 ${
              !isHumanTurn || isRolling || hasRolled
                ? 'bg-[#767586]/60 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-[#4648d4] to-[#6063ee] hover:brightness-110 shadow-lg cursor-pointer'
            }`}
          >
            <Dices className="w-6 h-6" />
            {isRolling
              ? 'Rolling...'
              : hasRolled
              ? 'Choose Token to Move'
              : 'Roll Dice'}
          </button>
        </div>
      </div>
    </div>
  );
};
