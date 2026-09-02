import { PlayerColor, PlayerConfig, Token, AIDifficulty } from '../types';

export const TRACK_COORDINATES: Array<[number, number]> = [
  [6, 13], // 0 - Blue Start
  [6, 12], // 1
  [6, 11], // 2
  [6, 10], // 3
  [6, 9],  // 4
  [5, 8],  // 5
  [4, 8],  // 6
  [3, 8],  // 7
  [2, 8],  // 8 - Safe Star
  [1, 8],  // 9
  [0, 8],  // 10
  [0, 7],  // 11
  [0, 6],  // 12
  [1, 6],  // 13 - Red Start
  [2, 6],  // 14
  [3, 6],  // 15
  [4, 6],  // 16
  [5, 6],  // 17
  [6, 5],  // 18
  [6, 4],  // 19
  [6, 3],  // 20
  [6, 2],  // 21 - Safe Star
  [6, 1],  // 22
  [6, 0],  // 23
  [7, 0],  // 24
  [8, 0],  // 25
  [8, 1],  // 26 - Green Start
  [8, 2],  // 27
  [8, 3],  // 28
  [8, 4],  // 29
  [8, 5],  // 30
  [9, 6],  // 31
  [10, 6], // 32
  [11, 6], // 33
  [12, 6], // 34 - Safe Star
  [13, 6], // 35
  [14, 6], // 36
  [14, 7], // 37
  [14, 8], // 38
  [13, 8], // 39 - Yellow Start
  [12, 8], // 40
  [11, 8], // 41
  [10, 8], // 42
  [9, 8],  // 43
  [8, 9],  // 44
  [8, 10], // 45
  [8, 11], // 46
  [8, 12], // 47 - Safe Star
  [8, 13], // 48
  [8, 14], // 49
  [7, 14], // 50
  [6, 14], // 51
];

export const SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export const COLOR_START_INDICES: Record<PlayerColor, number> = {
  blue: 0,
  red: 13,
  green: 26,
  yellow: 39,
};

export const HOME_CORRIDORS: Record<PlayerColor, Array<[number, number]>> = {
  blue: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],
  red: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],
  green: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  yellow: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
};

export const CENTER_HOME_COORDS: Record<PlayerColor, [number, number]> = {
  blue: [7, 8],
  red: [6, 7],
  green: [7, 6],
  yellow: [8, 7],
};

export const YARD_COORDINATES: Record<PlayerColor, Array<[number, number]>> = {
  blue: [
    [2, 11],
    [3.5, 11],
    [2, 12.5],
    [3.5, 12.5],
  ],
  red: [
    [2, 2],
    [3.5, 2],
    [2, 3.5],
    [3.5, 3.5],
  ],
  green: [
    [11, 2],
    [12.5, 2],
    [11, 3.5],
    [12.5, 3.5],
  ],
  yellow: [
    [11, 11],
    [12.5, 11],
    [11, 12.5],
    [12.5, 12.5],
  ],
};

export const TOTAL_STEPS_TO_HOME = 56;

// Convert a token's step to board grid (x, y)
export function getTokenCoordinates(token: Token): [number, number] {
  if (token.step === -1) {
    // In home yard
    const yardSpots = YARD_COORDINATES[token.color];
    return yardSpots[token.id % yardSpots.length];
  }

  if (token.step === TOTAL_STEPS_TO_HOME) {
    // Finished in center home
    return CENTER_HOME_COORDS[token.color];
  }

  if (token.step >= 51 && token.step <= 55) {
    // In colored home corridor
    const corridorIndex = token.step - 51;
    return HOME_CORRIDORS[token.color][corridorIndex];
  }

  // On main 52-cell track
  const startIdx = COLOR_START_INDICES[token.color];
  const globalTrackIdx = (startIdx + token.step) % 52;
  return TRACK_COORDINATES[globalTrackIdx];
}

// Get global track index for a token if on main track
export function getGlobalTrackIndex(token: Token): number | null {
  if (token.step >= 0 && token.step <= 50) {
    const startIdx = COLOR_START_INDICES[token.color];
    return (startIdx + token.step) % 52;
  }
  return null;
}

// Check if a token can make a legal move with the rolled dice value
export function canTokenMove(token: Token, diceValue: number): boolean {
  if (token.step === TOTAL_STEPS_TO_HOME) {
    return false; // Already finished
  }

  if (token.step === -1) {
    // Requires a 6 to leave yard
    return diceValue === 6;
  }

  // Check if step + diceValue does not overshoot home (56 max)
  return token.step + diceValue <= TOTAL_STEPS_TO_HOME;
}

// Find all moveable tokens for a player with a dice roll
export function getMoveableTokens(
  playerTokens: Token[],
  diceValue: number
): Token[] {
  return playerTokens.filter((token) => canTokenMove(token, diceValue));
}

// Select best move for AI bot
export function chooseBotMove(
  botPlayer: PlayerConfig,
  allTokens: Token[],
  diceValue: number,
  difficulty: AIDifficulty = 'medium'
): Token | null {
  const myTokens = allTokens.filter(
    (t) => t.playerIndex === botPlayer.id && !t.isHome
  );
  const moveable = getMoveableTokens(myTokens, diceValue);

  if (moveable.length === 0) return null;
  if (moveable.length === 1) return moveable[0];

  if (difficulty === 'easy') {
    // Random move
    return moveable[Math.floor(Math.random() * moveable.length)];
  }

  // Score candidate moves
  let bestToken = moveable[0];
  let highestScore = -Infinity;

  for (const token of moveable) {
    let score = 0;

    // Next step position
    const nextStep = token.step === -1 ? 0 : token.step + diceValue;

    // 1. Moving out of yard on rolling a 6 is great
    if (token.step === -1 && diceValue === 6) {
      score += 60;
    }

    // 2. Entering home triangle is top priority
    if (nextStep === TOTAL_STEPS_TO_HOME) {
      score += 100;
    }

    // 3. Reaching home corridor (steps 51-55) is safe and high value
    if (nextStep >= 51 && nextStep < TOTAL_STEPS_TO_HOME) {
      score += 45 + (nextStep - 50) * 5;
    }

    // 4. Capture opponent check
    if (nextStep <= 50) {
      const startIdx = COLOR_START_INDICES[token.color];
      const targetGlobalTrack = (startIdx + nextStep) % 52;
      const isSafe = SAFE_TRACK_INDICES.includes(targetGlobalTrack);

      if (!isSafe) {
        // Look for opponent tokens on this target track
        const opponentsOnTarget = allTokens.filter(
          (t) =>
            t.playerIndex !== botPlayer.id &&
            getGlobalTrackIndex(t) === targetGlobalTrack
        );

        if (opponentsOnTarget.length > 0) {
          score += 85; // High capture reward!
        }
      } else {
        // Landing on safe star spot
        score += 35;
      }
    }

    // 5. Danger avoidance on hard difficulty
    if (difficulty === 'hard' && token.step >= 0 && token.step <= 50) {
      const currentGlobalTrack = getGlobalTrackIndex(token);
      const isCurrentlySafe =
        currentGlobalTrack !== null &&
        SAFE_TRACK_INDICES.includes(currentGlobalTrack);

      // If currently vulnerable with opponent behind within 6 squares
      if (!isCurrentlySafe && currentGlobalTrack !== null) {
        const opponentThreatening = allTokens.some((t) => {
          if (t.playerIndex === botPlayer.id) return false;
          const oppTrack = getGlobalTrackIndex(t);
          if (oppTrack === null) return false;
          const dist = (currentGlobalTrack - oppTrack + 52) % 52;
          return dist >= 1 && dist <= 6;
        });

        if (opponentThreatening) {
          score += 40; // Escape threat!
        }
      }

      // Bonus for advancing further ahead
      score += token.step * 0.5;
    } else {
      score += token.step * 0.3;
    }

    if (score > highestScore) {
      highestScore = score;
      bestToken = token;
    }
  }

  return bestToken;
}
