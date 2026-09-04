import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Reveal from '@/components/copa/Reveal';

const INFO_BAR = [
  '6 cursos previstos',
  'Cata · Maridaje · Regiones',
  'Español, inglés, portugués',
  'A tu ritmo',
];

const CATEGORIES = ['Todos', 'Cata', 'Maridaje', 'Regiones', 'Producción'];

const COURSES = [
  {
    numeral: 'I',
    tag: 'Cata · Principiante',
    title: 'Fundamentos de la cata',
    description: 'Ver, oler, probar. Los tres pasos que ordenan todo lo demás, con palabras que ya usás.',
    lessons: '12 lecciones',
    status: 'Gratis',
    opensFirst: true,
  },
  {
    numeral: 'II',
    tag: 'Maridaje · Intermedio',
    title: 'Mesa y maridaje',
    description: 'Qué funciona, por qué, y cuándo da exactamente igual. Maridaje sin reglas rígidas.',
    lessons: '18 lecciones',
    status: 'Precio pendiente',
  },
  {
    numeral: 'III',
    tag: 'Uvas · Todos los niveles',
    title: 'Las uvas, una por una',
    description: 'Malbec, Cabernet, Chardonnay y compañía: qué esperar de cada una sin memorizar nada.',
    lessons: '9 lecciones',
    status: 'Precio pendiente',
  },
  {
    numeral: 'IV',
    tag: 'Regiones · Intermedio',
    title: 'De Mendoza al Loira',
    description: 'Por qué el lugar cambia el vino, y cómo se lee eso en la etiqueta.',
    writing: true,
  },
  {
    numeral: 'V',
    tag: 'Cata · Avanzado',
    title: 'Análisis sensorial',
    description: 'Entrenar el paladar en serio: cómo se describe lo que sentís sin inventar nada.',
    writing: true,
  },
  {
    numeral: 'VI',
    tag: 'Producción · Avanzado',
    title: 'De la uva a la botella',
    description: 'Qué pasa en la bodega, y cuánto de eso llega efectivamente a tu copa.',
    writing: true,
  },
];

const Educacion = () => {
  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Academia - Vako Club</title>
        <meta name="description" content="La Academia Vako está en preparación: cursos cortos de cata, maridaje, uvas, regiones y producción, del mismo criterio que la guía." />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 text-center flex flex-col items-center">
        <Reveal className="copa-eyebrow">Academia Vako · En preparación</Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-cormorant font-light leading-[1.05] mt-6" style={{ fontSize: 'clamp(40px,7vw,76px)' }}>
            El vino, <span className="text-copa-burgundy">en orden</span>.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-copa-ink/80 max-w-2xl mx-auto mt-6" style={{ fontSize: 20, lineHeight: 1.6 }}>
            Cursos cortos que siguen el mismo criterio que la guía: de la primera copa a la góndola, sin esnobismo. Se abren de a uno, cuando están listos de verdad.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-wrap gap-6 items-center justify-center mt-10">
          <a href="mailto:info@vakoclub.com?subject=Academia%20Vako%20-%20Avisenme%20cuando%20abra" className="copa-btn-primary">
            Avisarme cuando abra
          </a>
          <Link to="/guia" className="copa-btn-secondary">
            Empezar por la guía
          </Link>
        </Reveal>
      </section>

      <div className="border-y border-copa-gold/50 bg-copa-creamDeep">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {INFO_BAR.map((item, i) => (
            <div
              key={item}
              className={`py-6 text-center copa-eyebrow text-copa-ink/70 ${i < INFO_BAR.length - 1 ? 'md:border-r border-copa-gold/40' : ''}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <div className="copa-eyebrow">El programa</div>
            <h2 className="font-cormorant font-light mt-3" style={{ fontSize: 'clamp(30px,4vw,42px)' }}>
              Seis cursos, un mismo hilo.
            </h2>
          </Reveal>
          <Reveal delay={0.05} className="flex flex-wrap gap-2 font-jost text-[11px] tracking-[0.14em] uppercase">
            {CATEGORIES.map((category, i) => (
              <div
                key={category}
                className={
                  i === 0
                    ? 'px-[18px] py-[11px] border border-copa-burgundy text-copa-cream bg-copa-burgundy'
                    : 'px-[18px] py-[11px] border border-copa-gold/60 text-copa-ink/65'
                }
              >
                {category}
              </div>
            ))}
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-9 pb-20">
          {COURSES.map((course, i) => (
            <Reveal key={course.numeral} delay={(i % 3) * 0.05} className={`copa-card flex flex-col ${course.writing ? 'opacity-70' : ''}`}>
              <div className="h-[150px] bg-copa-creamDeep border-b border-copa-gold/40 relative flex items-center justify-center">
                <div className="font-cormorant font-light text-copa-burgundy/35" style={{ fontSize: 52 }}>{course.numeral}</div>
                {course.opensFirst && (
                  <div className="absolute top-3.5 left-3.5 font-jost text-[10px] tracking-[0.16em] uppercase text-copa-cream bg-copa-burgundy px-2.5 py-1.5">
                    Abre primero
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="font-jost text-[10px] tracking-[0.18em] uppercase text-copa-gold">{course.tag}</div>
                <h3 className="font-cormorant" style={{ fontSize: 27, lineHeight: 1.15 }}>{course.title}</h3>
                <p className="text-copa-ink/70" style={{ fontSize: 16, lineHeight: 1.6 }}>{course.description}</p>
                {course.writing ? (
                  <div className="mt-auto pt-[18px] border-t border-copa-gold/35 font-jost text-[11px] tracking-[0.12em] uppercase text-copa-ink/50">
                    En escritura
                  </div>
                ) : (
                  <div className="mt-auto pt-[18px] border-t border-copa-gold/35 flex justify-between items-center font-jost text-[11px] tracking-[0.12em] uppercase text-copa-ink/60">
                    <div>{course.lessons}</div>
                    <div className={course.status === 'Gratis' ? 'text-copa-burgundy' : 'text-copa-ink/45'}>{course.status}</div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-copa-burgundy text-copa-cream">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-wrap gap-12 items-center justify-between">
          <div className="max-w-xl">
            <div className="font-jost text-[11px] tracking-[0.22em] uppercase text-copa-cream/65">Mientras tanto</div>
            <h2 className="font-cormorant font-light leading-[1.08] mt-4" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
              La guía ya hace el primer curso completo.
            </h2>
            <p className="text-copa-cream/80 mt-4" style={{ fontSize: 19, lineHeight: 1.6 }}>
              83 páginas, siete partes, tres idiomas. Es el mismo recorrido de la Academia, para leer hoy.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 items-start">
            <Link to="/tienda/el-mundo-de-la-copa" className="copa-btn-invert">
              Conseguir la guía
            </Link>
            <div className="font-jost text-[11px] tracking-[0.1em] text-copa-cream/60">
              Pago seguro con Stripe · Devolución 7 días
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Educacion;
