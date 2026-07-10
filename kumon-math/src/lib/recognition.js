// Per-box handwritten-digit recognition using a small MLP that ships WITH the
// app (public/model/digits.json, ~98% on MNIST test). No TensorFlow.js, no CDN,
// no external model to 404 — the forward pass is plain JavaScript and works
// offline. We recognize ONE box (one digit) at a time; never freeform
// multi-digit segmentation.

const MODEL_PATH = `${import.meta.env.BASE_URL}model/digits.json`
const SIZE = 28

let model = null
let loadPromise = null

// Load the bundled model once. Resolves true on success; rejects on failure.
export function loadRecognizer() {
  if (model) return Promise.resolve(true)
  if (loadPromise) return loadPromise
  loadPromise = fetch(MODEL_PATH)
    .then((r) => {
      if (!r.ok) throw new Error(`model ${r.status}`)
      return r.json()
    })
    .then((m) => {
      model = m
      return true
    })
    .catch((err) => {
      loadPromise = null // allow a retry
      throw err
    })
  return loadPromise
}

export function isReady() {
  return !!model
}

// Recognize the digit drawn on `sourceCanvas` (dark ink on white paper).
// Returns { digit, confidence } or null if the box looks empty.
export function recognizeDigit(sourceCanvas) {
  if (!model) return null
  const bbox = inkBoundingBox(sourceCanvas)
  if (!bbox) return null // empty box

  const x = toInputVector(sourceCanvas, bbox) // Float length 784, white-on-black [0,1]
  return classify(x)
}

// ---- Model forward pass (MLP: 784 -> hidden(ReLU) -> 10 softmax) -----------

function classify(x) {
  const { hidden, out, W1, b1, W2, b2 } = model
  const a1 = new Float32Array(hidden)
  for (let h = 0; h < hidden; h += 1) a1[h] = b1[h]
  // a1 += x · W1  (skip zero pixels — most of the image is background)
  for (let i = 0; i < 784; i += 1) {
    const xi = x[i]
    if (xi === 0) continue
    const base = i * hidden
    for (let h = 0; h < hidden; h += 1) a1[h] += xi * W1[base + h]
  }
  for (let h = 0; h < hidden; h += 1) if (a1[h] < 0) a1[h] = 0 // ReLU

  const z = new Float32Array(out)
  for (let o = 0; o < out; o += 1) {
    let s = b2[o]
    for (let h = 0; h < hidden; h += 1) s += a1[h] * W2[h * out + o]
    z[o] = s
  }
  // softmax
  let max = -Infinity
  for (let o = 0; o < out; o += 1) if (z[o] > max) max = z[o]
  let sum = 0
  for (let o = 0; o < out; o += 1) {
    z[o] = Math.exp(z[o] - max)
    sum += z[o]
  }
  let best = 0
  for (let o = 1; o < out; o += 1) if (z[o] > z[best]) best = o
  return { digit: best, confidence: z[best] / sum }
}

// ---- Preprocessing ---------------------------------------------------------

// Tight bounding box of drawn ink (non-white pixels); null if effectively blank.
function inkBoundingBox(canvas) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  let ink = 0
  for (let y = 0; y < height; y += 1) {
    for (let xx = 0; xx < width; xx += 1) {
      const i = (y * width + xx) * 4
      const alpha = data[i + 3]
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      if (alpha > 40 && lum < 200) {
        ink += 1
        if (xx < minX) minX = xx
        if (xx > maxX) maxX = xx
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (ink < 12) return null
  return { minX, minY, maxX, maxY }
}

// Crop to the ink, scale to ~20px, center in a 28x28 frame (MNIST convention),
// and return a 784-length white-digit-on-black vector in [0,1].
function toInputVector(source, bbox) {
  const c = document.createElement('canvas')
  c.width = SIZE
  c.height = SIZE
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, SIZE, SIZE)

  const boxW = bbox.maxX - bbox.minX + 1
  const boxH = bbox.maxY - bbox.minY + 1
  const inner = SIZE * 0.72
  const scale = inner / Math.max(boxW, boxH)
  const drawW = boxW * scale
  const drawH = boxH * scale
  const dx = (SIZE - drawW) / 2
  const dy = (SIZE - drawH) / 2
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(source, bbox.minX, bbox.minY, boxW, boxH, dx, dy, drawW, drawH)

  const px = ctx.getImageData(0, 0, SIZE, SIZE).data
  const raw = new Float32Array(784)
  for (let i = 0; i < 784; i += 1) {
    const lum = (px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2]) / 3
    raw[i] = 1 - lum / 255 // invert: dark ink -> ~1 (white on black)
  }
  return centerOfMass(raw)
}

// Shift the digit so its center of mass sits at the middle of the frame — this
// is how MNIST is normalized, and it noticeably improves accuracy on real
// hand-drawn input (which isn't bbox-centered the way training data is).
function centerOfMass(x) {
  let total = 0
  let sx = 0
  let sy = 0
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const v = x[r * SIZE + c]
      total += v
      sx += v * c
      sy += v * r
    }
  }
  if (total === 0) return x
  const shiftX = Math.round(SIZE / 2 - 0.5 - sx / total)
  const shiftY = Math.round(SIZE / 2 - 0.5 - sy / total)
  if (shiftX === 0 && shiftY === 0) return x
  const out = new Float32Array(784)
  for (let r = 0; r < SIZE; r += 1) {
    const sr = r - shiftY
    if (sr < 0 || sr >= SIZE) continue
    for (let c = 0; c < SIZE; c += 1) {
      const sc = c - shiftX
      if (sc < 0 || sc >= SIZE) continue
      out[r * SIZE + c] = x[sr * SIZE + sc]
    }
  }
  return out
}
