import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Team {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('teams')
          .select('*');

        if (fetchError) throw fetchError;

        setTeams(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();

    // Listen for team changes
    const subscription = supabase
      .channel('teams-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { teams, loading, error };
}
