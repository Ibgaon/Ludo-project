import React from 'react';
import { Volume2, VolumeX, Music, Users, Bot, Wifi, Zap, Trophy } from 'lucide-react';
import { GameModeType, UserProfile, GameSettings } from '../types';
import { soundManager } from '../utils/audio';

interface HomeDashboardProps {
  userProfile: UserProfile;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onSelectMode: (mode: GameModeType) => void;
  onQuickStart: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  settings,
  onUpdateSettings,
  onSelectMode,
  onQuickStart,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-4 pb-28 max-w-md mx-auto w-full md:max-w-2xl">
      {/* Quick Sound & Music Controls */}
      <div className="w-full flex justify-end gap-2.5 mb-6">
        <button
          onClick={() => {
            const nextVal = !settings.soundEffects;
            onUpdateSettings({ soundEffects: nextVal });
            soundManager.playClick(nextVal);
          }}
          aria-label="Toggle sound"
          className={`w-12 h-12 rounded-full flex items-center justify-center tactile-button transition-colors cursor-pointer ${
            settings.soundEffects
              ? 'bg-[#e6e8ea] text-[#464554]'
              : 'bg-[#e0e3e5]/60 text-[#767586]'
          }`}
        >
          {settings.soundEffects ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => {
            const nextVal = !settings.backgroundMusic;
            onUpdateSettings({ backgroundMusic: nextVal });
            soundManager.toggleBGM(nextVal);
            soundManager.playClick(settings.soundEffects);
          }}
          aria-label="Toggle background music"
          className={`w-12 h-12 rounded-full flex items-center justify-center tactile-button transition-colors cursor-pointer ${
            settings.backgroundMusic
              ? 'bg-[#e1e0ff] text-[#4648d4]'
              : 'bg-[#e6e8ea] text-[#464554]'
          }`}
        >
          <Music className="w-6 h-6" />
        </button>
      </div>

      {/* Main Game Mode Options */}
      <div className="w-full flex flex-col gap-4 mb-8">
        {/* Play Offline (Pass & Play) */}
        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onSelectMode('pass_play');
          }}
          className="tactile-button bg-[#4648d4] text-white rounded-2xl py-6 px-5 w-full flex items-center justify-between group overflow-hidden relative text-left cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6063ee] to-[#4648d4] opacity-80 z-0" />
          <div className="z-10 flex flex-col items-start">
            <span className="text-[24px] font-bold tracking-tight text-white">
              Play Offline
            </span>
            <span className="text-[15px] font-medium text-[#e1e0ff] opacity-95">
              Pass & Play with friends
            </span>
          </div>
          <Users className="w-10 h-10 z-10 opacity-85 group-active:scale-90 transition-transform text-white" />
        </button>

        {/* Vs Computer */}
        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onSelectMode('vs_computer');
          }}
          className="tactile-button bg-[#fd761a] text-white rounded-2xl py-4 px-5 w-full flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#9d4300] shadow-xs">
              <Bot className="w-7 h-7" />
            </div>
            <span className="text-[20px] font-bold">Vs Computer</span>
          </div>
          <span className="text-[24px] font-bold">▶</span>
        </button>

        {/* Local Multiplayer */}
        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onSelectMode('local_multiplayer');
          }}
          className="tactile-button bg-[#00885d] text-white rounded-2xl py-4 px-5 w-full flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#006c49] shadow-xs">
              <Wifi className="w-7 h-7" />
            </div>
            <span className="text-[20px] font-bold">Local Multiplayer</span>
          </div>
          <span className="text-[24px] font-bold">▶</span>
        </button>
      </div>

      {/* Profile & Statistics Bento Card */}
      <div className="w-full bg-white rounded-2xl p-5 card-shadow border border-[#c7c4d7]/30 relative overflow-hidden">
        {/* Background decorative trophy */}
        <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-[#4648d4]">
          <Trophy className="w-36 h-36" />
        </div>

        <h2 className="text-[20px] font-bold text-[#191c1e] mb-4">Your Profile</h2>

        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#464554] uppercase tracking-wider">
              Total Wins
            </span>
            <span className="text-[36px] font-extrabold text-[#4648d4] leading-tight">
              {userProfile.totalWins}
            </span>
          </div>

          <div className="w-px h-12 bg-[#c7c4d7]/40" />

          <div className="flex flex-col text-right">
            <span className="text-[12px] font-bold text-[#464554] uppercase tracking-wider">
              Games Played
            </span>
            <span className="text-[32px] font-extrabold text-[#191c1e] leading-tight">
              {userProfile.gamesPlayed}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundEffects);
            onQuickStart();
          }}
          className="tactile-button w-full bg-[#e0e3e5] text-[#191c1e] hover:bg-[#d8dadc] text-[18px] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Zap className="w-5 h-5 text-[#fd761a]" />
          Quick Start
        </button>
      </div>
    </div>
  );
};
