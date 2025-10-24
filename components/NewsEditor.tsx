'use client';

import { useState, useRef, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsEntry } from '@/lib/types';
import { Button } from './ui/Button';
import { Newspaper, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface NewsEditorProps {
  eventId: string;
  news: NewsEntry[];
  isEditor: boolean;
}

export function NewsEditor({ eventId, news, isEditor }: NewsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  if (!isEditor) return null;

  const handleSave = async () => {
    const title = titleRef.current?.value.trim() || '';
    const body = bodyRef.current?.value.trim() || '';
    
    if (!title || !body) {
      toast.error('Title and body are required');
      return;
    }

    setSaving(true);
    try {
      const newsRef = editingId ? doc(db, 'news', editingId) : doc(collection(db, 'news'));
      
      await setDoc(newsRef, {
        eventId,
        title,
        body,
        createdAt: editingId ? news.find(n => n.id === editingId)?.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      toast.success(editingId ? 'News updated!' : 'News posted!');
      setIsAdding(false);
      setEditingId(null);
      if (titleRef.current) titleRef.current.value = '';
      if (bodyRef.current) bodyRef.current.value = '';
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry: NewsEntry) => {
    setEditingId(entry.id);
    setIsAdding(true);
    // Use setTimeout to ensure the inputs are rendered before setting values
    setTimeout(() => {
      if (titleRef.current) titleRef.current.value = entry.title;
      if (bodyRef.current) bodyRef.current.value = entry.body;
    }, 0);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news entry?')) return;

    try {
      await deleteDoc(doc(db, 'news', id));
      toast.success('News deleted');
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    if (titleRef.current) titleRef.current.value = '';
    if (bodyRef.current) bodyRef.current.value = '';
  };

  return (
    <div className="bg-secondary rounded-lg p-6 border border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Manage News & Updates</h3>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add News
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-background p-4 rounded-lg border border-border space-y-4">
          <div>
            <label htmlFor="news-title" className="block text-sm font-medium mb-2">Title</label>
            <input
              ref={titleRef}
              id="news-title"
              type="text"
              defaultValue=""
              placeholder="e.g., Day 1 Preview: The Battle Begins"
              autoComplete="off"
              className="flex h-11 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="news-body" className="block text-sm font-medium mb-2">Body</label>
            <textarea
              ref={bodyRef}
              id="news-body"
              defaultValue=""
              placeholder="Write your news content here..."
              rows={6}
              autoComplete="off"
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y text-sm"
              style={{ minHeight: '150px' }}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Publish'}
            </Button>
            <Button onClick={handleCancel} variant="ghost" disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Existing News List */}
      {news.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Recent Posts ({news.length})</p>
          {news.map((entry) => (
            <div
              key={entry.id}
              className="bg-background p-4 rounded-lg border border-border flex justify-between items-start"
            >
              <div className="flex-1 mr-4">
                <h4 className="font-semibold">{entry.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {entry.body}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {entry.createdAt && typeof entry.createdAt === 'object' && 'toDate' in entry.createdAt
                    ? new Date(entry.createdAt.toDate()).toLocaleDateString('en-IE', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Just now'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4 text-primary" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 hover:bg-secondary rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

