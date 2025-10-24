'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEditorLock } from '@/lib/hooks/useEditorLock';
import { useEvent } from '@/lib/hooks/useEvent';
import { useRounds } from '@/lib/hooks/useRounds';
import { useScores } from '@/lib/hooks/useScores';
import { useNews } from '@/lib/hooks/useNews';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { EditorPinModal } from '@/components/EditorPinModal';
import { EditorControls } from '@/components/EditorControls';
import { Scorecard } from '@/components/Scorecard';
import { Leaderboard } from '@/components/Leaderboard';
import { PlayerBios } from '@/components/PlayerBios';
import { NewsDisplay } from '@/components/NewsDisplay';
import { NewsEditor } from '@/components/NewsEditor';
import { Button } from '@/components/ui/Button';
import { seedDatabase } from '@/lib/seed';
import { Trophy, Database } from 'lucide-react';
import { toast } from 'sonner';

const EVENT_ID = 'october-classic-2025';

export default function Home() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showPinModal, setShowPinModal] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const { isEditor, loading: authLoading, claimLock, releaseLock } = useEditorLock(EVENT_ID);
  const { event, loading: eventLoading } = useEvent(EVENT_ID);
  const { rounds, loading: roundsLoading } = useRounds(EVENT_ID);
  const { news, loading: newsLoading } = useNews(EVENT_ID);

  const handleSeedDatabase = async () => {
    if (!isEditor) {
      toast.error('You must be the editor to seed the database');
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to seed the database? This will create the event, courses, and rounds. Players: Oisin, Neil'
    );

    if (!confirmed) return;

    setSeeding(true);
    const result = await seedDatabase(['Oisin', 'Neil']);
    setSeeding(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const loading = authLoading || eventLoading || roundsLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">The October Classic 2025</h1>
          <p className="text-muted-foreground">
            Event not found. Would you like to initialize the database?
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => setShowPinModal(true)}
              variant="default"
              className="w-full"
            >
              I&apos;m the Scorer
            </Button>
          </div>
          {isEditor && (
            <Button
              onClick={handleSeedDatabase}
              variant="secondary"
              disabled={seeding}
              className="w-full"
            >
              <Database className="h-4 w-4 mr-2" />
              {seeding ? 'Seeding...' : 'Initialize Database'}
            </Button>
          )}
          <EditorPinModal
            isOpen={showPinModal}
            onClose={() => setShowPinModal(false)}
            onSubmit={claimLock}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-secondary/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{event.name}</h1>
                <p className="text-sm text-muted-foreground">Live Scoring</p>
              </div>
            </div>
            <EditorControls
              isEditor={isEditor}
              onLock={() => setShowPinModal(true)}
              onRelease={releaseLock}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* News Section - Prominent */}
        <NewsDisplay news={news} />
        
        {/* News Editor - Only for editors */}
        {isEditor && <NewsEditor eventId={EVENT_ID} news={news} isEditor={isEditor} />}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger
              value="leaderboard"
              isActive={activeTab === 'leaderboard'}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="players"
              isActive={activeTab === 'players'}
              onClick={() => setActiveTab('players')}
            >
              Players
            </TabsTrigger>
            {rounds.map((round) => (
              <TabsTrigger
                key={round.id}
                value={round.id}
                isActive={activeTab === round.id}
                onClick={() => setActiveTab(round.id)}
              >
                <span className="flex items-center gap-1">
                  {round.label}
                  {round.submitted && <span className="text-accent text-xs">✓</span>}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="leaderboard" isActive={activeTab === 'leaderboard'}>
            <LeaderboardTab
              event={event}
              rounds={rounds}
              isEditor={isEditor}
            />
          </TabsContent>

          <TabsContent value="players" isActive={activeTab === 'players'}>
            <PlayerBios />
          </TabsContent>

          {rounds.map((round) => (
            <TabsContent key={round.id} value={round.id} isActive={activeTab === round.id}>
              <RoundTab
                round={round}
                players={event.players}
                isEditor={isEditor}
              />
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Seed Database Button (Editor Only, Bottom Right) */}
      {isEditor && (
        <div className="fixed bottom-4 right-4">
          <div className="flex flex-col items-end gap-1">
            <Button
              onClick={handleSeedDatabase}
              variant="secondary"
              size="sm"
              disabled={seeding}
            >
              <Database className="h-4 w-4 mr-2" />
              {seeding ? 'Clearing & Seeding...' : 'Clear All & Re-seed'}
            </Button>
            <span className="text-xs text-muted-foreground">
              ⚠️ This erases all old course data
            </span>
          </div>
        </div>
      )}

      <EditorPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSubmit={claimLock}
      />
    </div>
  );
}

function RoundTab({
  round,
  players,
  isEditor,
}: {
  round: any;
  players: string[];
  isEditor: boolean;
}) {
  const { scores, loading } = useScores(round.id);

  if (loading) {
    return (
      <div className="text-center py-12">
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

function LeaderboardTab({
  event,
  rounds,
  isEditor,
}: {
  event: any;
  rounds: any[];
  isEditor: boolean;
}) {
  return <LeaderboardWithScores event={event} rounds={rounds} isEditor={isEditor} />;
}

function LeaderboardWithScores({
  event,
  rounds,
  isEditor,
}: {
  event: any;
  rounds: any[];
  isEditor: boolean;
}) {
  const [allScores, setAllScores] = useState<any[]>([]);

  // Subscribe to all scores collections
  useEffect(() => {
    if (rounds.length === 0) return;

    const unsubscribes: (() => void)[] = [];
    const scoresData: Map<string, any[]> = new Map();

    rounds.forEach((round) => {
      const scoresQuery = query(
        collection(db, 'scores'),
        where('roundId', '==', round.id)
      );

      const unsubscribe = onSnapshot(scoresQuery, (snapshot) => {
        const scores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        scoresData.set(round.id, scores);
        
        // Update all scores
        const combined = Array.from(scoresData.values()).flat();
        setAllScores(combined);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [rounds]);

  return (
    <Leaderboard
      event={event}
      rounds={rounds}
      allScores={allScores}
      isEditor={isEditor}
    />
  );
}

