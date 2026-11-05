import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { contact, price } from '../data/site.js';
import { lockScroll } from '../motion/smooth.js';
import { KEY as INTRO_KEY } from '../intro/state.js';

/*
 * The command palette — Ctrl/⌘ K, or "/", from anywhere.
 *
 * A software studio's site should be operable the way its visitors' tools
 * are. Everything a visitor might come for is one keystroke and a few
 * letters away: any page or section, the prices, the email address (copied),
 * the phone number. It is a dialog with a focus trap, fully usable by
 * keyboard, and nothing on the site depends on it.
 */

const EVENT = 'maxi:command';
export const openCommandPalette = () => window.dispatchEvent(new Event(EVENT));

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const useShortcutLabel = () =>
  useSyncExternalStore(() => () => {}, () => (isMac() ? '⌘ K' : 'Ctrl K'), () => 'Ctrl K');

function useCommands(close) {
  const navigate = useNavigate();
  const go = useCallback((to) => () => { close(); navigate(to); }, [close, navigate]);

  return useMemo(() => [
    { group: 'Navigate', label: 'Home', hint: '/', run: go('/en/home') },
    { group: 'Navigate', label: 'Services', hint: 'Tier 01', run: go('/en/services') },
    { group: 'Navigate', label: 'Pricing', hint: `care ${price.care}/mo · retainer ${price.retainer}/mo`, run: go('/en/services#pricing'), keywords: 'price cost charge rates money' },
    { group: 'Navigate', label: 'How we work', hint: 'Services', run: go('/en/services#how-we-work'), keywords: 'process' },
    { group: 'Navigate', label: 'Rebuild my homepage', hint: 'Step zero', run: go('/en/services#rebuild'), keywords: 'free website demo' },
    { group: 'Navigate', label: 'AI Product', hint: 'Tier 02', run: go('/en/ai-product'), keywords: 'creators software' },
    { group: 'Navigate', label: 'The Studio Programme', hint: '£0 build', run: go('/en/programme'), keywords: 'free website local business' },
    { group: 'Navigate', label: 'Apply for the programme', hint: 'Ten places', run: go('/en/programme#apply') },
    { group: 'Navigate', label: 'About', hint: 'London · 2024', run: go('/en/about-us'), keywords: 'founders team' },
    { group: 'Navigate', label: 'Contact', hint: 'One working day', run: go('/en/contact-us'), keywords: 'talk message form' },
    { group: 'Navigate', label: 'Privacy notice', hint: 'Legal', run: go('/en/privacy') },
    { group: 'Navigate', label: 'Terms of service', hint: 'Legal', run: go('/en/tos') },

    {
      group: 'Do', label: 'Copy email address', hint: contact.email, keywords: 'mail',
      run: async (done) => {
        try { await navigator.clipboard.writeText(contact.email); done('Copied'); }
        catch { window.location.href = `mailto:${contact.email}`; }
      },
    },
    { group: 'Do', label: 'Write to us', hint: 'Opens your mail app', run: () => { window.location.href = `mailto:${contact.email}`; }, keywords: 'email' },
    { group: 'Do', label: 'Call us', hint: contact.phone, run: () => { window.location.href = contact.phoneHref; }, keywords: 'phone ring' },

    {
      group: 'Preferences', label: 'Replay the intro', hint: 'Reloads the page', keywords: 'animation',
      run: () => {
        try { sessionStorage.removeItem(INTRO_KEY); } catch { /* ignore */ }
        window.location.reload();
      },
    },
  ], [go]);
}

function match(cmd, q) {
  if (!q) return true;
  const hay = `${cmd.label} ${cmd.hint} ${cmd.keywords || ''} ${cmd.group}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function Palette({ onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState(null);
  const input = useRef(null);
  const list = useRef(null);
  const commands = useCommands(onClose);
  const shown = commands.filter((c) => match(c, q));

  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => { setActive(0); }, [q]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (c) => {
    if (!c) return;
    c.run((msg) => {
      setFlash({ label: c.label, msg });
      setTimeout(onClose, 650);
    });
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(shown.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(shown[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'Tab') { e.preventDefault(); } // focus stays in the field
  };

  let lastGroup = null;
  return (
    <div className="cmd fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]" onMouseDown={onClose}>
      <div className="cmd-scrim absolute inset-0 bg-ink/55 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="cmd-panel relative w-full max-w-[640px] overflow-hidden rounded-[4px] border border-ink/10 bg-cream shadow-[0_30px_80px_-20px_rgb(28_26_46/0.5)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-stone px-5">
          <span className="font-mono text-[15px] text-signal" aria-hidden="true">›</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Go to a page, find the prices, copy our email…"
            className="h-14 w-full bg-transparent font-ui text-[16px] text-ink placeholder:text-ink-mid/70 focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={shown[active] ? `cmd-${active}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="hidden rounded-[3px] border border-stone px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-mid sm:block">ESC</kbd>
        </div>

        <ul id="cmd-list" ref={list} role="listbox" className="max-h-[min(56vh,440px)] overflow-y-auto py-2" data-lenis-prevent>
          {shown.length === 0 && (
            <li className="px-5 py-8 text-center font-mono text-[12px] tracking-wide text-ink-mid">
              Nothing matches — try “pricing” or “email”.
            </li>
          )}
          {shown.map((c, i) => {
            const head = c.group !== lastGroup;
            lastGroup = c.group;
            const done = flash?.label === c.label;
            return (
              <li key={c.label} role="presentation">
                {head && (
                  <p className="px-5 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mid">{c.group}</p>
                )}
                <div
                  id={`cmd-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                  className={`mx-2 flex cursor-pointer items-center justify-between gap-6 rounded-[3px] px-3 py-2.5 ${
                    i === active ? 'bg-ink text-cream' : 'text-ink'
                  }`}
                >
                  <span className="font-ui text-[15px] font-normal">{c.label}</span>
                  <span className={`truncate font-mono text-[11px] tracking-wide ${i === active ? 'text-cream/70' : 'text-ink-mid'}`}>
                    {done ? <span className="text-signal">{flash.msg} ✓</span> : c.hint}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-stone px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mid">
          <span>↑↓ to move · ↵ to open</span>
          <span>Maxi AI Development</span>
        </div>
      </div>
    </div>
  );
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const returnTo = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const show = () => {
      returnTo.current = document.activeElement;
      setOpen(true);
    };
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setOpen((o) => {
          if (!o) returnTo.current = document.activeElement;
          return !o;
        });
      } else if (k === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener(EVENT, show);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(EVENT, show);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    lockScroll('palette', open);
    if (!open && returnTo.current) {
      returnTo.current.focus?.({ preventScroll: true });
      returnTo.current = null;
    }
  }, [open]);
  useEffect(() => () => lockScroll('palette', false), []);

  return open ? <Palette onClose={close} /> : null;
}
