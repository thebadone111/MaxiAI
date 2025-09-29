import { Link, useLocation } from 'react-router-dom';

/**
 * PrimaryButton
 * Navigates to the language-aware Contact page (e.g., /en/contact-us, /sv/contact-us).
 *
 * How it determines language:
 * - Reads the first URL segment (/en or /sv) from useLocation().
 *
 * Props:
 * - className (optional): extra classes to append to the button.
 *
 * Usage examples:
 * - <PrimaryButton />
 * - <PrimaryButton className="w-full mt-6" />
 */
function PrimaryButton({ className = '' }) {
  const { pathname } = useLocation();
  const lang = pathname.split('/').filter(Boolean)[0] || 'en';
  const contactPath = `/${lang}/contact-us`;
  const text = lang === 'sv' ? 'Skicka förfrågan nu!' : 'Start Your Project!';

  return (
    <Link to={contactPath} className={`btn-primary text-center ${className}`}>
      {text}
    </Link>
  );
}

export default PrimaryButton;