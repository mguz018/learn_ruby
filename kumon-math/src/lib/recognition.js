// Per-box handwritten-digit recognition using TensorFlow.js + a pre-trained
// MNIST-style model loaded from a CDN.
//
// Design notes:
//  - We recognize ONE box (one digit) at a time. There is no freeform
//    multi-digit segmentation — each box is an independent 28x28 image.
//  - TF.js is loaded lazily from a CDN the first time recognition is needed,
//    so the initial app load stays light and keypad-only users never pay for it.
//  - Everything degrades gracefully: if TF.js or the model can't load, callers
//    fall back to the keypad and the reason is surfaced to the parent dashboard.

let tf = null
let model = null
let loadPromise = null
let inputSize = 28
let flatInput = false // some models expect [1, 784] instead of [1, 28, 28, 1]

const TFJS_CDN = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const el = document.createElement('script')
    el.src = src
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(el)
  })
}

// Returns a promise that resolves to true if the recognizer is ready, or
// rejects with an error explaining why it could not load.
export function loadRecognizer(modelUrl) {
  if (model) return Promise.resolve(true)
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    await loadScript(TFJS_CDN)
    tf = window.tf
    if (!tf) throw new Error('TensorFlow.js did not initialize')

    // Try loadLayersModel first (Keras-style), then loadGraphModel.
    try {
      model = await tf.loadLayersModel(modelUrl)
    } catch (errLayers) {
      model = await tf.loadGraphModel(modelUrl)
    }

    // Inspect the expected input shape so we can reshape correctly.
    const shape = model.inputs?.[0]?.shape || [null, 28, 28, 1]
    if (shape.length === 2) {
      flatInput = true
      inputSize = Math.round(Math.sqrt(shape[1] || 784))
    } else {
      flatInput = false
      inputSize = shape[1] || 28
    }
    return true
  })().catch((err) => {
    loadPromise = null // allow a retry later
    throw err
  })

  return loadPromise
}

export function isReady() {
  return !!model
}

// Recognize the digit drawn on `sourceCanvas` (black ink on white background).
// Returns { digit, confidence } or null if the box looks empty.
export function recognizeDigit(sourceCanvas) {
  if (!model || !tf) return null

  const bbox = inkBoundingBox(sourceCanvas)
  if (!bbox) return null // empty box

  return tf.tidy(() => {
    // Crop to the ink, then place it centered on a square with padding — this
    // matches how MNIST digits are normalized and hugely improves accuracy.
    const norm = normalizeToCanvas(sourceCanvas, bbox, inputSize)
    let img = tf.browser
      .fromPixels(norm, 1)
      .toFloat()
      .div(255)
    // Canvas is dark ink on light paper; MNIST is white digit on black.
    img = tf.scalar(1).sub(img)

    const input = flatInput
      ? img.reshape([1, inputSize * inputSize])
      : img.reshape([1, inputSize, inputSize, 1])

    const output = model.predict(input)
    const probs = output.dataSync()
    let best = 0
    for (let i = 1; i < probs.length; i += 1) {
      if (probs[i] > probs[best]) best = i
    }
    return { digit: best % 10, confidence: probs[best] }
  })
}

// Find the tight bounding box of drawn ink (non-white pixels). Returns null if
// the canvas is effectively blank.
function inkBoundingBox(canvas) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  let inkPixels = 0
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4
      const alpha = data[i + 3]
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
      // Dark, opaque pixel counts as ink.
      if (alpha > 40 && lum < 200) {
        inkPixels += 1
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }
  if (inkPixels < 12) return null
  return { minX, minY, maxX, maxY }
}

// Draw the cropped ink onto a size x size canvas, scaled to ~20px and centered
// (MNIST convention: 20px digit in a 28px frame).
function normalizeToCanvas(source, bbox, size) {
  const target = document.createElement('canvas')
  target.width = size
  target.height = size
  const ctx = target.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  const boxW = bbox.maxX - bbox.minX + 1
  const boxH = bbox.maxY - bbox.minY + 1
  const inner = size * 0.72 // leave a margin
  const scale = inner / Math.max(boxW, boxH)
  const drawW = boxW * scale
  const drawH = boxH * scale
  const dx = (size - drawW) / 2
  const dy = (size - drawH) / 2

  ctx.imageSmoothingEnabled = true
  ctx.drawImage(source, bbox.minX, bbox.minY, boxW, boxH, dx, dy, drawW, drawH)
  return target
}
