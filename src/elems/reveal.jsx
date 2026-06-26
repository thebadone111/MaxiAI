import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — wraps children in a div that fades up the first time
 * it enters the viewport. Small, dependency-free, restrained.
 *
 * Props:
 *   delay   — ms to delay the animation (for staggers)
 *   as      — element tag (default: div)
 *   variant — 'up' | 'fade' | 'rule'
 */
function Reveal({ children, delay = 0, as: Tag = 'div', variant = 'up', className = '', ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal-${variant} ${shown ? 'is-shown' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
