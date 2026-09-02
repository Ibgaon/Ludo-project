import React from 'react';
import { MatchHistoryItem } from '../types';
import { Trophy, Clock, Users, ArrowUpRight } from 'lucide-react';

interface HistoryScreenProps {
  history: MatchHistoryItem[];
  onPlayAgain: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onPlayAgain }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start px-5 pt-3 pb-32 max-w-md mx-auto w-full">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-[24px] font-bold text-[#191c1e]">Match History</h2>
        <p className="text-[15px] font-medium text-[#767586]">Your recent battles and results</p>
      </div>

      {history.length === 0 ? (
        <div className="w-full bg-white rounded-2xl p-8 text-center border border-[#c7c4d7]/30 shadow-xs">
          <Trophy className="w-12 h-12 text-[#c7c4d7] mx-auto mb-3" />
          <h3 className="text-[18px] font-bold text-[#191c1e] mb-1">No Matches Played Yet</h3>
          <p className="text-[14px] text-[#767586] mb-5">
            Start a match against the computer or friends to see your game logs here.
          </p>
          <button
            onClick={onPlayAgain}
            className="tactile-button bg-[#4648d4] text-white px-6 py-2.5 rounded-xl font-bold text-[15px] cursor-pointer"
          >
            Play First Match
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {history.map((item) => {
            const isWin = item.userRank === 1;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-[#c7c4d7]/30 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-[15px] ${
                      isWin
                        ? 'bg-[#e1e0ff] text-[#4648d4]'
                        : 'bg-[#eceef0] text-[#767586]'
                    }`}
                  >
                    {isWin ? <Trophy className="w-6 h-6 fill-[#4648d4]" /> : `#${item.userRank}`}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-bold text-[#191c1e]">
                        {item.gameMode}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                          isWin
                            ? 'bg-[#dcfce7] text-[#00885d]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {isWin ? 'Victory' : `Rank ${item.userRank}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[13px] font-medium text-[#767586] mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {item.playerCount}P
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[16px] font-extrabold text-[#4648d4]">
                    +{item.userScore}
                  </span>
                  <span className="text-[12px] font-semibold text-[#767586] flex items-center gap-0.5">
                    Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
