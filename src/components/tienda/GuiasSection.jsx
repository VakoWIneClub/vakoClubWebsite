import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wine, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Reveal from '@/components/copa/Reveal';
import NotifyGuideDialog from '@/components/tienda/NotifyGuideDialog';

// Guías con su propia landing de venta dedicada — el título y la imagen llevan ahí
// en vez de ir directo al checkout.
const LANDING_PATH = { 'guia-general': '/tienda/el-mundo-de-la-copa' };

const guias = [
  {
    id: 'guia-general',
    nombre: 'El Mundo de la Copa',
    subtitulo: 'Guía del entusiasta · Edición 2026 · Vol. I',
    descripcion:
      'Uvas, regiones y maridajes para entender qué estás bebiendo. 82 páginas: de los cinco componentes del vino a un recorrido completo por Francia, Italia, España, Argentina, Chile, Estados Unidos, Australia y más.',
    estado: 'disponible',
    etiqueta: 'Guía General',
    precio: 29.99,
    image: '/images/guias/el-mundo-de-la-copa-tapa.jpg',
  },
  {
    id: 'guia-espanol',
    nombre: 'Guía del Vino Español',
    subtitulo: 'Primera entrega · Colección Regional',
    descripcion:
      'Crianza, Reserva y Gran Reserva explicados de una vez. Rioja, Ribera del Duero, Rías Baixas, Jerez y las uvas que hacen único al vino español.',
    estado: 'proximamente',
    etiqueta: 'Colección Regional · 1/3',
    precio: 12,
    precioRegular: 19,
  },
  {
    id: 'guia-argentino',
    nombre: 'Guía del Vino Argentino',
    subtitulo: 'Segunda entrega · Colección Regional',
    descripcion:
      'Más allá del Malbec: Bonarda, Torrontés y por qué la altura del viñedo cambia lo que hay en tu copa. Mendoza, Salta y Patagonia explicadas de una vez.',
    estado: 'proximamente',
    etiqueta: 'Colección Regional · 2/3',
    precio: 12,
    precioRegular: 19,
  },
  {
    id: 'guia-frances',
    nombre: 'Guía del Vino Francés',
    subtitulo: 'Tercera entrega · Colección Regional',
    descripcion:
      'El traductor definitivo de qué uva se esconde detrás de cada región: Burdeos vs. Borgoña, Champagne y el resto del mapa francés, sin intimidación.',
    estado: 'proximamente',
    etiqueta: 'Colección Regional · 3/3',
    precio: 12,
    precioRegular: 19,
  },
];

const GuiaCard = ({ guia, index, onComprar, onAvisame, comprando }) => {
  const disponible = guia.estado === 'disponible';
  const procesando = comprando === guia.id;
  const landingPath = LANDING_PATH[guia.id];
  return (
    <Reveal delay={Math.min(index * 0.08, 0.24)} className="copa-card flex flex-col h-full">
      <div className="relative h-56 bg-copa-creamDeep flex items-center justify-center overflow-hidden">
        <div className="absolute top-4 inset-x-4 flex flex-wrap items-start justify-between gap-2">
          <span className="font-jost text-[10px] tracking-[0.14em] uppercase bg-copa-burgundy text-copa-cream px-3 py-1">
            {guia.etiqueta}
          </span>
          {!disponible && (
            <span className="font-jost text-[10px] tracking-[0.14em] uppercase border border-copa-gold bg-copa-cream/90 text-copa-ink px-3 py-1">
              Próximamente
            </span>
          )}
        </div>
        {guia.image ? (
          landingPath ? (
            <Link to={landingPath} aria-label={guia.nombre} className="block w-full h-full">
              <img src={guia.image} alt={guia.nombre} className="object-cover w-full h-full" />
            </Link>
          ) : (
            <img src={guia.image} alt={guia.nombre} className="object-cover w-full h-full" />
          )
        ) : disponible ? (
          <BookOpen className="h-12 w-12 text-copa-gold" />
        ) : (
          <Wine className="h-12 w-12 text-copa-gold" />
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between gap-5">
        <div>
          <h3 className="font-cormorant" style={{ fontSize: 24 }}>
            {landingPath ? (
              <Link to={landingPath} className="hover:text-copa-burgundy transition-colors">
                {guia.nombre}
              </Link>
            ) : (
              guia.nombre
            )}
          </h3>
          <p className="font-jost text-[11px] tracking-[0.1em] uppercase text-copa-gold mt-1">{guia.subtitulo}</p>
          <p className="text-copa-ink/70 text-sm mt-3" style={{ lineHeight: 1.6 }}>
            {guia.descripcion}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            {guia.precio ? (
              <div className="flex items-baseline gap-2">
                <span className="font-cormorant text-copa-burgundy" style={{ fontSize: 28 }}>
                  ${guia.precio}
                </span>
                {guia.precioRegular && <span className="text-copa-ink/40 line-through text-sm">${guia.precioRegular}</span>}
              </div>
            ) : (
              <span className="text-copa-ink/60 text-sm italic">{guia.precioNota}</span>
            )}
            {guia.precioRegular && (
              <p className="font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50 mt-1">Precio Fundador</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => (disponible ? onComprar(guia.id) : onAvisame(guia.nombre))}
            disabled={procesando}
            className="copa-btn-nav inline-flex items-center"
          >
            {procesando && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {procesando ? 'Redirigiendo…' : disponible ? 'Quiero esta guía' : 'Avísame'}
          </button>
        </div>
      </div>
    </Reveal>
  );
};

const GuiasSection = () => {
  const { toast } = useToast();
  const [dialogState, setDialogState] = useState({ open: false, guideName: '' });
  const [comprando, setComprando] = useState(null);

  const handleAvisame = (guideName) => {
    setDialogState({ open: true, guideName });
  };

  const handleComprar = async (guideId) => {
    setComprando(guideId);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId, returnPath: '/tienda' }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'No se pudo iniciar el pago.');
      }
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: 'No se pudo iniciar el pago',
        description: error.message || 'Intenta de nuevo en unos minutos.',
        variant: 'destructive',
      });
      setComprando(null);
    }
  };

  return (
    <div className="py-20 sm:py-28">
      <Reveal className="copa-eyebrow text-center">Guías en PDF</Reveal>
      <Reveal delay={0.05}>
        <h2
          className="font-cormorant font-light leading-[1.05] mt-4 mx-auto max-w-2xl text-center"
          style={{ fontSize: 'clamp(28px,4vw,44px)' }}
        >
          Aprendé de vino a tu ritmo
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-copa-ink/70 max-w-2xl mx-auto mt-5 text-center" style={{ fontSize: 18, lineHeight: 1.6 }}>
          Sin tecnicismos. Descarga inmediata, para leer en el móvil o imprimir.
        </p>
      </Reveal>
      <Reveal
        delay={0.15}
        className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60"
      >
        <span>Descarga inmediata en PDF</span>
        <span className="hidden sm:inline text-copa-gold">·</span>
        <span>Escrito en la voz cercana de Vako Club</span>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {guias.map((guia, index) => (
          <GuiaCard
            key={guia.id}
            guia={guia}
            index={index}
            onComprar={handleComprar}
            onAvisame={handleAvisame}
            comprando={comprando}
          />
        ))}
      </div>

      <NotifyGuideDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
        guideName={dialogState.guideName}
      />
    </div>
  );
};

export default GuiasSection;
