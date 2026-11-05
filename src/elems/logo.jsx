import { MARK } from './mark-paths.js';

/**
 * The Maxi mark — the serif M crossed by two signal-red rules — as inline
 * SVG, so it inherits colour and can be animated rule by rule.
 *
 * The geometry is a reconstruction traced from public/maxi-icon.png by
 * tools/brand/trace_mark.py; public/maxi-mark.svg is the same artwork as a
 * file. If the original vector ever turns up, regenerate both.
 *
 *   tone   — 'ink' (default) or 'cream': the letter's colour. The rules are
 *            always signal red.
 *   title  — accessible name; without one the mark is decorative.
 */
export function Mark({ className = '', tone = 'ink', title, rulesClassName = '', style, ...rest }) {
  return (
    <svg
      viewBox={MARK.viewBox}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      <path d={MARK.m} fill={tone === 'cream' ? 'var(--color-cream)' : 'var(--color-ink)'} fillRule="evenodd" />
      <path d={MARK.rules} fill="var(--color-signal)" className={rulesClassName} />
    </svg>
  );
}

/**
 * The lockup, as in maxi-lockup.png: mark, a hairline, then "Maxi" set live
 * in Fraunces at its high optical size (the Didone cut the PNG uses). Live
 * text rather than the PNG, so it is crisp at every size and recolours with
 * its context.
 *
 *   size — the mark's height in px; everything else scales from it.
 */
export function Lockup({ tone = 'ink', size = 36, className = '' }) {
  const text = tone === 'cream' ? 'text-cream' : 'text-ink';
  return (
    <span
      className={`inline-flex items-center ${text} ${className}`}
      style={{ gap: size * 0.42 }}
    >
      <Mark className="w-auto shrink-0" tone={tone} style={{ height: size }} />
      <span aria-hidden="true" className="w-px self-stretch bg-current opacity-60" style={{ marginBlock: -size * 0.12 }} />
      <span
        className="font-display leading-none"
        style={{
          fontSize: size * 0.86,
          fontWeight: 400,
          fontVariationSettings: '"opsz" 144',
          letterSpacing: '-0.01em',
        }}
      >
        Maxi
      </span>
    </span>
  );
}
