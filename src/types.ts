export type PlayerColor = 'blue' | 'red' | 'green' | 'yellow';

export type PlayerType = 'human' | 'bot';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameModeType = 'pass_play' | 'vs_computer' | 'local_multiplayer';

export type AppScreen =
  | 'splash'
  | 'home'
  | 'mode_select'
  | 'setup_match'
  | 'game'
  | 'settings'
  | 'leaderboard'
  | 'history'
  | 'profile';

export interface PlayerConfig {
  id: number;
  name: string;
  color: PlayerColor;
  type: PlayerType;
  difficulty?: AIDifficulty;
  avatar: string;
  isCurrentTurn?: boolean;
  score?: number;
  rank?: number;
}

export interface Token {
  id: number; // 0, 1, 2, 3
  playerIndex: number;
  color: PlayerColor;
  // stepPosition:
  // -1: in yard (home base)
  // 0 to 50: on main common board track (51 track cells)
  // 51 to 55: inside private colored home column
  // 56: finished inside center home triangle
  step: number;
  isHome: boolean;
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  gameMode: string;
  playerCount: number;
  winnerName: string;
  winnerColor: PlayerColor;
  userRank: number;
  userScore: number;
  duration: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  totalWins: number;
  gamesPlayed: number;
  winStreak: number;
  highestScore: number;
  favoriteColor: PlayerColor;
  achievements: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    icon: string;
  }[];
}

export interface GameSettings {
  soundEffects: boolean;
  backgroundMusic: boolean;
  vibration: boolean;
  diceAnimation: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}
