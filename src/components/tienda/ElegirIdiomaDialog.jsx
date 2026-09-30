import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CART_CATALOG, IDIOMAS, NOMBRE_IDIOMA, idiomasDeGuia } from '@/contexts/CartContext';

// Selector de idioma que se abre al agregar cualquier guía al carrito (botón de cada landing y
// checklist del CartWidget): el visitante elige la edición y recién ahí se agrega. Se muestran
// siempre los tres idiomas — los que todavía no tienen edición aparecen deshabilitados con
// "Próximamente", para que quien llega desde Brasil vea de entrada que esa guía no está en
// portugués en vez de enterarse después de pagar. Qué idiomas existen de cada guía sale de
// CART_CATALOG[id].idiomas (src/contexts/CartContext.jsx).
const T = {
  es: { titulo: '¿En qué idioma querés la guía?', pronto: 'Próximamente', actual: 'En tu carrito' },
  en: { titulo: 'Which language do you want the guide in?', pronto: 'Coming soon', actual: 'In your cart' },
  pt: { titulo: 'Em qual idioma você quer o guia?', pronto: 'Em breve', actual: 'No seu carrinho' },
};

const ElegirIdiomaDialog = ({ guideId, open, onOpenChange, onElegir, uiLang = 'es', idiomaActual = null }) => {
  const t = T[uiLang] || T.es;
  const guia = CART_CATALOG[guideId];
  const disponibles = idiomasDeGuia(guideId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-copa-cream border-copa-gold rounded-none text-copa-ink max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            {t.titulo}
          </DialogTitle>
          <DialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 15 }}>
            {guia ? guia.nombre[uiLang] || guia.nombre.es : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {IDIOMAS.map((code) => {
            const disponible = disponibles.includes(code);
            const esActual = idiomaActual === code;
            return (
              <button
                key={code}
                type="button"
                disabled={!disponible}
                onClick={() => onElegir(code)}
                className={`flex items-center justify-between border px-4 py-3 text-left transition-colors ${
                  disponible
                    ? 'border-copa-gold hover:bg-copa-burgundy hover:text-copa-cream'
                    : 'border-copa-ink/15 text-copa-ink/40 cursor-not-allowed'
                } ${esActual ? 'bg-copa-gold/15' : ''}`}
              >
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 19 }}>{NOMBRE_IDIOMA[code]}</span>
                {!disponible ? (
                  <span className="font-jost text-[10px] tracking-[0.14em] uppercase">{t.pronto}</span>
                ) : esActual ? (
                  <span className="font-jost text-[10px] tracking-[0.14em] uppercase">{t.actual}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElegirIdiomaDialog;
