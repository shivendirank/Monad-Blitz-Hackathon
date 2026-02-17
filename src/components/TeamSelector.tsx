'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { useTeams } from '@/hooks/useTeams';

export function TeamSelector() {
  const { address: walletAddress } = useAccount();
  const { teams, loading: teamsLoading } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [username, setUsername] = useState('');

  // Check if profile exists
  useEffect(() => {
    const checkProfile = async () => {
      if (!walletAddress) return;

      try {
        const { data } = await supabase
          .from('player_profiles')
          .select('id, team_id')
          .eq('address', walletAddress)
          .single();

        if (data) {
          setHasProfile(true);
          setSelectedTeam(data.team_id || null);
        }
      } catch (error) {
        setHasProfile(false);
      }
    };

    checkProfile();
  }, [walletAddress]);

  const handleJoinTeam = async () => {
    if (!walletAddress || !selectedTeam) return;

    try {
      setLoading(true);

      if (hasProfile) {
        // Update existing profile
        await supabase
          .from('player_profiles')
          .update({ team_id: selectedTeam })
          .eq('address', walletAddress);
      } else {
        // Create new profile
        await supabase.from('player_profiles').insert([
          {
            address: walletAddress,
            username: username || undefined,
            team_id: selectedTeam,
            score: 0,
          },
        ]);
        setHasProfile(true);
      }
    } catch (error) {
      console.error('Error joining team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="text-center py-8 text-white/60">
        Connect your wallet to join a team
      </div>
    );
  }

  if (teamsLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/10 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hasProfile && (
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Username (optional)
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-green-500 focus:outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          Choose Your Team
        </label>
        <div className="space-y-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selectedTeam === team.id
                  ? 'bg-green-500/20 border-green-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {team.image_url && (
                  <img
                    src={team.image_url}
                    alt={team.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="font-bold">{team.name}</div>
                  {team.description && (
                    <div className="text-sm text-white/60">{team.description}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="inline-block w-6 h-6 rounded-full border-2 border-white/20">
                    {selectedTeam === team.id && (
                      <div className="w-full h-full rounded-full bg-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleJoinTeam}
        disabled={!selectedTeam || loading}
        className="w-full px-6 py-3 rounded-lg bg-green-500 text-black font-bold hover:bg-green-400 disabled:bg-white/20 disabled:text-white/50 transition"
      >
        {loading ? 'Joining...' : hasProfile ? 'Switch Team' : 'Join Team'}
      </button>
    </div>
  );
}
