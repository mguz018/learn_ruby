// Hand-written to match supabase/migrations. Regenerate with
// `supabase gen types typescript` once the project is linked.

export type SparMode = 'pause_only' | 'full';
export type SparMove =
  | 'agree_bigger'
  | 'own_it'
  | 'hand_back'
  | 'deadpan'
  | 'defended'
  | 'unclear';

export type Profile = {
  id: string;
  name: string;
  mode: SparMode;
  difficulty: number;
  countdown_seconds: number;
  training_wheels: boolean;
  onboarded_at: string | null;
  created_at: string;
};

export type UserPhrase = {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
};

export type Jab = {
  id: string;
  user_id: string;
  text: string;
  difficulty: number;
  flagged_too_much: boolean;
  created_at: string;
};

export type Rep = {
  id: string;
  user_id: string;
  jab_id: string | null;
  mode: SparMode;
  audio_path: string | null;
  transcript: string | null;
  response_ms: number | null;
  word_count: number | null;
  move: SparMove | null;
  defended: boolean | null;
  defense_signals: string[];
  note: string | null;
  created_at: string;
};

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  __InternalSupabase: { PostgrestVersion: '13' };
  public: {
    Tables: {
      profiles: Table<Profile, Partial<Profile> & { id: string }, Partial<Profile>>;
      sore_spots: Table<UserPhrase, { user_id: string; text: string }, Partial<UserPhrase>>;
      off_limits: Table<UserPhrase, { user_id: string; text: string }, Partial<UserPhrase>>;
      jabs: Table<
        Jab,
        { user_id: string; text: string; difficulty: number },
        Partial<Jab>
      >;
      reps: Table<Rep, Omit<Rep, 'id' | 'created_at'>, Partial<Rep>>;
    };
    Views: Record<string, never>;
    Functions: {
      delete_all_my_data: { Args: Record<string, never>; Returns: void };
    };
    Enums: { spar_mode: SparMode; spar_move: SparMove };
    CompositeTypes: Record<string, never>;
  };
};
