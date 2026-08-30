/*
  Post-build prerender.

  The site is a client-rendered SPA, which means a crawler fetching a plain
  document got an empty <div id="root"> and nothing else. This renders each
  route to static HTML at build time and writes it alongside the client
  bundle, so every page is a real document with a real title. The client
  bundle then hydrates it.

  Run by `npm run build` after the client and SSR builds.
*/
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');

const { render } = await import('./dist-ssr/entry-server.js');
const { routeMeta, prerenderRoutes } = await import('./src/data/meta.js');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildPage(route) {
  const meta = routeMeta[route];
  const appHtml = render(route);

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${escape(meta.description)}" />`
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
}

let count = 0;
for (const route of prerenderRoutes) {
  const html = buildPage(route);

  // /en/404 becomes dist/404.html — Cloudflare Pages serves that for
  // unmatched paths, with a real 404 status rather than a soft one.
  const outFile =
    route === '/en/404'
      ? path.join(dist, '404.html')
      : path.join(dist, route, 'index.html');

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  count += 1;
  console.log(`  prerendered  ${route}`);
}

console.log(`\n${count} routes prerendered into dist/\n`);
