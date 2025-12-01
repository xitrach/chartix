import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash: React.FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      // Timeout ensures element is rendered before scrolling
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      // Scroll to top if no hash
      window.scrollTo({ top: 0 });
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
