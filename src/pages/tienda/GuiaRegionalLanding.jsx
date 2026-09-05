import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Reveal, { COPA_EASE } from '@/components/copa/Reveal';
import Seo from '@/components/Seo';
import CompraResultBanner from '@/components/tienda/CompraResultBanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// Plantilla compartida para las landings de la Colección Regional (España, Argentina, y Francia
// cuando esté lista) — misma estructura y sistema visual `copa-*` que
// src/pages/tienda/ElMundoDeLaCopaLanding.jsx, pero simplificada porque estas guías son de un solo
// idioma: sin selector de idioma/edad propio (usa el AgeVerificationPopup genérico del sitio, ya
// montado en App.jsx para toda página que no sea El Mundo de la Copa) y sin el contador en vivo de
// cupos de "Fundador/a" (queda pendiente para cuando exista la migración de Supabase por guía).
//
// `content` — ver src/pages/tienda/contenido/guiaVinoEspanol.js para la forma completa y comentada
// de cada campo.
const btnPrimary = 'copa-btn-primary';
const eyebrow = 'copa-eyebrow';

// Estas guías regionales solo existen en español por ahora — a diferencia de El Mundo de la
// Copa, que sí tiene edición real en los tres idiomas. Mostramos los tres botones igual (Julian
// lo pidió así, para dejar ver que el idioma es una opción) pero EN/PT abren un aviso en vez de
// cambiar el contenido de la página.
const LANGS = ['es', 'en', 'pt'];
const LANG_NAMES = { es: 'Español', en: 'English', pt: 'Português' };

// El aviso se muestra en el idioma que el visitante eligió — si alguien clickea "EN" es porque
// probablemente no lee bien español, así que el propio aviso de "todavía no existe en inglés"
// tiene que estar en inglés para que se entienda. `content.nombre` trae el nombre de la guía ya
// traducido a los tres idiomas (ver guiaVinoEspanol.js / guiaVinoArgentino.js).
const NOTICE_COPY = {
  en: {
    title: 'Not yet available in English',
    body: (nombre) => `${nombre} is only available in Spanish for now. As soon as the English edition exists, you'll be able to pick it right here.`,
  },
  pt: {
    title: 'Ainda não disponível em Português',
    body: (nombre) => `${nombre} está disponível apenas em espanhol, por enquanto. Assim que existir a edição em português, você vai poder escolhê-la bem aqui.`,
  },
};

const QUIENES = {
  eyebrow: 'Vako Club',
  title: 'No somos una bodega. Somos los que te explican qué estás tomando.',
  label: 'Experiencia',
  bio: 'Sin escuela y sin atajos: leyendo, probando, preguntando y volviendo a probar. Nos llevó diez años llegar hasta acá, y buena parte de ese camino fue dar vueltas de más por no tener a nadie que me dijera por dónde empezar.',
};

const GuiaRegionalLanding = ({ content }) => {
  const { toast } = useToast();
  const [comprando, setComprando] = useState(false);
  const [openFaq, setOpenFaq] = useState({});
  // Código del idioma que abrió el aviso de "todavía no disponible" (null = diálogo cerrado).
  const [langNotice, setLangNotice] = useState(null);
  const ofertaRef = useRef(null);

  const toggleFaq = (i) => setOpenFaq((s) => ({ ...s, [i]: !s[i] }));

  const handleLangClick = (code) => {
    if (code === 'es') return;
    setLangNotice(code);
  };

  const irACheckout = async () => {
    setComprando(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guideId: content.guideId, returnPath: content.path }),
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

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Seo
        title={content.meta.title}
        description={content.meta.description}
        path={content.path}
        image={content.hero.coverSrc}
      />

      <CompraResultBanner />

      {/* Selector de idioma — la guía hoy solo existe en español, así que EN/PT abren un aviso
          en vez de cambiar el contenido. Mismo patrón visual que la tira de idioma de
          El Mundo de la Copa (src/pages/tienda/ElMundoDeLaCopaLanding.jsx). */}
      <div className="border-b border-copa-gold bg-copa-cream">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-2.5 flex items-center justify-end">
          <nav aria-label="Idioma" className="flex items-center gap-2.5 font-jost text-[11px] tracking-[0.14em]">
            {LANGS.map((code, i) => (
              <React.Fragment key={code}>
                {i > 0 && <span className="text-copa-ink/30">·</span>}
                <button
                  type="button"
                  onClick={() => handleLangClick(code)}
                  aria-current={code === 'es' ? 'page' : undefined}
                  aria-label={LANG_NAMES[code]}
                  className={code === 'es' ? 'text-copa-burgundy cursor-default' : 'copa-link-nav'}
                >
                  {code.toUpperCase()}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* 1 · Hero */}
      <section className="max-w-[1160px] mx-auto px-6 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24 lg:pb-[110px]">
        <div className="flex flex-wrap items-center gap-10 sm:gap-16 lg:gap-20">
          <div className="flex-[1_1_420px] min-w-[300px] max-w-[640px] text-center sm:text-left">
            <Reveal className={eyebrow}>{content.hero.eyebrow}</Reveal>
            <Reveal delay={0.05}>
              <h1
                className="font-cormorant font-light leading-[0.98] tracking-tight mt-6"
                style={{ fontSize: 'clamp(38px,5.6vw,72px)' }}
              >
                {content.hero.titlePre}
                <em className="not-italic text-copa-burgundy">{content.hero.titleEm}</em>
                {content.hero.titlePost}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[34em] mx-auto sm:mx-0 text-copa-ink/90 mt-8" style={{ fontSize: 'clamp(17px,1.5vw,20px)', lineHeight: 1.6 }}>
                {content.hero.paragraph}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap items-center justify-center sm:justify-start gap-7 mt-10">
              <button type="button" onClick={irACheckout} disabled={comprando} className={btnPrimary}>
                {comprando ? 'Redirigiendo…' : content.oferta.ctaConGarantia}
              </button>
              <a href="#adentro" className="copa-btn-secondary">
                {content.hero.ctaSecondary}
              </a>
            </Reveal>
            <Reveal delay={0.2} className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-6 leading-loose">
              {content.hero.microcopy}
            </Reveal>
          </div>
          <div className="flex-[0_1_380px] min-w-[280px] flex justify-center p-7 sm:p-12 bg-copa-creamDeep">
            <img
              src={content.hero.coverSrc}
              alt={content.hero.coverAlt}
              width={content.hero.coverWidth}
              height={content.hero.coverHeight}
              className="w-full max-w-[340px] h-auto block"
              style={{ boxShadow: '14px 14px 0 rgba(43,35,32,.14)' }}
            />
          </div>
        </div>
      </section>

      {/* 2 · Adentro se ve así */}
      <section id="adentro" className="py-20 sm:py-32 lg:py-40 bg-copa-creamDeep">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8">
          <Reveal className={eyebrow}>{content.adentro.eyebrow}</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
              {content.adentro.title}
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 flex gap-7 overflow-x-auto px-6 sm:px-8 pb-6" style={{ scrollSnapType: 'x proximity' }}>
          {content.adentro.pages.map((p) => (
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
          {content.adentro.dragHint}
        </div>
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 mt-14 text-center">
          <Reveal>
            <button type="button" onClick={irACheckout} disabled={comprando} className={btnPrimary}>
              {comprando ? 'Redirigiendo…' : content.oferta.ctaConGarantia}
            </button>
          </Reveal>
          <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-4 leading-loose">
            {content.oferta.secureNote}
          </div>
        </div>
      </section>

      {/* 3 · Barra de datos */}
      <section aria-label="Datos de la guía" className="border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-6 flex flex-wrap gap-x-6 gap-y-2.5 justify-between font-jost text-[11px] tracking-[0.18em] uppercase">
          {content.dataBar.items.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span className="text-copa-gold">·</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 4 · El problema */}
      <section className="bg-copa-burgundy text-copa-cream py-24 sm:py-36 lg:py-[160px] px-6 sm:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal className="font-jost text-[11px] tracking-[0.22em] uppercase text-copa-gold">{content.problema.eyebrow}</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant font-light leading-[1.02] mt-6" style={{ fontSize: 'clamp(32px,4.6vw,58px)' }}>
              {content.problema.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-[90px] h-px bg-copa-gold mx-auto my-14" />
          <div className="flex flex-wrap gap-7 sm:gap-14 text-left justify-center">
            <Reveal className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              {content.problema.p1}
            </Reveal>
            <Reveal delay={0.05} className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              {content.problema.p2}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 · El índice */}
      <section className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>{content.indice.eyebrow}</Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
            {content.indice.title}
          </h2>
        </Reveal>
        <div className="mt-20 border-t border-copa-gold">
          {content.indice.rows.map((row, i) => (
            <Reveal key={row.titulo} delay={Math.min(i * 0.04, 0.2)}>
              <div className="group flex flex-wrap items-baseline gap-4 sm:gap-10 py-6 sm:py-8 px-3 sm:px-6 border-b border-copa-gold/55 transition-colors duration-300 hover:bg-copa-creamDeep">
                <span
                  className="flex-[0_0_40px] font-cormorant italic text-copa-gold transition-colors duration-300 group-hover:text-copa-burgundy"
                  style={{ fontSize: 'clamp(24px,3vw,34px)' }}
                >
                  —
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

      {/* 6 · Quién está atrás */}
      <section className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-[88px]">
          <div className="flex-[1_1_420px] min-w-[280px]">
            <Reveal className={eyebrow}>{QUIENES.eyebrow}</Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-cormorant leading-[1.08] mt-6 max-w-[22em]" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
                {QUIENES.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 py-7 pl-6 border-l-2 border-dashed border-copa-burgundy/60">
              <div className="font-jost text-[11px] tracking-[0.18em] uppercase text-copa-burgundy">{QUIENES.label}</div>
              <p className="max-w-[34em] text-copa-ink/70 mt-3.5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                {QUIENES.bio}
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

      {/* 7 · Franja de confianza */}
      <section aria-label={content.confianza.items.join(' · ')} className="bg-copa-creamDeep border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-10 sm:py-12 flex flex-wrap gap-x-10 gap-y-5 justify-center text-center">
          {content.confianza.items.map((item) => (
            <span key={item} className="flex-[1_1_240px] max-w-[320px] font-jost text-[12px] tracking-[0.08em] uppercase text-copa-ink/70" style={{ lineHeight: 1.6 }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 8 · La oferta */}
      <section ref={ofertaRef} className="max-w-[1160px] mx-auto px-6 sm:px-8 pb-20 sm:pb-32 lg:pb-40">
        <div className="bg-copa-creamDeep border-y border-copa-gold py-14 sm:py-20 lg:py-24 px-6 sm:px-8 flex flex-wrap gap-10 sm:gap-16 lg:gap-20 items-center justify-center">
          <div className="flex-[0_1_340px] text-center">
            <Reveal className={eyebrow}>{content.oferta.eyebrow}</Reveal>
            <Reveal delay={0.1} className="font-jost text-[11px] tracking-[0.16em] uppercase text-copa-ink/60 mt-5">
              {content.oferta.paymentNote}
            </Reveal>
            <Reveal delay={0.12} className="mt-8 py-4 px-5 border border-copa-gold bg-copa-cream text-left">
              <div className="font-cormorant text-copa-burgundy" style={{ fontSize: 17, lineHeight: 1.3 }}>
                {content.oferta.garantia.titulo}
              </div>
              <div className="text-copa-ink/75 mt-1.5" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                {content.oferta.garantia.texto}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-8`}>
                {comprando ? 'Redirigiendo…' : content.oferta.ctaConGarantia}
              </button>
            </Reveal>
            <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-5 leading-loose">
              {content.oferta.secureNote}
            </div>
          </div>
          <div className="flex-[1_1_360px] max-w-[520px] flex flex-col gap-5">
            {content.oferta.incluye.map((item, i) => (
              <Reveal key={item} delay={Math.min(i * 0.03, 0.15)} className="flex items-baseline gap-5">
                <span className="flex-none w-7 h-px bg-copa-gold -translate-y-2" />
                <span style={{ fontSize: 18, lineHeight: 1.55 }}>{item}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · La colección regional */}
      <section className="border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-16 sm:py-24 lg:py-[110px] text-center">
          <Reveal className={eyebrow}>{content.coleccion.eyebrow}</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant leading-[1.08] mt-6 max-w-[28em] mx-auto" style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>
              {content.coleccion.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[38em] mx-auto text-copa-ink/75 mt-6" style={{ fontSize: 17, lineHeight: 1.65 }}>
              {content.coleccion.text}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="flex flex-wrap gap-5 justify-center mt-9">
            {content.coleccion.links.map((l) => (
              <Link key={l.href} to={l.href} className="copa-btn-secondary">
                {l.label}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 10 · Preguntas */}
      <section className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>{content.faq.eyebrow}</Reveal>
        <div className="max-w-[820px] mt-14 border-t border-copa-gold/55">
          {content.faq.items.map((item, i) => {
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
                      transition={{ duration: 0.35, ease: COPA_EASE }}
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
      <section className="max-w-[900px] mx-auto px-6 sm:px-8 py-24 sm:py-40 lg:py-[180px] text-center">
        <Reveal>
          <h2 className="font-cormorant font-light leading-[1.02] m-0" style={{ fontSize: 'clamp(32px,4.6vw,58px)' }}>
            {content.cierre.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-14`}>
            {comprando ? 'Redirigiendo…' : content.oferta.ctaConGarantia}
          </button>
        </Reveal>
      </section>

      {/* Aviso al elegir inglés o portugués — en el idioma que se clickeó, no en español, para
          que quien no lee español lo entienda igual. */}
      <Dialog open={langNotice !== null} onOpenChange={(open) => !open && setLangNotice(null)}>
        <DialogContent className="bg-copa-cream border-copa-gold rounded-none text-copa-ink">
          <DialogHeader>
            <DialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
              {langNotice ? NOTICE_COPY[langNotice].title : ''}
            </DialogTitle>
            <DialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
              {langNotice ? NOTICE_COPY[langNotice].body(content.nombre[langNotice]) : ''}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuiaRegionalLanding;
