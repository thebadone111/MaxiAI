import { Link } from 'react-router-dom';

/**
 * Actions — the CTA pair used across the site.
 *
 * Every call to action gets two doors: a committing one (the button) and a
 * lower-commitment one beside it, for the visitor who isn't ready to talk to
 * a stranger yet.
 *
 * primary   — { to, label }
 * secondary — { to | href, label }
 */
function Actions({ primary, secondary, dark = false, className = '' }) {
  if (!primary && !secondary) return null;

  const btnClass = dark ? 'btn-ghost' : 'btn-primary';
  const secondaryClass = `font-prose italic text-[17px] underline underline-offset-4 decoration-1 transition-colors ${
    dark ? 'text-cream/80 hover:text-signal' : 'text-ink-mid hover:text-signal'
  }`;

  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-4 ${className}`}>
      {primary && (
        <Link
          to={primary.to}
          className={btnClass}
          style={dark ? { borderColor: 'var(--color-cream)', color: 'var(--color-cream)' } : undefined}
        >
          {primary.label}
          <span style={{ fontFamily: 'DM Mono, monospace' }}>→</span>
        </Link>
      )}

      {primary && secondary && (
        <span className={`font-mono text-[13px] ${dark ? 'text-cream/40' : 'text-ink-mid'}`}>·</span>
      )}

      {secondary &&
        (secondary.href ? (
          <a href={secondary.href} className={secondaryClass}>
            {secondary.label}
          </a>
        ) : (
          <Link to={secondary.to} className={secondaryClass}>
            {secondary.label}
          </Link>
        ))}
    </div>
  );
}

export default Actions;
