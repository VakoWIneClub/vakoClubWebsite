import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// GTM's default "All Pages" trigger only covers the initial load — React Router
// changes routes via history.pushState without a real page load, so every
// navigation after the first needs its own page_view pushed manually.
// In GTM, wire a Custom Event trigger (event name "page_view") to the GA4 tag.
const AnalyticsTracker = () => {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    // GTM's "All Pages" trigger already covers whichever path loaded first,
    // so only push when the path actually changes (not on every effect re-run).
    if (previousPath.current === currentPath) return;
    const isInitialMount = previousPath.current === null;
    previousPath.current = currentPath;
    if (isInitialMount) return;

    // react-helmet updates document.title asynchronously after this effect runs,
    // so read it a beat later or the event carries the previous page's title.
    const timeoutId = setTimeout(() => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
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
