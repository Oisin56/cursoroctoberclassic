'use client';

import { useState } from 'react';
import { NewsEntry } from '@/lib/types';
import { Newspaper, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/Button';

interface NewsDisplayProps {
  news: NewsEntry[];
}

export function NewsDisplay({ news }: NewsDisplayProps) {
  const [showAll, setShowAll] = useState(false);

  if (news.length === 0) return null;

  const latestNews = news[0];
  const previewLength = 200;
  const needsTruncation = latestNews.body.length > previewLength;
  const previewBody = needsTruncation
    ? latestNews.body.substring(0, previewLength) + '...'
    : latestNews.body;

  if (showAll) {
    return (
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">News & Updates</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAll(false)}>
            Back
          </Button>
        </div>

        <div className="space-y-6">
          {news.map((entry) => (
            <div
              key={entry.id}
              className="bg-secondary p-6 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-bold text-primary">{entry.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {entry.createdAt && typeof entry.createdAt === 'object' && 'toDate' in entry.createdAt
                    ? new Date(entry.createdAt.toDate()).toLocaleDateString('en-IE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Just now'}
                </div>
              </div>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {entry.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Newspaper className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">Latest News</h3>
      </div>

      <div className="bg-secondary p-6 rounded-lg border border-border">
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-xl font-bold text-primary">{latestNews.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {latestNews.createdAt && typeof latestNews.createdAt === 'object' && 'toDate' in latestNews.createdAt
              ? new Date(latestNews.createdAt.toDate()).toLocaleDateString('en-IE', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Just now'}
          </div>
        </div>
        <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-4">
          {previewBody}
        </p>
        {(needsTruncation || news.length > 1) && (
          <Button
            onClick={() => setShowAll(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {news.length > 1 ? `Read All ${news.length} Updates` : 'Read Full Article'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

