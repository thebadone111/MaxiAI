import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppRoutes from './routes.jsx';

// No stylesheet imports here on purpose — the prerendered HTML reuses the
// <link> the client build already put in index.html.
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>
  );
}
