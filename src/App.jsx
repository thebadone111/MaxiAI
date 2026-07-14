import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomeEn from './pages/en/home';
import ServicesEn from './pages/en/services';
import AIProductEn from './pages/en/ai-product';
import AboutUsEn from './pages/en/about-us';
import ContactUsEn from './pages/en/contact-us';
import NotFound from './pages/404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en/home" replace />} />
        <Route path="/en" element={<Navigate to="/en/home" replace />} />

        <Route path="/en/home" element={<HomeEn />} />
        <Route path="/en/services" element={<ServicesEn />} />
        <Route path="/en/ai-product" element={<AIProductEn />} />
        <Route path="/en/about-us" element={<AboutUsEn />} />
        <Route path="/en/contact-us" element={<ContactUsEn />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
