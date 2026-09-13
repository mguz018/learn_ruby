import { createContext, useContext, useMemo, useState } from 'react';

import type { SparMode } from '@/types/db';

export type OnboardingDraft = {
  name: string;
  soreSpots: string[];
  offLimits: string[];
  mode: SparMode;
};

type OnboardingState = {
  draft: OnboardingDraft;
  update: (patch: Partial<OnboardingDraft>) => void;
};

// Onboarding is four screens that write one profile at the end, so the answers
// live in memory until the last step commits them.
const initialDraft: OnboardingDraft = {
  name: '',
  soreSpots: ['', '', ''],
  offLimits: [''],
  mode: 'pause_only',
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);

  const value = useMemo<OnboardingState>(
    () => ({ draft, update: (patch) => setDraft((prev) => ({ ...prev, ...patch })) }),
    [draft],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingState {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  return ctx;
}
