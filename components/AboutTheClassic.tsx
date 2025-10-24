'use client';

import { Trophy, Info } from 'lucide-react';

export function AboutTheClassic() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-secondary rounded-lg p-6 border border-border">
        <div className="flex items-center gap-3">
          <Info className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">About The October Classic</h2>
            <p className="text-muted-foreground">
              Tournament format, rules, and scoring system explained
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-secondary/50 rounded-lg p-6 border border-border/50">
        <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          The October Classic
        </h3>
        <p className="text-muted-foreground mb-4">
          The October Classic is an annual links golf tournament played each October, marking the culmination of the golf season. 
          This prestigious event takes competitors on a journey through Ireland&apos;s finest links courses over four unforgettable days.
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

      {/* Tournament Schedule */}
      <div className="bg-secondary/50 rounded-lg p-6 border border-border/50">
        <h3 className="text-xl font-bold mb-4 text-primary">Tournament Schedule</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 1 AM</div>
            <div className="flex-1">
              <div className="font-semibold">Ballyliffin Old</div>
              <div className="text-sm text-muted-foreground">Format: Strokeplay</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 1 PM</div>
            <div className="flex-1">
              <div className="font-semibold">Ballyliffin Glashedy</div>
              <div className="text-sm text-muted-foreground">Format: Strokeplay</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 2 AM</div>
            <div className="flex-1">
              <div className="font-semibold">Portsalon</div>
              <div className="text-sm text-muted-foreground">Format: Stableford</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 2 PM</div>
            <div className="flex-1">
              <div className="font-semibold">Dunfanaghy</div>
              <div className="text-sm text-muted-foreground">Format: Matchplay</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 3 AM</div>
            <div className="flex-1">
              <div className="font-semibold">Cruit Island</div>
              <div className="text-sm text-muted-foreground">Format: Strokeplay (9 holes)</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 3 PM</div>
            <div className="flex-1">
              <div className="font-semibold">Narin & Portnoo</div>
              <div className="text-sm text-muted-foreground">Format: Strokeplay</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
            <div className="text-primary font-bold min-w-[80px]">Day 4</div>
            <div className="flex-1">
              <div className="font-semibold">Mount Juliet</div>
              <div className="text-sm text-muted-foreground">Format: Stableford</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

