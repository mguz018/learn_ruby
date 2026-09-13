import * as Speech from 'expo-speech';

/**
 * TODO: expo-speech is the system voice. It is flat and a little robotic, which
 * is acceptable for v1 but is not what a real jab sounds like — the body reacts
 * to tone, and this has none. A hosted TTS provider (ElevenLabs, Cartesia,
 * OpenAI) would plug in right here: swap the body of `say` for a fetch to an
 * edge function that returns audio, and play it with expo-av. Nothing else in
 * the app needs to change.
 */

/** Speaks `text` and resolves when the voice stops. Never rejects. */
export function say(text: string): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    Speech.speak(text, {
      rate: 0.98,
      onDone: finish,
      // A voice that fails silently would strand the rep, so treat any problem
      // as "it finished" and let the gate open.
      onError: finish,
      onStopped: finish,
    });
  });
}

export function stopSpeaking(): void {
  void Speech.stop();
}
