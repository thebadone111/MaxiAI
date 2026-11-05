import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './elems/layout.jsx';

import HomeEn from './pages/en/home';
import ServicesEn from './pages/en/services';
import ProgrammeEn from './pages/en/programme';
import AIProductEn from './pages/en/ai-product';
import AboutUsEn from './pages/en/about-us';
import ContactUsEn from './pages/en/contact-us';
import PrivacyEn from './pages/en/privacy';
import TosEn from './pages/en/tos';
import NotFound from './pages/404';

/**
 * Route table, shared by the browser entry and the prerenderer.
 * Every page renders inside <Layout> (header, main, footer, intro, curtain,
 * command palette), so the smooth-scroll engine survives navigation.
 *
 * Adding a route means editing this file, src/data/meta.js (title +
 * description, and the prerender list) and public/_redirects.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/home" replace />} />
      <Route path="/en" element={<Navigate to="/en/home" replace />} />

      <Route element={<Layout />}>
        <Route path="/en/home" element={<HomeEn />} />
        <Route path="/en/services" element={<ServicesEn />} />
        <Route path="/en/programme" element={<ProgrammeEn />} />
        <Route path="/en/ai-product" element={<AIProductEn />} />
        <Route path="/en/about-us" element={<AboutUsEn />} />
        <Route path="/en/contact-us" element={<ContactUsEn />} />

        {/* Legal */}
        <Route path="/en/privacy" element={<PrivacyEn />} />
        <Route path="/en/tos" element={<TosEn />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Unprefixed aliases */}
      <Route path="/home" element={<Navigate to="/en/home" replace />} />
      <Route path="/services" element={<Navigate to="/en/services" replace />} />
      <Route path="/programme" element={<Navigate to="/en/programme" replace />} />
      <Route path="/ai-product" element={<Navigate to="/en/ai-product" replace />} />
      <Route path="/about-us" element={<Navigate to="/en/about-us" replace />} />
      <Route path="/about" element={<Navigate to="/en/about-us" replace />} />
      <Route path="/contact-us" element={<Navigate to="/en/contact-us" replace />} />
      <Route path="/contact" element={<Navigate to="/en/contact-us" replace />} />
      <Route path="/privacy" element={<Navigate to="/en/privacy" replace />} />
      <Route path="/privacy-policy" element={<Navigate to="/en/privacy" replace />} />
      <Route path="/tos" element={<Navigate to="/en/tos" replace />} />
      <Route path="/terms" element={<Navigate to="/en/tos" replace />} />
    </Routes>
  );
}

export default AppRoutes;
