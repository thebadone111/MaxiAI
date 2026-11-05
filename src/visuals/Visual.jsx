import { useHydrated, useMinWidth } from '../motion/hooks.js';
import { FanOut, LiveSystem, MarketMap, Topology, Uptime } from './code.jsx';

/*
 * The visuals registry: pages name a slot, and the slot renders its
 * procedural panel (src/visuals/code.jsx). Every slot shares a 4:5 frame.
 */
const REGISTRY = {
  homeHero: () => <LiveSystem />,
  services: (p) => <Topology {...p} />,
  about: (p) => <MarketMap {...p} />,
  aiProduct: (p) => <FanOut {...p} />,
  programme: (p) => <Uptime {...p} />,
};

/**
 * A slot's frame, always rendered (so the prerendered layout already has
 * the space), with its panel mounted only on wide screens after hydration.
 * Below lg the panels are decorative extras and are not rendered at all.
 */
export default function Visual({ slot, dark = false, hero = false }) {
  const hydrated = useHydrated();
  const wide = useMinWidth(1024);
  const render = REGISTRY[slot];
  if (!render) return null;
  const show = hydrated && wide;

  return (
    <div
      className={`relative w-full ${hero ? '' : 'lg:sticky lg:top-[calc(var(--header-h)+2rem)]'}`}
      style={{ aspectRatio: '4 / 5' }}
      data-visual={slot}
    >
      {show && (
        <div className="visual-swap absolute inset-0">
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
