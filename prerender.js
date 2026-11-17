/*
  Post-build prerender.

  Renders each route to static HTML at build time and writes it alongside
  the client bundle, so every page is a real document with a real title,
  description, canonical URL, link-preview tags and structured data. The
  client bundle then hydrates it.

  Also writes sitemap.xml and robots.txt from the same route table, so a new
  page cannot be added to the site and forgotten in the sitemap.

  Run by `npm run build` after the client and SSR builds.
*/
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

const { render } = await import('./dist-ssr/entry-server.js');
const { routeMeta, prerenderRoutes, ORIGIN } = await import('./src/data/meta.js');
const { contact, markets } = await import('./src/data/site.js');
const { legalEntity } = await import('./src/data/legal.js');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Structured data: who the company is, on every page. Facts come from the
   same data files the pages render, so they cannot drift apart. */
const organisation = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${ORIGIN}/#organisation`,
  name: legalEntity.name,
  alternateName: 'Maxi AI',
  url: `${ORIGIN}/en/home`,
  logo: `${ORIGIN}/favicon-512.png`,
  image: `${ORIGIN}/og.png`,
  email: contact.email,
  telephone: contact.phone,
  foundingDate: '2024',
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address[0],
    addressLocality: 'London',
    postalCode: 'N8 9ED',
    addressCountry: 'GB',
  },
  areaServed: markets.map((m) => m.country),
  identifier: { '@type': 'PropertyValue', propertyID: 'Companies House', value: legalEntity.companyNo },
  knowsAbout: [
    'Website development and hosting',
    'Cybersecurity',
    'IT infrastructure',
    'Bespoke software',
    'AI integration for business',
  ],
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${ORIGIN}/#website`,
  url: ORIGIN,
  name: 'Maxi AI Development',
  publisher: { '@id': `${ORIGIN}/#organisation` },
  inLanguage: 'en-GB',
};

const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

function head(route, meta) {
  const canonical = `${ORIGIN}${route}`;
  const indexable = route !== '/en/404';
  const tags = [
    indexable && `<link rel="canonical" href="${canonical}" />`,
    !indexable && `<meta name="robots" content="noindex" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Maxi AI Development" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    indexable && `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${ORIGIN}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Maxi AI Development — software, security and your company's own AI brain." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${ORIGIN}/og.png" />`,
    jsonLd(organisation),
    route === '/en/home' && jsonLd(website),
  ];
  return tags.filter(Boolean).join('\n    ');
}

function buildPage(route) {
  const meta = routeMeta[route];
  const appHtml = render(route);

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escape(meta.description)}" />`
    )
    .replace('</head>', `    ${head(route, meta)}\n  </head>`)
    // email_off: Cloudflare's email obfuscation rewrites mailto links in the
    // HTML it serves, which would no longer match what React hydrates.
    .replace(
      '<div id="root"></div>',
      `<!--email_off--><div id="root">${appHtml}</div><!--/email_off-->`
    );
}

let count = 0;
for (const route of prerenderRoutes) {
  const html = buildPage(route);

  /*
    /en/home is written as dist/en/home.html, not dist/en/home/index.html.
    Cloudflare Pages serves the former at /en/home — the URL every link on
    the site uses — whereas the latter costs a 308 to /en/home/ on every
    request. /en/404 becomes dist/404.html, which Pages serves for any
    unmatched path with a real 404 status.
  */
  const outFile =
    route === '/en/404' ? path.join(dist, '404.html') : path.join(dist, `${route}.html`);

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  count += 1;
  console.log(`  prerendered  ${route}`);
}

// ── sitemap.xml + robots.txt ─────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const priority = { '/en/home': '1.0', '/en/services': '0.9', '/en/ai-brain': '0.9' };
const urls = prerenderRoutes
  .filter((r) => r !== '/en/404')
  .map(
    (r) =>
      `  <url>\n    <loc>${ORIGIN}${r}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${
        priority[r] ?? (r.startsWith('/en/privacy') || r.startsWith('/en/tos') ? '0.3' : '0.7')
      }</priority>\n  </url>`
  )
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
);

console.log(`\n${count} routes prerendered into dist/, plus sitemap.xml and robots.txt\n`);
