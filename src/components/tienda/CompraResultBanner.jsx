import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';

const CompraResultBanner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const compra = searchParams.get('compra');
  const sessionId = searchParams.get('session_id');
  // A missing session_id (mistyped/truncated link, tracking-param stripper) must resolve to
  // the error state immediately — otherwise it stays 'verificando' forever, since the effect
  // below only runs when sessionId is present.
  const [status, setStatus] = useState(compra === 'exito' ? (sessionId ? 'verificando' : 'error') : null);
  const [resultado, setResultado] = useState(null);
  // Evita disparar el evento de compra dos veces si el efecto se reejecuta (StrictMode en dev,
  // o el usuario recarga la misma URL de éxito) — el transaction_id igual dedupea en GA4/Meta,
  // pero así no dependemos solo de eso.
  const eventoDisparado = useRef(false);

  useEffect(() => {
    let cancelado = false;
    if (compra === 'exito' && sessionId) {
      fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelado) return;
          setStatus(data.paid ? 'pagado' : 'no-pagado');
          setResultado(data);

          if (data.paid && !eventoDisparado.current) {
            eventoDisparado.current = true;
            const valorMoneda = data.currency?.toUpperCase() || 'USD';
            // Meta (y el value-based bidding de Google Ads) exigen un value numérico > 0 en el
            // evento de compra — mandarlo undefined/null en vez de omitir el evento es lo que hizo
            // que el Pixel de Meta marcara el 100% de los Purchase como "falta el valor".
            const valorValido = Number.isFinite(data.value) && data.value > 0;

            if (valorValido && typeof window.gtag === 'function') {
              window.gtag('event', 'purchase', {
                transaction_id: sessionId,
                value: data.value,
                currency: valorMoneda,
                items: [{ item_id: data.guideId, item_name: data.guideName, price: data.value, quantity: 1 }],
              });
            }

            if (valorValido && typeof window.fbq === 'function') {
              window.fbq('track', 'Purchase', { value: data.value, currency: valorMoneda }, { eventID: sessionId });
            }
          }
        })
        .catch(() => {
          if (!cancelado) setStatus('error');
        });
    }
    return () => {
      cancelado = true;
    };
  }, [compra, sessionId]);

  if (!compra) return null;

  const cerrar = () => {
    searchParams.delete('compra');
    searchParams.delete('session_id');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto pt-8 px-4"
    >
      <div className="border border-copa-gold bg-copa-creamDeep p-6 flex items-start gap-4">
        {compra === 'cancelada' && (
          <>
            <XCircle className="h-8 w-8 text-copa-ink/40 shrink-0" />
            <div>
              <h3 className="font-cormorant" style={{ fontSize: 22 }}>Compra cancelada</h3>
              <p className="text-copa-ink/70 text-sm mt-1">
                No se realizó ningún cobro. Podés intentarlo de nuevo cuando quieras.
              </p>
            </div>
          </>
        )}

        {compra === 'exito' && status === 'verificando' && (
          <>
            <Loader2 className="h-8 w-8 text-copa-gold shrink-0 animate-spin" />
            <h3 className="font-cormorant" style={{ fontSize: 22 }}>Confirmando tu pago...</h3>
          </>
        )}

        {compra === 'exito' && status === 'pagado' && (
          <>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
            <div className="space-y-3">
              <h3 className="font-cormorant" style={{ fontSize: 22 }}>
                ¡Gracias por tu compra{resultado?.guideName ? ` de "${resultado.guideName}"` : ''}!
              </h3>
              {resultado?.downloadUrl ? (
                <a href={resultado.downloadUrl} download className="copa-btn-nav inline-flex items-center">
                  <Download className="mr-2 h-4 w-4" /> Descargar guía
                </a>
              ) : (
                <p className="text-copa-ink/70 text-sm">
                  Tu pago se confirmó. Estamos preparando el enlace de descarga — si no lo recibís
                  en breve, escribinos a info@vakoclub.com con tu comprobante y te la mandamos al toque.
                </p>
              )}
            </div>
          </>
        )}

        {compra === 'exito' && (status === 'no-pagado' || status === 'error') && (
          <>
            <XCircle className="h-8 w-8 text-red-600 shrink-0" />
            <div>
              <h3 className="font-cormorant" style={{ fontSize: 22 }}>No pudimos confirmar el pago</h3>
              <p className="text-copa-ink/70 text-sm mt-1">
                Si te realizaron un cobro, escribinos a info@vakoclub.com y lo resolvemos.
              </p>
            </div>
          </>
        )}

        <button
          onClick={cerrar}
          className="ml-auto font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/50 hover:text-copa-ink transition-colors shrink-0"
        >
          Cerrar
        </button>
      </div>
    </motion.div>
  );
};

export default CompraResultBanner;
