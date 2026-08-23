import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Reveal from '@/components/copa/Reveal';

const PILLARS = [
  {
    number: '01',
    title: 'Las guías',
    description: 'Regiones, uvas, cata y maridaje ordenados una sola vez, para leerse de principio a fin. Aprendés a tu ritmo, de una manera amena y visual.',
  },
  {
    number: '02',
    title: 'Las experiencias',
    description: 'Catas y encuentros, virtuales y presenciales, para aprender de otros y no solo de un PDF. Lo compartido se entiende mejor.',
  },
  {
    number: '03',
    title: 'La comunidad',
    description: 'Un foro donde nadie te corrige por decir «me gusta este». Miembros en España, Argentina y Brasil, en tres idiomas.',
  },
];

const VALUES = [
  { label: 'Accesible', description: 'Si hace falta un diccionario para leernos, escribimos mal.' },
  { label: 'Curioso', description: 'Preguntar es el método, no la falta de nivel.' },
  { label: 'Honesto', description: 'No vendemos vino: no tenemos nada que defender.' },
  { label: 'Sin esnobismo', description: 'Un sommelier amigo, no un manual técnico.' },
];

const SobreNosotros = () => {
  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Sobre Nosotros - Vako Club</title>
        <meta name="description" content="Conoce la historia y la misión de Vako Club, un proyecto nacido de la pasión por el vino y el deseo de crear una comunidad global de aficionados." />
        <meta property="og:title" content="Sobre Nosotros - Vako Club" />
        <meta property="og:description" content="Conoce la historia y la misión de Vako Club, un proyecto nacido de la pasión por el vino y el deseo de crear una comunidad global de aficionados." />
      </Helmet>

      <section className="border-b border-copa-gold/50">
        <Reveal className="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24 text-center">
          <div className="copa-eyebrow">Quiénes somos</div>
          <h1 className="font-cormorant font-light leading-[1.02] mt-6" style={{ fontSize: 'clamp(36px,6vw,66px)' }}>
            No somos una bodega. Somos los que te explican <span className="text-copa-burgundy">qué estás tomando</span>.
          </h1>
          <p className="text-copa-ink/80 mt-7 mx-auto" style={{ fontSize: 19, lineHeight: 1.65 }}>
            Vako Club nació de una idea simple: que entender el vino no debería depender de haber ido a una escuela. Sin escuela y sin atajos — leyendo, probando, preguntando y volviendo a probar. Nos llevó diez años llegar hasta acá, y buena parte de ese camino fue dar vueltas de más por no tener a nadie que nos dijera por dónde empezar.
          </p>
          <p className="font-cormorant italic text-copa-burgundy mt-8" style={{ fontSize: 25 }}>
            «Cada botella tiene una historia que contar.»
          </p>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <Reveal
            key={pillar.number}
            delay={i * 0.08}
            className={`p-10 sm:p-12 ${i < PILLARS.length - 1 ? 'md:border-r border-copa-gold/40' : ''}`}
          >
            <div className="font-cormorant font-light text-copa-burgundy/40" style={{ fontSize: 34 }}>{pillar.number}</div>
            <h2 className="font-cormorant mt-3" style={{ fontSize: 30 }}>{pillar.title}</h2>
            <p className="text-copa-ink/70 mt-3" style={{ fontSize: 17, lineHeight: 1.65 }}>{pillar.description}</p>
          </Reveal>
        ))}
      </section>

      <section className="bg-copa-creamDeep border-t border-copa-gold/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 flex flex-wrap gap-14">
          <Reveal className="flex-1 min-w-[280px]">
            <div className="copa-eyebrow">Lo que creemos</div>
            <h2 className="font-cormorant font-light leading-[1.08] mt-4" style={{ fontSize: 'clamp(26px,4vw,42px)' }}>
              Elegancia sin pretensión.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="flex-[1.4] min-w-[320px] flex flex-col">
            {VALUES.map((value, i) => (
              <div
                key={value.label}
                className={`flex gap-5 py-5 ${i < VALUES.length - 1 ? 'border-b border-copa-gold/40' : ''}`}
              >
                <div className="font-jost text-[11px] tracking-[0.16em] uppercase text-copa-burgundy min-w-[120px]">{value.label}</div>
                <div className="text-copa-ink/75" style={{ fontSize: 17, lineHeight: 1.6 }}>{value.description}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Reveal className="max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center border-t border-copa-gold/50">
        <p className="font-cormorant font-light leading-[1.1]" style={{ fontSize: 'clamp(26px,4vw,46px)' }}>
          Te invitamos a nuestra mesa. Levantá la copa: brindemos por las historias que faltan.
        </p>
        <div className="flex flex-wrap gap-6 items-center justify-center mt-9">
          <Link to="/suscripcion" className="copa-btn-primary">
            Unirme gratis al club
          </Link>
          <Link to="/guia" className="copa-btn-secondary">
            Ver la guía
          </Link>
        </div>
      </Reveal>
    </div>
  );
};

export default SobreNosotros;
