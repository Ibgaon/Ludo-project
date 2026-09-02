import React, { useState } from 'react';
import { Play, RefreshCw, Settings, LogOut, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  soundEnabled?: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onExitToHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  soundEnabled = true,
  onResume,
  onRestart,
  onOpenSettings,
  onExitToHome,
}) => {
  const [confirmAction, setConfirmAction] = useState<'restart' | 'exit' | null>(null);

  if (!isOpen) return null;

  const handleAction = (type: 'resume' | 'restart' | 'settings' | 'exit') => {
    soundManager.playClick(soundEnabled);
    if (type === 'resume') {
      onResume();
    } else if (type === 'restart') {
      setConfirmAction('restart');
    } else if (type === 'settings') {
      onOpenSettings();
    } else if (type === 'exit') {
      setConfirmAction('exit');
    }
  };

  const handleConfirmAction = () => {
    soundManager.playClick(soundEnabled);
    if (confirmAction === 'restart') {
      setConfirmAction(null);
      onRestart();
    } else if (confirmAction === 'exit') {
      setConfirmAction(null);
      onExitToHome();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center items-center bg-black/40 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white w-full max-w-md rounded-t-[32px] md:rounded-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.15)] md:shadow-2xl overflow-hidden flex flex-col p-6 pb-[max(24px,env(safe-area-inset-bottom))] relative animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-[#c7c4d7]/60 rounded-full mx-auto mb-6 md:hidden" />

        {confirmAction ? (
          /* Confirmation View */
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-4">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <h3 className="text-[22px] font-bold text-[#191c1e] mb-2">
              {confirmAction === 'restart' ? 'Restart Game?' : 'Exit to Home?'}
            </h3>

            <p className="text-[15px] font-medium text-[#464554] mb-8 px-4">
              {confirmAction === 'restart'
                ? 'This match will end and a new one will begin. Are you sure?'
                : 'Your current match progress will be lost.'}
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  soundManager.playClick(soundEnabled);
                  setConfirmAction(null);
                }}
                className="tactile-button flex-1 bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] rounded-xl h-14 font-bold text-[17px] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                className={`tactile-button flex-1 text-white rounded-xl h-14 font-bold text-[17px] cursor-pointer ${
                  confirmAction === 'restart'
                    ? 'bg-[#4648d4] hover:bg-[#3d3fba]'
                    : 'bg-[#ba1a1a] hover:bg-[#9a1515]'
                }`}
              >
                {confirmAction === 'restart' ? 'Restart' : 'Exit'}
              </button>
            </div>
          </div>
        ) : (
          /* Main Pause Menu */
          <div className="flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-[26px] font-extrabold text-[#4648d4] tracking-tight">
                Game Paused
              </h2>
              <p className="text-[15px] font-medium text-[#464554] mt-1">Take a breather.</p>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Resume Button */}
              <button
                onClick={() => handleAction('resume')}
                className="tactile-button bg-[#4648d4] hover:bg-[#3d3fba] text-white rounded-xl h-14 flex items-center justify-center gap-2 text-[18px] font-bold w-full cursor-pointer shadow-md"
              >
                <Play className="w-5 h-5 fill-white" />
                Resume
              </button>

              {/* Restart Game */}
              <button
                onClick={() => handleAction('restart')}
                className="tactile-button bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] rounded-xl h-14 flex items-center justify-center gap-2 text-[18px] font-bold w-full border border-[#c7c4d7]/30 cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                Restart Game
              </button>

              {/* Settings */}
              <button
                onClick={() => handleAction('settings')}
                className="tactile-button bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] rounded-xl h-14 flex items-center justify-center gap-2 text-[18px] font-bold w-full border border-[#c7c4d7]/30 cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>

              <div className="h-px bg-[#c7c4d7]/30 w-full my-1" />

              {/* Exit to Home */}
              <button
                onClick={() => handleAction('exit')}
                className="tactile-button bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl h-14 flex items-center justify-center gap-2 text-[18px] font-bold w-full cursor-pointer transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Exit to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
