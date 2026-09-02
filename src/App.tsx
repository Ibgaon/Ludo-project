import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  GameModeType,
  AIDifficulty,
  PlayerConfig,
  UserProfile,
  GameSettings,
  MatchHistoryItem,
} from './types';
import { ASSETS } from './utils/assets';
import { soundManager } from './utils/audio';

import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { SplashScreen } from './components/SplashScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { GameModeSelect } from './components/GameModeSelect';
import { SetupMatch } from './components/SetupMatch';
import { GameBoard } from './components/GameBoard';
import { PauseModal } from './components/PauseModal';
import { WinnerScreen } from './components/WinnerScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';

const DEFAULT_PROFILE: UserProfile = {
  name: 'AlexGamer99',
  avatar: ASSETS.avatarWinner,
  totalWins: 142,
  gamesPlayed: 318,
  winStreak: 4,
  highestScore: 4520,
  favoriteColor: 'blue',
  achievements: [
    {
      id: '1',
      title: 'First Step',
      description: 'Unlock your first piece from the home yard with a 6',
      unlocked: true,
      icon: '🎲',
    },
    {
      id: '2',
      title: 'Grand Master',
      description: 'Win 100 total matches in Ludo Premier',
      unlocked: true,
      icon: '🏆',
    },
    {
      id: '3',
      title: 'Triple Sixes',
      description: 'Roll lucky sixes back to back in a competitive match',
      unlocked: true,
      icon: '⚡',
    },
    {
      id: '4',
      title: 'Clean Sweep',
      description: 'Get all 4 tokens home without losing a single piece',
      unlocked: false,
      icon: '👑',
    },
  ],
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEffects: true,
  backgroundMusic: false,
  vibration: true,
  diceAnimation: true,
  animationSpeed: 'normal',
};

const INITIAL_HISTORY: MatchHistoryItem[] = [
  {
    id: 'm-1',
    date: 'Today, 2:45 PM',
    gameMode: 'Vs Computer',
    playerCount: 2,
    winnerName: 'AlexGamer99',
    winnerColor: 'blue',
    userRank: 1,
    userScore: 4520,
    duration: '6m 20s',
  },
  {
    id: 'm-2',
    date: 'Yesterday, 8:15 PM',
    gameMode: 'Local Multiplayer',
    playerCount: 4,
    winnerName: 'SarahPlayz',
    winnerColor: 'red',
    userRank: 2,
    userScore: 3100,
    duration: '11m 40s',
  },
  {
    id: 'm-3',
    date: 'Aug 30, 4:10 PM',
    gameMode: 'Pass & Play',
    playerCount: 3,
    winnerName: 'AlexGamer99',
    winnerColor: 'blue',
    userRank: 1,
    userScore: 4200,
    duration: '8m 15s',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('home');
  const [selectedMode, setSelectedMode] = useState<GameModeType>('vs_computer');
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('medium');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(2);

  const [activeMatchPlayers, setActiveMatchPlayers] = useState<PlayerConfig[]>([]);
  const [isGamePaused, setIsGamePaused] = useState<boolean>(false);
  const [winnerResults, setWinnerResults] = useState<{
    winnerOrder: number[];
    players: PlayerConfig[];
  } | null>(null);

  // Persistent user state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ludo_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('ludo_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [history, setHistory] = useState<MatchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ludo_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ludo_profile', JSON.stringify(userProfile));
    } catch {
      // Ignored
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('ludo_settings', JSON.stringify(settings));
    } catch {
      // Ignored
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ludo_history', JSON.stringify(history));
    } catch {
      // Ignored
    }
  }, [history]);

  const navigateTo = (screen: AppScreen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleUpdateSettings = (updated: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleModeSelect = (mode: GameModeType) => {
    setSelectedMode(mode);
    navigateTo('mode_select');
  };

  const handleModeConfirmed = (
    mode: GameModeType,
    difficulty: AIDifficulty,
    playerCount: number
  ) => {
    setSelectedMode(mode);
    setSelectedDifficulty(difficulty);
    setSelectedPlayerCount(playerCount);
    navigateTo('setup_match');
  };

  const handleQuickStart = () => {
    const quickPlayers: PlayerConfig[] = [
      {
        id: 0,
        name: userProfile.name,
        color: 'blue',
        type: 'human',
        avatar: userProfile.avatar,
      },
      {
        id: 1,
        name: 'Bot Alpha',
        color: 'red',
        type: 'bot',
        difficulty: 'medium',
        avatar: ASSETS.avatarBot,
      },
    ];
    setActiveMatchPlayers(quickPlayers);
    setWinnerResults(null);
    navigateTo('game');
  };

  const handleStartGame = (configuredPlayers: PlayerConfig[]) => {
    setActiveMatchPlayers(configuredPlayers);
    setWinnerResults(null);
    navigateTo('game');
  };

  const handleGameOver = (winnerOrder: number[]) => {
    const winnerIdx = winnerOrder[0] ?? 0;
    const isUserWinner = winnerIdx === 0;

    // Update user stats
    setUserProfile((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalWins: isUserWinner ? prev.totalWins + 1 : prev.totalWins,
      winStreak: isUserWinner ? prev.winStreak + 1 : 0,
    }));

    // Record match history
    const newHistoryItem: MatchHistoryItem = {
      id: `m-${Date.now()}`,
      date: 'Just now',
      gameMode:
        selectedMode === 'vs_computer'
          ? 'Vs Computer'
          : selectedMode === 'pass_play'
          ? 'Pass & Play'
          : 'Local Multiplayer',
      playerCount: activeMatchPlayers.length,
      winnerName: activeMatchPlayers[winnerIdx]?.name || 'Player 1',
      winnerColor: activeMatchPlayers[winnerIdx]?.color || 'blue',
      userRank: winnerOrder.indexOf(0) !== -1 ? winnerOrder.indexOf(0) + 1 : 2,
      userScore: isUserWinner ? 4520 : 2850,
      duration: '7m 45s',
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    setWinnerResults({
      winnerOrder,
      players: activeMatchPlayers,
    });
  };

  // Render current screen
  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => navigateTo('home')} />;
  }

  // If winner screen active
  if (winnerResults) {
    return (
      <WinnerScreen
        winnerOrder={winnerResults.winnerOrder}
        players={winnerResults.players}
        settings={settings}
        onHome={() => {
          setWinnerResults(null);
          navigateTo('home');
        }}
        onPlayAgain={() => {
          setWinnerResults(null);
          navigateTo('game');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col font-sans overflow-x-hidden">
      {/* Top App Bar (Visible on non-game and game screens appropriately) */}
      {currentScreen !== 'game' && (
        <TopAppBar
          title={
            currentScreen === 'settings'
              ? 'Settings'
              : currentScreen === 'leaderboard'
              ? 'Leaderboard'
              : currentScreen === 'history'
              ? 'History'
              : currentScreen === 'profile'
              ? 'Profile'
              : currentScreen === 'mode_select'
              ? 'Game Mode'
              : currentScreen === 'setup_match'
              ? 'Match Setup'
              : 'LUDO PREMIER'
          }
          showBack={currentScreen !== 'home'}
          showSettings={currentScreen === 'home'}
          soundEnabled={settings.soundEffects}
          onBack={() => {
            if (currentScreen === 'setup_match') {
              navigateTo('mode_select');
            } else if (currentScreen === 'mode_select') {
              navigateTo('home');
            } else {
              navigateTo('home');
            }
          }}
          onSettings={() => navigateTo('settings')}
        />
      )}

      {/* Screen Views */}
      <div className={`${currentScreen !== 'game' ? 'pt-16' : ''} flex-1 flex flex-col`}>
        {currentScreen === 'home' && (
          <HomeDashboard
            userProfile={userProfile}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onSelectMode={handleModeSelect}
            onQuickStart={handleQuickStart}
          />
        )}

        {currentScreen === 'mode_select' && (
          <GameModeSelect
            initialMode={selectedMode}
            settings={settings}
            onProceed={handleModeConfirmed}
          />
        )}

        {currentScreen === 'setup_match' && (
          <SetupMatch
            initialPlayerCount={selectedPlayerCount}
            initialVsBot={selectedMode === 'vs_computer'}
            initialDifficulty={selectedDifficulty}
            settings={settings}
            onStartGame={handleStartGame}
          />
        )}

        {currentScreen === 'game' && (
          <GameBoard
            players={activeMatchPlayers}
            settings={settings}
            onPause={() => setIsGamePaused(true)}
            onGameOver={handleGameOver}
            onExit={() => navigateTo('home')}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen soundEnabled={settings.soundEffects} />
        )}

        {currentScreen === 'history' && (
          <HistoryScreen
            history={history}
            onPlayAgain={() => navigateTo('mode_select')}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            soundEnabled={settings.soundEffects}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>

      {/* Pause Modal */}
      <PauseModal
        isOpen={isGamePaused}
        soundEnabled={settings.soundEffects}
        onResume={() => setIsGamePaused(false)}
        onRestart={() => {
          setIsGamePaused(false);
          // Restart match with current players
          setWinnerResults(null);
          navigateTo('game');
        }}
        onOpenSettings={() => {
          setIsGamePaused(false);
          navigateTo('settings');
        }}
        onExitToHome={() => {
          setIsGamePaused(false);
          navigateTo('home');
        }}
      />

      {/* Bottom Navigation Bar (Shown on main hub screens) */}
      {['home', 'leaderboard', 'history', 'profile'].includes(currentScreen) && (
        <BottomNavBar
          currentScreen={currentScreen}
          onNavigate={(scr) => navigateTo(scr)}
          soundEnabled={settings.soundEffects}
        />
      )}
    </div>
  );
}
