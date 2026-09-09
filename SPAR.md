# Spar

A sparring simulator for people who freeze or flare when they get teased. The app
delivers a jab by voice, you have to exhale before the mic opens, then you answer
out loud within a few seconds. It grades calm, not wit.

The promise: after two weeks, you feel the spike and pause instead of reacting.

The problem is nervous system activation, not vocabulary. If a feature makes the
app more entertaining but doesn't build the pause, it doesn't ship.

## Stack

Expo (SDK 57) + TypeScript strict + expo-router + Supabase.

## Setup

```sh
npm install
cp .env.example .env      # fill in your Supabase URL and anon key
npm start
```

Apply the schema to your Supabase project by running the files in
`supabase/migrations/` in order (SQL editor, or `supabase db push` once linked).
Then enable **Email** sign-in in Auth → Providers.

Only the anon key belongs in `.env`. The Anthropic API key and the transcription
provider key live in Supabase Edge Function secrets and never touch the client.

## Layout

```
app/                    routes (expo-router)
  (auth)/sign-in        email OTP
  (onboarding)/         name → sore-spots → off-limits → mode
  (tabs)/               home, progress, settings
src/api/                Supabase reads and writes
src/components/         shared UI
src/lib/                supabase client, theme
src/state/              session (auth + profile), onboarding draft
src/types/db.ts         hand-written schema types
supabase/migrations/    schema, RLS, storage, delete-my-data RPC
```

## Sessions

- [x] **1** — setup, schema + RLS, auth, onboarding, profile persistence
- [ ] **2** — Home and the core loop in pause-only mode, static jabs, expo-speech
- [ ] **3** — jab generation edge function with the safety check
- [ ] **4** — recording, transcription, grading edge function, full mode
- [ ] **5** — Progress, difficulty ladder, "Too much", session cap, training wheels

## Non-goals

No comeback generation or suggestions, ever. No funniness score. No social
features. No wearables. No mic-based breath detection. No web version.
