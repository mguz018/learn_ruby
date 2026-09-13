import { supabase } from '@/lib/supabase';
import type { SparMode, SparSession, SparSessionEnd } from '@/types/db';

export async function startSession(
  userId: string,
  mode: SparMode,
  difficulty: number,
): Promise<SparSession> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId, mode, difficulty })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function endSession(
  sessionId: string,
  reason: SparSessionEnd,
): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString(), ended_reason: reason })
    .eq('id', sessionId);
  if (error) throw error;
}
