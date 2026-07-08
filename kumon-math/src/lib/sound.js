// Tiny WebAudio helpers — no audio files to ship. Used sparingly: a soft tick
// on answer feedback and a triumphant fanfare for a belt promotion.

let ctx = null
function ac() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, start, dur, { type = 'sine', gain = 0.15 } = {}) {
  const c = ac()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = c.currentTime + start
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export function playCorrect() {
  tone(660, 0, 0.12, { type: 'triangle', gain: 0.08 })
}

export function playWrong() {
  tone(180, 0, 0.18, { type: 'sine', gain: 0.08 })
}

// Rising major arpeggio for a belt promotion.
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((f, i) => tone(f, i * 0.14, 0.5, { type: 'triangle', gain: 0.14 }))
  tone(1318.51, notes.length * 0.14, 0.7, { type: 'triangle', gain: 0.12 })
}
