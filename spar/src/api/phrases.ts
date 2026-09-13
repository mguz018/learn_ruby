import { supabase } from '@/lib/supabase';
import type { UserPhrase } from '@/types/db';

// sore_spots and off_limits are the same shape and are always edited as a whole
// list, so one module serves both.
export type PhraseTable = 'sore_spots' | 'off_limits';

export async function fetchPhrases(
  table: PhraseTable,
  userId: string,
): Promise<UserPhrase[]> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Replaces the user's whole list with `texts`, in order. */
export async function replacePhrases(
  table: PhraseTable,
  userId: string,
  texts: string[],
): Promise<void> {
  const cleaned = texts.map((t) => t.trim()).filter((t) => t.length > 0);

  const { error: deleteError } = await supabase.from(table).delete().eq('user_id', userId);
  if (deleteError) throw deleteError;

  if (cleaned.length === 0) return;

  const { error: insertError } = await supabase
    .from(table)
    .insert(cleaned.map((text) => ({ user_id: userId, text })));
  if (insertError) throw insertError;
}
