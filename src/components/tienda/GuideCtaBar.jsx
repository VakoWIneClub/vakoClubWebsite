import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'vako_guide_cta_dismissed';

// Wrapped in try/catch, same as ElMundoDeLaCopaLanding's readStoredLang/readGatePassed —
// private-mode / storage-disabled browsers throw on localStorage access.
const readDismissed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const GuideCtaBar = () => {
  const [dismissed, setDismissed] = useState(readDismissed);

  useEffect(() => {
    try {
      if (dismissed) {
        window.localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage unavailable — the dismiss state just won't persist across visits.
    }
  }, [dismissed]);

  if (dismissed) {
    return (
      <button
        type="button"
        onClick={() => setDismissed(false)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 border border-copa-gold bg-copa-burgundy text-copa-cream px-4 py-2.5 font-jost text-[10px] tracking-[0.14em] uppercase shadow-lg hover:bg-copa-ink transition-colors"
        aria-label="Mostrar anuncio de la guía El Mundo de la Copa"
      >
        <BookOpen className="h-4 w-4" />
        Ver guía
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-copa-gold bg-copa-creamDeep text-copa-ink shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <img
          src="/images/guias/el-mundo-de-la-copa-tapa.jpg"
          alt="Tapa de la guía El mundo de la copa"
          className="hidden sm:block h-12 w-9 object-cover border border-copa-gold/60 flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-grow min-w-0">
          <p className="font-cormorant leading-tight truncate" style={{ fontSize: 18 }}>
            El Mundo de la Copa{' '}
            <span className="text-copa-ink/60 font-jost text-[10px] tracking-[0.1em] uppercase align-middle">
              · Guía digital · USD 29.99
            </span>
          </p>
          <p className="hidden sm:block text-copa-ink/70 truncate" style={{ fontSize: 14 }}>
            Cata, servicio, etiquetas y maridaje explicados sin vueltas.
          </p>
        </div>
        <Link to="/tienda/el-mundo-de-la-copa" className="copa-btn-nav flex-shrink-0 inline-flex items-center justify-center">
          Ver guía
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center text-copa-ink/50 hover:text-copa-ink transition-colors"
          aria-label="Ocultar anuncio de la guía"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GuideCtaBar;
