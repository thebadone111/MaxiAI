"""
Render public/og.png, the 1200x630 image link previews use (LinkedIn,
Slack, WhatsApp, iMessage, X). Typographic, in the brand's own faces:
Fraunces and DM Mono are converted from the @fontsource woff2 files the site
already ships, so the preview matches the page exactly.

    python tools/brand/og_image.py
"""
import io
import re
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
NM = ROOT / "node_modules"
OUT = ROOT / "public" / "og.png"

INK = (28, 26, 46)
CREAM = (250, 247, 240)
SIGNAL = (192, 57, 43)
MIST = (154, 149, 168)


def font(woff2, size, wght=None, opsz=None):
    tt = TTFont(str(woff2))
    tt.flavor = None
    buf = io.BytesIO()
    tt.save(buf)
    buf.seek(0)
    f = ImageFont.truetype(buf, size)
    if wght or opsz:
        axes = {a["name"] if isinstance(a["name"], str) else a["name"].decode(): a for a in f.get_variation_axes()}
        vals = []
        for name, axis in axes.items():
            n = name.lower()
            if "weight" in n and wght:
                vals.append(wght)
            elif "optical" in n and opsz:
                vals.append(opsz)
            else:
                vals.append(axis["default"])
        f.set_variation_by_axes(vals)
    return f


def mark_polys(scale, ox, oy):
    src = (ROOT / "src" / "elems" / "mark-paths.js").read_text(encoding="utf-8")
    out = {}
    for key in ("m", "rules"):
        d = re.search(rf"{key}: '([^']+)'", src).group(1)
        polys = []
        for sub in d.split("Z"):
            nums = [float(v) for v in re.findall(r"-?\d+\.?\d*", sub)]
            if len(nums) >= 6:
                polys.append([(ox + nums[i] * scale, oy + nums[i + 1] * scale) for i in range(0, len(nums), 2)])
        out[key] = polys
    return out


def main():
    W, H = 1200, 630
    S = 2  # supersample, then downscale for smooth edges
    img = Image.new("RGB", (W * S, H * S), INK)
    d = ImageDraw.Draw(img)

    display = NM / "@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2"
    italic = NM / "@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2"
    mono = NM / "@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2"

    # The mark, cream letter with signal rules, top left.
    polys = mark_polys(0.17 * S, 80 * S, 72 * S)
    for p in polys["m"]:
        d.polygon(p, fill=CREAM)
    for p in polys["rules"]:
        d.polygon(p, fill=SIGNAL)
    d.line([(212 * S, 70 * S), (212 * S, 172 * S)], fill=(90, 87, 110), width=S)
    d.text((236 * S, 92 * S), "Maxi", font=font(display, 64 * S, wght=400, opsz=144), fill=CREAM)

    eyebrow = font(mono, 20 * S)
    d.text((80 * S, 250 * S), "MAXI AI DEVELOPMENT  ·  LONDON", font=eyebrow, fill=SIGNAL)
    d.rectangle([80 * S, 290 * S, 152 * S, 293 * S], fill=SIGNAL)

    big = font(display, 66 * S, wght=300, opsz=144)
    big_i = font(italic, 66 * S, wght=400, opsz=144)
    y = 322 * S
    d.text((80 * S, y), "Software, security and", font=big, fill=CREAM)
    y += 80 * S
    x = 80 * S
    d.text((x, y), "your company's own ", font=big, fill=CREAM)
    x += d.textlength("your company's own ", font=big)
    d.text((x, y), "AI brain.", font=big_i, fill=SIGNAL)

    d.text((80 * S, 548 * S), "maxiai.co.uk", font=font(mono, 20 * S), fill=MIST)

    img = img.resize((W, H), Image.LANCZOS)
    img.save(OUT, optimize=True)
    print(f"{OUT.name}: {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
