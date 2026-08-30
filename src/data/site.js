/*
  Single source of truth for the facts that appear in more than one place.
*/

// ── Pricing ───────────────────────────────────────────────
// Round numbers on purpose. No charm pricing — £99 is the kind of small
// dishonesty the rest of the site is written against.
export const price = {
  care:       '£100',    // care plan, one-page site, per month
  careMulti:  '£200',    // care plan, multi-page site, per month
  careAnnual: '£1,000',  // care plan paid annually — two months free
  retainer:   '£750',    // retainer floor, per month
  project:    '£1,500',  // project work floor
};

// Not published. Kept here so scoping uses the same reference every time:
// £125/hour, and bands of £750 light-touch, £1,500 for roughly two days a
// month, £3,000 for an embedded fractional tech department.

export const VAT_NOTE = 'Prices exclude VAT, if and when applicable.';

// ── Contact ───────────────────────────────────────────────
export const contact = {
  email: 'info@maxiai.co.uk',
  phone: '+44 7435 322298',
  phoneHref: 'tel:+447435322298',
  address: ['Flat 2, 82 Crouch Hill', 'London N8 9ED', 'United Kingdom'],
};

// ── Markets ───────────────────────────────────────────────
export const markets = [
  {
    country: 'United Kingdom',
    short: 'UK',
    note: 'Headquarters. Financial services and advisory.',
  },
  {
    country: 'Sweden',
    short: 'SE',
    note: 'Fintech, infrastructure and retail tech. We work in Swedish.',
  },
  {
    country: 'Malta',
    short: 'MT',
    note: 'Hospitality, concierge and family office software.',
  },
  {
    country: 'Hong Kong',
    short: 'HK',
    note: 'A financial platform build and technology consultancy in the growing fintech sector.',
  },
];

export const marketsLong = markets.map((m) => m.country).join(' · ');
export const marketsShort = markets.map((m) => m.short).join(' · ');

// ── Status ────────────────────────────────────────────────
export const STATUS = 'Currently taking new engagements';
