'use client';

import { useState, useCallback } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Round, Score, HoleScore, Hole } from '@/lib/types';
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
  const holes = course?.holes || [];
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
  
  if (!course) return <div>Loading course data...</div>;

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
      handicap: 0,
      holes: {},
      birdies: 0,
      eagles: 0,
      ldPoints: 0,
      cttpPoints: 0,
      updatedAt: null as any,
    };
  };

  const calculateStablefordPoints = (strokes: number, par: number, handicapStrokes: number): number => {
    const netScore = strokes - handicapStrokes;
    const diff = netScore - par;
    
    if (diff <= -3) return 5; // Albatross or better
    if (diff === -2) return 4; // Eagle
    if (diff === -1) return 3; // Birdie
    if (diff === 0) return 2;  // Par
    if (diff === 1) return 1;  // Bogey
    return 0; // Double bogey or worse
  };

  const getHandicapStrokes = (handicap: number, strokeIndex: number): number => {
    const fullStrokes = Math.floor(handicap / 18);
    const extraStrokes = handicap % 18;
    return fullStrokes + (strokeIndex <= extraStrokes ? 1 : 0);
  };

  const updateHandicap = (player: string, handicap: number) => {
    if (!isEditor) return;

    const currentScore = getPlayerScore(player);
    const updatedScore: Score = {
      ...currentScore,
      handicap: handicap || 0,
    };

    // Recalculate all Stableford points for existing holes
    Object.keys(updatedScore.holes).forEach(holeKey => {
      const holeNum = parseInt(holeKey);
      const hole = holes.find(h => h.number === holeNum);
      if (hole && updatedScore.holes[holeKey].strokes) {
        const handicapStrokes = getHandicapStrokes(handicap || 0, hole.strokeIndex);
        updatedScore.holes[holeKey].points = calculateStablefordPoints(
          updatedScore.holes[holeKey].strokes!,
          hole.par,
          handicapStrokes
        );
      }
    });

    // Recalculate birdies/eagles
    const { birdies, eagles } = calculateBirdiesEagles(updatedScore, holes);
    updatedScore.birdies = birdies;
    updatedScore.eagles = eagles;

    setOptimisticScores(prev => ({
      ...prev,
      [player]: updatedScore,
    }));

    debouncedSave(updatedScore.id, updatedScore);
  };

  const updateHoleScore = (player: string, holeNum: number, strokes: number | '') => {
    if (!isEditor) return;

    const currentScore = getPlayerScore(player);
    const holeKey = holeNum.toString();
    const hole = holes.find(h => h.number === holeNum);
    
    if (!hole) return;

    const currentHole = currentScore.holes[holeKey] || {};
    
    let updatedHole: HoleScore;
    
    if (strokes === '') {
      updatedHole = {
        ...currentHole,
        strokes: undefined,
        points: undefined,
      };
    } else {
      const handicapStrokes = getHandicapStrokes(currentScore.handicap || 0, hole.strokeIndex);
      const points = calculateStablefordPoints(strokes, hole.par, handicapStrokes);
      
      updatedHole = {
        ...currentHole,
        strokes: strokes,
        points: points,
      };
    }

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

  const updateGIR = (player: string, holeNum: number, gir: boolean) => {
    if (!isEditor) return;

    const currentScore = getPlayerScore(player);
    const holeKey = holeNum.toString();
    const currentHole = currentScore.holes[holeKey] || {};
    
    const updatedHole = {
      ...currentHole,
      gir: gir,
    };

    const updatedScore: Score = {
      ...currentScore,
      holes: {
        ...currentScore.holes,
        [holeKey]: updatedHole,
      },
    };

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

  const updateMatchplayWinner = async (winner: string | null) => {
    if (!isEditor) return;

    try {
      const roundRef = doc(db, 'rounds', round.id);
      await setDoc(roundRef, {
        matchplayWinner: winner,
      }, { merge: true });
      toast.success(winner ? `${winner} selected as winner` : 'Winner cleared');
    } catch (error) {
      console.error('Error updating matchplay winner:', error);
      toast.error('Failed to update winner');
    }
  };

  const updateHoleData = async (holeNum: number, field: 'par' | 'strokeIndex', value: number) => {
    if (!isEditor || !course) return;

    try {
      const courseRef = doc(db, 'courses', course.id);
      const updatedHoles = course.holes.map(h => 
        h.number === holeNum ? { ...h, [field]: value } : h
      );
      
      await setDoc(courseRef, {
        holes: updatedHoles,
      }, { merge: true });
      
      toast.success('Course data updated');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course data');
    }
  };

  const submitCard = async () => {
    if (!isEditor) return;

    try {
      const roundRef = doc(db, 'rounds', round.id);
      await setDoc(roundRef, {
        submitted: true,
      }, { merge: true });
      toast.success('Card submitted! Points now count toward leaderboard.');
    } catch (error) {
      console.error('Error submitting card:', error);
      toast.error('Failed to submit card');
    }
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
          <span className="text-muted-foreground">White Tees</span>
        </div>
      </div>

      {/* Handicap Input */}
      <div className="bg-secondary rounded-lg p-4 border border-border">
        <h3 className="text-lg font-semibold mb-3">Player Handicaps</h3>
        <div className="flex gap-6 flex-wrap">
          {players.map(player => {
            const playerScore = getPlayerScore(player);
            return (
              <div key={player} className="flex items-center gap-3">
                <label className="font-medium min-w-[80px]">{player}:</label>
                <Input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="54"
                  value={playerScore.handicap || ''}
                  onChange={(e) => updateHandicap(player, parseInt(e.target.value) || 0)}
                  disabled={!isEditor}
                  className="h-10 w-20 text-center"
                  placeholder="H'cap"
                />
              </div>
            );
          })}
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
                <th key={player} className="p-2 text-center text-sm font-medium border-l border-border" colSpan={3}>
                  {player}
                </th>
              ))}
            </tr>
            <tr className="border-b border-border">
              <th colSpan={4}></th>
              {players.map(player => (
                <>
                  <th key={`${player}-strokes`} className="p-2 text-center text-xs text-muted-foreground border-l border-border">
                    Strokes
                  </th>
                  <th key={`${player}-pts`} className="p-2 text-center text-xs text-muted-foreground">
                    Pts
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
                  <td className="p-1 text-center">
                    {isEditor ? (
                      <Input
                        type="number"
                        inputMode="numeric"
                        min="3"
                        max="6"
                        value={hole.par}
                        onChange={(e) => updateHoleData(hole.number, 'par', parseInt(e.target.value) || 3)}
                        className="h-9 w-14 text-center p-1 bg-background"
                      />
                    ) : (
                      <span className="text-sm">{hole.par}</span>
                    )}
                  </td>
                  <td className="p-1 text-center">
                    {isEditor ? (
                      <Input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="18"
                        value={hole.strokeIndex}
                        onChange={(e) => updateHoleData(hole.number, 'strokeIndex', parseInt(e.target.value) || 1)}
                        className="h-9 w-14 text-center p-1 bg-background text-muted-foreground"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">{hole.strokeIndex}</span>
                    )}
                  </td>
                  <td className="p-2 text-center text-sm text-muted-foreground">{hole.yardage}</td>
                  {players.map(player => {
                    const playerScore = getPlayerScore(player);
                    const holeScore = playerScore.holes[hole.number.toString()] || {};
                    const handicapStrokes = getHandicapStrokes(playerScore.handicap || 0, hole.strokeIndex);
                    
                    return (
                      <>
                        <td key={`${player}-${hole.number}-strokes`} className="p-1 border-l border-border">
                          <Input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="15"
                            value={holeScore.strokes || ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : '';
                              updateHoleScore(player, hole.number, val as number | '');
                            }}
                            disabled={!isEditor}
                            className="h-9 w-14 text-center p-1 bg-background"
                          />
                          {handicapStrokes > 0 && (
                            <div className="text-xs text-center text-primary mt-0.5">+{handicapStrokes}</div>
                          )}
                        </td>
                        <td key={`${player}-${hole.number}-pts`} className="p-2 text-center font-semibold text-accent">
                          {holeScore.points !== undefined ? holeScore.points : '-'}
                        </td>
                        <td key={`${player}-${hole.number}-gir`} className="p-1">
                          <button
                            onClick={() => updateGIR(player, hole.number, !holeScore.gir)}
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
                const strokeTotal = calculateStrokeTotal(playerScore, holes);
                const pointsTotal = calculatePointsTotal(playerScore, holes);
                const girCount = Object.values(playerScore.holes).filter(h => h.gir).length;
                
                return (
                  <>
                    <td key={`${player}-stroke-total`} className="p-2 text-center border-l border-border">
                      {strokeTotal || '-'}
                    </td>
                    <td key={`${player}-pts-total`} className="p-2 text-center text-accent">
                      {pointsTotal || '-'}
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

      {/* Matchplay Winner Selection */}
      {round.format === 'Matchplay' && isEditor && (
        <div className="bg-secondary rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold mb-3">Matchplay Winner Selection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select the winner of this matchplay round to award +10 points on the leaderboard.
          </p>
          <div className="flex gap-3 flex-wrap">
            {players.map(player => (
              <button
                key={player}
                onClick={() => updateMatchplayWinner(player)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  round.matchplayWinner === player
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border hover:bg-accent/20'
                }`}
              >
                {player}
              </button>
            ))}
            {round.matchplayWinner && (
              <button
                onClick={() => updateMatchplayWinner(null)}
                className="px-6 py-3 rounded-lg font-medium bg-background border border-border hover:bg-destructive/20 text-muted-foreground"
              >
                Clear Winner
              </button>
            )}
          </div>
          {round.matchplayWinner && (
            <p className="mt-3 text-sm text-primary">
              Winner: <strong>{round.matchplayWinner}</strong> (+10 points)
            </p>
          )}
        </div>
      )}

      {/* Submit Card Button */}
      {isEditor && (
        <div className="bg-secondary rounded-lg p-6 border border-border text-center">
          {round.submitted ? (
            <div className="flex items-center justify-center gap-3 text-accent">
              <Check className="h-6 w-6" />
              <span className="text-lg font-semibold">Card Submitted - Points Count Toward Leaderboard</span>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Once you&apos;ve entered all scores and verified the course data, submit the card to include these scores in the leaderboard.
              </p>
              <button
                onClick={submitCard}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition"
              >
                Submit Card
              </button>
            </div>
          )}
        </div>
      )}

      {/* View-only indicator */}
      {!isEditor && round.submitted && (
        <div className="bg-accent/10 rounded-lg p-4 border border-accent text-center">
          <div className="flex items-center justify-center gap-3 text-accent">
            <Check className="h-5 w-5" />
            <span className="font-medium">This card has been submitted and counts toward the leaderboard</span>
          </div>
        </div>
      )}
    </div>
  );
}

function calculateStrokeTotal(score: Score, holes: Hole[]): number {
  return Object.values(score.holes).reduce((sum, h) => sum + (h.strokes || 0), 0);
}

function calculatePointsTotal(score: Score, holes: Hole[]): number {
  return Object.values(score.holes).reduce((sum, h) => sum + (h.points || 0), 0);
}

function calculateBirdiesEagles(score: Score, holes: Hole[]): { birdies: number; eagles: number } {
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
