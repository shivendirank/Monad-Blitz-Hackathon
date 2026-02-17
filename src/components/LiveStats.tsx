'use client';

import { useBlockNumber, useReadContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  PIZZA_PASS_ADDRESS,
  PIZZA_PASS_ABI,
  PIZZA_ORDER_PROCESSOR_ADDRESS,
  PIZZA_ORDER_PROCESSOR_ABI,
} from '@/contracts/addresses';

interface Team {
  id: number;
  name: string;
  score: number;
}

export function LiveStats() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: totalOrders } = useReadContract({
    address: PIZZA_ORDER_PROCESSOR_ADDRESS,
    abi: PIZZA_ORDER_PROCESSOR_ABI,
    functionName: 'getTotalOrders',
    args: [],
    watch: true,
  });

  // Fetch team scores from Supabase
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name');
        
        if (error) throw error;

        // Calculate scores by counting players per team
        const teamScores = await Promise.all(
          (data || []).map(async (team) => {
            const { count } = await supabase
              .from('player_profiles')
              .select('*', { count: 'exact', head: true })
              .eq('team_id', team.id);
            
            return {
              id: team.id,
              name: team.name,
              score: count || 0,
            };
          })
        );

        setTeams(teamScores.sort((a, b) => b.score - a.score));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
    
    // Set up real-time listener for player_profiles
    const subscription = supabase
      .channel('player-updates')
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

  const topTeam = teams[0];

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-white/70">Block</span>
        <span className="font-mono font-bold text-green-400">
          {blockNumber !== undefined ? blockNumber.toString() : '—'}
        </span>
      </div>
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
        <span className="text-white/70">Total pizza orders</span>
        <span className="font-mono font-bold">
          {totalOrders !== undefined ? totalOrders.toString() : '—'}
        </span>
      </div>
      {!loading && topTeam && (
        <div className="bg-yellow-500/20 rounded-lg px-4 py-2 flex items-center gap-2 border border-yellow-500/30">
          <span className="text-white/70">Leading</span>
          <span className="font-mono font-bold text-yellow-300">
            {topTeam.name} ({topTeam.score})
          </span>
        </div>
      )}
      <div className="text-white/50 text-xs">
        1s blocks · 10k TPS
      </div>
    </div>
  );
}
