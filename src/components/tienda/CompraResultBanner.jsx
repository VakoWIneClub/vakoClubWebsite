import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';

const CompraResultBanner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const compra = searchParams.get('compra');
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState(compra === 'exito' ? 'verificando' : null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (compra === 'exito' && sessionId) {
      fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          setStatus(data.paid ? 'pagado' : 'no-pagado');
          setResultado(data);
        })
        .catch(() => setStatus('error'));
    }
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
