import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useToast } from '@/components/ui/use-toast';

// Same EmailJS project already used by the contact form and the "notify me" waitlist
// (src/components/contacto/ContactForm.jsx, src/components/tienda/NotifyGuideDialog.jsx).
const EMAILJS_SERVICE_ID = 'service_2z4rljb';
const EMAILJS_TEMPLATE_ID = 'template_d3yel4f';
const EMAILJS_PUBLIC_KEY = 'G7BJcfLPx0PBVWBOT';

const GUIDE_ID = 'guia-general';
const PRICE_LABEL = 'USD 29.99';

const EASE = [0.2, 0.8, 0.2, 1];

const Reveal = ({ children, className, delay = 0, as: Tag = 'div', ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    transition={{ duration: 0.7, ease: EASE, delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

const INDICE = [
  { num: '—', titulo: 'Introducción', desc: 'Para qué sirve entender lo que tomás, y cómo leer esta guía sin subrayar nada.' },
  { num: 'I', titulo: 'Fundamentos', desc: 'Qué hay en la copa: uva, clima, tiempo. La copa, la temperatura y el servicio sin ceremonia.' },
  { num: 'II', titulo: 'Aprender a catar', desc: 'Ver, oler, probar: los pasos que ordenan todo lo demás, con palabras que ya usás.' },
  { num: 'III', titulo: 'Las uvas', desc: 'Malbec, Cabernet, Chardonnay y compañía: qué esperar de cada una sin memorizar nada.' },
  { num: 'IV', titulo: 'Las regiones', desc: 'De Mendoza al Loira: por qué el lugar cambia el vino, y cómo se lee eso en la etiqueta.' },
  { num: 'V', titulo: 'Mesa y maridaje', desc: 'Maridaje sin reglas rígidas: qué funciona, por qué, y cuándo da igual.' },
  { num: '—', titulo: 'Apéndices', desc: 'Fichas de cata para imprimir, glosario corto y tabla de temperaturas de servicio.' },
];

const PAGINAS = [
  { src: '/images/guias/paginas/pagina-01-apertura.jpg', alt: 'Página interior: apertura de parte' },
  { src: '/images/guias/paginas/pagina-02-diagrama.jpg', alt: 'Página interior: texto y diagrama' },
  { src: '/images/guias/paginas/pagina-03-fundamentos.jpg', alt: 'Página interior: fundamentos' },
  { src: '/images/guias/paginas/pagina-04-cata.jpg', alt: 'Página interior: cata' },
  { src: '/images/guias/paginas/pagina-05-uvas.jpg', alt: 'Página interior: uvas' },
  { src: '/images/guias/paginas/pagina-06-regiones.jpg', alt: 'Página interior: regiones' },
];

const INCLUYE = [
  'Las 83 páginas en PDF de alta calidad',
  'Edición en español, inglés o portugués: elegís al comprar',
  'Diagramas y fichas de cata para imprimir',
  'Acceso inmediato, sin vencimiento',
  'Actualizaciones futuras sin costo',
];

const FAQS = [
  { q: '¿En qué formato llega?', a: 'PDF. Se lee en celular, tablet, computadora o impreso.' },
  { q: '¿Necesito saber algo de vino para empezar?', a: 'No. La guía arranca desde cero y llega lejos.' },
  { q: '¿Hay en otros idiomas?', a: 'Sí. Los criterios son universales y hay ediciones en inglés y portugués.' },
  { q: '¿Cómo la recibo?', a: 'Por email, apenas se acredita el pago.' },
  { q: '¿Puedo regalarla?', a: 'Sí. Comprás igual que siempre y nos escribís a quién mandarle el enlace.' },
  { q: '¿Se actualiza?', a: 'Sí, y las actualizaciones te llegan sin costo.' },
];

const btnPrimary =
  'inline-flex items-center justify-center font-jost text-xs font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy px-8 py-[19px] transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60 disabled:cursor-not-allowed';

const eyebrow = 'font-jost text-[11px] tracking-[0.22em] uppercase text-copa-gold';

const ElMundoDeLaCopaLanding = () => {
  const { toast } = useToast();
  const [comprando, setComprando] = useState(false);
  const [email, setEmail] = useState('');
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState('Un correo por semana sobre vino. Te podés dar de baja cuando quieras.');
  const [openFaq, setOpenFaq] = useState({});
  const [fillY, setFillY] = useState(8);
  const [trazoOro, setTrazoOro] = useState(true);
  const reducedRef = useRef(false);

  const problemaRef = useRef(null);
  const ofertaRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('copa-landing-active');
    return () => document.body.classList.remove('copa-landing-active');
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedRef.current) {
      setFillY(8);
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const oferta = ofertaRef.current;
        const end = oferta
          ? oferta.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6
          : document.body.scrollHeight;
        const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, end)));
        setFillY(63 - 55 * p);

        const problema = problemaRef.current;
        if (problema) {
          const r = problema.getBoundingClientRect();
          const mid = window.innerHeight / 2;
          setTrazoOro(!(r.top < mid && r.bottom > mid));
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const irACheckout = async () => {
    setComprando(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId: GUIDE_ID }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'No se pudo iniciar el pago.');
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: 'No se pudo iniciar el pago',
        description: error.message || 'Intenta de nuevo en unos minutos.',
        variant: 'destructive',
      });
      setComprando(false);
    }
  };

  const enviarEmail = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailMsg('Escribí un email válido para mandarte la primera parte.');
      return;
    }
    setEnviandoEmail(true);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nombre: 'Landing — El mundo de la copa',
          email,
          asunto: 'lead-magnet',
          mensaje: `Pidió la primera parte gratis de "El mundo de la copa" desde la landing. Email de contacto: ${email}`,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setEmailMsg('Listo: te llega la primera parte en unos minutos.');
        setEmail('');
      })
      .catch(() => {
        setEmailMsg('Hubo un problema al enviarlo. Probá de nuevo en un rato.');
      })
      .finally(() => setEnviandoEmail(false));
  };

  const toggleFaq = (i) => setOpenFaq((s) => ({ ...s, [i]: !s[i] }));

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Jost:wght@400;500&display=swap"
        />
        <title>El mundo de la copa — Vako Club</title>
        <meta
          name="description"
          content="Guía digital de 83 páginas de Vako Club para dejar de elegir vino a ciegas: cata, servicio, etiquetas y maridaje, sin esnobismo. Descarga inmediata en español, inglés y portugués."
        />
      </Helmet>

      {/* La copa que se llena — hilo visual fijo en el margen derecho, indicador de avance */}
      <div
        aria-hidden="true"
        className="fixed z-40 pointer-events-none hidden sm:block"
        style={{ right: 'clamp(10px,2.2vw,34px)', top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg width="62" height="120" viewBox="0 0 62 120" fill="none" style={{ display: 'block' }}>
          <defs>
            <clipPath id="copaFillLanding">
              <path d="M13 8 C13 45 20 60 31 63 C42 60 49 45 49 8 Z" />
            </clipPath>
          </defs>
          <rect x="0" y={fillY} width="62" height="70" fill="#6B1F2A" clipPath="url(#copaFillLanding)" opacity="0.92" />
          <g stroke={trazoOro ? '#B08D57' : '#F7F1E6'} strokeWidth="1" fill="none">
            <path d="M13 8 C13 45 20 60 31 63 C42 60 49 45 49 8 Z" />
            <path d="M13 8 H49" />
            <path d="M31 63 V104" />
            <path d="M18 110 C18 105 44 105 44 110" />
            <path d="M18 110 H44" />
          </g>
        </svg>
      </div>
      {/* Versión mobile: línea vertical de 2px al borde derecho */}
      <div
        aria-hidden="true"
        className="fixed right-0 top-0 h-full w-[2px] z-40 pointer-events-none sm:hidden"
        style={{ background: 'rgba(176,141,87,.35)' }}
      >
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: `${((63 - fillY) / 55) * 100}%`, background: '#6B1F2A' }}
        />
      </div>

      {/* 0 · Barra superior */}
      <header className="sticky top-0 z-50 bg-copa-cream/90 backdrop-saturate-150 backdrop-blur-sm border-b border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3">
            <img src="/images/VakoLogo.png" alt="" width="34" height="34" className="rounded-full" />
            <span className="font-jost text-[11px] tracking-[0.22em] uppercase">Vako Club</span>
          </a>
          <div className="flex items-center gap-4 sm:gap-8">
            <nav aria-label="Idioma" className="flex items-center gap-2.5 font-jost text-[11px] tracking-[0.14em]">
              <span className="text-copa-burgundy" aria-current="page">ES</span>
              <span className="text-copa-ink/30">·</span>
              <span className="text-copa-ink/40" title="Próximamente">EN</span>
              <span className="text-copa-ink/30">·</span>
              <span className="text-copa-ink/40" title="Próximamente">PT</span>
            </nav>
            <button
              type="button"
              onClick={irACheckout}
              disabled={comprando}
              className="font-jost text-[11px] font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy px-[18px] py-[11px] whitespace-nowrap transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60"
            >
              {comprando ? 'Redirigiendo…' : 'Conseguir la guía'}
            </button>
          </div>
        </div>
      </header>

      {/* 1 · Hero */}
      <section id="top" className="max-w-[1160px] mx-auto px-6 sm:px-8 pt-20 sm:pt-28 lg:pt-[132px] pb-16 sm:pb-24 lg:pb-[110px]">
        <div className="flex flex-wrap items-center gap-10 sm:gap-16 lg:gap-20">
          <div className="flex-[1_1_420px] min-w-[300px] max-w-[640px]">
            <Reveal className={eyebrow}>Guía digital · 83 páginas · Español, inglés y portugués</Reveal>
            <Reveal delay={0.05}>
              <h1
                className="font-cormorant font-light leading-[0.98] tracking-tight mt-6"
                style={{ fontSize: 'clamp(44px,6.6vw,88px)' }}
              >
                El vino se disfruta más cuando lo <em className="not-italic text-copa-burgundy">entendés</em>.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[34em] text-copa-ink/90 mt-10" style={{ fontSize: 'clamp(18px,1.6vw,22px)', lineHeight: 1.6 }}>
                Ochenta y tres páginas para dejar de elegir a ciegas. Cómo se cata, cómo se sirve, qué dice una
                etiqueta y con qué va cada botella. Sin esnobismo y sin tecnicismos vacíos.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap items-center gap-7 mt-12">
              <button type="button" onClick={irACheckout} disabled={comprando} className={btnPrimary}>
                {comprando ? 'Redirigiendo…' : `Conseguir la guía — ${PRICE_LABEL}`}
              </button>
              <a
                href="#adentro"
                className="font-jost text-xs tracking-[0.14em] uppercase text-copa-ink border-b border-copa-gold pb-1.5 transition-colors hover:text-copa-burgundy hover:border-copa-burgundy"
              >
                Ver páginas de adentro
              </a>
            </Reveal>
            <Reveal delay={0.2} className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-6 leading-loose">
              Descarga inmediata · PDF para leer en cualquier dispositivo · Pago seguro
            </Reveal>
          </div>
          <div className="flex-[0_1_380px] min-w-[280px] flex justify-center p-7 sm:p-12 bg-copa-creamDeep">
            <img
              src="/images/guias/el-mundo-de-la-copa-tapa.jpg"
              alt="Tapa de la guía El mundo de la copa, de Vako Club"
              width="451"
              height="627"
              className="w-full max-w-[340px] h-auto block"
              style={{ boxShadow: '14px 14px 0 rgba(43,35,32,.14)' }}
            />
          </div>
        </div>
      </section>

      {/* 2 · Barra de datos */}
      <section aria-label="Datos de la guía" className="border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-6 flex flex-wrap gap-x-6 gap-y-2.5 justify-between font-jost text-[11px] tracking-[0.18em] uppercase">
          <span>83 páginas</span>
          <span className="text-copa-gold">·</span>
          <span>7 partes</span>
          <span className="text-copa-gold">·</span>
          <span>3 idiomas</span>
          <span className="text-copa-gold">·</span>
          <span>Descarga inmediata</span>
        </div>
      </section>

      {/* 3 · El problema — única sección en borgoña a sangre */}
      <section ref={problemaRef} className="bg-copa-burgundy text-copa-cream py-24 sm:py-36 lg:py-[200px] px-6 sm:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal className="font-jost text-[11px] tracking-[0.22em] uppercase text-copa-gold">Seamos sinceros</Reveal>
          <Reveal delay={0.05}>
            <h2
              className="font-cormorant font-light leading-[1.02] mt-6"
              style={{ fontSize: 'clamp(34px,5vw,64px)' }}
            >
              Te pasan la carta de vinos y elegís el segundo más barato.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-[90px] h-px bg-copa-gold mx-auto my-14" />
          <div className="flex flex-wrap gap-7 sm:gap-14 text-left justify-center">
            <Reveal className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              No es falta de gusto. Es falta de mapa. Nadie te enseñó a leer una etiqueta, a distinguir un Malbec
              de altura de uno de valle, ni a decir "este me gusta" sin sentir que estás inventando.
            </Reveal>
            <Reveal delay={0.05} className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              El vino tiene un idioma. Se aprende en una tarde y te dura toda la vida. Esta guía es ese idioma,
              ordenado de la primera copa hasta la góndola.
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · El índice */}
      <section id="indice" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>El índice</Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
            Siete partes. Un criterio propio.
          </h2>
        </Reveal>
        <div className="mt-20 border-t border-copa-gold">
          {INDICE.map((row, i) => (
            <Reveal key={row.titulo} delay={Math.min(i * 0.04, 0.2)}>
              <div className="group flex flex-wrap items-baseline gap-4 sm:gap-10 py-6 sm:py-8 px-3 sm:px-6 border-b border-copa-gold/55 transition-colors duration-300 hover:bg-copa-creamDeep">
                <span
                  className="flex-[0_0_58px] font-cormorant italic text-copa-gold transition-colors duration-300 group-hover:text-copa-burgundy"
                  style={{ fontSize: 'clamp(28px,3.4vw,40px)' }}
                >
                  {row.num}
                </span>
                <div className="flex-[1_1_280px] min-w-[240px]">
                  <div className="font-cormorant leading-[1.1]" style={{ fontSize: 'clamp(24px,2.8vw,32px)' }}>
                    {row.titulo}
                  </div>
                  <div className="text-copa-ink/70 mt-2" style={{ fontSize: 17, lineHeight: 1.6 }}>
                    {row.desc}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 · Adentro se ve así */}
      <section id="adentro" className="py-20 sm:py-32 lg:py-40 bg-copa-creamDeep">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8">
          <Reveal className={eyebrow}>Un vistazo</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
              Adentro se ve así.
            </h2>
          </Reveal>
        </div>
        <div
          className="mt-16 flex gap-7 overflow-x-auto px-6 sm:px-8 pb-6"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {PAGINAS.map((p) => (
            <img
              key={p.src}
              src={p.src}
              loading="lazy"
              alt={p.alt}
              className="flex-none w-[300px] h-auto"
              style={{ scrollSnapAlign: 'start', boxShadow: '10px 10px 0 rgba(43,35,32,.12)' }}
            />
          ))}
        </div>
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 font-jost text-[11px] tracking-[0.18em] uppercase text-copa-ink/60">
          Arrastrá para ver más
        </div>
      </section>

      {/* 6 · Quién está atrás */}
      <section id="quienes" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-[88px]">
          <div className="flex-[1_1_420px] min-w-[280px]">
            <Reveal className={eyebrow}>Vako Club</Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-cormorant leading-[1.08] mt-6 max-w-[22em]" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
                No somos una bodega. Somos los que te explican qué estás tomando.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 py-7 pl-6 border-l-2 border-dashed border-copa-burgundy/60">
              <div className="font-jost text-[11px] tracking-[0.18em] uppercase text-copa-burgundy">
                Experiencia
              </div>
              <p className="max-w-[34em] text-copa-ink/70 mt-3.5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                Sin escuela y sin atajos: leyendo, probando, preguntando y volviendo a probar. Nos llevó diez años llegar hasta acá, y buena parte de ese camino fue dar vueltas de más por no tener a nadie que me dijera por dónde empezar.
              </p>
            </Reveal>
          </div>
          <div className="flex-[1_1_300px] min-w-[260px] bg-copa-creamDeep flex items-center justify-center p-10 sm:p-20">
            <svg width="150" height="200" viewBox="0 0 62 120" fill="none" stroke="#B08D57" strokeWidth="0.8" style={{ display: 'block' }}>
              <path d="M13 8 C13 45 20 60 31 63 C42 60 49 45 49 8 Z" />
              <path d="M13 8 H49" />
              <path d="M31 63 V104" />
              <path d="M18 110 C18 105 44 105 44 110" />
              <path d="M18 110 H44" />
            </svg>
          </div>
        </div>
      </section>

      {/* 8 · La oferta */}
      <section id="oferta" ref={ofertaRef} className="max-w-[1160px] mx-auto px-6 sm:px-8 pb-20 sm:pb-32 lg:pb-40">
        <div className="bg-copa-creamDeep border-y border-copa-gold py-14 sm:py-20 lg:py-24 px-6 sm:px-8 flex flex-wrap gap-10 sm:gap-16 lg:gap-20 items-center justify-center">
          <div className="flex-[0_1_340px] text-center">
            <Reveal className={eyebrow}>La guía completa</Reveal>
            <Reveal delay={0.05}>
              <div
                className="font-cormorant font-light leading-none text-copa-burgundy mt-5"
                style={{ fontSize: 'clamp(52px,7vw,72px)', fontFeatureSettings: "'tnum'" }}
              >
                {PRICE_LABEL}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="font-jost text-[11px] tracking-[0.16em] uppercase text-copa-ink/60 mt-[18px]">
              Pago único · Sin vencimiento
            </Reveal>
            <Reveal delay={0.15}>
              <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-10`}>
                {comprando ? 'Redirigiendo…' : `Conseguir la guía — ${PRICE_LABEL}`}
              </button>
            </Reveal>
            <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-5 leading-loose">
              Pago seguro con Stripe · Recibís el enlace de descarga al instante en tu email
            </div>
          </div>
          <div className="flex-[1_1_360px] max-w-[520px] flex flex-col gap-5">
            {INCLUYE.map((item, i) => (
              <Reveal key={item} delay={Math.min(i * 0.03, 0.15)} className="flex items-baseline gap-5">
                <span className="flex-none w-7 h-px bg-copa-gold -translate-y-2" />
                <span style={{ fontSize: 18, lineHeight: 1.55 }}>{item}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Para quien no está listo — captura de email */}
      <section id="email" className="border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-16 sm:py-24 lg:py-[120px] flex flex-wrap gap-8 sm:gap-16 lg:gap-20 items-end">
          <div className="flex-[1_1_380px]">
            <Reveal>
              <h2 className="font-cormorant leading-[1.08] m-0" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
                ¿Todavía lo estás pensando?
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-[32em] text-copa-ink/80 mt-5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                Dejanos tu email y te mandamos la primera parte completa, gratis. Si te sirve, ya sabés dónde
                está el resto.
              </p>
            </Reveal>
          </div>
          <form onSubmit={enviarEmail} className="flex-[1_1_380px] max-w-[520px]">
            <div className="flex flex-wrap">
              <label htmlFor="copa-email-input" className="sr-only">Tu email</label>
              <input
                id="copa-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="flex-[1_1_200px] min-w-0 bg-transparent border-0 border-b border-copa-gold rounded-none px-0.5 py-4 focus:outline-none"
                style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: '#2B2320' }}
              />
              <button
                type="submit"
                disabled={enviandoEmail}
                className="font-jost text-[11px] font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy border-0 px-5 py-[17px] cursor-pointer transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60"
              >
                {enviandoEmail ? 'Enviando…' : 'Enviar la primera parte'}
              </button>
            </div>
            <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-4 leading-loose">
              {emailMsg}
            </div>
          </form>
        </div>
      </section>

      {/* 10 · Preguntas */}
      <section id="faq" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>Preguntas</Reveal>
        <div className="max-w-[820px] mt-14 border-t border-copa-gold/55">
          {FAQS.map((item, i) => {
            const open = !!openFaq[i];
            return (
              <div key={item.q} className="border-b border-copa-gold/55">
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={open}
                  className="w-full flex items-baseline justify-between gap-6 bg-transparent border-0 py-[26px] px-0.5 cursor-pointer text-left font-cormorant"
                  style={{ fontSize: 'clamp(21px,2.2vw,24px)' }}
                >
                  <span>{item.q}</span>
                  <span
                    className="font-jost text-lg text-copa-gold transition-transform duration-300"
                    style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="max-w-[34em] text-copa-ink/80 m-0 pb-7" style={{ fontSize: 18, lineHeight: 1.65 }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11 · Cierre */}
      <section className="max-w-[900px] mx-auto px-6 sm:px-8 py-24 sm:py-40 lg:py-[220px] text-center">
        <Reveal>
          <h2 className="font-cormorant font-light leading-[1.02] m-0" style={{ fontSize: 'clamp(34px,5vw,64px)' }}>
            La próxima botella que abras puede tener sentido.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-14`}>
            {comprando ? 'Redirigiendo…' : `Conseguir la guía — ${PRICE_LABEL}`}
          </button>
        </Reveal>
      </section>

      {/* 12 · Pie */}
      <footer className="bg-copa-burgundy text-copa-cream/80">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-8 flex flex-wrap gap-4 sm:gap-8 items-center justify-between font-jost text-[11px] tracking-[0.16em] uppercase">
          <span className="text-copa-cream tracking-[0.24em]">Vako Club</span>
          <a
            href="https://www.instagram.com/vakoclub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-copa-gold hover:text-copa-cream transition-colors"
          >
            Instagram
          </a>
          <div className="flex gap-4 flex-wrap">
            <Link to="/terminos" className="text-copa-cream/80 hover:text-copa-gold transition-colors">Términos</Link>
            <Link to="/politica-privacidad" className="text-copa-cream/80 hover:text-copa-gold transition-colors">Privacidad</Link>
            <Link to="/contacto" className="text-copa-cream/80 hover:text-copa-gold transition-colors">Contacto</Link>
          </div>
          <span className="text-copa-cream/60">© {new Date().getFullYear()} Vako Club</span>
        </div>
      </footer>
    </div>
  );
};

export default ElMundoDeLaCopaLanding;
