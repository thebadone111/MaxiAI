import { Link } from 'react-router-dom';
import PageMeta from '../elems/pagemeta.jsx';

function NotFound() {
  return (
    <>
      <PageMeta route="/en/404" />
      <section className="bg-cream min-h-[70vh] flex items-center">
        <div className="wrap py-32">
          <span className="eyebrow">Error · 404</span>
          <hr className="signal-rule mt-5 mb-10" />
          <h1 className="font-display font-light text-[64px] md:text-[120px] leading-[1.02] text-ink">
            Not <em className="text-signal not-italic italic">found.</em>
          </h1>
          <p className="font-prose text-[18px] md:text-[20px] text-ink-mid mt-10 max-w-[520px] leading-relaxed">
            The page you were looking for isn't here. It may have moved, or perhaps it never existed in the first place.
          </p>
          <div className="mt-12 flex gap-4 flex-wrap">
            <Link to="/en/home" className="btn-primary">
              Return home <span className="font-mono">→</span>
            </Link>
            <Link to="/en/contact-us" className="btn-ghost">
              Tell us what broke
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;
