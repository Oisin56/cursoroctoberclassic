'use client';

import { Lock, Unlock } from 'lucide-react';
import { Button } from './ui/Button';

interface EditorControlsProps {
  isEditor: boolean;
  onLock: () => void;
  onRelease: () => void;
}

export function EditorControls({ isEditor, onLock, onRelease }: EditorControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {isEditor ? (
        <>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/20 border border-accent">
            <Unlock className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Editing</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRelease}
          >
            Release Editor
          </Button>
        </>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={onLock}
        >
          <Lock className="h-4 w-4 mr-2" />
          I'm the Scorer
        </Button>
      )}
    </div>
  );
}

