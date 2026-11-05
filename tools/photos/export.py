"""Export the Maxi photo variant as AVIF + WebP at several widths.

    python tools/photos/export.py             # all
    python tools/photos/export.py services    # one

Originals live in photo-candidates/ (2400px masters, never upscaled).
4:5 slots are cropped at source around a focal point (fx, fy as fractions of
the frame). homeReveal is exported 16:9 full-bleed plus a 9:16 phone crop.
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

sys.path.insert(0, str(Path(__file__).parent))
from grade import grade  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img"
SRC = ROOT / "photo-candidates"

FIG = [480, 720, 960]
REVEAL = [1000, 1500, 2200, 2600]
REVEAL_PHONE = [600, 900]

# name -> (source, ratio (w, h), widths, phone widths or None)
JOBS = {
    "home-hero":   ("01-home-hero-barbican-walkway.jpg",         (4, 5),   FIG, None),
    "home-reveal": ("02-home-reveal-data-centre-aisle.jpg",      (16, 9),  REVEAL, REVEAL_PHONE),
    "services":    ("03-services-blue-patch-cables-switch.jpg",  (4, 5),   FIG, None),
    "about":       ("04-about-london-brick-gables-dusk.jpg",     (4, 5),   FIG, None),
    "ai-product":  ("05-ai-product-podcast-desk-mic-arm.jpg",    (4, 5),   FIG, None),
    "programme":   ("06-programme-maroon-shopfront.jpg",         (4, 5),   FIG, None),
}

# (fx, fy) focal point for the crop; phone crop uses fx only for home-reveal.
FOCAL = {
    "home-hero": (0.5, 0.45), "home-reveal": (0.5, 0.5), "services": (0.42, 0.5),
    "about": (0.5, 0.4), "ai-product": (0.5, 0.5), "programme": (0.6, 0.5),
}
PHONE_FOCAL = {"home-reveal": 0.35}

GRADE = {n: 1.0 for n in JOBS}
GRADE["home-reveal"] = 0.8


def crop_ratio(im, rw, rh, fx, fy):
    """Largest rw:rh box centred on the focal point."""
    if im.width / im.height > rw / rh:
        cw, ch = round(im.height * rw / rh), im.height
    else:
        cw, ch = im.width, round(im.width * rh / rw)
    x0 = min(max(0, round(fx * im.width - cw / 2)), im.width - cw)
    y0 = min(max(0, round(fy * im.height - ch / 2)), im.height - ch)
    return im.crop((x0, y0, x0 + cw, y0 + ch))


def save(img, stem, wq=82, aq=58):
    img.save(f"{stem}.avif", quality=aq, speed=4)
    img.save(f"{stem}.webp", quality=wq, method=6)
    return tuple(Path(f"{stem}.{e}").stat().st_size // 1024 for e in ("avif", "webp"))


def emit(im, stem_base, widths, total):
    for w in widths:
        if w > im.width:
            print(f"  skip {w}: source only {im.width} wide")
            continue
        out = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        a, b = save(out, OUT / f"{stem_base}-{w}", *((60, 48) if stem_base.startswith("home-reveal") else (82, 58)))
        total += a + b
        print(f"  {stem_base}-{w}  {out.width}x{out.height}  avif {a} KB  webp {b} KB")
    return total


def export(name):
    src, (rw, rh), widths, phone = JOBS[name]
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
    fx, fy = FOCAL[name]
    main = crop_ratio(im, rw, rh, fx, fy)
    if GRADE.get(name):
        main = grade(main, GRADE[name])
    total = emit(main, name, widths, 0)
    if phone:
        full = grade(im, GRADE[name]) if GRADE.get(name) else im
        pc = crop_ratio(full, 9, 16, PHONE_FOCAL.get(name, 0.5), 0.5)
        total = emit(pc, f"{name}-portrait", phone, total)
    print()
    return total


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    grand = 0
    for n in sys.argv[1:] or list(JOBS):
        print(n)
        grand += export(n)
    print(f"total written this run (avif+webp): {grand} KB")
