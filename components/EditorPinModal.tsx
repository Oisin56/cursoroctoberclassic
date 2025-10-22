'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface EditorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<boolean>;
}

export function EditorPinModal({ isOpen, onClose, onSubmit }: EditorPinModalProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(pin);
    setLoading(false);
    if (success) {
      setPin('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enter Editor PIN">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pin" className="block text-sm font-medium mb-2">
            PIN Code
          </label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            autoFocus
            disabled={loading}
            className="text-center text-2xl tracking-widest"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !pin}
            className="flex-1"
          >
            {loading ? 'Verifying...' : 'Unlock Editor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

