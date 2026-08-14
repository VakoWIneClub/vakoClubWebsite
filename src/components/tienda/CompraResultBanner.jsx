import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="wine-card rounded-2xl p-6 flex items-start gap-4">
        {compra === 'cancelada' && (
          <>
            <XCircle className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-playfair text-xl text-amber-200">Compra cancelada</h3>
              <p className="text-amber-100/70 text-sm mt-1">
                No se realizó ningún cobro. Podés intentarlo de nuevo cuando quieras.
              </p>
            </div>
          </>
        )}

        {compra === 'exito' && status === 'verificando' && (
          <>
            <Loader2 className="h-8 w-8 text-amber-400 shrink-0 animate-spin" />
            <h3 className="font-playfair text-xl text-amber-200">Confirmando tu pago...</h3>
          </>
        )}

        {compra === 'exito' && status === 'pagado' && (
          <>
            <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
            <div className="space-y-3">
              <h3 className="font-playfair text-xl text-amber-200">
                ¡Gracias por tu compra{resultado?.guideName ? ` de "${resultado.guideName}"` : ''}!
              </h3>
              {resultado?.downloadUrl ? (
                <a href={resultado.downloadUrl} download>
                  <Button className="wine-gradient text-stone-900 font-semibold hover:opacity-90">
                    <Download className="mr-2 h-4 w-4" /> Descargar guía
                  </Button>
                </a>
              ) : (
                <p className="text-amber-100/70 text-sm">
                  Tu pago se confirmó. Estamos preparando el enlace de descarga — si no lo recibís
                  en breve, escribinos a info@vakoclub.com con tu comprobante y te la mandamos al toque.
                </p>
              )}
            </div>
          </>
        )}

        {compra === 'exito' && (status === 'no-pagado' || status === 'error') && (
          <>
            <XCircle className="h-8 w-8 text-red-400 shrink-0" />
            <div>
              <h3 className="font-playfair text-xl text-amber-200">No pudimos confirmar el pago</h3>
              <p className="text-amber-100/70 text-sm mt-1">
                Si te realizaron un cobro, escribinos a info@vakoclub.com y lo resolvemos.
              </p>
            </div>
          </>
        )}

        <button
          onClick={cerrar}
          className="ml-auto text-amber-100/50 hover:text-amber-100 text-sm shrink-0"
        >
          Cerrar
        </button>
      </div>
    </motion.div>
  );
};

export default CompraResultBanner;
