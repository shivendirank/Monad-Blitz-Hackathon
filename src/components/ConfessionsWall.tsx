'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useConfessions } from '@/hooks/useConfessions';
import Testimonials, { TestimonialCardProps } from '@/components/ui/twitter-testimonial-cards';
import { usePlayerProfile } from '@/hooks/usePlayerProfile';
import { useTeams } from '@/hooks/useTeams';

// Mock confessions data for display
const MOCK_CONFESSIONS = [
  {
    username: 'Luna',
    team_name: 'Wrapsynth',
    content: 'I\'ve been debugging the same issue for 3 hours and it was just a missing semicolon 😭',
    likes: 342,
  },
  {
    username: 'Alex',
    team_name: 'My Pen Is Long',
    content: 'Coffee is my favorite programming language. Can\'t code without at least 3 cups ☕',
    likes: 521,
  },
  {
    username: 'Zara',
    team_name: 'Bebop',
    content: 'Honestly, Stack Overflow saved my hackathon. Shout out to the community 🙏',
    likes: 289,
  },
  {
    username: 'Jordan',
    team_name: 'Neon Knights',
    content: '5AM submission panic hits different. But we shipped it!',
    likes: 198,
  },
  {
    username: 'Sam',
    team_name: 'Cipher',
    content: 'Watching my code compile feels like opening a mystery box 🎁',
    likes: 456,
  },
  {
    username: 'Maya',
    team_name: 'Flux',
    content: 'The pizza is cold but the vibes are hot. Best hackathon ever 🍕⚡',
    likes: 623,
  },
];

export function ConfessionsWall() {
  const { address } = useAccount();
  const { confessions, addConfession, loading } = useConfessions();
  const { profile } = usePlayerProfile(address);
  const { teams } = useTeams();
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !profile || !input.trim()) {
      alert('Please connect your wallet and enter a confession');
      return;
    }

    try {
      setSubmitting(true);
      await addConfession(input.trim(), profile.id, profile.team_id || 1);
      setInput('');
    } catch (error) {
      console.error('Failed to post confession:', error);
      alert('Failed to post confession');
    } finally {
      setSubmitting(false);
    }
  };

  // Combine mock and real confessions, prioritizing real ones
  const displayConfessions = confessions.length > 0 ? confessions : MOCK_CONFESSIONS;

  // Convert confessions to testimonial cards
  const confessionCards: TestimonialCardProps[] = displayConfessions.map((conf) => {
    const isRealConfession = 'created_at' in conf;
    const dateStr = isRealConfession ? conf.created_at : new Date().toISOString();
    
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const displayDate = isToday 
      ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      : date.toLocaleDateString();

    return {
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conf.username}`,
      username: conf.username || 'Team Member',
      handle: `@${conf.team_name?.toLowerCase().replace(/\s+/g, '_') || 'team'}`,
      content: conf.content,
      date: displayDate,
      verified: true,
      likes: conf.likes || 0,
      retweets: 0,
    };
  });

  return (
    <div className="bg-terminal-gray border border-primary/20 p-5 rounded space-y-4">
      <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
        🍕 GhostSlice Wall
      </h3>

      {/* Confessions Display */}
      {loading && confessions.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm py-8">
          Loading confessions...
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[400px]">
          <Testimonials cards={confessionCards} />
        </div>
      )}

      {/* Submission Form */}
      {address && profile ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your confession anonymously... 🤫"
            maxLength={280}
            className="w-full bg-black/40 border border-primary/10 rounded p-3 text-white text-sm placeholder-white/40 focus:border-primary/30 focus:outline-none resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {input.length}/280
            </span>
            <button
              type="submit"
              disabled={!input.trim() || submitting}
              className="px-4 py-2 bg-primary/20 hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed text-primary text-xs font-bold rounded transition-colors"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center text-muted-foreground text-xs py-4">
          Connect your wallet to post confessions
        </div>
      )}
    </div>
  );
}
