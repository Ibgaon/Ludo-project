import React, { useState } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';
import { ASSETS } from '../utils/assets';
import { soundManager } from '../utils/audio';

interface LeaderboardScreenProps {
  soundEnabled?: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  soundEnabled = true,
}) => {
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  const leaders = [
    {
      rank: 1,
      name: 'AlexGamer99',
      score: 14250,
      wins: 142,
      avatar: ASSETS.avatarWinner,
      badge: 'Grand Master',
    },
    {
      rank: 2,
      name: 'SarahPlayz',
      score: 12890,
      wins: 124,
      avatar: ASSETS.avatarFemale,
      badge: 'Diamond',
    },
    {
      rank: 3,
      name: 'MikeDice',
      score: 11420,
      wins: 108,
      avatar: ASSETS.avatarMale,
      badge: 'Platinum',
    },
    {
      rank: 4,
      name: 'Emma_Champion',
      score: 9850,
      wins: 89,
      avatar: ASSETS.avatarFemale,
      badge: 'Gold',
    },
    {
      rank: 5,
      name: 'LudoKing_07',
      score: 8740,
      wins: 76,
      avatar: ASSETS.avatarMale,
      badge: 'Silver',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-md mx-auto w-full">
      {/* Title */}
      <div className="text-center mb-5">
        <h2 className="text-[24px] font-bold text-[#191c1e]">Hall of Fame</h2>
        <p className="text-[15px] font-medium text-[#767586]">Top Ludo Premier Champions</p>
      </div>

      {/* Tabs */}
      <div className="w-full flex bg-[#eceef0] p-1 rounded-2xl mb-6">
        <button
          onClick={() => {
            soundManager.playClick(soundEnabled);
            setTab('global');
          }}
          className={`flex-1 py-2.5 rounded-xl text-[15px] font-bold transition-all cursor-pointer ${
            tab === 'global'
              ? 'bg-white text-[#4648d4] shadow-xs'
              : 'text-[#464554] hover:text-[#191c1e]'
          }`}
        >
          All-Time Global
        </button>
        <button
          onClick={() => {
            soundManager.playClick(soundEnabled);
            setTab('weekly');
          }}
          className={`flex-1 py-2.5 rounded-xl text-[15px] font-bold transition-all cursor-pointer ${
            tab === 'weekly'
              ? 'bg-white text-[#4648d4] shadow-xs'
              : 'text-[#464554] hover:text-[#191c1e]'
          }`}
        >
          Weekly League
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="w-full flex justify-center items-end gap-3 mb-6 pt-6">
        {/* 2nd Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#767586] shadow-sm bg-white">
              <img
                src={leaders[1].avatar}
                alt={leaders[1].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#767586] text-white w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[12px]">
              2
            </div>
          </div>
          <span className="text-[14px] font-bold text-[#191c1e] max-w-[80px] truncate text-center">
            {leaders[1].name}
          </span>
          <span className="text-[12px] font-bold text-[#6063ee]">
            {leaders[1].score.toLocaleString()}
          </span>
          <div className="w-20 h-16 bg-[#e0e3e5] rounded-t-2xl mt-2 flex items-center justify-center">
            <Medal className="w-6 h-6 text-[#767586]" />
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#4648d4] shadow-md bg-white ring-4 ring-[#e1e0ff]">
              <img
                src={leaders[0].avatar}
                alt={leaders[0].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fd761a] text-white p-1 rounded-full shadow-md">
              <Trophy className="w-4 h-4 fill-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#4648d4] text-white w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[13px]">
              1
            </div>
          </div>
          <span className="text-[15px] font-extrabold text-[#191c1e] max-w-[100px] truncate text-center">
            {leaders[0].name}
          </span>
          <span className="text-[13px] font-extrabold text-[#4648d4]">
            {leaders[0].score.toLocaleString()}
          </span>
          <div className="w-24 h-24 bg-[#4648d4] text-white rounded-t-2xl mt-2 flex flex-col items-center justify-center shadow-md">
            <Flame className="w-7 h-7 text-[#fd761a] fill-[#fd761a]" />
            <span className="text-[11px] font-extrabold uppercase mt-1">Champion</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fd761a] shadow-sm bg-white">
              <img
                src={leaders[2].avatar}
                alt={leaders[2].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#fd761a] text-white w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[12px]">
              3
            </div>
          </div>
          <span className="text-[14px] font-bold text-[#191c1e] max-w-[80px] truncate text-center">
            {leaders[2].name}
          </span>
          <span className="text-[12px] font-bold text-[#6063ee]">
            {leaders[2].score.toLocaleString()}
          </span>
          <div className="w-20 h-12 bg-[#ffdbca] rounded-t-2xl mt-2 flex items-center justify-center">
            <Medal className="w-6 h-6 text-[#9d4300]" />
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="w-full flex flex-col gap-2.5">
        {leaders.slice(3).map((item) => (
          <div
            key={item.rank}
            className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#c7c4d7]/30 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-bold text-[#767586] w-6 text-center">
                {item.rank}
              </span>
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#eceef0] border border-[#c7c4d7]/30">
                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold text-[#191c1e]">{item.name}</span>
                <span className="text-[12px] font-semibold text-[#767586]">{item.badge}</span>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[16px] font-extrabold text-[#4648d4]">
                {item.score.toLocaleString()}
              </span>
              <span className="text-[12px] font-bold text-[#00885d]">{item.wins} Wins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
