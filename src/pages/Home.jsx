import React from 'react';
import { Users, Calendar, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/copa/Reveal';
import Seo from '@/components/Seo';

const features = [
  {
    icon: Users,
    title: 'Comunidad Apasionada',
    description: 'Conecta con otros amantes del vino, comparte tus descubrimientos y participa en debates.',
    path: '/comunidad',
  },
  {
    icon: ShoppingBag,
    title: 'Guía Digital',
    description: 'Descarga inmediata de nuestra guía en PDF: cata, servicio, etiquetas y maridaje explicados sin vueltas.',
    path: '/tienda',
  },
  {
    icon: Calendar,
    title: 'Eventos y Catas',
    description: 'Participa en catas virtuales y presenciales, talleres y encuentros exclusivos para miembros.',
    path: '/eventos',
  },
];

const stats = [
  { number: '500+', label: 'Vinos Catados' },
  { number: '10K+', label: 'Miembros Activos' },
  { number: '50+', label: 'Expertos Colaboradores' },
  { number: '4.9', label: 'Rating Promedio' },
];

const eyebrow = 'copa-eyebrow text-center';
const sectionTitle = 'font-cormorant font-light leading-[1.05] mt-4 mx-auto max-w-2xl text-center';
const sectionParagraph = 'text-copa-ink/70 max-w-2xl mx-auto mt-5 text-center';

const Home = () => {
  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Seo
        title="Vako Club - Tu Comunidad de Vinos"
        description="Bienvenido a Vako Club, un espacio para amantes del vino. Explora nuestra tienda, eventos y únete a una comunidad apasionada."
        path="/"
      />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36 pb-20 sm:pb-28 text-center">
        <Reveal className="flex justify-center">
          <img src="/images/VakoLogo.png" alt="Vako Club" className="h-24 w-24 sm:h-28 sm:w-28" />
        </Reveal>
        <Reveal delay={0.05} className="copa-eyebrow mt-8">
          Vako Club
        </Reveal>
        <Reveal delay={0.1}>
          <h1
            className="font-cormorant font-light leading-[0.98] tracking-tight mt-6"
            style={{ fontSize: 'clamp(44px,7vw,88px)' }}
          >
            Bienvenido a
            <br />
            <em className="not-italic text-copa-burgundy">Vako Club</em>
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-2xl mx-auto text-copa-ink/80 mt-8" style={{ fontSize: 'clamp(18px,1.6vw,22px)', lineHeight: 1.6 }}>
            Donde cada copa cuenta una historia. Descubre, aprende y comparte tu pasión por el vino.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap items-center justify-center gap-6 mt-12">
          <Link to="/guia" className="copa-btn-primary">
            Explorar Guía
          </Link>
          <Link to="/noticias" className="copa-btn-secondary">
            Ver Noticias
          </Link>
        </Reveal>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 border-t border-copa-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className={eyebrow}>Por qué Vako Club</Reveal>
          <Reveal delay={0.05}>
            <h2 className={sectionTitle} style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
              Una experiencia única
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={sectionParagraph} style={{ fontSize: 18, lineHeight: 1.6 }}>
              Más que un club, somos un punto de encuentro para explorar el universo del vino.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.path} delay={Math.min(i * 0.06, 0.2)}>
                  <Link to={feature.path} className="copa-card flex flex-col items-center text-center p-10 h-full">
                    <div className="h-16 w-16 rounded-full border border-copa-gold flex items-center justify-center">
                      <Icon className="h-7 w-7 text-copa-burgundy" />
                    </div>
                    <h3 className="font-cormorant mt-6" style={{ fontSize: 26 }}>
                      {feature.title}
                    </h3>
                    <p className="text-copa-ink/70 mt-3" style={{ fontSize: 16, lineHeight: 1.6 }}>
                      {feature.description}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guía destacada — el lead principal hacia la tienda */}
      <section className="py-20 sm:py-28 bg-copa-creamDeep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-12 lg:gap-20">
            <Reveal className="flex-[0_1_360px] min-w-[260px] flex justify-center">
              <img
                src="/images/guias/el-mundo-de-la-copa-tapa.jpg"
                alt="Tapa de la guía El mundo de la copa, de Vako Club"
                className="w-full max-w-[300px] h-auto"
                style={{ boxShadow: '14px 14px 0 rgba(43,35,32,.14)' }}
              />
            </Reveal>
            <div className="flex-[1_1_380px] min-w-[280px]">
              <Reveal className="copa-eyebrow">Guía digital · 83 páginas</Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-cormorant font-light leading-[1.05] mt-4" style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
                  El Mundo de la Copa
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-copa-ink/75 mt-5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                  Todo lo que necesitás para dejar de elegir vino a ciegas: cata, servicio, etiquetas y maridaje,
                  sin esnobismo. Disponible en español, inglés y portugués.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="flex flex-wrap items-center gap-6 mt-8">
                <Link to="/tienda/el-mundo-de-la-copa" className="copa-btn-primary">
                  Conseguir la guía — USD 29.99
                </Link>
                <Link to="/tienda" className="copa-btn-secondary">
                  Ver todas las guías
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={Math.min(i * 0.06, 0.2)} className="text-center">
                <div className="font-cormorant font-light text-copa-burgundy" style={{ fontSize: 'clamp(36px,4.5vw,52px)' }}>
                  {stat.number}
                </div>
                <div className="font-jost text-[11px] tracking-[0.16em] uppercase text-copa-ink/60 mt-2">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-copa-burgundy text-copa-cream py-24 sm:py-36 px-6 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <Reveal className="copa-eyebrow">Sumate</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant font-light leading-[1.05] mt-6" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
              ¿Listo para descorchar tu pasión?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <p className="text-copa-cream/85" style={{ fontSize: 18, lineHeight: 1.6 }}>
              Únete a Vako Club hoy y comienza tu viaje enológico. ¡Es gratis!
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <Link to="/suscripcion" className="copa-btn-invert">
              Unirme a la Comunidad
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
