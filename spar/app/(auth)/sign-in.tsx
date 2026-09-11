import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/lib/theme';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async () => {
    setBusy(true);
    setError(null);
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (sendError) setError(sendError.message);
    else setCodeSent(true);
  };

  const verifyCode = async () => {
    setBusy(true);
    setError(null);
    // No navigation here: onAuthStateChange updates the session and the index
    // route redirects.
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });
    setBusy(false);
    if (verifyError) setError(verifyError.message);
  };

  return (
    <Screen
      footer={
        codeSent ? (
          <>
            <Button
              label="Continue"
              onPress={verifyCode}
              busy={busy}
              disabled={code.trim().length < 6}
            />
            <Button
              label="Use a different email"
              variant="ghost"
              onPress={() => {
                setCodeSent(false);
                setCode('');
                setError(null);
              }}
            />
          </>
        ) : (
          <Button
            label="Send me a code"
            onPress={sendCode}
            busy={busy}
            disabled={!email.includes('@')}
          />
        )
      }
    >
      <View style={{ gap: spacing.sm, marginTop: spacing.xxl }}>
        <Text variant="display">Spar</Text>
        <Text variant="body" tone="muted">
          Practice feeling the spike and pausing, instead of reacting.
        </Text>
      </View>

      <View style={{ gap: spacing.md, marginTop: spacing.xl }}>
        {codeSent ? (
          <>
            <Text variant="body" tone="muted">
              We sent a 6-digit code to {email.trim()}.
            </Text>
            <TextField
              label="Code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoFocus
              maxLength={6}
              placeholder="123456"
            />
          </>
        ) : (
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            placeholder="you@example.com"
          />
        )}

        {error ? (
          <Text variant="caption" tone="muted">
            {error}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
