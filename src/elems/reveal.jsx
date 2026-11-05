import { useReveal } from '../motion/hooks.js';

/**
 * Reveal — reveals its element the first time it scrolls into view.
 *
 * Same API as before, now driven by the shared observer in
 * src/motion/hooks.js and the CSS in index.css:
 *
 *   variant — 'up' (rise) | 'fade' | 'rule' (the signal rule draws in)
 *   delay   — ms, for staggers; becomes the --d custom property
 *   as      — element tag (default div)
 *   wide    — rule only: the 200px rule
 */
const CLASS = {
  up: 'rise',
  fade: 'fade',
  rule: 'signal-rule hairline-draw',
};

function Reveal({ children, delay = 0, as = 'div', variant = 'up', wide = false, className = '', style, ...rest }) {
  const ref = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`${CLASS[variant] ?? CLASS.up}${wide ? ' wide' : ''} ${className}`}
      style={delay ? { '--d': `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
