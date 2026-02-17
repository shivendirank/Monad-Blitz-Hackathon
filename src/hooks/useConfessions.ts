import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Confession {
  id: string;
  player_id: string;
  content: string;
  team_id: number;
  team_name?: string;
  username?: string;
  created_at: string;
  likes: number;
}

export function useConfessions() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        setLoading(true);
        
        // Fetch confessions with team and player info
        const { data: confessionData, error: confessionError } = await supabase
          .from('confessions')
          .select(`
            *,
            teams:team_id (name),
            player_profiles:player_id (username)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (confessionError) throw confessionError;

        const formattedConfessions = (confessionData || []).map((conf: any) => ({
          id: conf.id,
          player_id: conf.player_id,
          content: conf.content,
          team_id: conf.team_id,
          team_name: conf.teams?.name || 'Anonymous',
          username: conf.player_profiles?.username || 'Team Member',
          created_at: conf.created_at,
          likes: conf.likes || 0,
        }));

        setConfessions(formattedConfessions);
        setError(null);
      } catch (err) {
        console.error('Error fetching confessions:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setConfessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConfessions();

    // Listen for new confessions
    const subscription = supabase
      .channel('confessions-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'confessions' },
        (payload) => {
          fetchConfessions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addConfession = async (content: string, playerId: string, teamId: number) => {
    try {
      const { data, error } = await supabase
        .from('confessions')
        .insert([
          {
            player_id: playerId,
            content,
            team_id: teamId,
            likes: 0,
          },
        ])
        .select();

      if (error) throw error;

      return data?.[0] || null;
    } catch (err) {
      console.error('Error adding confession:', err);
      throw err;
    }
  };

  return { confessions, loading, error, addConfession };
}
