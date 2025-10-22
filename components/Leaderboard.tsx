'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, Round, Score } from '@/lib/types';
import { LeaderboardEntry } from '@/lib/types';
import { Button } from './ui/Button';
import { Trophy, Award } from 'lucide-react';
import { toast } from 'sonner';

interface LeaderboardProps {
  event: Event;
  rounds: Round[];
  allScores: Score[];
  isEditor: boolean;
}

export function Leaderboard({ event, rounds, allScores, isEditor }: LeaderboardProps) {
  const [savingGirWinner, setSavingGirWinner] = useState(false);

  const leaderboard = calculateLeaderboard(event, rounds, allScores);

  const setGirOverallWinner = async (player: string) => {
    if (!isEditor) return;
    
    setSavingGirWinner(true);
    try {
      const eventRef = doc(db, 'events', event.id);
      await setDoc(eventRef, {
        girOverallWinner: player,
      }, { merge: true });
      toast.success(`${player} awarded GIR Overall Winner (+10 pts)`);
    } catch (error) {
      console.error('Error setting GIR winner:', error);
      toast.error('Failed to set GIR winner');
    } finally {
      setSavingGirWinner(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Cumulative Leaderboard</h2>
            <p className="text-muted-foreground">
              {event.name} - Overall Standings
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-secondary rounded-lg">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left font-medium">Pos</th>
              <th className="p-3 text-left font-medium">Player</th>
              <th className="p-3 text-center font-medium text-sm">F9 Wins<br/><span className="text-xs text-muted-foreground">(3 ea)</span></th>
              <th className="p-3 text-center font-medium text-sm">B9 Wins<br/><span className="text-xs text-muted-foreground">(3 ea)</span></th>
              <th className="p-3 text-center font-medium text-sm">Round Wins<br/><span className="text-xs text-muted-foreground">(10 ea)</span></th>
              <th className="p-3 text-center font-medium text-sm">LD</th>
              <th className="p-3 text-center font-medium text-sm">CTTP</th>
              <th className="p-3 text-center font-medium text-sm">Birdies<br/><span className="text-xs text-muted-foreground">(1 ea)</span></th>
              <th className="p-3 text-center font-medium text-sm">Eagles<br/><span className="text-xs text-muted-foreground">(5 ea)</span></th>
              <th className="p-3 text-center font-medium text-sm">GIR<br/><span className="text-xs text-muted-foreground">(10)</span></th>
              <th className="p-3 text-right font-bold text-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, idx) => (
              <tr
                key={entry.player}
                className={`border-b border-border/50 ${
                  idx === 0 ? 'bg-primary/10' : idx === 1 ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-3">
                  {idx === 0 && <Trophy className="h-5 w-5 text-primary inline" />}
                  {idx === 1 && <Award className="h-5 w-5 text-muted-foreground inline" />}
                  {idx === 2 && <Award className="h-5 w-5 text-amber-700 inline" />}
                  {idx > 2 && <span className="text-muted-foreground">{idx + 1}</span>}
                </td>
                <td className="p-3 font-semibold">{entry.player}</td>
                <td className="p-3 text-center">{entry.front9Wins * 3}</td>
                <td className="p-3 text-center">{entry.back9Wins * 3}</td>
                <td className="p-3 text-center">{entry.roundWins * 10}</td>
                <td className="p-3 text-center text-primary">{entry.ldPoints}</td>
                <td className="p-3 text-center text-accent">{entry.cttpPoints}</td>
                <td className="p-3 text-center">{entry.birdies}</td>
                <td className="p-3 text-center">{entry.eagles * 5}</td>
                <td className="p-3 text-center">{entry.girBonus}</td>
                <td className="p-3 text-right text-xl font-bold text-primary">{entry.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GIR Overall Winner Selection */}
      {isEditor && (
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-3">GIR Overall Winner Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Award +10 points to the player with the most greens in regulation across all rounds.
            {event.girOverallWinner && ` Current winner: ${event.girOverallWinner}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {event.players.map(player => (
              <Button
                key={player}
                variant={event.girOverallWinner === player ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGirOverallWinner(player)}
                disabled={savingGirWinner}
              >
                {player}
              </Button>
            ))}
            {event.girOverallWinner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGirOverallWinner('')}
                disabled={savingGirWinner}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function calculateLeaderboard(
  event: Event,
  rounds: Round[],
  allScores: Score[]
): LeaderboardEntry[] {
  const entries: Record<string, LeaderboardEntry> = {};

  // Initialize entries
  event.players.forEach(player => {
    entries[player] = {
      player,
      front9Wins: 0,
      back9Wins: 0,
      roundWins: 0,
      ldPoints: 0,
      cttpPoints: 0,
      birdies: 0,
      eagles: 0,
      girBonus: 0,
      total: 0,
    };
  });

  // Process each round
  rounds.forEach(round => {
    const roundScores = allScores.filter(s => s.roundId === round.id);
    if (roundScores.length === 0) return;

    const course = round.course;
    if (!course) return;

    // Calculate front9 and back9 winners
    const front9Totals: Record<string, number> = {};
    const back9Totals: Record<string, number> = {};

    roundScores.forEach(score => {
      let front9 = 0;
      let back9 = 0;

      Object.entries(score.holes).forEach(([holeNum, holeScore]) => {
        const num = parseInt(holeNum);
        const strokes = holeScore.strokes || 0;
        
        if (num <= 9) {
          front9 += strokes;
        } else {
          back9 += strokes;
        }
      });

      front9Totals[score.player] = front9;
      back9Totals[score.player] = back9;
    });

    // Award front9 winner (lowest for stroke play, handle ties)
    const front9Winner = Object.entries(front9Totals)
      .filter(([_, total]) => total > 0)
      .sort((a, b) => a[1] - b[1])[0];
    if (front9Winner && front9Totals[front9Winner[0]] > 0) {
      const lowestFront9 = front9Winner[1];
      const winners = Object.entries(front9Totals).filter(([_, t]) => t === lowestFront9);
      if (winners.length === 1) {
        entries[front9Winner[0]].front9Wins++;
      }
    }

    // Award back9 winner (only for 18-hole rounds)
    if (course.holes.length === 18) {
      const back9Winner = Object.entries(back9Totals)
        .filter(([_, total]) => total > 0)
        .sort((a, b) => a[1] - b[1])[0];
      if (back9Winner && back9Totals[back9Winner[0]] > 0) {
        const lowestBack9 = back9Winner[1];
        const winners = Object.entries(back9Totals).filter(([_, t]) => t === lowestBack9);
        if (winners.length === 1) {
          entries[back9Winner[0]].back9Wins++;
        }
      }
    }

    // Award round winner based on format
    if (round.format === 'Strokeplay') {
      const roundWinner = roundScores
        .filter(s => Object.keys(s.holes).length > 0)
        .sort((a, b) => {
          const aTotal = Object.values(a.holes).reduce((sum, h) => sum + (h.strokes || 0), 0);
          const bTotal = Object.values(b.holes).reduce((sum, h) => sum + (h.strokes || 0), 0);
          return aTotal - bTotal;
        })[0];
      if (roundWinner) {
        entries[roundWinner.player].roundWins++;
      }
    } else if (round.format === 'Stableford') {
      const roundWinner = roundScores
        .sort((a, b) => {
          const aTotal = Object.values(a.holes).reduce((sum, h) => sum + (h.points || 0), 0);
          const bTotal = Object.values(b.holes).reduce((sum, h) => sum + (h.points || 0), 0);
          return bTotal - aTotal;
        })[0];
      if (roundWinner) {
        entries[roundWinner.player].roundWins++;
      }
    }

    // Accumulate side games and birdies/eagles
    roundScores.forEach(score => {
      entries[score.player].ldPoints += score.ldPoints || 0;
      entries[score.player].cttpPoints += score.cttpPoints || 0;
      entries[score.player].birdies += score.birdies || 0;
      entries[score.player].eagles += score.eagles || 0;
    });
  });

  // Award GIR overall winner
  if (event.girOverallWinner) {
    entries[event.girOverallWinner].girBonus = 10;
  }

  // Calculate totals
  Object.values(entries).forEach(entry => {
    entry.total =
      entry.front9Wins * 3 +
      entry.back9Wins * 3 +
      entry.roundWins * 10 +
      entry.ldPoints +
      entry.cttpPoints +
      entry.birdies +
      entry.eagles * 5 +
      entry.girBonus;
  });

  // Sort by total descending
  return Object.values(entries).sort((a, b) => b.total - a.total);
}

