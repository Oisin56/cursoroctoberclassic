import { Timestamp } from 'firebase/firestore';

export interface Hole {
  number: number;
  par: number;
  strokeIndex: number;
  yardage: number;
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
  girOverallWinner: string | null;
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
  format: RoundFormat;
  ldHoles: number[];
  cttpHoles: number[];
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
  girBonus: number;
  total: number;
}

