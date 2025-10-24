'use client';

import { useState } from 'react';
import { Round, Score } from '@/lib/types';
import { Scorecard } from './Scorecard';
import { useScores } from '@/lib/hooks/useScores';
import { FileText, Check } from 'lucide-react';

interface ScorecardsTabProps {
  rounds: Round[];
  players: string[];
  isEditor: boolean;
}

export function ScorecardsTab({ rounds, players, isEditor }: ScorecardsTabProps) {
  const [selectedRoundId, setSelectedRoundId] = useState(rounds[0]?.id || '');

  const selectedRound = rounds.find(r => r.id === selectedRoundId);

  return (
    <div className="space-y-6">
      {/* Round Selector */}
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Scorecards</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select a round to view or edit its scorecard
        </p>

        {/* Round Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rounds.map((round) => (
            <button
              key={round.id}
              onClick={() => setSelectedRoundId(round.id)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedRoundId === round.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-background hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="font-semibold text-sm">{round.label}</div>
                {round.submitted && (
                  <Check className="h-4 w-4 text-accent flex-shrink-0" />
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {round.course?.name || 'Loading...'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {round.format}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scorecard */}
      {selectedRound && (
        <RoundScorecard
          round={selectedRound}
          players={players}
          isEditor={isEditor}
        />
      )}
    </div>
  );
}

function RoundScorecard({
  round,
  players,
  isEditor,
}: {
  round: Round;
  players: string[];
  isEditor: boolean;
}) {
  const { scores, loading } = useScores(round.id);

  if (loading) {
    return (
      <div className="text-center py-12 bg-secondary rounded-lg border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading round data...</p>
      </div>
    );
  }

  return (
    <Scorecard
      round={round}
      scores={scores}
      players={players}
      isEditor={isEditor}
    />
  );
}

