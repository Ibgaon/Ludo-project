import React from 'react';
import { Home, Trophy, History, User } from 'lucide-react';
import { AppScreen } from '../types';
import { soundManager } from '../utils/audio';

interface BottomNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  soundEnabled?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled = true,
}) => {
  const tabs = [
    { id: 'home' as AppScreen, icon: Home, label: 'Home' },
    { id: 'leaderboard' as AppScreen, icon: Trophy, label: 'Leaderboard' },
    { id: 'history' as AppScreen, icon: History, label: 'History' },
    { id: 'profile' as AppScreen, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-[max(12px,env(safe-area-inset-bottom))] h-20 bg-[#eceef0]/95 backdrop-blur-md border-t border-[#c7c4d7]/30 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] rounded-t-2xl md:hidden">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => {
              soundManager.playClick(soundEnabled);
              onNavigate(tab.id);
            }}
            aria-label={tab.label}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#fd761a] text-white rounded-full w-12 h-12 shadow-md scale-105'
                : 'text-[#464554] w-12 h-12 rounded-full hover:bg-white/40 active:scale-90'
            }`}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </nav>
  );
};
