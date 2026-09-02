import React, { useState } from 'react';
import { Bot, Users, ArrowRight, Smile, Meh, Frown, User } from 'lucide-react';
import { GameModeType, AIDifficulty, GameSettings } from '../types';
import { soundManager } from '../utils/audio';
import { ASSETS } from '../utils/assets';

interface GameModeSelectProps {
  initialMode: GameModeType;
  settings: GameSettings;
  onProceed: (mode: GameModeType, difficulty: AIDifficulty, playerCount: number) => void;
}

export const GameModeSelect: React.FC<GameModeSelectProps> = ({
  initialMode,
  settings,
  onProceed,
}) => {
  const [activeCategory, setActiveCategory] = useState<'computer' | 'local'>(
    initialMode === 'vs_computer' ? 'computer' : 'local'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('medium');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(
    initialMode === 'pass_play' ? 2 : 4
  );

  const handleSelectDifficulty = (diff: AIDifficulty) => {
    soundManager.playClick(settings.soundEffects);
    setActiveCategory('computer');
    setSelectedDifficulty(diff);
  };

  const handleSelectPlayers = (count: number) => {
    soundManager.playClick(settings.soundEffects);
    setActiveCategory('local');
    setSelectedPlayerCount(count);
  };

  const handleNext = () => {
    soundManager.playClick(settings.soundEffects);
    const finalMode: GameModeType =
      activeCategory === 'computer' ? 'vs_computer' : 'local_multiplayer';
    onProceed(finalMode, selectedDifficulty, selectedPlayerCount);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-md mx-auto w-full">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-bold text-[#191c1e]">Select Game Mode</h2>
        <p className="text-[15px] font-medium text-[#767586]">Choose how you want to play</p>
      </div>

      {/* Play With Computer Section */}
      <section className="w-full space-y-3 mb-6">
        <h3 className="text-[18px] font-bold text-[#191c1e] flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#4648d4]" />
          PLAY WITH COMPUTER
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Easy */}
          <button
            onClick={() => handleSelectDifficulty('easy')}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'computer' && selectedDifficulty === 'easy'
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeCategory === 'computer' && selectedDifficulty === 'easy'
                  ? 'bg-[#4648d4] text-white'
                  : 'bg-[#e6e8ea] text-[#464554]'
              }`}
            >
              <Smile className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">Easy</span>
          </button>

          {/* Medium */}
          <button
            onClick={() => handleSelectDifficulty('medium')}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'computer' && selectedDifficulty === 'medium'
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeCategory === 'computer' && selectedDifficulty === 'medium'
                  ? 'bg-[#4648d4] text-white'
                  : 'bg-[#e6e8ea] text-[#464554]'
              }`}
            >
              <Meh className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">Medium</span>
          </button>

          {/* Hard */}
          <button
            onClick={() => handleSelectDifficulty('hard')}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'computer' && selectedDifficulty === 'hard'
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeCategory === 'computer' && selectedDifficulty === 'hard'
                  ? 'bg-[#4648d4] text-white'
                  : 'bg-[#e6e8ea] text-[#464554]'
              }`}
            >
              <Frown className="w-6 h-6" />
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">Hard</span>
          </button>
        </div>
      </section>

      {/* Local Multiplayer Section */}
      <section className="w-full space-y-3 mb-6">
        <h3 className="text-[18px] font-bold text-[#191c1e] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#fd761a]" />
          LOCAL MULTIPLAYER
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 2 Players */}
          <button
            onClick={() => handleSelectPlayers(2)}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'local' && selectedPlayerCount === 2
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#4648d4] flex items-center justify-center border-2 border-white text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#e63946] flex items-center justify-center border-2 border-white text-white">
                <User className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">2 Players</span>
          </button>

          {/* 3 Players */}
          <button
            onClick={() => handleSelectPlayers(3)}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'local' && selectedPlayerCount === 3
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-[#4648d4] flex items-center justify-center border-2 border-white text-white">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#e63946] flex items-center justify-center border-2 border-white text-white z-10">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#00885d] flex items-center justify-center border-2 border-white text-white">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">3 Players</span>
          </button>

          {/* 4 Players */}
          <button
            onClick={() => handleSelectPlayers(4)}
            className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 border ${
              activeCategory === 'local' && selectedPlayerCount === 4
                ? 'border-[#4648d4] bg-[#e1e0ff] ring-2 ring-[#4648d4] shadow-sm'
                : 'bg-[#eceef0] border-[#c7c4d7]/40 hover:bg-[#e0e3e5]'
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-5 h-5 rounded-full bg-[#4648d4] border border-white" />
              <div className="w-5 h-5 rounded-full bg-[#e63946] border border-white" />
              <div className="w-5 h-5 rounded-full bg-[#00885d] border border-white" />
              <div className="w-5 h-5 rounded-full bg-[#fd761a] border border-white" />
            </div>
            <span className="text-[15px] font-bold text-[#191c1e]">4 Players</span>
          </button>
        </div>
      </section>

      {/* Contextual Illustration Banner */}
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-[#f2f4f6] h-32 relative flex items-center justify-center border border-[#c7c4d7]/30">
        <img
          src={ASSETS.piecesBanner}
          alt="Ludo Game Pieces"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f2f4f6]/90 via-[#f2f4f6]/50 to-transparent" />
        <span className="relative text-[20px] font-bold text-[#191c1e] z-10 drop-shadow-xs">
          Ready to play?
        </span>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full p-5 bg-[#f7f9fb]/95 backdrop-blur-md border-t border-[#c7c4d7]/30 pb-[max(20px,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-30">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleNext}
            className="tactile-button w-full bg-[#4648d4] hover:bg-[#3d3fba] text-white text-[20px] font-bold py-4 rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            Next Step
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
