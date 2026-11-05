"""Maxi grade: gentle, should never read as a filter.

~10% desaturation, shadows leaned toward ink #1C1A2E, highlights toward cream
#FAF7F0. `amount` 0 = untouched, 1 = full strength.
"""
import numpy as np
from PIL import Image

INK = np.array([0x1C, 0x1A, 0x2E], dtype=np.float32)
CREAM = np.array([0xFA, 0xF7, 0xF0], dtype=np.float32)


def grade(im, amount=1.0):
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    lum = (a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))[..., None] / 255.0
    out = lum * 255.0 + (a - lum * 255.0) * (1 - 0.10 * amount)       # desaturate
    sh = ((1 - lum) ** 2.2) * 0.14 * amount                           # shadow weight
    hi = (lum ** 2.2) * 0.12 * amount                                 # highlight weight
    out = out * (1 - sh) + INK * sh
    out = out * (1 - hi) + CREAM * hi
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
