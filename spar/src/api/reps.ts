import { supabase } from '@/lib/supabase';
import type { Jab, Rep, SparMode } from '@/types/db';

/** Jabs are rows before they are reps, so the rep can point at what was heard. */
export async function saveJab(
  userId: string,
  text: string,
  difficulty: number,
): Promise<Jab> {
  const { data, error } = await supabase
    .from('jabs')
    .insert({ user_id: userId, text, difficulty })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function fetchRecentJabTexts(userId: string, limit = 20): Promise<string[]> {
  const { data, error } = await supabase
    .from('jabs')
    .select('text')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row) => row.text);
}

type PauseRepInput = {
  userId: string;
  sessionId: string;
  jabId: string;
  mode: SparMode;
  responseMs: number;
};

/**
 * A pause-only rep has a response time and nothing else — no transcript, no word
 * count, no move. Those columns stay null until full mode in session 4.
 */
export async function savePauseRep(input: PauseRepInput): Promise<void> {
  const { error } = await supabase.from('reps').insert({
    user_id: input.userId,
    session_id: input.sessionId,
    jab_id: input.jabId,
    mode: input.mode,
    response_ms: input.responseMs,
    audio_path: null,
    transcript: null,
    word_count: null,
    move: null,
    defended: null,
    defense_signals: [],
    note: null,
  });
  if (error) throw error;
}

export type RepStatRow = Pick<Rep, 'response_ms' | 'created_at'>;

/** The rows behind the Home numbers: response times over a trailing window. */
export async function fetchRepStats(userId: string, days = 14): Promise<RepStatRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('reps')
    .select('response_ms, created_at')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
