'use client';

import { Round, Score, Hole } from '@/lib/types';
import { Button } from './ui/Button';

interface TraditionalScorecardProps {
  round: Round;
  scores: Score[];
  players: string[];
  onEdit?: () => void;
  isEditor: boolean;
}

export function TraditionalScorecard({ round, scores, players, onEdit, isEditor }: TraditionalScorecardProps) {
  const course = round.course;
  const holes = course?.holes || [];
  
  if (!course) return <div>Loading course data...</div>;

  const getPlayerScore = (player: string): Score | undefined => {
    return scores.find(s => s.player === player);
  };

  const calculateTotal = (score: Score | undefined): number => {
    if (!score) return 0;
    return Object.values(score.holes).reduce((sum, h) => sum + (h.strokes || 0), 0);
  };

  const calculatePoints = (score: Score | undefined): number => {
    if (!score) return 0;
    return Object.values(score.holes).reduce((sum, h) => sum + (h.points || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Traditional Card Header */}
      <div className="bg-white text-gray-900 rounded-lg p-6 border-4 border-gray-800 shadow-xl">
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
          <h2 className="text-3xl font-bold uppercase tracking-wide">{course.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{course.location}</p>
          <div className="mt-2 flex justify-center gap-4 text-sm font-semibold">
            <span>{round.label}</span>
            <span className="text-gray-600">•</span>
            <span>{round.date}</span>
            <span className="text-gray-600">•</span>
            <span className="uppercase">{round.format}</span>
          </div>
        </div>

        {/* Traditional Scorecard Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="p-2 text-left font-bold text-xs uppercase">Hole</th>
                <th className="p-2 text-center font-bold text-xs uppercase">Par</th>
                <th className="p-2 text-center font-bold text-xs uppercase">SI</th>
                {players.map(player => (
                  <th key={player} className="p-2 text-center font-bold text-xs uppercase border-l-2 border-gray-400">
                    {player}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holes.map((hole, idx) => {
                const isOut = hole.number === 9;
                const isIn = hole.number === 18 || (holes.length === 9 && hole.number === 9);
                
                return (
                  <>
                    <tr key={hole.number} className={`border-b border-gray-300 ${isOut || isIn ? 'border-b-2 border-gray-800' : ''}`}>
                      <td className="p-2 text-center font-semibold">{hole.number}</td>
                      <td className="p-2 text-center">{hole.par || '-'}</td>
                      <td className="p-2 text-center text-gray-600 text-sm">{hole.strokeIndex || '-'}</td>
                      {players.map(player => {
                        const playerScore = getPlayerScore(player);
                        const holeScore = playerScore?.holes[hole.number.toString()];
                        return (
                          <td key={`${player}-${hole.number}`} className="p-2 text-center border-l-2 border-gray-400">
                            <span className="font-semibold text-lg">{holeScore?.strokes || '-'}</span>
                            {holeScore?.points !== undefined && (
                              <span className="ml-1 text-xs text-gray-600">({holeScore.points})</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    
                    {/* Out/In Subtotals */}
                    {isOut && (
                      <tr className="bg-gray-100 font-bold border-b-2 border-gray-800">
                        <td className="p-2 text-left uppercase text-xs">Out</td>
                        <td className="p-2 text-center">
                          {holes.slice(0, 9).reduce((sum, h) => sum + (h.par || 0), 0)}
                        </td>
                        <td className="p-2"></td>
                        {players.map(player => {
                          const playerScore = getPlayerScore(player);
                          const front9Total = holes.slice(0, 9).reduce((sum, h) => 
                            sum + (playerScore?.holes[h.number.toString()]?.strokes || 0), 0
                          );
                          const front9Points = holes.slice(0, 9).reduce((sum, h) => 
                            sum + (playerScore?.holes[h.number.toString()]?.points || 0), 0
                          );
                          return (
                            <td key={`${player}-out`} className="p-2 text-center border-l-2 border-gray-400">
                              <span className="text-lg">{front9Total || '-'}</span>
                              {front9Points > 0 && (
                                <span className="ml-1 text-xs text-gray-600">({front9Points})</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                    
                    {isIn && holes.length === 18 && (
                      <tr className="bg-gray-100 font-bold border-b-2 border-gray-800">
                        <td className="p-2 text-left uppercase text-xs">In</td>
                        <td className="p-2 text-center">
                          {holes.slice(9).reduce((sum, h) => sum + (h.par || 0), 0)}
                        </td>
                        <td className="p-2"></td>
                        {players.map(player => {
                          const playerScore = getPlayerScore(player);
                          const back9Total = holes.slice(9).reduce((sum, h) => 
                            sum + (playerScore?.holes[h.number.toString()]?.strokes || 0), 0
                          );
                          const back9Points = holes.slice(9).reduce((sum, h) => 
                            sum + (playerScore?.holes[h.number.toString()]?.points || 0), 0
                          );
                          return (
                            <td key={`${player}-in`} className="p-2 text-center border-l-2 border-gray-400">
                              <span className="text-lg">{back9Total || '-'}</span>
                              {back9Points > 0 && (
                                <span className="ml-1 text-xs text-gray-600">({back9Points})</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </>
                );
              })}
              
              {/* Total Row */}
              <tr className="bg-gray-800 text-white font-bold text-lg">
                <td className="p-3 text-left uppercase">Total</td>
                <td className="p-3 text-center">
                  {holes.reduce((sum, h) => sum + (h.par || 0), 0)}
                </td>
                <td className="p-3"></td>
                {players.map(player => {
                  const playerScore = getPlayerScore(player);
                  const total = calculateTotal(playerScore);
                  const points = calculatePoints(playerScore);
                  return (
                    <td key={`${player}-total`} className="p-3 text-center border-l-2 border-white">
                      <span className="text-2xl">{total || '-'}</span>
                      {points > 0 && (
                        <span className="ml-2 text-sm opacity-90">({points}pts)</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Handicaps */}
        <div className="mt-4 pt-4 border-t-2 border-gray-300 flex justify-end gap-6 text-sm">
          {players.map(player => {
            const playerScore = getPlayerScore(player);
            return (
              <div key={player} className="flex items-center gap-2">
                <span className="font-semibold">{player} H'cap:</span>
                <span className="font-mono">{playerScore?.handicap || 0}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Button */}
      {isEditor && onEdit && (
        <div className="text-center">
          <Button
            onClick={onEdit}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Edit Card
          </Button>
        </div>
      )}
    </div>
  );
}

