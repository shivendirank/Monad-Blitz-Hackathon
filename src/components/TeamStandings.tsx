'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Team {
  id: number;
  name: string;
  description: string;
  image_url: string;
  playerCount: number;
}

export function TeamStandings() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, description, image_url');

        console.log('Teams fetched:', teamsData, 'Error:', teamsError);

        if (teamsError) throw teamsError;

        if (!teamsData || teamsData.length === 0) {
          console.warn('No teams found in database');
          setTeams([]);
          setLoading(false);
          return;
        }

        // Get player count for each team
        const teamsWithCounts = await Promise.all(
          (teamsData || []).map(async (team) => {
            const { count } = await supabase
              .from('player_profiles')
              .select('*', { count: 'exact', head: true })
              .eq('team_id', team.id);

            return {
              ...team,
              playerCount: count || 0,
            };
          })
        );

        console.log('Teams with counts:', teamsWithCounts);
        setTeams(teamsWithCounts.sort((a, b) => b.playerCount - a.playerCount));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
        setLoading(false);
      }
    };

    fetchTeams();

    // Listen for player profile changes
    const subscription = supabase
      .channel('team-player-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'player_profiles' },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/10 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team, index) => (
        <div
          key={team.id}
          className={`flex items-center gap-4 p-4 rounded-lg border ${
            index === 0
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-white/5 border-white/10'
          } hover:bg-white/10 transition`}
        >
          <div className="text-2xl font-bold text-white/50 w-8">#{index + 1}</div>

          {team.image_url && (
            <img
              src={team.image_url}
              alt={team.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}

          <div className="flex-1">
            <h3 className="font-bold text-lg">{team.name}</h3>
            <p className="text-sm text-white/60">{team.description}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">{team.playerCount}</div>
            <div className="text-xs text-white/50">players</div>
          </div>
        </div>
      ))}
    </div>
  );
}
