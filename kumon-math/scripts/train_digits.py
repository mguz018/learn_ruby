# Trains the bundled handwritten-digit recognizer for Exponential Go.
# A small MLP (784 -> 128 -> 10) on MNIST, exported to public/model/digits.json
# so the app can run the forward pass in plain JavaScript (no TensorFlow.js).
#
# Usage (from the kumon-math/ directory):
#   pip install numpy
#   curl -o mnist.npz https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
#   python scripts/train_digits.py
import numpy as np, json

d = np.load('mnist.npz')
xtr = d['x_train'].reshape(-1, 784).astype(np.float32) / 255.0
ytr = d['y_train'].astype(np.int64)
xte = d['x_test'].reshape(-1, 784).astype(np.float32) / 255.0
yte = d['y_test'].astype(np.int64)

rng = np.random.default_rng(42)
H = 128
# He init
W1 = rng.standard_normal((784, H)).astype(np.float32) * np.sqrt(2.0 / 784)
b1 = np.zeros(H, np.float32)
W2 = rng.standard_normal((H, 10)).astype(np.float32) * np.sqrt(2.0 / H)
b2 = np.zeros(10, np.float32)


def forward(x):
    z1 = x @ W1 + b1
    a1 = np.maximum(z1, 0)
    z2 = a1 @ W2 + b2
    z2 -= z2.max(1, keepdims=True)
    e = np.exp(z2)
    p = e / e.sum(1, keepdims=True)
    return z1, a1, p


def onehot(y):
    o = np.zeros((y.size, 10), np.float32)
    o[np.arange(y.size), y] = 1
    return o


N = xtr.shape[0]
batch = 128
lr = 0.2
epochs = 14
for ep in range(epochs):
    idx = rng.permutation(N)
    if ep in (8, 12):
        lr *= 0.3
    for s in range(0, N, batch):
        bi = idx[s:s + batch]
        x = xtr[bi]
        y = ytr[bi]
        z1, a1, p = forward(x)
        m = x.shape[0]
        dz2 = (p - onehot(y)) / m
        gW2 = a1.T @ dz2
        gb2 = dz2.sum(0)
        da1 = dz2 @ W2.T
        dz1 = da1 * (z1 > 0)
        gW1 = x.T @ dz1
        gb1 = dz1.sum(0)
        W2 -= lr * gW2
        b2 -= lr * gb2
        W1 -= lr * gW1
        b1 -= lr * gb1
    _, _, ptr = forward(xte)
    acc = (ptr.argmax(1) == yte).mean()
    print(f'epoch {ep+1:2d}  test acc {acc*100:.2f}%  lr {lr:.3f}')

_, _, pte = forward(xte)
print('FINAL test accuracy: %.2f%%' % ((pte.argmax(1) == yte).mean() * 100))


def q(a, nd=4):
    return [round(float(v), nd) for v in np.asarray(a).ravel()]


model = {
    'in': 784, 'hidden': H, 'out': 10,
    'W1': q(W1), 'b1': q(b1), 'W2': q(W2), 'b2': q(b2),
}
out = 'public/model/digits.json'
import os
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w') as f:
    json.dump(model, f, separators=(',', ':'))
print('wrote', out, os.path.getsize(out) // 1024, 'KB')
