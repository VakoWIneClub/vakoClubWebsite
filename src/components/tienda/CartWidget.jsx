import React, { useState } from 'react';
import { ShoppingBag, X, Loader2 } from 'lucide-react';
import { useCart, CART_CATALOG, formatUsd, calcularPromo3x2 } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Este widget vive en /tienda y en las 3 landings de guías. Solo El Mundo de la Copa es
// realmente trilingüe, así que es la única que pasa `lang` — el resto lo deja en 'es' (default),
// que es el único idioma real de sus guías.
const T = {
  es: {
    cartLabel: (n) => `Ver carrito (${n} ${n === 1 ? 'guía' : 'guías'})`,
    carrito: 'Carrito',
    titulo: 'Tu carrito',
    subtitulo: 'Un solo pago por todas las guías que elijas.',
    promo3x2: 'Oferta especial: llevando 3 guías, solo se cobran 2.',
    gratis: 'GRATIS',
    quitar: (nombre) => `Quitar ${nombre} del carrito`,
    total: 'Total',
    pagar: (monto) => `Pagar todo — ${monto}`,
    redirigiendo: 'Redirigiendo…',
    vaciar: 'Vaciar carrito',
    errorTitle: 'No se pudo iniciar el pago',
    errorFallback: 'Intenta de nuevo en unos minutos.',
  },
  en: {
    cartLabel: (n) => `View cart (${n} ${n === 1 ? 'guide' : 'guides'})`,
    carrito: 'Cart',
    titulo: 'Your cart',
    subtitulo: 'One single payment for every guide you pick.',
    promo3x2: 'Special offer: buy 3 guides, only pay for 2.',
    gratis: 'FREE',
    quitar: (nombre) => `Remove ${nombre} from cart`,
    total: 'Total',
    pagar: (monto) => `Pay all — ${monto}`,
    redirigiendo: 'Redirecting…',
    vaciar: 'Empty cart',
    errorTitle: "We couldn't start the payment",
    errorFallback: 'Try again in a few minutes.',
  },
  pt: {
    cartLabel: (n) => `Ver carrinho (${n} ${n === 1 ? 'guia' : 'guias'})`,
    carrito: 'Carrinho',
    titulo: 'Seu carrinho',
    subtitulo: 'Um único pagamento por todos os guias que escolher.',
    promo3x2: 'Oferta especial: levando 3 guias, você paga só 2.',
    gratis: 'GRÁTIS',
    quitar: (nombre) => `Remover ${nombre} do carrinho`,
    total: 'Total',
    pagar: (monto) => `Pagar tudo — ${monto}`,
    redirigiendo: 'Redirecionando…',
    vaciar: 'Esvaziar carrinho',
    errorTitle: 'Não foi possível iniciar o pagamento',
    errorFallback: 'Tente novamente em alguns minutos.',
  },
};

const CartWidget = ({ lang = 'es' }) => {
  const t = T[lang] || T.es;
  const { items, removeItem, clear } = useCart();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pagando, setPagando] = useState(false);

  if (items.length === 0) return null;

  const subtotalCents = items.reduce((sum, it) => sum + (CART_CATALOG[it.id]?.amountCents || 0), 0);
  // La promo 3x2 es solo de exhibición acá — lo que de verdad se cobra lo decide el servidor
  // (api/create-checkout-session.js) al crear la sesión de Stripe, con la misma regla.
  const { idsGratis, descuentoCents } = calcularPromo3x2(items);
  const totalCents = subtotalCents - descuentoCents;

  const pagarTodo = async () => {
    setPagando(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ guideId: it.id, lang: it.lang })),
          returnPath: window.location.pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || t.errorFallback);
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: t.errorTitle,
        description: error.message || t.errorFallback,
        variant: 'destructive',
      });
      setPagando(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.cartLabel(items.length)}
        className="fixed z-40 bottom-24 sm:bottom-6 right-4 sm:right-6 flex items-center gap-2 bg-copa-burgundy text-copa-cream px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-copa-ink transition-colors"
      >
        <span className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-copa-gold text-copa-ink text-[10px] font-bold flex items-center justify-center">
            {items.length}
          </span>
        </span>
        <span className="font-jost text-[11px] tracking-[0.14em] uppercase hidden sm:inline">{t.carrito}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-copa-cream border-copa-gold rounded-none text-copa-ink">
          <DialogHeader>
            <DialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
              {t.titulo}
            </DialogTitle>
            <DialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 15 }}>
              {t.subtitulo}
            </DialogDescription>
          </DialogHeader>

          {/* Se muestra siempre que haya algo en el carrito (desde 1 guía), no solo cuando la
              promo ya está activa — es un incentivo para sumar una tercera, no solo una
              confirmación de que ya se activó. */}
          <div className="bg-copa-gold/15 border border-copa-gold px-4 py-3 text-center">
            <span className="font-jost text-[12px] tracking-[0.08em] uppercase text-copa-burgundy">{t.promo3x2}</span>
          </div>

          <div className="flex flex-col divide-y divide-copa-gold/40">
            {items.map((it) => {
              const guia = CART_CATALOG[it.id];
              if (!guia) return null;
              const nombre = guia.nombre[lang] || guia.nombre.es;
              const esGratis = idsGratis.has(it.id);
              return (
                <div key={it.id} className="flex items-center justify-between gap-3 py-3">
                  <span style={{ fontSize: 16 }}>{nombre}</span>
                  <div className="flex items-center gap-4 flex-none">
                    {esGratis ? (
                      <span className="font-jost text-[13px] tracking-[0.06em]">
                        <span className="line-through text-copa-ink/40 mr-2">{formatUsd(guia.amountCents)}</span>
                        <span className="text-copa-burgundy font-medium">{t.gratis}</span>
                      </span>
                    ) : (
                      <span className="font-jost text-[13px] tracking-[0.06em]">{formatUsd(guia.amountCents)}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      aria-label={t.quitar(nombre)}
                      className="text-copa-ink/50 hover:text-copa-burgundy transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-copa-gold">
            <span className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70">{t.total}</span>
            <span className="font-cormorant flex items-baseline gap-2" style={{ fontSize: 22 }}>
              {descuentoCents > 0 && (
                <span className="line-through text-copa-ink/40" style={{ fontSize: 15 }}>{formatUsd(subtotalCents)}</span>
              )}
              {formatUsd(totalCents)}
            </span>
          </div>

          <button type="button" onClick={pagarTodo} disabled={pagando} className="copa-btn-primary w-full">
            {pagando && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
            {pagando ? t.redirigiendo : t.pagar(formatUsd(totalCents))}
          </button>
          <button
            type="button"
            onClick={clear}
            className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/50 hover:text-copa-ink transition-colors text-center"
          >
            {t.vaciar}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartWidget;
