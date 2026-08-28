import React from 'react';
import { ExternalLink } from 'lucide-react';
import Reveal from '@/components/copa/Reveal';

// Vako Club no vende decoración item por item en este sitio — el catálogo completo (Printify +
// Hostinger Ecommerce) vive en la tienda externa. Esta sección es solo una vidriera: un puñado de
// ejemplos y un único botón que saca al visitante a comprar ahí.
const TIENDA_DECORACION_URL = 'https://hostinger.store/vako-club';

const ejemplos = [
  {
    id: 'syrah',
    nombre: 'Poster enmarcado Syrah',
    image: '/images/il_fullxfull.7147611925_98b9.webp',
  },
  {
    id: 'rhythm-and-nature',
    nombre: 'Poster enmarcado Rhythm and Nature',
    image: '/images/il_fullxfull.7147581583_do84.webp',
  },
  {
    id: 'tempranillo',
    nombre: 'Poster enmarcado Tempranillo',
    image: '/images/il_fullxfull.7147487421_reas.webp',
  },
];

const DecoracionSection = () => {
  return (
    <div id="decoracion" className="py-20 sm:py-28 border-t border-copa-gold/30 scroll-mt-24">
      <Reveal className="copa-eyebrow text-center">Decoración</Reveal>
      <Reveal delay={0.05}>
        <h2
          className="font-cormorant font-light leading-[1.05] mt-4 mx-auto max-w-2xl text-center"
          style={{ fontSize: 'clamp(28px,4vw,44px)' }}
        >
          Vestí tu espacio de vino
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-copa-ink/70 max-w-2xl mx-auto mt-5 text-center" style={{ fontSize: 18, lineHeight: 1.6 }}>
          Cuadros y piezas con distintos diseños para tu bodega, rincón de vinos o comedor. El catálogo
          completo vive en nuestra tienda — estos son solo algunos ejemplos.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 max-w-4xl mx-auto">
        {ejemplos.map((item, index) => (
          <Reveal key={item.id} delay={Math.min(0.1 + index * 0.08, 0.34)} className="copa-card overflow-hidden">
            <div className="h-64 bg-copa-creamDeep">
              <img src={item.image} alt={item.nombre} className="object-cover w-full h-full" />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="text-center mt-12">
        <a
          href={TIENDA_DECORACION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="copa-btn-nav inline-flex items-center gap-2"
        >
          Visitar la tienda de decoración
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Reveal>
    </div>
  );
};

export default DecoracionSection;
