import { useHydrated, useMinWidth } from '../motion/hooks.js';
import { useVisuals } from './mode.jsx';
import { PhotoFigure } from './photo.jsx';
import { FanOut, LiveSystem, MarketMap, Topology, Uptime } from './code.jsx';
import { PHOTOS } from '../photos.js';

/*
 * The visuals registry: one slot, two renderings. Pages name a slot; the
 * visual mode (src/visuals/mode.jsx) picks the variant. Both share the same
 * 4:5 frame, so the layout is identical whichever is showing.
 *
 * When one variant is chosen, delete the other column here.
 */
const REGISTRY = {
  homeHero: { photo: () => <PhotoFigure photo={PHOTOS.homeHero} hero />, code: () => <LiveSystem /> },
  services: { photo: () => <PhotoFigure photo={PHOTOS.services} />, code: (p) => <Topology {...p} /> },
  about: { photo: () => <PhotoFigure photo={PHOTOS.about} />, code: (p) => <MarketMap {...p} /> },
  aiProduct: { photo: () => <PhotoFigure photo={PHOTOS.aiProduct} />, code: (p) => <FanOut {...p} /> },
  programme: { photo: () => <PhotoFigure photo={PHOTOS.programme} />, code: (p) => <Uptime {...p} /> },
};

/**
 * A slot's frame, always rendered (so the prerendered layout already has
 * the space), with its media mounted only on wide screens after hydration.
 * Below lg the figures are decorative extras and are not rendered at all —
 * hiding them with CSS would still download a phone's worth of photograph.
 */
export default function Visual({ slot, dark = false, hero = false }) {
  const { mode } = useVisuals();
  const hydrated = useHydrated();
  const wide = useMinWidth(1024);
  const entry = REGISTRY[slot];
  if (!entry) return null;
  const render = entry[mode] || entry.code;
  const show = hydrated && wide;

  return (
    <div
      className={`relative w-full ${hero ? '' : 'lg:sticky lg:top-[calc(var(--header-h)+2rem)]'}`}
      style={{ aspectRatio: '4 / 5' }}
      data-visual={slot}
      data-mode={mode}
    >
      {show && (
        <div key={mode} className="visual-swap absolute inset-0">
          {render({ dark })}
        </div>
      )}
    </div>
  );
}

/**
 * A section split: content on the left, a slot's visual on the right from
 * lg up. Below lg the content simply takes the full width.
 */
export function Split({ visual, dark = false, children }) {
  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">{children}</div>
      <div className="hidden lg:col-span-5 lg:block">
        <Visual slot={visual} dark={dark} />
      </div>
    </div>
  );
}
