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

  const setHandicapDropWinner = async (player: string) => {
    if (!isEditor) return;
    
    setSavingGirWinner(true); // Reusing same state for simplicity
    try {
      const eventRef = doc(db, 'events', event.id);
      await setDoc(eventRef, {
        handicapDropWinner: player,
      }, { merge: true });
      toast.success(`${player} awarded Biggest Handicap Drop (+10 pts)`);
    } catch (error) {
      console.error('Error setting handicap drop winner:', error);
      toast.error('Failed to set handicap drop winner');
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
              <th className="p-3 text-center font-medium text-sm">GIR<br/><span className="text-xs text-muted-foreground">(count)</span></th>
              <th className="p-3 text-center font-medium text-sm">GIR Bonus<br/><span className="text-xs text-muted-foreground">(manual)</span></th>
              <th className="p-3 text-center font-medium text-sm">H&apos;cap Drop<br/><span className="text-xs text-muted-foreground">(display)</span></th>
              <th className="p-3 text-center font-medium text-sm">H&apos;cap Bonus<br/><span className="text-xs text-muted-foreground">(manual)</span></th>
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
                <td className="p-3 text-center text-muted-foreground">{entry.girCount}</td>
                <td className="p-3 text-center text-accent">{entry.girBonus > 0 ? '+10' : '-'}</td>
                <td className="p-3 text-center text-muted-foreground">{entry.handicapDrop > 0 ? entry.handicapDrop.toFixed(1) : '-'}</td>
                <td className="p-3 text-center text-accent">{entry.handicapDropBonus > 0 ? '+10' : '-'}</td>
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

      {/* Handicap Drop Winner Selection */}
      {isEditor && (
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-3">Biggest Handicap Drop Winner</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Award +10 points for biggest handicap drop after Narin/Portnoo and Mt Juliet rounds.
            {event.handicapDropWinner && ` Current winner: ${event.handicapDropWinner}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {event.players.map(player => (
              <Button
                key={player}
                variant={event.handicapDropWinner === player ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHandicapDropWinner(player)}
                disabled={savingGirWinner}
              >
                {player}
              </Button>
            ))}
            {event.handicapDropWinner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHandicapDropWinner('')}
                disabled={savingGirWinner}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* October Classic Explanation */}
      <div className="bg-secondary/50 rounded-lg p-6 border border-border/50">
        <h3 className="text-2xl font-bold mb-4 text-primary">About The October Classic</h3>
        <p className="text-muted-foreground mb-4">
          The October Classic is an annual links golf tournament played each October, marking the culmination of the golf season. 
          This prestigious event takes competitors on a journey through Ireland&apos;s finest links courses over five unforgettable days.
        </p>

        <h4 className="text-lg font-semibold mb-3 mt-6">Scoring System Explained</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Front 9 Winner (per round)</span>
              <span className="font-semibold text-primary">+3 points</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Back 9 Winner (per round)</span>
              <span className="font-semibold text-primary">+3 points</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Round Winner</span>
              <span className="font-semibold text-primary">+10 points</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Longest Drive (per hole)</span>
              <span className="font-semibold text-primary">+1 point</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Closest to Pin (per hole)</span>
              <span className="font-semibold text-accent">+1 point</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Birdie (per hole)</span>
              <span className="font-semibold">+1 point</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Eagle (per hole)</span>
              <span className="font-semibold">+5 points</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Most GIRs (Overall)</span>
              <span className="font-semibold text-accent">+10 points</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Biggest Handicap Drop</span>
              <span className="font-semibold text-accent">+10 points</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-background/50 rounded-lg">
          <h5 className="font-semibold mb-2">Format Details</h5>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Rounds feature mix of Strokeplay, Stableford, and Matchplay formats</li>
            <li>Front 9 / Back 9 winners determined by the same format as the round</li>
            <li>LD and CTTP apply to pre-selected holes (marked on scorecard)</li>
            <li>Each LD or CTTP win adds +1 point to player&apos;s total</li>
            <li>GIR (Greens in Regulation) tracked across all rounds</li>
            <li>Handicap drop calculated after Narin/Portnoo and Mt Juliet rounds</li>
            <li>Scores only count toward leaderboard once submitted by scorer</li>
          </ul>
        </div>
      </div>
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
      girCount: 0, // Cumulative GIR count across all rounds
      girBonus: 0,
      handicapDrop: 0,
      handicapDropBonus: 0,
      total: 0,
    };
  });

  // Process each round (only submitted rounds count toward leaderboard)
  rounds.forEach(round => {
    // Skip rounds that haven't been submitted
    if (!round.submitted) return;
    
    const roundScores = allScores.filter(s => s.roundId === round.id);
    if (roundScores.length === 0) return;

    const course = round.course;
    if (!course) return;

    // Calculate front9 and back9 winners based on round format
    const front9Totals: Record<string, number> = {};
    const back9Totals: Record<string, number> = {};

    roundScores.forEach(score => {
      let front9 = 0;
      let back9 = 0;

      Object.entries(score.holes).forEach(([holeNum, holeScore]) => {
        const num = parseInt(holeNum);
        
        // Use appropriate scoring based on format
        if (round.format === 'Stableford') {
          const points = holeScore.points || 0;
          if (num <= 9) {
            front9 += points;
          } else {
            back9 += points;
          }
        } else {
          // Strokeplay and Matchplay use strokes
          const strokes = holeScore.strokes || 0;
          if (num <= 9) {
            front9 += strokes;
          } else {
            back9 += strokes;
          }
        }
      });

      front9Totals[score.player] = front9;
      back9Totals[score.player] = back9;
    });

    // Award front9 winner based on format
    if (round.format === 'Stableford') {
      // Stableford: highest points wins
      const front9Winner = Object.entries(front9Totals)
        .filter(([_, total]) => total > 0)
        .sort((a, b) => b[1] - a[1])[0]; // Descending for points
      if (front9Winner && front9Totals[front9Winner[0]] > 0) {
        const highestFront9 = front9Winner[1];
        const winners = Object.entries(front9Totals).filter(([_, t]) => t === highestFront9);
        if (winners.length === 1) {
          entries[front9Winner[0]].front9Wins++;
        }
      }
    } else {
      // Strokeplay/Matchplay: lowest strokes wins
      const front9Winner = Object.entries(front9Totals)
        .filter(([_, total]) => total > 0)
        .sort((a, b) => a[1] - b[1])[0]; // Ascending for strokes
      if (front9Winner && front9Totals[front9Winner[0]] > 0) {
        const lowestFront9 = front9Winner[1];
        const winners = Object.entries(front9Totals).filter(([_, t]) => t === lowestFront9);
        if (winners.length === 1) {
          entries[front9Winner[0]].front9Wins++;
        }
      }
    }

    // Award back9 winner (only for 18-hole rounds) based on format
    if (course.holes.length === 18) {
      if (round.format === 'Stableford') {
        // Stableford: highest points wins
        const back9Winner = Object.entries(back9Totals)
          .filter(([_, total]) => total > 0)
          .sort((a, b) => b[1] - a[1])[0]; // Descending for points
        if (back9Winner && back9Totals[back9Winner[0]] > 0) {
          const highestBack9 = back9Winner[1];
          const winners = Object.entries(back9Totals).filter(([_, t]) => t === highestBack9);
          if (winners.length === 1) {
            entries[back9Winner[0]].back9Wins++;
          }
        }
      } else {
        // Strokeplay/Matchplay: lowest strokes wins
        const back9Winner = Object.entries(back9Totals)
          .filter(([_, total]) => total > 0)
          .sort((a, b) => a[1] - b[1])[0]; // Ascending for strokes
        if (back9Winner && back9Totals[back9Winner[0]] > 0) {
          const lowestBack9 = back9Winner[1];
          const winners = Object.entries(back9Totals).filter(([_, t]) => t === lowestBack9);
          if (winners.length === 1) {
            entries[back9Winner[0]].back9Wins++;
          }
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
    } else if (round.format === 'Matchplay') {
      // Use manually selected winner for matchplay
      if (round.matchplayWinner && entries[round.matchplayWinner]) {
        entries[round.matchplayWinner].roundWins++;
      }
    }

    // Accumulate side games, birdies/eagles, and GIR count
    roundScores.forEach(score => {
      entries[score.player].ldPoints += score.ldPoints || 0;
      entries[score.player].cttpPoints += score.cttpPoints || 0;
      entries[score.player].birdies += score.birdies || 0;
      entries[score.player].eagles += score.eagles || 0;
      
      // Count total GIRs across all holes in this round
      const girCount = Object.values(score.holes).filter(h => h.gir).length;
      entries[score.player].girCount += girCount;
    });
  });

  // Calculate handicap drops (Narin/Portnoo + Mt Juliet only)
  const narinRound = rounds.find(r => r.course?.name === 'Narin & Portnoo Golf Club');
  const mtJulietRound = rounds.find(r => r.course?.name === 'Mount Juliet Golf Club');
  
  if (narinRound && mtJulietRound && narinRound.submitted && mtJulietRound.submitted) {
    event.players.forEach(player => {
      const mtJulietScore = allScores.find(s => s.roundId === mtJulietRound.id && s.player === player);
      const startingHandicap = event.startingHandicaps?.[player] || 0;
      
      if (mtJulietScore && mtJulietScore.handicap !== undefined) {
        const drop = startingHandicap - mtJulietScore.handicap;
        entries[player].handicapDrop = Math.max(0, drop); // Only show positive drops
      }
    });
  }

  // Award GIR overall winner
  if (event.girOverallWinner) {
    entries[event.girOverallWinner].girBonus = 10;
  }

  // Award handicap drop winner
  if (event.handicapDropWinner) {
    entries[event.handicapDropWinner].handicapDropBonus = 10;
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
      entry.girBonus +
      entry.handicapDropBonus;
  });

  // Sort by total descending
  return Object.values(entries).sort((a, b) => b.total - a.total);
}

