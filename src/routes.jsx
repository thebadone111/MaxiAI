import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToHash from './elems/scroll.jsx';

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
 * The unprefixed aliases exist because inbound links and older
 * search results point at /services rather than /en/services.
 */
function AppRoutes() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Navigate to="/en/home" replace />} />
        <Route path="/en" element={<Navigate to="/en/home" replace />} />

        <Route path="/en/home" element={<HomeEn />} />
        <Route path="/en/services" element={<ServicesEn />} />
        <Route path="/en/programme" element={<ProgrammeEn />} />
        <Route path="/en/ai-product" element={<AIProductEn />} />
        <Route path="/en/about-us" element={<AboutUsEn />} />
        <Route path="/en/contact-us" element={<ContactUsEn />} />

        {/* Legal */}
        <Route path="/en/privacy" element={<PrivacyEn />} />
        <Route path="/en/tos" element={<TosEn />} />

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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
