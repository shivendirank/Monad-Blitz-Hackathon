import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface PlayerProfile {
  id: string;
  address: string;
  username?: string;
  avatar_url?: string;
  team_id?: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface UsePlayerProfileResult {
  profile: PlayerProfile | null;
  loading: boolean;
  error: Error | null;
  joinTeam: (teamId: number) => Promise<void>;
  updateProfile: (updates: Partial<PlayerProfile>) => Promise<void>;
  createProfile: (address: string) => Promise<PlayerProfile>;
}

export function usePlayerProfile(address?: string): UsePlayerProfileResult {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async (addr: string) => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('address', addr)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setProfile(data || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (address) {
      fetchProfile(address);
    }
  }, [address, fetchProfile]);

  const createProfile = useCallback(
    async (addr: string): Promise<PlayerProfile> => {
      try {
        const { data, error: createError } = await supabase
          .from('player_profiles')
          .insert([{ address: addr, score: 0 }])
          .select()
          .single();

        if (createError) throw createError;

        setProfile(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    []
  );

  const joinTeam = useCallback(async (teamId: number) => {
    if (!profile) throw new Error('No profile loaded');

    try {
      const { data, error: updateError } = await supabase
        .from('player_profiles')
        .update({ team_id: teamId })
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [profile]);

  const updateProfile = useCallback(
    async (updates: Partial<PlayerProfile>) => {
      if (!profile) throw new Error('No profile loaded');

      try {
        const { data, error: updateError } = await supabase
          .from('player_profiles')
          .update(updates)
          .eq('id', profile.id)
          .select()
          .single();

        if (updateError) throw updateError;

        setProfile(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        throw error;
      }
    },
    [profile]
  );

  return {
    profile,
    loading,
    error,
    joinTeam,
    updateProfile,
    createProfile,
  };
}
