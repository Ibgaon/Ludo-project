import React, { useState } from 'react';
import { User, Bot, X, Plus, Play, Gauge } from 'lucide-react';
import { PlayerColor, PlayerConfig, AIDifficulty, GameSettings } from '../types';
import { soundManager } from '../utils/audio';
import { ASSETS } from '../utils/assets';

interface SetupMatchProps {
  initialPlayerCount?: number;
  initialVsBot?: boolean;
  initialDifficulty?: AIDifficulty;
  settings: GameSettings;
  onStartGame: (players: PlayerConfig[]) => void;
}

const COLOR_MAP: Record<PlayerColor, { name: string; bg: string; text: string }> = {
  blue: { name: 'Blue', bg: 'bg-[#4648d4]', text: 'text-white' },
  red: { name: 'Red', bg: 'bg-[#e63946]', text: 'text-white' },
  green: { name: 'Green', bg: 'bg-[#00885d]', text: 'text-white' },
  yellow: { name: 'Yellow', bg: 'bg-[#fd761a]', text: 'text-white' },
};

const DEFAULT_AVATARS = [
  ASSETS.avatarWinner,
  ASSETS.avatarFemale,
  ASSETS.avatarMale,
  ASSETS.avatarBot,
];

export const SetupMatch: React.FC<SetupMatchProps> = ({
  initialPlayerCount = 2,
  initialVsBot = false,
  initialDifficulty = 'medium',
  settings,
  onStartGame,
}) => {
  const [players, setPlayers] = useState<PlayerConfig[]>([
    {
      id: 0,
      name: 'Player 1',
      color: 'blue',
      type: 'human',
      avatar: DEFAULT_AVATARS[0],
    },
    {
      id: 1,
      name: initialVsBot ? 'Bot Alpha' : 'Player 2',
      color: 'red',
      type: initialVsBot ? 'bot' : 'human',
      difficulty: initialDifficulty,
      avatar: initialVsBot ? DEFAULT_AVATARS[3] : DEFAULT_AVATARS[1],
    },
    ...(initialPlayerCount >= 3
      ? [
          {
            id: 2,
            name: initialVsBot ? 'Bot Beta' : 'Player 3',
            color: 'green' as PlayerColor,
            type: (initialVsBot ? 'bot' : 'human') as 'bot' | 'human',
            difficulty: initialDifficulty,
            avatar: DEFAULT_AVATARS[2],
          },
        ]
      : []),
    ...(initialPlayerCount >= 4
      ? [
          {
            id: 3,
            name: initialVsBot ? 'Bot Gamma' : 'Player 4',
            color: 'yellow' as PlayerColor,
            type: (initialVsBot ? 'bot' : 'human') as 'bot' | 'human',
            difficulty: initialDifficulty,
            avatar: DEFAULT_AVATARS[3],
          },
        ]
      : []),
  ]);

  const handleP1ColorChange = (color: PlayerColor) => {
    soundManager.playClick(settings.soundEffects);
    setPlayers((prev) => {
      const remainingColors: PlayerColor[] = (['blue', 'red', 'green', 'yellow'] as PlayerColor[]).filter(
        (c) => c !== color
      );
      return prev.map((p, idx) => {
        if (idx === 0) return { ...p, color };
        return { ...p, color: remainingColors[idx - 1] || 'red' };
      });
    });
  };

  const handlePlayerTypeChange = (playerIndex: number, type: 'human' | 'bot' | 'none') => {
    soundManager.playClick(settings.soundEffects);
    if (type === 'none') {
      if (players.length <= 2) return; // Min 2 players
      setPlayers((prev) => prev.filter((_, idx) => idx !== playerIndex).map((p, i) => ({ ...p, id: i })));
      return;
    }

    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== playerIndex) return p;
        const isBot = type === 'bot';
        return {
          ...p,
          type,
          name: isBot ? `Bot ${['Alpha', 'Beta', 'Gamma'][idx - 1] || idx}` : `Player ${idx + 1}`,
          avatar: isBot ? DEFAULT_AVATARS[3] : DEFAULT_AVATARS[idx % DEFAULT_AVATARS.length],
        };
      })
    );
  };

  const handleDifficultyChange = (playerIndex: number, difficulty: AIDifficulty) => {
    soundManager.playClick(settings.soundEffects);
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === playerIndex ? { ...p, difficulty } : p))
    );
  };

  const handleNameChange = (playerIndex: number, name: string) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === playerIndex ? { ...p, name } : p))
    );
  };

  const handleAddPlayer = () => {
    if (players.length >= 4) return;
    soundManager.playClick(settings.soundEffects);

    const availableColors: PlayerColor[] = (['blue', 'red', 'green', 'yellow'] as PlayerColor[]).filter(
      (c) => !players.some((p) => p.color === c)
    );
    const newColor = availableColors[0] || 'yellow';
    const newIdx = players.length;

    setPlayers((prev) => [
      ...prev,
      {
        id: newIdx,
        name: `Player ${newIdx + 1}`,
        color: newColor,
        type: 'human',
        difficulty: 'medium',
        avatar: DEFAULT_AVATARS[newIdx % DEFAULT_AVATARS.length],
      },
    ]);
  };

  const handleStart = () => {
    soundManager.playClick(settings.soundEffects);
    onStartGame(players);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-md mx-auto w-full">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-bold text-[#191c1e]">Setup Match</h2>
        <p className="text-[15px] font-medium text-[#767586]">Configure players to start</p>
      </div>

      {/* Players List */}
      <div className="w-full flex flex-col gap-4 mb-6">
        {/* Player 1 (You) */}
        <div className="bg-white rounded-2xl p-4.5 border border-[#e0e3e5] card-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full ${
                  COLOR_MAP[players[0].color].bg
                } flex items-center justify-center text-white font-bold text-[16px] shadow-xs`}
              >
                1
              </div>
              <h3 className="text-[18px] font-bold text-[#191c1e]">You</h3>
            </div>
            <span className="px-3 py-1 bg-[#eceef0] rounded-full text-[12px] font-bold text-[#464554] flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Human
            </span>
          </div>

          <div className="space-y-3.5">
            <input
              type="text"
              value={players[0].name}
              onChange={(e) => handleNameChange(0, e.target.value)}
              placeholder="Enter name"
              className="w-full bg-[#f2f4f6] border border-[#c7c4d7]/50 rounded-xl px-4 py-2.5 text-[#191c1e] text-[15px] font-medium focus:ring-2 focus:ring-[#4648d4] focus:outline-none"
            />

            <div>
              <label className="text-[12px] font-bold text-[#464554] block mb-2 uppercase tracking-wide">
                Piece Color
              </label>
              <div className="flex gap-3">
                {(['blue', 'red', 'green', 'yellow'] as PlayerColor[]).map((col) => {
                  const isSelected = players[0].color === col;
                  return (
                    <button
                      key={col}
                      onClick={() => handleP1ColorChange(col)}
                      aria-label={`Select ${col}`}
                      className={`w-10 h-10 rounded-full transition-all duration-150 relative cursor-pointer ${
                        COLOR_MAP[col].bg
                      } ${
                        isSelected
                          ? 'ring-3 ring-[#4648d4] ring-offset-2 scale-105 shadow-md'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Other Opponent Players */}
        {players.slice(1).map((player, sliceIdx) => {
          const actualIdx = sliceIdx + 1;
          const isBot = player.type === 'bot';

          return (
            <div
              key={player.id}
              className="bg-white rounded-2xl p-4.5 border border-[#e0e3e5] card-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      COLOR_MAP[player.color].bg
                    } flex items-center justify-center text-white font-bold text-[16px] shadow-xs`}
                  >
                    {actualIdx + 1}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#191c1e]">
                    {isBot ? 'Bot Opponent' : 'Opponent'}
                  </h3>
                </div>

                {/* Switch Player Type: Human / Bot / Remove */}
                <div className="flex bg-[#eceef0] rounded-xl p-1 gap-1">
                  <button
                    onClick={() => handlePlayerTypeChange(actualIdx, 'human')}
                    aria-label="Set to Human"
                    className={`px-2.5 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                      !isBot
                        ? 'bg-white shadow-xs text-[#191c1e]'
                        : 'text-[#464554] hover:text-[#191c1e]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePlayerTypeChange(actualIdx, 'bot')}
                    aria-label="Set to Computer Bot"
                    className={`px-2.5 py-1 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                      isBot
                        ? 'bg-white shadow-xs text-[#191c1e]'
                        : 'text-[#464554] hover:text-[#191c1e]'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                  </button>
                  {players.length > 2 && (
                    <button
                      onClick={() => handlePlayerTypeChange(actualIdx, 'none')}
                      aria-label="Remove player"
                      className="px-2 py-1 rounded-lg text-[#ba1a1a] hover:bg-white/60 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleNameChange(actualIdx, e.target.value)}
                  placeholder="Enter opponent name"
                  className="w-full bg-[#f2f4f6] border border-[#c7c4d7]/50 rounded-xl px-4 py-2.5 text-[#191c1e] text-[15px] font-medium focus:ring-2 focus:ring-[#4648d4] focus:outline-none"
                />

                {isBot && (
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#464554]" />
                    <select
                      value={player.difficulty || 'medium'}
                      onChange={(e) =>
                        handleDifficultyChange(actualIdx, e.target.value as AIDifficulty)
                      }
                      className="flex-1 bg-[#f2f4f6] border border-[#c7c4d7]/50 rounded-xl px-3 py-2 text-[#191c1e] text-[14px] font-medium focus:ring-2 focus:ring-[#4648d4] focus:outline-none cursor-pointer"
                    >
                      <option value="easy">Easy AI</option>
                      <option value="medium">Normal AI</option>
                      <option value="hard">Hard AI</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Player Button */}
        {players.length < 4 && (
          <button
            onClick={handleAddPlayer}
            className="w-full border-2 border-dashed border-[#c7c4d7] hover:border-[#4648d4] bg-[#f7f9fb] hover:bg-[#eceef0] rounded-2xl py-5 flex flex-col items-center justify-center text-[#464554] hover:text-[#4648d4] transition-all cursor-pointer active:scale-98"
          >
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mb-2 shadow-xs border border-[#c7c4d7]/40">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[16px] font-bold">Add Player {players.length + 1}</span>
          </button>
        )}
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c7c4d7]/30 p-4.5 pb-[max(18px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="text-[#464554]">
            <span className="text-[11px] font-bold block uppercase tracking-wider">
              Game Mode
            </span>
            <span className="text-[16px] font-bold text-[#191c1e]">
              Classic • {players.length} Players
            </span>
          </div>

          <button
            onClick={handleStart}
            className="tactile-button bg-[#4648d4] hover:bg-[#3d3fba] text-white px-7 py-3.5 rounded-full text-[18px] font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            Start Game
            <Play className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
