'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfessions } from '@/hooks/useConfessions';
import { ChevronDown, Send, MessageSquare, Zap } from 'lucide-react';

// Hard-coded teams list
const TEAMS = [
  { id: 1, name: 'My Pen Is Long' },
  { id: 2, name: 'Thousand Monkeys Thousand Typewriters' },
  { id: 3, name: 'Wrapsynth' },
  { id: 4, name: 'Bebop' },
  { id: 5, name: 'Golti Bros' },
  { id: 6, name: 'KUBI Sigma Males' },
  { id: 7, name: 'PizzaBlitz' },
  { id: 8, name: 'Sergei Chain.Love' },
  { id: 9, name: 'MarcoPolo' },
  { id: 10, name: 'moonmono' },
  { id: 11, name: 'Arrive' },
  { id: 12, name: 'Trust Me Bro' },
  { id: 13, name: 'Tharun Ekambaram' },
  { id: 14, name: 'CPL' },
  { id: 15, name: 'EthKiller' },
  { id: 16, name: 'Pizza Rush' },
  { id: 17, name: 'sexy' },
  { id: 18, name: '$BLUFF' },
  { id: 19, name: 'BuzzBallz Enjoyers' },
  { id: 20, name: 'DVB HyperStream' },
  { id: 21, name: 'The Last Slice' },
  { id: 22, name: 'Solo' },
  { id: 23, name: 'Formula Zero' },
  { id: 24, name: 'upsilon' },
  { id: 25, name: 'Team Boston' },
  { id: 26, name: 'Friday' },
  { id: 27, name: 'Mace' },
];

// Mock confessions data with replies
const MOCK_CONFESSIONS = [
  {
    id: '1',
    username: 'anonymous',
    team_name: 'Wrapsynth',
    content: 'Just deployed on mainnet and the transaction went through in 1 second. This is actual magic 🚀',
    upvotes: 342,
    downvotes: 12,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    tokReward: 50,
    replies: [
      {
        id: '1-1',
        content: 'That\'s insane! Monad speed is no joke 🔥',
        upvotes: 89,
        downvotes: 2,
        tokReward: 25,
        created_at: new Date(Date.now() - 3 * 60000).toISOString(),
      },
      {
        id: '1-2',
        content: 'Congrats on the deploy! 🎉',
        upvotes: 45,
        downvotes: 1,
        tokReward: 20,
        created_at: new Date(Date.now() - 2 * 60000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    username: 'anonymous',
    team_name: 'My Pen Is Long',
    content: 'Our smart contract had a bug and we fixed it 3 minutes before the deadline. That was intense. 💪',
    upvotes: 521,
    downvotes: 8,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    tokReward: 75,
    replies: [
      {
        id: '2-1',
        content: 'Nothing beats that last-minute save feeling!',
        upvotes: 120,
        downvotes: 3,
        tokReward: 30,
        created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    username: 'anonymous',
    team_name: 'Bebop',
    content: 'Honestly, the vibe in this hackathon is insane. Everyone is just grinding and helping each other 🔥',
    upvotes: 289,
    downvotes: 5,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    tokReward: 45,
    replies: [],
  },
  {
    id: '4',
    username: 'anonymous',
    team_name: 'PizzaBlitz',
    content: 'Just realized pizza tokens are actually genius. Who needs real money anyway? 🍕',
    upvotes: 198,
    downvotes: 4,
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    tokReward: 35,
    replies: [],
  },
  {
    id: '5',
    username: 'anonymous',
    team_name: 'KUBI Sigma Males',
    content: 'Watching people debug React for 4 hours when the issue was just a forgotten semicolon... peak hackathon energy',
    upvotes: 456,
    downvotes: 9,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    tokReward: 60,
    replies: [],
  },
];

interface ReplyProps {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  tokReward: number;
  created_at: string;
}

interface ConfessionProps {
  id: string;
  username: string;
  team_name: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  tokReward: number;
  replies: ReplyProps[];
}

const ConfessionCard: React.FC<ConfessionProps & { index: number }> = ({
  id,
  team_name,
  content,
  likes,
  created_at,
  index,
}) => {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(Math.floor(Math.random() * 500) + 50);
  const [downvoteCount, setDownvoteCount] = useState(Math.floor(Math.random() * 100) + 5);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const formatTime = (date: string) => {
    const now = new Date();
    const confDate = new Date(date);
    const diff = Math.floor((now.getTime() - confDate.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return confDate.toLocaleDateString();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotX = ((y - rect.height / 2) / rect.height) * 10;
    const rotY = ((x - rect.width / 2) / rect.width) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const netVotes = upvoteCount - downvoteCount;
  const votePercentage = upvoteCount / (upvoteCount + downvoteCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        perspective: '1200px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full"
    >
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black/60 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-7 min-h-64 flex flex-col justify-between shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        
        {/* Glassmorphism blur line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

        <div className="relative z-10">
          {/* Header: Team + Time */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg border border-indigo-300/50">
                <span className="text-white font-bold text-xs">{team_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold">{team_name}</p>
                <p className="text-slate-400 text-xs">{formatTime(created_at)}</p>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-lg px-3 py-1 backdrop-blur-sm">
              <p className="text-amber-300 text-xs font-bold">3 🍕TOK</p>
            </div>
          </div>

          {/* Content */}
          <p className="text-slate-100 text-base leading-relaxed font-light mb-5 break-words">
            {content}
          </p>

          {/* Vote Bar */}
          <div className="mb-4 bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${votePercentage}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
            />
          </div>
        </div>

        {/* Footer: Vote Buttons */}
        <div className="relative z-10 flex items-center justify-between pt-5 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            {/* Upvote Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (downvoted) {
                  setDownvoted(false);
                  setDownvoteCount(downvoteCount - 1);
                }
                setUpvoted(!upvoted);
                setUpvoteCount(upvoted ? upvoteCount - 1 : upvoteCount + 1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                upvoted
                  ? 'bg-green-500/30 border border-green-400/60 text-green-300'
                  : 'bg-slate-700/40 border border-slate-600/50 text-slate-400 hover:bg-slate-700/60'
              }`}
            >
              <motion.span
                animate={{ scale: upvoted ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-lg"
              >
                👍
              </motion.span>
              <span className="text-xs font-semibold">{upvoteCount}</span>
            </motion.button>

            {/* Downvote Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (upvoted) {
                  setUpvoted(false);
                  setUpvoteCount(upvoteCount - 1);
                }
                setDownvoted(!downvoted);
                setDownvoteCount(downvoted ? downvoteCount - 1 : downvoteCount + 1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                downvoted
                  ? 'bg-red-500/30 border border-red-400/60 text-red-300'
                  : 'bg-slate-700/40 border border-slate-600/50 text-slate-400 hover:bg-slate-700/60'
              }`}
            >
              <motion.span
                animate={{ scale: downvoted ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-lg"
              >
                👎
              </motion.span>
              <span className="text-xs font-semibold">{downvoteCount}</span>
            </motion.button>
          </div>

          {/* Net Vote Score */}
          <div className="text-right">
            <motion.div
              key={netVotes}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-sm font-bold text-indigo-300"
            >
              {netVotes > 0 ? '+' : ''}{netVotes}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function ArenaPage() {
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

  const selectedTeamData = selectedTeam 
    ? TEAMS.find((t) => t.id === selectedTeam)
    : null;

  // Debug logging
  useEffect(() => {
    if (selectedTeamData) {
      console.log('Selected team:', selectedTeamData.name);
    }
  }, [selectedTeamData]);

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
                className="relative w-full z-40"
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500 transition-all duration-300 group"
                >
                  <div className="text-left flex-1">
                    <p className="text-xs text-slate-400 mb-1">Choose your team</p>
                    <p className="text-lg font-bold text-white line-clamp-1">
                      {selectedTeamData?.name || 'Select a team...'}
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
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl z-50 max-h-96 overflow-y-auto shadow-2xl origin-top"
                    >
                      {TEAMS.map((team, idx) => (
                          <motion.button
                            key={team.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            onClick={() => {
                              setSelectedTeam(team.id);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-b-0 hover:border-indigo-500"
                          >
                            <p className="font-semibold text-white text-sm">{team.name}</p>
                          </motion.button>
                        ))
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center text-slate-500 text-xs mt-4"
              >
                {TEAMS.length} teams available
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center text-slate-500 text-xs mt-2"
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
            className="min-h-screen py-16 px-4"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header with Team + Wallet */}
              <motion.div
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-lg p-6 rounded-2xl z-40 border border-indigo-500/30 shadow-2xl"
              >
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {selectedTeamData?.name || 'Loading...'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {Math.floor(Math.random() * 10) + 3} teammates venting anonymously
                  </p>
                </div>
                
                {/* Wallet Display */}
                <div className="flex flex-col items-end gap-3">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/50 rounded-xl px-6 py-3 backdrop-blur-md">
                    <p className="text-amber-300 text-xs font-semibold mb-1">WALLET BALANCE</p>
                    <p className="text-amber-100 text-2xl font-black">3 <span className="text-xl">🍕TOK</span></p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTeam(null)}
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded-lg text-sm font-bold transition-all shadow-lg"
                  >
                    Change Team
                  </motion.button>
                </div>
              </motion.div>

              {/* Confessions Grid */}
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {confessionsLoading && displayConfessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-16"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl mb-4"
                      >
                        🍕
                      </motion.div>
                      <p className="text-slate-400 text-lg">Loading confessions...</p>
                    </motion.div>
                  ) : displayConfessions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-16"
                    >
                      <p className="text-slate-400 text-lg mb-4">No confessions yet. Be the first to confess!</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-bold text-white shadow-lg"
                      >
                        Share a Confession
                      </motion.button>
                    </motion.div>
                  ) : (
                    displayConfessions.map((confession, idx) => (
                      <ConfessionCard key={confession.id} {...confession} index={idx} />
                    ))
                  )}
                </div>
              </AnimatePresence>

              {/* Spacing at bottom */}
              <div className="h-32" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
