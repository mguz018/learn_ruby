import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/lib/theme';
import { useSession } from '@/state/session';

/** The only routing decision in the app: signed out → sign in, not onboarded →
 *  onboarding, otherwise the tabs. */
export default function Index() {
  const { loading, session, profile } = useSession();

  if (loading || (session && !profile)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!session) return <Redirect href="/sign-in" />;
  if (!profile?.onboarded_at) return <Redirect href="/name" />;
  return <Redirect href="/home" />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
