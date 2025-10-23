import { Timestamp } from 'firebase/firestore';

export interface Hole {
  number: number;
  par?: number; // Optional - user fills in
  strokeIndex?: number; // Optional - user fills in
  isCttpHole?: boolean; // Checkbox for Par 3s
  isLdHole?: boolean; // Checkbox for Par 5s
}

export interface Course {
  id: string;
  name: string;
  location: string;
  holes: Hole[];
}

export interface Event {
  id: string;
  name: string;
  year: number;
  players: string[];
  startingHandicaps: Record<string, number>; // Player name -> starting handicap
  girOverallWinner: string | null;
  handicapDropWinner: string | null; // Winner of biggest handicap drop (Narin/Portnoo + Mt Juliet)
  createdAt: Timestamp;
}

export interface EditorAccess {
  currentEditorUid: string | null;
  updatedAt: Timestamp;
}

export type RoundFormat = 'Strokeplay' | 'Stableford' | 'Matchplay';

export interface Round {
  id: string;
  eventId: string;
  courseId: string;
  sequence: number;
  label: string;
  date: string; // e.g., "October 23, 2025"
  format: RoundFormat;
  matchplayWinner?: string | null; // For matchplay rounds
  submitted?: boolean; // Whether scores are final and count toward leaderboard
  course?: Course; // Joined data
}

export interface HoleScore {
  strokes?: number;
  points?: number;
  gir?: boolean;
}

export interface Score {
  id: string;
  roundId: string;
  player: string;
  handicap: number;
  holes: Record<string, HoleScore>;
  birdies: number;
  eagles: number;
  ldPoints: number;
  cttpPoints: number;
  updatedAt: Timestamp;
}

export interface LeaderboardEntry {
  player: string;
  front9Wins: number;
  back9Wins: number;
  roundWins: number;
  ldPoints: number;
  cttpPoints: number;
  birdies: number;
  eagles: number;
  girCount: number; // Total GIR across all rounds (for display only)
  girBonus: number; // Manual 10 points awarded to winner
  handicapDrop: number; // Handicap drop after Narin/Portnoo + Mt Juliet (for display)
  handicapDropBonus: number; // Manual 10 points awarded for biggest drop
  total: number;
}

