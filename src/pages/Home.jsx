import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Wine, Users, Calendar, ShoppingBag, Paintbrush, Shirt, GlassWater, Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import Reveal from '@/components/copa/Reveal';

const WelcomePopup = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const copyCoupon = () => {
    navigator.clipboard.writeText('BONARDA20%');
    toast({
      title: '¡Cupón copiado!',
      description: 'Usa BONARDA20% en la tienda.',
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="border-copa-gold rounded-none max-w-md"
        style={{ backgroundColor: '#F7F1E6', backdropFilter: 'none' }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-cormorant font-light text-copa-ink" style={{ fontSize: 28 }}>
            ¡Bienvenido a la familia Vako Club!
          </AlertDialogTitle>
          {/* AlertDialogDescription renders a <p> — keep it to inline content only, the
              coupon box (a <div>) can't legally nest inside a <p>. */}
          <AlertDialogDescription
            className="text-center text-copa-ink/75 mt-2"
            style={{ fontSize: 16, lineHeight: 1.6, fontFamily: "'EB Garamond', serif" }}
          >
            Para celebrar tu llegada, te regalamos un <strong className="text-copa-burgundy">20% de descuento</strong> en
            merchandising y arte. ¡Explora nuestra tienda y encuentra tu pieza favorita!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="border border-copa-gold bg-copa-creamDeep px-4 py-3 flex items-center justify-center gap-4">
          <span className="font-jost text-lg text-copa-burgundy tracking-widest">BONARDA20%</span>
          <button
            type="button"
            onClick={copyCoupon}
            aria-label="Copiar cupón"
            className="text-copa-burgundy hover:text-copa-ink transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <AlertDialogFooter>
          <button type="button" className="copa-btn-primary w-full" onClick={() => onOpenChange(false)}>
            ¡Genial, gracias!
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const features = [
  {
    icon: Users,
    title: 'Comunidad Apasionada',
    description: 'Conecta con otros amantes del vino, comparte tus descubrimientos y participa en debates.',
    path: '/comunidad',
  },
  {
    icon: ShoppingBag,
    title: 'Tienda Exclusiva',
    description: 'Accede a una selección curada de vinos, merchandising y accesorios únicos del club.',
    path: '/tienda',
  },
  {
    icon: Calendar,
    title: 'Eventos y Catas',
    description: 'Participa en catas virtuales y presenciales, talleres y encuentros exclusivos para miembros.',
    path: '/eventos',
  },
];

const communityArticles = [
  { name: 'Vinos selectos', description: 'Descubre nuestra colección de vinos de alta calidad', icon: Wine },
  { name: 'Arte y decoración', description: 'Piezas únicas para decorar tus espacios con la cultura del vino', icon: Paintbrush },
  { name: 'Merchandising', description: 'Lleva tu pasión por el vino con nuestra línea de productos', icon: Shirt },
  { name: 'Accesorios', description: 'Las mejores herramientas para disfrutar al máximo de tus vinos', icon: GlassWater },
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
  const location = useLocation();
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    const hash = location.hash;
    if (hash.includes('type=signup')) {
      const welcomeShown = sessionStorage.getItem('welcomePopupShown');
      if (!welcomeShown) {
        setShowWelcomePopup(true);
        sessionStorage.setItem('welcomePopupShown', 'true');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [location]);

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>Vako Club - Tu Comunidad de Vinos</title>
        <meta
          name="description"
          content="Bienvenido a Vako Club, un espacio para amantes del vino. Explora nuestra tienda, eventos y únete a una comunidad apasionada."
        />
      </Helmet>

      <WelcomePopup isOpen={showWelcomePopup} onOpenChange={setShowWelcomePopup} />

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

      {/* Community articles */}
      <section className="py-20 sm:py-28 bg-copa-creamDeep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className={eyebrow}>Tienda</Reveal>
          <Reveal delay={0.05}>
            <h2 className={sectionTitle} style={{ fontSize: 'clamp(28px,4vw,44px)' }}>
              Artículos para la comunidad
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={sectionParagraph} style={{ fontSize: 18, lineHeight: 1.6 }}>
              Descubre nuestra selección de productos pensados para la comunidad.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {communityArticles.map((article, i) => {
              const Icon = article.icon;
              return (
                <Reveal key={article.name} delay={Math.min(i * 0.05, 0.2)}>
                  <Link to="/tienda" className="copa-card flex flex-col items-center text-center p-8 h-full">
                    <Icon className="h-9 w-9 text-copa-gold" />
                    <h3 className="font-cormorant mt-4" style={{ fontSize: 22 }}>
                      {article.name}
                    </h3>
                    <p className="text-copa-ink/70 mt-2" style={{ fontSize: 15, lineHeight: 1.55 }}>
                      {article.description}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
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
          <Reveal delay={0.1} className="mt-8 space-y-2">
            <p className="text-copa-cream/85" style={{ fontSize: 18, lineHeight: 1.6 }}>
              Únete a Vako Club hoy y comienza tu viaje enológico. ¡Es gratis!
            </p>
            <p className="text-copa-cream/85" style={{ fontSize: 18, lineHeight: 1.6 }}>
              Te regalamos un 20% de descuento en merchandising y arte.
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
