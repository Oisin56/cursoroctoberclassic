'use client';

import { useState, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Round, Score, HoleScore } from '@/lib/types';
import { Input } from './ui/Input';
import { debounce } from '@/lib/utils';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

interface ScorecardProps {
  round: Round;
  scores: Score[];
  players: string[];
  isEditor: boolean;
}

export function Scorecard({ round, scores, players, isEditor }: ScorecardProps) {
  const [optimisticScores, setOptimisticScores] = useState<Record<string, Score>>({});
  
  const course = round.course;
  if (!course) return <div>Loading course data...</div>;

  const holes = course.holes;
  const isNineHole = holes.length === 9;

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (scoreId: string, data: Partial<Score>) => {
      try {
        const scoreRef = doc(db, 'scores', scoreId);
        await setDoc(scoreRef, {
          ...data,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (error) {
        console.error('Error saving score:', error);
        toast.error('Failed to save');
      }
    }, 300),
    []
  );

  const getPlayerScore = (player: string): Score => {
    const existing = scores.find(s => s.player === player);
    const optimistic = optimisticScores[player];
    
    if (optimistic) return optimistic;
    
    if (existing) return existing;
    
    // Return default
    return {
      id: `${round.id}_${player}`,
      roundId: round.id,
      player,
      holes: {},
      birdies: 0,
      eagles: 0,
      ldPoints: 0,
      cttpPoints: 0,
      updatedAt: null as any,
    };
  };

  const updateHoleScore = (player: string, holeNum: number, field: keyof HoleScore, value: any) => {
    if (!isEditor) return;

    const currentScore = getPlayerScore(player);
    const holeKey = holeNum.toString();
    const currentHole = currentScore.holes[holeKey] || {};
    
    const updatedHole = {
      ...currentHole,
      [field]: value === '' ? undefined : value,
    };

    const updatedScore: Score = {
      ...currentScore,
      holes: {
        ...currentScore.holes,
        [holeKey]: updatedHole,
      },
    };

    // Calculate birdies/eagles
    const { birdies, eagles } = calculateBirdiesEagles(updatedScore, holes);
    updatedScore.birdies = birdies;
    updatedScore.eagles = eagles;

    setOptimisticScores(prev => ({
      ...prev,
      [player]: updatedScore,
    }));

    debouncedSave(updatedScore.id, updatedScore);
  };

  const updateSideGame = (player: string, field: 'ldPoints' | 'cttpPoints', value: number) => {
    if (!isEditor) return;

    const currentScore = getPlayerScore(player);
    const updatedScore: Score = {
      ...currentScore,
      [field]: value || 0,
    };

    setOptimisticScores(prev => ({
      ...prev,
      [player]: updatedScore,
    }));

    debouncedSave(updatedScore.id, updatedScore);
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-secondary rounded-lg p-4 border border-border">
        <h2 className="text-2xl font-bold">{course.name}</h2>
        <p className="text-muted-foreground">{course.location}</p>
        <div className="mt-2 flex gap-4 text-sm">
          <span className="text-primary font-medium">{round.label}</span>
          <span className="text-muted-foreground">Format: {round.format}</span>
        </div>
      </div>

      {/* Scorecard Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-secondary rounded-lg">
          <thead>
            <tr className="border-b border-border">
              <th className="p-2 text-left text-sm font-medium text-muted-foreground w-12">Hole</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground w-12">Par</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground w-12">SI</th>
              <th className="p-2 text-center text-sm font-medium text-muted-foreground w-16">Yds</th>
              {players.map(player => (
                <th key={player} className="p-2 text-center text-sm font-medium border-l border-border" colSpan={2}>
                  {player}
                </th>
              ))}
            </tr>
            <tr className="border-b border-border">
              <th colSpan={4}></th>
              {players.map(player => (
                <>
                  <th key={`${player}-score`} className="p-2 text-center text-xs text-muted-foreground border-l border-border">
                    {round.format === 'Stableford' ? 'Pts' : 'Score'}
                  </th>
                  <th key={`${player}-gir`} className="p-2 text-center text-xs text-muted-foreground">
                    GIR
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {holes.map((hole, idx) => {
              const isLD = round.ldHoles.includes(hole.number);
              const isCTTP = round.cttpHoles.includes(hole.number);
              const rowBg = isLD || isCTTP ? 'bg-primary/5' : '';
              
              return (
                <tr key={hole.number} className={`border-b border-border/50 ${rowBg}`}>
                  <td className="p-2 text-center font-medium">
                    {hole.number}
                    {isLD && <span className="text-xs text-primary ml-1">LD</span>}
                    {isCTTP && <span className="text-xs text-accent ml-1">CP</span>}
                  </td>
                  <td className="p-2 text-center text-sm">{hole.par}</td>
                  <td className="p-2 text-center text-sm text-muted-foreground">{hole.strokeIndex}</td>
                  <td className="p-2 text-center text-sm text-muted-foreground">{hole.yardage}</td>
                  {players.map(player => {
                    const playerScore = getPlayerScore(player);
                    const holeScore = playerScore.holes[hole.number.toString()] || {};
                    
                    return (
                      <>
                        <td key={`${player}-${hole.number}-score`} className="p-1 border-l border-border">
                          <Input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="15"
                            value={round.format === 'Stableford' ? (holeScore.points || '') : (holeScore.strokes || '')}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : '';
                              updateHoleScore(
                                player,
                                hole.number,
                                round.format === 'Stableford' ? 'points' : 'strokes',
                                val
                              );
                            }}
                            disabled={!isEditor}
                            className="h-9 w-14 text-center p-1 bg-background"
                          />
                        </td>
                        <td key={`${player}-${hole.number}-gir`} className="p-1">
                          <button
                            onClick={() => updateHoleScore(player, hole.number, 'gir', !holeScore.gir)}
                            disabled={!isEditor}
                            className={`h-9 w-9 rounded flex items-center justify-center transition ${
                              holeScore.gir
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-background hover:bg-accent/20'
                            } ${!isEditor ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            {holeScore.gir && <Check className="h-4 w-4" />}
                          </button>
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
            
            {/* Totals Row */}
            <tr className="bg-primary/10 font-semibold">
              <td className="p-2 text-left">Total</td>
              <td className="p-2 text-center">{holes.reduce((sum, h) => sum + h.par, 0)}</td>
              <td colSpan={2}></td>
              {players.map(player => {
                const playerScore = getPlayerScore(player);
                const total = calculateTotal(playerScore, holes, round.format);
                const girCount = Object.values(playerScore.holes).filter(h => h.gir).length;
                
                return (
                  <>
                    <td key={`${player}-total`} className="p-2 text-center border-l border-border">
                      {total || '-'}
                    </td>
                    <td key={`${player}-gir-total`} className="p-2 text-center">
                      {girCount || '-'}
                    </td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Side Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LD & CTTP Points */}
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-3">Side Games</h3>
          <div className="space-y-3">
            {players.map(player => {
              const playerScore = getPlayerScore(player);
              return (
                <div key={player} className="flex items-center gap-3">
                  <span className="flex-1 font-medium">{player}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">LD:</label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={playerScore.ldPoints || ''}
                      onChange={(e) => updateSideGame(player, 'ldPoints', parseInt(e.target.value) || 0)}
                      disabled={!isEditor}
                      className="h-9 w-16 text-center"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">CTTP:</label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={playerScore.cttpPoints || ''}
                      onChange={(e) => updateSideGame(player, 'cttpPoints', parseInt(e.target.value) || 0)}
                      disabled={!isEditor}
                      className="h-9 w-16 text-center"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Birdies & Eagles */}
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-3">Birdies & Eagles</h3>
          <div className="space-y-3">
            {players.map(player => {
              const playerScore = getPlayerScore(player);
              return (
                <div key={player} className="flex items-center gap-3">
                  <span className="flex-1 font-medium">{player}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Birdies:</span>
                    <span className="text-lg font-semibold text-primary">{playerScore.birdies}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Eagles:</span>
                    <span className="text-lg font-semibold text-accent">{playerScore.eagles}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTotal(score: Score, holes: any[], format: string): number {
  if (format === 'Stableford') {
    return Object.values(score.holes).reduce((sum, h) => sum + (h.points || 0), 0);
  } else {
    return Object.values(score.holes).reduce((sum, h) => sum + (h.strokes || 0), 0);
  }
}

function calculateBirdiesEagles(score: Score, holes: any[]): { birdies: number; eagles: number } {
  let birdies = 0;
  let eagles = 0;

  Object.entries(score.holes).forEach(([holeNum, holeScore]) => {
    if (!holeScore.strokes) return;
    
    const hole = holes.find(h => h.number === parseInt(holeNum));
    if (!hole) return;

    const diff = holeScore.strokes - hole.par;
    if (diff === -1) birdies++;
    if (diff <= -2) eagles++;
  });

  return { birdies, eagles };
}

