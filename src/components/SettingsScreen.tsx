import React, { useState } from 'react';
import { Volume2, Music, Vibrate, Dices, Gauge, BookOpen, HelpCircle, ChevronRight } from 'lucide-react';
import { GameSettings } from '../types';
import { soundManager } from '../utils/audio';
import { RulesModal } from './RulesModal';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [modalType, setModalType] = useState<'rules' | 'how_to_play' | null>(null);

  const speedValue =
    settings.animationSpeed === 'slow' ? 1 : settings.animationSpeed === 'normal' ? 2 : 3;

  const handleSpeedChange = (val: number) => {
    soundManager.playClick(settings.soundEffects);
    const speedMap: Record<number, 'slow' | 'normal' | 'fast'> = {
      1: 'slow',
      2: 'normal',
      3: 'fast',
    };
    onUpdateSettings({ animationSpeed: speedMap[val] || 'normal' });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-2xl mx-auto w-full space-y-6">
      {/* Audio & Haptics Section */}
      <section className="w-full bg-white rounded-2xl p-5 shadow-xs border border-[#c7c4d7]/30">
        <h2 className="text-[20px] font-bold text-[#4648d4] mb-4 px-1">
          Audio & Haptics
        </h2>

        <div className="space-y-3.5">
          {/* Sound Effects */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eceef0]/50 transition-colors">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-[#767586]" />
              <span className="text-[16px] font-semibold text-[#191c1e]">
                Sound Effects
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => {
                  onUpdateSettings({ soundEffects: e.target.checked });
                  soundManager.playClick(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#4648d4]"></div>
            </label>
          </div>

          {/* Background Music */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eceef0]/50 transition-colors">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-[#767586]" />
              <span className="text-[16px] font-semibold text-[#191c1e]">
                Background Music
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.backgroundMusic}
                onChange={(e) => {
                  const nextVal = e.target.checked;
                  onUpdateSettings({ backgroundMusic: nextVal });
                  soundManager.toggleBGM(nextVal);
                  soundManager.playClick(settings.soundEffects);
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#4648d4]"></div>
            </label>
          </div>

          {/* Vibration */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eceef0]/50 transition-colors">
            <div className="flex items-center gap-3">
              <Vibrate className="w-6 h-6 text-[#767586]" />
              <span className="text-[16px] font-semibold text-[#191c1e]">
                Vibration
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) => {
                  onUpdateSettings({ vibration: e.target.checked });
                  if (e.target.checked) soundManager.vibrate(true, 50);
                  soundManager.playClick(settings.soundEffects);
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#4648d4]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Gameplay Experience Section */}
      <section className="w-full bg-white rounded-2xl p-5 shadow-xs border border-[#c7c4d7]/30">
        <h2 className="text-[20px] font-bold text-[#4648d4] mb-4 px-1">
          Gameplay Experience
        </h2>

        <div className="space-y-4">
          {/* Dice Animation */}
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eceef0]/50 transition-colors">
            <div className="flex items-center gap-3">
              <Dices className="w-6 h-6 text-[#767586]" />
              <span className="text-[16px] font-semibold text-[#191c1e]">
                Dice Animation
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.diceAnimation}
                onChange={(e) => {
                  onUpdateSettings({ diceAnimation: e.target.checked });
                  soundManager.playClick(settings.soundEffects);
                }}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#e0e3e5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#4648d4]"></div>
            </label>
          </div>

          {/* Animation Speed Slider */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Gauge className="w-6 h-6 text-[#767586]" />
                <span className="text-[16px] font-semibold text-[#191c1e]">
                  Animation Speed
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#4648d4] tracking-wider uppercase">
                {settings.animationSpeed}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={speedValue}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full h-2.5 bg-[#eceef0] rounded-lg appearance-none cursor-pointer accent-[#4648d4]"
            />
            <div className="flex justify-between mt-2 px-1 text-[13px] font-semibold text-[#767586]">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="w-full bg-white rounded-2xl shadow-xs border border-[#c7c4d7]/30 overflow-hidden">
        <ul className="divide-y divide-[#c7c4d7]/30">
          <li>
            <button
              onClick={() => {
                soundManager.playClick(settings.soundEffects);
                setModalType('rules');
              }}
              className="w-full flex items-center justify-between p-4.5 hover:bg-[#eceef0]/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#767586]" />
                <span className="text-[16px] font-semibold text-[#191c1e]">
                  Game Rules
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#767586]" />
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                soundManager.playClick(settings.soundEffects);
                setModalType('how_to_play');
              }}
              className="w-full flex items-center justify-between p-4.5 hover:bg-[#eceef0]/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-[#767586]" />
                <span className="text-[16px] font-semibold text-[#191c1e]">
                  How to Play
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#767586]" />
            </button>
          </li>
        </ul>
      </section>

      {/* About & Branding Section */}
      <section className="text-center py-4 opacity-75">
        <div className="text-[20px] font-extrabold text-[#767586] tracking-tight mb-1">
          LUDO PREMIER
        </div>
        <p className="text-[12px] font-bold text-[#767586] mb-3">
          Version 2.1.0 (Build 429)
        </p>
        <div className="flex justify-center gap-3 text-[13px] font-bold">
          <button
            onClick={() => setModalType('rules')}
            className="text-[#4648d4] hover:underline cursor-pointer"
          >
            Terms of Service
          </button>
          <span className="text-[#767586]">•</span>
          <button
            onClick={() => setModalType('rules')}
            className="text-[#4648d4] hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </section>

      {/* Rules / Tutorial Modal */}
      <RulesModal
        type={modalType}
        onClose={() => setModalType(null)}
        soundEnabled={settings.soundEffects}
      />
    </div>
  );
};
