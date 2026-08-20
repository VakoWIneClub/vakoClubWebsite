import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// gtag('config', ...) in index.html only sends a page_view for the initial
// load — React Router changes routes via history.pushState without a real
// page load, so every navigation after the first needs its own manual event.
const AnalyticsTracker = () => {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (previousPath.current === currentPath) return;
    const isInitialMount = previousPath.current === null;
    previousPath.current = currentPath;
    if (isInitialMount) return;

    // react-helmet updates document.title asynchronously after this effect runs,
    // so read it a beat later or the event carries the previous page's title.
    const timeoutId = setTimeout(() => {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', 'page_view', {
        page_path: currentPath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
