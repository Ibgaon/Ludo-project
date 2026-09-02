import React, { useState } from 'react';
import { UserProfile, PlayerColor } from '../types';
import { Trophy, Flame, Zap, Award, Edit2, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ProfileScreenProps {
  userProfile: UserProfile;
  soundEnabled?: boolean;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  soundEnabled = true,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);

  const handleSaveName = () => {
    soundManager.playClick(soundEnabled);
    if (name.trim()) {
      onUpdateProfile({ name: name.trim() });
    }
    setIsEditing(false);
  };

  const winRate =
    userProfile.gamesPlayed > 0
      ? Math.round((userProfile.totalWins / userProfile.gamesPlayed) * 100)
      : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-md mx-auto w-full space-y-6">
      {/* Title */}
      <div className="text-center mb-2">
        <h2 className="text-[24px] font-bold text-[#191c1e]">Player Profile</h2>
        <p className="text-[15px] font-medium text-[#767586]">Customize your avatar and stats</p>
      </div>

      {/* Profile Card */}
      <div className="w-full bg-white rounded-2xl p-6 border border-[#c7c4d7]/30 shadow-xs flex flex-col items-center relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4648d4] shadow-md mb-3 bg-[#eceef0]">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#f2f4f6] border border-[#c7c4d7] rounded-xl px-3 py-1.5 text-center font-bold text-[18px] focus:outline-none focus:ring-2 focus:ring-[#4648d4]"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="w-8 h-8 rounded-full bg-[#4648d4] text-white flex items-center justify-center cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[22px] font-extrabold text-[#191c1e]">
              {userProfile.name}
            </h3>
            <button
              onClick={() => {
                soundManager.playClick(soundEnabled);
                setIsEditing(true);
              }}
              className="p-1 text-[#767586] hover:text-[#4648d4] cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="px-3 py-1 bg-[#e1e0ff] text-[#4648d4] rounded-full text-[12px] font-extrabold uppercase tracking-wide">
            Level 14 Pro
          </span>
          <span className="px-3 py-1 bg-[#ffdbca] text-[#9d4300] rounded-full text-[12px] font-extrabold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-[#9d4300]" />
            Streak: {userProfile.winStreak}
          </span>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="w-full grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#c7c4d7]/30 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-[#767586] mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider">Total Wins</span>
            <Trophy className="w-4 h-4 text-[#4648d4]" />
          </div>
          <span className="text-[28px] font-extrabold text-[#4648d4]">
            {userProfile.totalWins}
          </span>
          <span className="text-[12px] font-medium text-[#767586]">
            of {userProfile.gamesPlayed} matches
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#c7c4d7]/30 shadow-xs flex flex-col">
          <div className="flex items-center justify-between text-[#767586] mb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider">Win Rate</span>
            <Zap className="w-4 h-4 text-[#fd761a]" />
          </div>
          <span className="text-[28px] font-extrabold text-[#00885d]">
            {winRate}%
          </span>
          <span className="text-[12px] font-medium text-[#767586]">
            High efficiency
          </span>
        </div>
      </div>

      {/* Achievements List */}
      <div className="w-full bg-white rounded-2xl p-5 border border-[#c7c4d7]/30 shadow-xs space-y-4">
        <h3 className="text-[18px] font-bold text-[#191c1e] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#fd761a]" />
          Achievements & Medals
        </h3>

        <div className="space-y-3">
          {userProfile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-3.5 ${
                ach.unlocked
                  ? 'bg-[#f7f9fb] border-[#c7c4d7]/30 text-[#191c1e]'
                  : 'bg-[#eceef0]/50 border-dashed border-[#c7c4d7]/40 text-[#767586] opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[18px] ${
                  ach.unlocked ? 'bg-[#e1e0ff] text-[#4648d4]' : 'bg-[#e0e3e5]'
                }`}
              >
                {ach.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-bold leading-tight">{ach.title}</h4>
                <p className="text-[12px] text-[#767586]">{ach.description}</p>
              </div>
              {ach.unlocked && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#dcfce7] text-[#00885d] uppercase">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
