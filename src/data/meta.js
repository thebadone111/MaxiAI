/*
  Per-route <title> and meta description.
  Consumed twice: by <PageMeta> for client-side navigation, and by
  prerender.js, which bakes them into each generated HTML file so
  crawlers that don't run JavaScript still see them.
*/

export const routeMeta = {
  '/en/home': {
    title: 'Maxi AI Development — Software, security and IT infrastructure for growing businesses',
    description:
      'A small London studio providing websites, cybersecurity, IT infrastructure and bespoke software to businesses in the UK, Sweden, Malta and Hong Kong. One dedicated engineer per client.',
  },
  '/en/services': {
    title: 'Outsourced IT support, security and web development for small businesses — London',
    description:
      'Websites and hosting, Cyber Essentials and security, Microsoft 365 and IT infrastructure, and bespoke software — from one dedicated engineer. London, working across the UK, Sweden, Malta and Hong Kong.',
  },
  '/en/programme': {
    title: 'A free website for your business — The Studio Programme by Maxi AI Development',
    description:
      'We build local businesses a landing page and register the domain, at no cost. You cover the care plan at £100 a month. Ten places a year, London and Stockholm.',
  },
  '/en/ai-product': {
    title: 'Custom software for creator businesses — Maxi AI Development',
    description:
      'Bespoke publishing tools, unified dashboards and operational infrastructure for creators who have outgrown off-the-shelf software. Built to own, not rent.',
  },
  '/en/about-us': {
    title: 'About Maxi AI Development — a small London software and IT studio',
    description:
      'Incorporated in London in 2024 by two founders. We do consultancy that pays the bills and product work that is building into the company’s second act.',
  },
  '/en/contact-us': {
    title: 'Contact Maxi AI Development — London',
    description:
      'Tell us what you’re working on. A short conversation, a written proposal, and an honest answer about whether we’re a fit.',
  },
  '/en/privacy': {
    title: 'Privacy Notice — Maxi AI Development',
    description:
      'What personal data we hold, why we are allowed to hold it, how long we keep it, and how to make us stop. Includes how we handle publicly available business contact information when prospecting in the UK. ICO registration ZB907965.',
  },
  '/en/tos': {
    title: 'Terms of Service — Maxi AI Development',
    description:
      'The terms on which you may use maxiai.co.uk: permitted use, intellectual property, enquiries, the status of published prices, liability and governing law. Client engagements are governed separately.',
  },
  '/en/404': {
    title: 'Not found — Maxi AI Development',
    description: 'The page you were looking for isn’t here.',
  },
};

// Routes prerendered at build time.
export const prerenderRoutes = Object.keys(routeMeta);
