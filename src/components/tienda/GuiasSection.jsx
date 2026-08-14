import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Wine, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NotifyGuideDialog from '@/components/tienda/NotifyGuideDialog';

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
    // image path — place the provided cover image at public/images/guias/el-mundo-en-una-copa.png
    image: '/images/guias/el-mundo-en-una-copa.png',
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="wine-card rounded-2xl overflow-hidden wine-hover relative flex flex-col"
    >
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-amber-500 text-amber-900 rounded-full text-xs font-bold">
          {guia.etiqueta}
        </span>
      </div>
      {!disponible && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-stone-800/80 border border-amber-500/30 text-amber-200 rounded-full text-xs font-bold">
            Próximamente
          </span>
        </div>
      )}

      <div className="relative h-56 bg-gradient-to-br from-amber-900/30 to-red-900/30 flex items-center justify-center overflow-hidden">
        {guia.image ? (
          <img src={guia.image} alt={guia.nombre} className="object-cover w-full h-full" />
        ) : (
          <div className="p-6 wine-gradient rounded-full wine-shadow">
            {disponible ? (
              <BookOpen className="h-12 w-12 text-stone-900" />
            ) : (
              <Wine className="h-12 w-12 text-stone-900" />
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-playfair text-xl font-semibold text-amber-200">
            {guia.nombre}
          </h3>
          <p className="text-amber-300/80 text-sm">{guia.subtitulo}</p>
        </div>

        <p className="text-amber-100/70 text-sm leading-relaxed">
          {guia.descripcion}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div>
            {guia.precio ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold wine-text-gradient">${guia.precio}</span>
                {guia.precioRegular && (
                  <span className="text-amber-100/50 line-through text-sm">${guia.precioRegular}</span>
                )}
              </div>
            ) : (
              <span className="text-amber-100/60 text-sm italic">{guia.precioNota}</span>
            )}
            {guia.precioRegular && (
              <p className="text-xs text-amber-100/50">Precio Fundador de lanzamiento</p>
            )}
          </div>
          <Button
            onClick={() => (disponible ? onComprar(guia.id) : onAvisame(guia.nombre))}
            disabled={procesando}
            className="wine-gradient text-stone-900 font-semibold hover:opacity-90 disabled:opacity-70"
          >
            {procesando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {procesando ? 'Redirigiendo...' : disponible ? 'Quiero esta guía' : 'Avísame'}
          </Button>
        </div>
      </div>
    </motion.div>
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
        body: JSON.stringify({ guideId }),
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
    <div className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 space-y-4"
      >
        <div className="inline-flex items-center gap-4">
          <Sparkles className="h-10 w-10 text-amber-400" />
          <h2 className="font-playfair text-4xl font-bold text-amber-200">
            Guías en PDF
          </h2>
        </div>
        <p className="text-amber-100/70 max-w-2xl mx-auto">
          Aprende de vino a tu ritmo, sin tecnicismos. Descarga inmediata, para leer en el móvil o
          imprimir.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-amber-100/70 text-sm pt-2">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" /> Descarga inmediata en PDF
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" /> Escrito en la voz cercana de Vako Club
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
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
