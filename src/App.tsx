import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Pay from './pages/Pay';
import Layout from './components/Layout';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="pay" element={<Pay />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
