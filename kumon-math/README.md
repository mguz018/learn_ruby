# 🥋 Math Belts — Kumon-style Practice (Math • Reading • History • Science)

A warm, kid-friendly single-page app that gives two children daily, mastery-gated
practice — Kumon-style — across **four subjects**: Math, Reading, History, and
Science. Built with React + Vite, tuned for iPad/tablet, and deployable to
Netlify. All progress is stored locally (no accounts, no servers).

Two profiles ship out of the box: **Oliver** 🦊 and **Noah** 🐨, each with an
**independent belt track per subject** — a kid never sees the other's stats.

## Subjects

Pick a kid, then a subject. Each subject has its own placement check, level map,
belts, and progress.

| Subject | Levels | How you level up |
| --- | --- | --- |
| 🔢 **Math** | 20 (grade 1 → 6) | **Speed + accuracy** — fluency through repetition |
| 📖 **Reading** | 6 | **Accuracy only** — no timer; rushing hurts comprehension |
| 🏛️ **History** | 5 | **Accuracy only** |
| 🔬 **Science** | 5 | **Accuracy only** |

Math is procedurally generated (never hardcoded). Reading/History/Science draw
from curated question banks in `src/data/content/` — easy to extend by adding
more items to any pool.

---

## The Kumon philosophy, baked in

- **One tiny concept per level.** Each level introduces a single new skill.
- **Mastery gating.** In **Math**, a kid advances only when they beat **both** the
  speed and accuracy targets (default 95%). In **Reading/History/Science** the belt
  is earned on **accuracy alone** — a read-and-think subject shouldn't reward
  rushing. Miss the target and they repeat the level with a **fresh** set.
- **Short daily sets.** 8–20 problems, ~10 minutes.
- **No hints or teaching during drills.** Fluency through repetition. Missed
  problems are reviewed in the end-of-set summary and automatically **re-appear
  in the next set** (spaced repetition).
- **No visible timer during the drill.** Time is tracked silently and revealed
  only in the summary — this avoids rush-guessing and anxiety.

## Math levels (1 → 20)

1. Addition within 10
2. Addition within 20
3. Two-digit addition, no regrouping
4. Two-digit addition with regrouping
5. Subtraction within 20
6. Two-digit subtraction with borrowing
7. Multiplication tables 2–5
8. Multiplication tables 6–9
9. Mixed multiplication & division facts
10. Multi-digit multiplication
11. Simple fractions (identify, compare, add same denominator)
12. Two-digit × two-digit multiplication
13. Long division (÷ one digit)
14. Order of operations
15. Fraction of a number
16. Percentages
17. Powers & squares
18. Rounding
19. Decimals (add & subtract) — uses the keypad with a decimal point
20. Averages (mean)

Math problems are **always generated on the fly** — never hardcoded — so
repeating a level always gives a fresh set.

## Gamification (mastery-based only)

- **Belt system** — each level is a belt (white → yellow → orange → green → blue →
  purple → brown → red → black, and beyond). Leveling up earns the next belt with
  a full-screen celebration + sound.
- **Level map** — a visual winding path of all 11 levels showing where the kid is
  and what's ahead.
- **Personal bests** — beat-your-own-time per level, celebrated when beaten.
- **Daily streak** per kid, with **one streak freeze earned per week** so a single
  missed day doesn't kill the streak.
- **Cooperative family streak** — stays alive only if **both** kids practice that
  day. This is the *only* shared element.
- **No** head-to-head leaderboard, **no** coins/gems/prizes. A kid never sees the
  other kid's stats inside their own flow.

## Answer input — Apple Pencil handwriting (primary) + keypad (fallback)

- **One box per digit**, like a test answer sheet. The app shows the right number
  of boxes for the expected answer and tolerates blank boxes.
- Each box is recognized **independently** with TensorFlow.js and an MNIST-style
  digit model — never freeform multi-digit segmentation.
- The recognized digit is shown **live under each box** so the kid sees what the
  app "read", with a per-box erase button to rewrite a single digit.
- Recognition runs on **pen-up with a ~400 ms debounce** so multi-stroke digits
  (4, 5) aren't cut off.
- **Palm rejection**: while an Apple Pencil is down, simultaneous touch input is
  ignored, so a resting hand leaves no marks.
- Submit with the big **Check** button (not auto-submit) so a misread digit can be
  fixed first.
- **Low-confidence guard**: if the model is unsure about a box, it turns yellow and
  asks for a rewrite instead of guessing (threshold is adjustable).
- A corner toggle switches to the **numeric keypad**; each kid's preferred input
  mode is remembered.
- The parent dashboard tracks how often recognition was **corrected**, to advise
  switching input modes.

## Parent dashboard (PIN-protected)

Default PIN is **1234** (change it inside → Settings). Behind the PIN:

- **Weekly summary per kid** — sets completed, accuracy trend, average time.
- **Struggle detection** — the specific fact families / problem types each kid
  misses most (e.g. `7×8`, `sub: borrow across zero`).
- **Adjustable knobs** — speed/accuracy targets and problems-per-set for every
  level; manually move a kid up or down a level.
- **Handwriting tuning** — confidence threshold and the MNIST model URL.
- **Backup** — export/import the full progress as a JSON file.

---

## Running locally

```bash
cd kumon-math
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Deploying to Netlify

`netlify.toml` is included. Point Netlify at this repo and either:

- set the **base directory** to `kumon-math` (the config already sets
  `command = npm run build` and `publish = dist`), or
- deploy this subdirectory directly.

The included SPA redirect rule keeps client-side routing working on refresh.

## About the handwriting model

TensorFlow.js and the digit model are loaded **at runtime from a CDN**, so the app
bundle stays small and the model can be swapped without a rebuild. The URL lives
in **Parent Dashboard → Settings → MNIST model URL**.

If the model (or TF.js) can't load — offline, blocked network, or a bad URL — the
app **automatically falls back to the keypad** so a child is never stuck, and the
reason is surfaced to the parent.

**Choosing / hosting a model.** The default points at a public MNIST-style model.
Any TensorFlow.js digit classifier works as long as it:

- is served with permissive CORS (or self-hosted alongside the app), and
- takes a 28×28 grayscale input and outputs 10 class scores (flat `[1, 784]` or
  `[1, 28, 28, 1]` inputs are both handled), MNIST-style (white digit on black —
  the app inverts the canvas for you).

To self-host for maximum reliability, drop `model.json` + its `*.bin` weights into
`public/model/` and set the model URL to `./model/model.json`. Digits are
normalized (cropped to the ink, scaled to ~20px, centered in 28px) before
inference to match MNIST conventions.

## Data & privacy

Everything is stored in this browser's `localStorage` under `mathbelts.state.v1`.
No data leaves the device. Use the JSON export in the parent dashboard to back up
or move progress between devices.
