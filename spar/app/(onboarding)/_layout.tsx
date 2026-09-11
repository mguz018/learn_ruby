import { Stack } from 'expo-router';

import { colors } from '@/lib/theme';
import { OnboardingProvider } from '@/state/onboarding';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </OnboardingProvider>
  );
}
