'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfessions } from '@/hooks/useConfessions';
import { useTeams } from '@/hooks/useTeams';
import { ChevronDown, Heart, MessageCircle } from 'lucide-react';

// Mock confessions data
const MOCK_CONFESSIONS = [
  {
    id: '1',
    username: 'Luna',
    team_name: 'Wrapsynth',
    content: 'I\'ve been debugging the same issue for 3 hours and it was just a missing semicolon 😭',
    likes: 342,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    username: 'Alex',
    team_name: 'My Pen Is Long',
    content: 'Coffee is my favorite programming language. Can\'t code without at least 3 cups ☕',
    likes: 521,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '3',
    username: 'Zara',
    team_name: 'Bebop',
    content: 'Honestly, Stack Overflow saved my hackathon. Shout out to the community 🙏',
    likes: 289,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '4',
    username: 'Jordan',
    team_name: 'Neon Knights',
    content: '5AM submission panic hits different. But we shipped it!',
    likes: 198,
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '5',
    username: 'Sam',
    team_name: 'Cipher',
    content: 'Watching my code compile feels like opening a mystery box 🎁',
    likes: 456,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
];

interface ConfessionProps {
  id: string;
  username: string;
  team_name: string;
  content: string;
  likes: number;
  created_at: string;
}

const ConfessionCard: React.FC<ConfessionProps & { index: number }> = ({
  id,
  username,
  team_name,
  content,
  likes,
  created_at,
  index,
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const formatTime = (date: string) => {
    const now = new Date();
    const confDate = new Date(date);
    const diff = Math.floor((now.getTime() - confDate.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return confDate.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 hover:bg-gradient-to-b hover:from-slate-800/70 hover:to-slate-900/70 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{username.charAt(0)}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm">{username}</h3>
            <span className="text-slate-400 text-xs">@{team_name.toLowerCase().replace(/\s+/g, '_')}</span>
          </div>
          <p className="text-slate-300 text-xs mt-0.5">{formatTime(created_at)}</p>

          <p className="text-slate-100 text-sm mt-3 leading-relaxed font-light">
            {content}
          </p>

          <div className="flex items-center gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLiked(!liked);
                setLikeCount(liked ? likeCount - 1 : likeCount + 1);
              }}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group"
            >
              <motion.div
                animate={{ scale: liked ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Heart
                  size={16}
                  className={liked ? 'fill-red-400 text-red-400' : ''}
                />
              </motion.div>
              <span className="text-xs group-hover:text-red-400">{likeCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-xs">Reply</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function ArenaPage() {
  const { teams, loading: teamsLoading } = useTeams();
  const { confessions, loading: confessionsLoading } = useConfessions();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayConfessions, setDisplayConfessions] = useState<ConfessionProps[]>([]);

  useEffect(() => {
    if (confessions.length > 0) {
      setDisplayConfessions(confessions as unknown as ConfessionProps[]);
    } else {
      setDisplayConfessions(MOCK_CONFESSIONS);
    }
  }, [confessions]);

  const selectedTeamData = selectedTeam ? teams.find((t) => t.id === selectedTeam) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {!selectedTeam ? (
          // Team Selector View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center mb-12"
              >
                <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  ARENA
                </h1>
                <p className="text-slate-400 text-sm tracking-wider">Select your team to enter</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full"
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500 transition-all duration-300 group"
                >
                  <div className="text-left flex-1">
                    <p className="text-xs text-slate-400 mb-1">Choose your team</p>
                    <p className="text-lg font-bold text-white line-clamp-1">
                      {teamsLoading ? 'Loading teams...' : selectedTeamData?.name || 'Select a team...'}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-2"
                  >
                    <ChevronDown size={24} className="text-indigo-400 group-hover:text-indigo-300" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto shadow-2xl origin-top"
                    >
                      {teamsLoading ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                          Loading teams...
                        </div>
                      ) : teams.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                          No teams found
                        </div>
                      ) : (
                        teams.map((team, idx) => (
                          <motion.button
                            key={team.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              setSelectedTeam(team.id);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0 hover:border-indigo-500"
                          >
                            <p className="font-semibold text-white text-sm">{team.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {Math.floor(Math.random() * 10) + 3} members
                            </p>
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center text-slate-500 text-xs mt-8"
              >
                Confess anonymously with your team
              </motion.p>
            </div>
          </motion.div>
        ) : (
          // Confessions Feed View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen py-12 px-4"
          >
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex items-center justify-between sticky top-0 bg-black/50 backdrop-blur-md p-4 rounded-xl z-40 border border-slate-800"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedTeamData?.name}</h2>
                  <p className="text-xs text-slate-400">
                    {Math.floor(Math.random() * 10) + 3} teammates venting
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTeam(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-semibold transition-all"
                >
                  Back
                </motion.button>
              </motion.div>

              {/* Confessions Feed */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {confessionsLoading && displayConfessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-slate-400">Loading confessions...</p>
                    </motion.div>
                  ) : displayConfessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-slate-400">No confessions yet. Be the first to confess!</p>
                    </motion.div>
                  ) : (
                    displayConfessions.map((confession, idx) => (
                      <ConfessionCard key={confession.id} {...confession} index={idx} />
                    ))
                  )}
                </div>
              </AnimatePresence>

              {/* Spacing at bottom */}
              <div className="h-20" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
