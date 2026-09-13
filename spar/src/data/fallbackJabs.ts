/**
 * The static pool. Session 3 replaces this with generated jabs, but it stays as
 * the fallback the edge function serves when the safety check fails three times.
 *
 * Every line here has to survive being said out loud by a stranger: nothing
 * touching protected traits, illness, trauma, or appearance. Level 1 is a
 * stranger at a party; level 5 is a close friend who knows your history. Higher
 * levels get more familiar, not more cruel — the escalation is intimacy, not
 * damage.
 */

const POOL: Record<number, readonly string[]> = {
  1: [
    'Oh, you still do that? I thought people stopped.',
    "That's a choice.",
    'Huh. Bold outfit for a Tuesday.',
    'You seem like you have a lot of opinions about coffee.',
    'Is that your real job or the fun one?',
  ],
  2: [
    'You talk about that a lot, you know.',
    'Let me guess, you have a podcast.',
    'You are one of those people who has a system for everything.',
    'Every time I see you, you have a new thing going on.',
    'You do love an announcement.',
  ],
  3: [
    'How is that side project going? Still going?',
    'You always say you are going to do that.',
    'You have been busy for about three years now.',
    'So is this the new thing, or the same thing renamed?',
    'You are very confident for someone still figuring it out.',
  ],
  4: [
    'You get like this every time something is about to change.',
    'You have had that same plan since I met you.',
    'You always do the hard version and then complain about it.',
    'You are doing the thing again. You know the thing.',
    'Everyone can tell when you are pretending it is fine.',
  ],
  5: [
    'You have been saying that exact sentence for years.',
    'This is the part where you get busy and stop answering.',
    'You do this every single time and then act surprised.',
    'You would rather start something new than finish that.',
    'I have watched you talk yourself out of this before.',
  ],
};

/** Picks a jab for `difficulty`, avoiding anything in `recentTexts`. */
export function pickFallbackJab(difficulty: number, recentTexts: readonly string[]): string {
  const level = Math.min(5, Math.max(1, Math.round(difficulty)));
  const pool = POOL[level] ?? POOL[1] ?? [];

  const unused = pool.filter((text) => !recentTexts.includes(text));
  // Once the whole level has been heard recently, repeats beat running dry.
  const candidates = unused.length > 0 ? unused : pool;

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? 'That is a choice.';
}
