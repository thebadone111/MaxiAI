# Photo candidates — Maxi AI (photo variant)

Stock photography for the "photo" visual variant, chosen against the editorial brand:
cool-neutral, restrained, quiet. Brand ground: Ink `#1C1A2E`, Cream `#FAF7F0`, Signal red `#C0392B`.

**Every file here is from Pexels and carries the Pexels License**
(<https://www.pexels.com/license/>): free for commercial and non-commercial use, no permission
or attribution required (credit appreciated). Not allowed: selling unaltered copies, implying
the photographer or a pictured person endorses Maxi AI, or using them in a trademark/logo.
The licence was read from each photo page's `ImageObject.license`
(`https://www.pexels.com/license/` for all six); no sponsored (iStock / Canva) result was used.
No recognisable person appears in any file (the hero has two tiny, distant silhouettes in the
walkway).

Candidates are 2400 px on the long edge from the Pexels CDN (home reveal 2800 px wide so the
2600 px width is not an upscale); original master sizes are listed.

| File | Photo | Photographer | Original | Slot |
| --- | --- | --- | --- | --- |
| `01-home-hero-barbican-walkway.jpg` | [Walkway under Modern Residential Building](https://www.pexels.com/photo/18252651/) | Polina Chistyakova | 2641 × 3521 | homeHero, 4:5 |
| `02-home-reveal-data-centre-aisle.jpg` | [Server Racks on Data Center](https://www.pexels.com/photo/4508751/) | Brett Sayles | 5568 × 3712 | homeReveal, 16:9 + 9:16 |
| `03-services-blue-patch-cables-switch.jpg` | [Cables Connected to Ethernet Ports](https://www.pexels.com/photo/2881232/) | Brett Sayles | 5520 × 3673 | services, 4:5 |
| `04-about-london-brick-gables-dusk.jpg` | [Historic Buildings With Moon in Evening Sky](https://www.pexels.com/photo/35011598/) | Brett Jordan | 2818 × 3722 | about, 4:5 |
| `05-ai-product-podcast-desk-mic-arm.jpg` | [Professional Podcast Studio with Dynamic Microphone](https://www.pexels.com/photo/33231527/) | Shaniqua Smith | 4284 × 5712 | aiProduct, 4:5 |
| `06-programme-maroon-shopfront.jpg` | [Photo Of Store Front](https://www.pexels.com/photo/3988037/) | Viktor Mogilat | 6226 × 4981 | programme, 4:5 |

Site versions are in `public/img/`, made by `tools/photos/export.py` (AVIF q58 speed 4, WebP q82
method 6, LANCZOS, never upscaled; home reveal uses AVIF q48 / WebP q60 to keep weight down).
`src/photos.js` lists the widths. All images get the Maxi grade (`tools/photos/grade.py`):
about 10 % desaturation, shadows leaned toward ink, highlights toward cream.

- **01 hero:** crop 4:5 around (0.5, 0.45). Grade 1.0. Warm brown concrete is the warmest frame; the grade cools it slightly.
- **02 reveal:** 16:9 centred; phone 9:16 centred at 35 % so the trolley monitor and aisle stay in frame. Grade 0.8.
- **03 services:** 4:5 around x = 0.42 (cable bundle and switch ports). Grade 1.0.
- **04 about:** 4:5 around (0.5, 0.4), keeping moon and both gables. Grade 1.0.
- **05 aiProduct:** 4:5 around centre (mic, boom arm, desk). Grade 1.0. No ring light or camera: the podcast desk stands in.
- **06 programme:** 4:5 around x = 0.6 (maroon frontage and door). Grade 1.0. Not London-confirmed (looks continental); no legible business name.
