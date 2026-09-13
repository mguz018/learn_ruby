import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/db';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

type ProfilePatch = Partial<
  Pick<
    Profile,
    'name' | 'mode' | 'difficulty' | 'countdown_seconds' | 'training_wheels' | 'onboarded_at'
  >
>;

export async function updateProfile(userId: string, patch: ProfilePatch): Promise<Profile> {
  // Upsert rather than update: the auth trigger normally creates the row, but a
  // user who signed up before that trigger existed would otherwise be stuck.
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...patch })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}
