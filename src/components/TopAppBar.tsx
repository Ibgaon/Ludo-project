import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopAppBarProps {
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  showBack?: boolean;
  showSettings?: boolean;
  soundEnabled?: boolean;
  customCenter?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'LUDO PREMIER',
  onBack,
  onSettings,
  showBack = true,
  showSettings = true,
  soundEnabled = true,
  customCenter,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 flex items-center justify-between px-5 h-16 bg-[#f7f9fb]/90 backdrop-blur-md shadow-xs border-b border-[#c7c4d7]/20">
      <div className="flex items-center min-w-[40px]">
        {showBack && onBack ? (
          <button
            onClick={() => {
              soundManager.playClick(soundEnabled);
              onBack();
            }}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#4648d4] hover:bg-[#eceef0] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <div className="flex-1 flex justify-center items-center px-2">
        {customCenter ? (
          customCenter
        ) : (
          <h1 className="font-extrabold text-[22px] md:text-[28px] text-[#4648d4] tracking-tight whitespace-nowrap">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center min-w-[40px] justify-end">
        {showSettings && onSettings ? (
          <button
            onClick={() => {
              soundManager.playClick(soundEnabled);
              onSettings();
            }}
            aria-label="Settings"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#464554] hover:bg-[#eceef0] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Settings className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
};
