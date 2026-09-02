import React from 'react';
import { X, BookOpen, HelpCircle, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RulesModalProps {
  type: 'rules' | 'how_to_play' | null;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  type,
  onClose,
  soundEnabled = true,
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c7c4d7]/30 bg-[#f7f9fb]">
          <div className="flex items-center gap-2.5">
            {type === 'rules' ? (
              <BookOpen className="w-6 h-6 text-[#4648d4]" />
            ) : (
              <HelpCircle className="w-6 h-6 text-[#fd761a]" />
            )}
            <h3 className="text-[20px] font-bold text-[#191c1e]">
              {type === 'rules' ? 'Official Game Rules' : 'How to Play Ludo'}
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick(soundEnabled);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#eceef0] hover:bg-[#e0e3e5] flex items-center justify-center text-[#464554] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-[#191c1e] text-[15px] leading-relaxed">
          {type === 'rules' ? (
            <>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-[#00885d] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[16px]">Entering the Track</h4>
                  <p className="text-[#464554]">
                    You must roll a <strong>6</strong> on the die to release a token from your yard onto your colored starting square.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Star className="w-5 h-5 text-[#fd761a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[16px]">Safe Squares (Stars)</h4>
                  <p className="text-[#464554]">
                    Squares marked with a <strong>star</strong> (including player start squares) are safe zones. Opponent tokens cannot capture you on safe squares.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[16px]">Capturing Tokens</h4>
                  <p className="text-[#464554]">
                    Landing on an opponent's token on a normal square knocks it back to their starting yard, and earns you a <strong>Bonus Turn</strong>!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-[#4648d4] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[16px]">Bonus Turns on 6</h4>
                  <p className="text-[#464554]">
                    Rolling a <strong>6</strong> grants another roll. However, rolling three 6s in a row forfeits the turn to ensure fair play.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-[#6063ee] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[16px]">Winning the Match</h4>
                  <p className="text-[#464554]">
                    Move all 4 of your tokens around the board and into your center Home base. The first player to bring all 4 pieces home wins!
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#e1e0ff]/50 rounded-2xl p-4 border border-[#4648d4]/20">
                <p className="font-semibold text-[#4648d4]">
                  Ludo Premier is a classic strategy game for 2 to 4 players. Here is your quick step-by-step guide:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#f2f4f6] rounded-xl">
                  <span className="font-bold text-[#4648d4] mr-2">Step 1:</span>
                  <span>Tap the <strong>Roll Dice</strong> button or click the die when it's your turn.</span>
                </div>
                <div className="p-3 bg-[#f2f4f6] rounded-xl">
                  <span className="font-bold text-[#4648d4] mr-2">Step 2:</span>
                  <span>If you roll a 6, tap a piece in your yard to bring it into play, or move an active token forward 6 spaces.</span>
                </div>
                <div className="p-3 bg-[#f2f4f6] rounded-xl">
                  <span className="font-bold text-[#4648d4] mr-2">Step 3:</span>
                  <span>When a piece has multiple move choices, click the glowing token you want to move.</span>
                </div>
                <div className="p-3 bg-[#f2f4f6] rounded-xl">
                  <span className="font-bold text-[#4648d4] mr-2">Step 4:</span>
                  <span>Chase opponent pieces to capture them, stay safe on star squares, and navigate your home stretch to victory!</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#c7c4d7]/30 bg-[#f7f9fb] flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick(soundEnabled);
              onClose();
            }}
            className="tactile-button bg-[#4648d4] hover:bg-[#3d3fba] text-white px-6 py-2.5 rounded-xl font-bold text-[15px] cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
