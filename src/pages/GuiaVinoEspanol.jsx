import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  Wine, BookOpen, MapPin, Grape, UtensilsCrossed, ShieldCheck, Sparkles,
  Check, X, ChevronDown, Mail, Loader2, ArrowRight, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// Misma integración de EmailJS ya usada en el formulario de contacto (src/components/contacto/ContactForm.jsx).
// No hay todavía checkout ni ESP de email marketing conectado, así que cada CTA de compra
// captura el email en la lista de espera en vez de enlazar a un pago que no existe.
const EMAILJS_SERVICE_ID = 'service_2z4rljb';
const EMAILJS_TEMPLATE_ID = 'template_d3yel4f';
const EMAILJS_PUBLIC_KEY = 'G7BJcfLPx0PBVWBOT';

const faqs = [
  {
    q: '¿Por qué pagar por esto si hay información gratis en internet?',
    a: 'Tienes razón: hay muchísima información gratuita sobre vino español. El problema no es que falte información, es que está repartida en decenas de sitios distintos, con niveles de calidad muy distintos, y casi nunca pensada para alguien que quiere aprender de forma ordenada. No compras "información exclusiva que no existe en ningún otro lado" — compras el tiempo que te ahorras al no tener que buscarla, cruzarla y ordenarla tú mismo/a, presentada de forma visual, curada y pensada para leerse en una sola sesión. Una guía, no 15 pestañas.',
  },
  {
    q: '¿Esta guía es para principiantes o para gente que ya sabe de vino?',
    a: 'Está pensada sobre todo para quien tiene curiosidad y ganas de aprender, pero se pierde con los tecnicismos — no hace falta que sepas nada de vino para empezar. Si ya eres una persona muy avanzada (por ejemplo, si estás preparando una certificación profesional de sumiller), es probable que ya conozcas buena parte de lo básico que cubrimos aquí; esta guía brilla más como el punto de partida claro y visual que te faltaba, no como programa de certificación.',
  },
  {
    q: '¿En qué formato la recibo y cómo la descargo?',
    a: 'Es un PDF digital. En cuanto completas la compra, recibes el enlace de descarga de inmediato — no hay envío físico ni esperas. Puedes leerla desde el móvil, la tablet o el ordenador, y también imprimir las partes pensadas para eso (como los bonos). Es tuya para siempre: la descargas una vez y se queda contigo, sin caducidad.',
  },
  {
    q: '¿Puedo pedir un reembolso si no me convence?',
    a: 'Sí. Tienes 14 días completos desde tu compra para decidir si la guía te aportó valor. Si no es así, escríbenos a info@vakoclub.com dentro de ese plazo y te devolvemos el 100% de lo que pagaste, sin necesidad de justificarlo.',
  },
  {
    q: '¿Qué incluye exactamente el precio de €12?',
    a: 'La Guía del Vino Español completa en PDF + la ficha de maridaje imprimible "Tapas & Vino Español" + el mapa visual imprimible de las Denominaciones de Origen de España + tu estatus de Fundador/a de la Colección (acceso anticipado a las próximas guías + invitación a la membresía Gratuita de Vako Club) + la garantía de devolución de 14 días. Todo por un único pago, sin suscripción ni cargos recurrentes.',
  },
  {
    q: '¿Por qué €12 ahora y no siempre este precio?',
    a: 'Porque eres parte de la primera entrega de una colección nueva (España es la primera de varias guías regionales que estamos preparando) y queremos premiar a quienes confían en el proyecto desde el principio. El Precio Fundador de €12 está disponible solo durante los primeros 14 días desde el lanzamiento; después, el precio pasa a ser €19 de forma indefinida.',
  },
  {
    q: '¿Necesito comprar también la Guía General de Vino de Vako Club?',
    a: 'No, son productos independientes y puedes comprar cualquiera de las dos por separado. Todavía no existe un paquete conjunto ("bundle") entre la Guía General y esta guía de España — si en el futuro lo creamos, avisaremos primero a quienes ya forman parte de la comunidad.',
  },
  {
    q: '¿Esta compra incluye las guías de Argentina y Francia?',
    a: 'No — cada guía regional se vende por separado, y todavía estamos escribiendo las próximas entregas. Lo que sí obtienes como Fundador/a de la Colección es acceso anticipado y aviso prioritario en cuanto estén listas, antes que nadie más. Todavía no tenemos fecha ni precio cerrados para esas guías, así que no podemos prometerte un descuento concreto — solo que serás de las primeras personas en enterarte.',
  },
  {
    q: '¿Esto es lo mismo que hacerme miembro "Sommelier" o "Gran Reserva" de Vako Club?',
    a: 'No, son cosas distintas (y sabemos que el nombre "Gran Reserva" puede confundir: dentro de la guía es una categoría de envejecimiento del vino español, y también es el nombre de uno de nuestros futuros planes de membresía). Comprar esta guía es un pago único por un PDF descargable. La membresía de pago de Vako Club (planes Sommelier y Gran Reserva) todavía no está disponible para contratar en el sitio — hoy solo puedes unirte gratis a la membresía Gratuita, y eso sí lo incluye tu estatus de Fundador/a de la Colección como invitación.',
  },
  {
    q: '¿Cómo se procesa el pago? ¿Es seguro?',
    a: 'Al hacer clic en el botón de compra saldrás de vakoclub.com hacia nuestra plataforma de pago externa, donde se procesa la transacción de forma segura. No guardamos ni vemos los datos de tu tarjeta en ningún momento.',
  },
  {
    q: '¿Puedo regalarla a otra persona?',
    a: 'Sí, es una idea estupenda, sobre todo si conoces a alguien a quien le encanta el vino o va a visitar España. Todavía estamos confirmando si la herramienta de pago final permite marcar la compra "como regalo" o enviar el PDF directamente al correo de otra persona; mientras tanto, la forma más simple es descargarla tú y reenviarla.',
  },
  {
    q: '¿La guía caduca? ¿La puedo conservar para siempre?',
    a: 'La puedes conservar para siempre. Es un archivo PDF que te descargas una vez — no depende de una suscripción activa ni de que sigas conectado/a a ningún sitio.',
  },
];

const NotifyDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Email inválido',
        description: 'Escribe un email válido para avisarte.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nombre: 'Lista de espera — Guía del Vino Español',
          email,
          asunto: 'otro',
          mensaje: `Quiere recibir aviso cuando la Guía del Vino Español esté disponible para compra. Email de contacto: ${email}`,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast({
          title: '¡Listo!',
          description: 'Te avisaremos en cuanto la Guía del Vino Español esté disponible.',
        });
        setEmail('');
        onOpenChange(false);
      })
      .catch(() => {
        toast({
          title: 'Error al enviar',
          description: 'Hubo un problema al guardar tu email. Inténtalo de nuevo.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-stone-900 wine-glass-effect text-amber-100">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl wine-text-gradient">
            Todavía no está a la venta
          </DialogTitle>
          <DialogDescription className="text-amber-100/70">
            Estamos terminando la Guía del Vino Español. Deja tu email y serás de las primeras
            personas en enterarte cuando esté lista para comprar — con el Precio Fundador de €12
            garantizado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-amber-500/30 rounded-lg text-amber-100 placeholder-amber-100/50 focus:outline-none focus:border-amber-400 transition-colors duration-300"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg wine-gradient text-stone-900 font-semibold hover:opacity-90 transition-all duration-300 wine-shadow disabled:opacity-70"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {loading ? 'Enviando...' : 'Avísame cuando esté disponible'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const FadeIn = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const GuiaVinoEspanol = () => {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToOferta = (e) => {
    e.preventDefault();
    document.getElementById('oferta')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const incluye = [
    'La Guía del Vino Español completa, en PDF',
    'Ficha de maridaje imprimible "Tapas & Vino Español"',
    'Mapa visual imprimible de las Denominaciones de Origen de España',
    'Estatus de Fundador/a de la Colección (acceso anticipado a Argentina y Francia + invitación a la membresía Gratuita)',
    'Garantía de devolución de 14 días',
  ];

  const esParaTi = [
    'Nunca has sabido explicar la diferencia entre Crianza y Reserva',
    'Te intimida un poco la sección de vinos españoles del súper o la carta de un restaurante',
    'Quieres regalar algo especial a alguien que "sabe de vino" y no quieres fallar',
    'Te encanta la comida española y quieres acertar con el maridaje',
    'Vas a viajar (o ya viajaste) a España y quieres entender mejor qué bebes',
    'Ya sigues a Vako Club y quieres profundizar en una región concreta',
  ];

  const noEsParaTi = [
    'Buscas prepararte para una certificación profesional o un examen de sumiller',
    'Ya trabajas en el sector del vino español y dominas el sistema de DO de memoria',
  ];

  const indice = [
    {
      icon: Award,
      title: 'El código de la etiqueta',
      desc: 'Vas a distinguir Joven, Crianza, Reserva y Gran Reserva con tiempos reales y verificados — y a saber por fin por qué una botella cuesta el doble que otra con el mismo nombre de DO.',
    },
    {
      icon: MapPin,
      title: 'Las Denominaciones de Origen que ya conoces de nombre',
      desc: 'Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda y Cava explicadas una por una: qué las hace diferentes entre sí, no solo un mapa con nombres.',
    },
    {
      icon: Grape,
      title: 'Las uvas que hacen a España única',
      desc: 'Tempranillo, Garnacha, Albariño, Verdejo, Mencía y Monastrell: cómo reconocer su carácter en la copa, sin necesidad de un curso de cata.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Maridaje español de verdad (no genérico)',
      desc: 'Qué abrir con jamón ibérico, con tapas clásicas (croquetas, gambas al ajillo), con paella y con marisco gallego.',
    },
  ];

  const bonos = [
    {
      title: 'Ficha de maridaje imprimible',
      subtitle: '"Tapas & Vino Español"',
      desc: 'Una página lista para imprimir o guardar en el móvil, que cruza vinos españoles con platos reconocibles: jamón ibérico, tapas clásicas, paella y marisco gallego.',
    },
    {
      title: 'Mapa visual imprimible',
      subtitle: 'Denominaciones de Origen de España',
      desc: 'Una versión simplificada y visual de las DO que ya buscas por nombre. Pósters similares se venden por separado desde $49.99 — este viene incluido, gratis.',
    },
    {
      title: 'Estatus de Fundador/a',
      subtitle: 'de la Colección Regional',
      desc: 'Al comprar durante el lanzamiento, quedas como early-adopter de la serie completa (España → Argentina → Francia): acceso anticipado y aviso prioritario, más invitación a la membresía Gratuita.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Guía del Vino Español (PDF) - Vako Club</title>
        <meta
          name="description"
          content="Deja de sentirte perdido frente al vino español. Crianza, Reserva, Gran Reserva, Denominaciones de Origen y maridaje explicado en una sola guía en PDF."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Aviso de vista previa interna — quitar cuando la página esté lista para publicarse */}
      <div className="bg-amber-900/40 border-b border-amber-500/30 text-amber-100/90 text-xs sm:text-sm text-center py-2 px-4">
        🚧 Vista previa interna — todavía no está enlazada desde la navegación del sitio. Bloqueada por: contenido real de la guía, herramienta de cobro externo y fecha de lanzamiento.
      </div>

      {/* Barra de oferta sticky */}
      <div className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur border-b border-amber-500/20 text-center py-2 px-4">
        <a href="#oferta" onClick={scrollToOferta} className="text-xs sm:text-sm text-amber-200 hover:text-amber-100 transition-colors">
          Precio Fundador de la Colección Regional: <strong className="wine-text-gradient">€12</strong>{' '}
          <span className="line-through text-amber-100/40">€19</span> — primeros 14 días desde el lanzamiento
        </a>
      </div>

      <div className="wine-pattern">
        {/* 1. Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <FadeIn>
              <div className="flex justify-center mb-6">
                <div className="p-5 wine-gradient rounded-full wine-shadow">
                  <Wine className="h-10 w-10 text-stone-900" />
                </div>
              </div>
              <p className="uppercase tracking-widest text-amber-400/80 text-sm font-medium">
                Colección Regional Vako Club — Primera entrega: España
              </p>
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold wine-text-gradient mt-4 leading-tight">
                Deja de sentirte perdido frente al vino español
              </h1>
              <p className="text-lg md:text-xl text-amber-100/80 max-w-3xl mx-auto mt-6 leading-relaxed">
                De Rioja a Rías Baixas, de Tempranillo a Albariño: por fin vas a entender qué
                significa de verdad Crianza, Reserva y Gran Reserva. Todo el vino español que
                necesitas conocer, en un solo PDF — sin abrir 15 pestañas.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => setNotifyOpen(true)}
                  className="wine-gradient text-stone-900 font-semibold text-base md:text-lg px-8 py-6 wine-shadow hover:opacity-90"
                >
                  Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-amber-100/50 text-xs sm:text-sm mt-4">
                  Descarga en PDF inmediata tras la compra · Garantía de devolución de 14 días ·
                  Pago seguro fuera de vakoclub.com
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* 2. El momento incómodo */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="wine-card rounded-2xl p-8 md:p-12 text-center space-y-6">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-amber-100">
                ¿Sabes de verdad la diferencia entre Crianza, Reserva y Gran Reserva?{' '}
                <span className="text-amber-100/60 font-normal">(casi nadie la sabe bien)</span>
              </h2>
              <p className="text-amber-100/80 leading-relaxed text-left">
                Estás delante de la sección de vinos españoles del supermercado, o de la carta de
                un restaurante, y todas las etiquetas parecen decir lo mismo con palabras
                distintas: Rioja, Ribera del Duero, DOCa, DO, Crianza, Reserva, Gran Reserva.
                Sabes que hay una diferencia real entre ellas — pero no la sabrías explicar si te
                preguntaran. Así que haces lo de siempre: eliges la botella que ya conoces, o le
                preguntas a quien esté cerca y te olvidas de la respuesta cinco minutos después.
              </p>
              <p className="text-amber-100/80 leading-relaxed text-left">
                No es que te falte curiosidad. Es que nadie te lo ha explicado nunca de forma
                simple, en un solo sitio, sin necesidad de tener conocimientos previos.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* 3. La solución */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <FadeIn className="text-center space-y-4">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
                Una guía. No 15 pestañas.
              </h2>
              <p className="text-amber-100/80 max-w-3xl mx-auto leading-relaxed">
                Sí, hay muchísima información gratis sobre vino español — reseñas, vídeos, posts
                de Instagram, blogs de bodegas. El problema nunca fue que faltara información. El
                problema es que está repartida en decenas de sitios distintos, con niveles de
                calidad muy distintos — y casi nunca pensada para alguien que solo quiere
                aprender, de una vez, de forma ordenada y visual.
              </p>
              <p className="text-amber-100/80 max-w-3xl mx-auto leading-relaxed">
                La Guía del Vino Español junta lo que de verdad importa en un único documento:
                legible en una sola sesión, pensado para leerse en el móvil o imprimirse, sin
                tecnicismos innecesarios.
              </p>
            </FadeIn>

            <FadeIn delay={0.1} className="overflow-x-auto">
              <table className="w-full text-sm md:text-base wine-card rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-amber-500/20 text-amber-300">
                    <th className="text-left p-4 font-playfair"></th>
                    <th className="text-left p-4 font-playfair">Contenido gratis disperso</th>
                    <th className="text-left p-4 font-playfair wine-text-gradient">Guía Vako Club</th>
                    <th className="text-left p-4 font-playfair">Certificación profesional</th>
                  </tr>
                </thead>
                <tbody className="text-amber-100/80">
                  {[
                    ['Precio', '€0', '€12 Fundador / €19 después', '$725–$1.395'],
                    ['Tiempo hasta el resultado', 'Horas saltando entre fuentes', 'Una sesión de lectura', 'Semanas o meses de estudio'],
                    ['Formato', 'Repartido en decenas de sitios', 'Un único PDF visual y curado', 'Curso + examen'],
                    ['Pensado para', 'Quien tiene tiempo para buscar', 'Quien quiere aprender rápido y bien', 'Quien busca certificarse'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-amber-500/10 last:border-0">
                      {row.map((cell, i) => (
                        <td key={i} className={`p-4 ${i === 2 ? 'text-amber-100 font-medium' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            <FadeIn delay={0.2} className="text-center">
              <Button onClick={() => setNotifyOpen(true)} className="wine-gradient text-stone-900 font-semibold px-8 py-6 wine-shadow hover:opacity-90">
                Quiero mi copia — €12 Precio Fundador
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* 4. Qué vas a aprender (también sirve de vista previa mientras no exista contenido maquetado) */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <FadeIn className="text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
                Esto es exactamente lo que vas a poder hacer después de leerla
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 gap-6">
              {indice.map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1} className="wine-card wine-hover rounded-xl p-6 flex gap-4">
                  <item.icon className="h-8 w-8 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-amber-100 mb-2">{item.title}</h3>
                    <p className="text-amber-100/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.3} className="text-center text-amber-100/50 text-sm italic">
              Vista previa de páginas reales: próximamente, en cuanto exista un borrador maquetado de la guía.
            </FadeIn>
            <FadeIn delay={0.35} className="text-center">
              <Button onClick={() => setNotifyOpen(true)} className="wine-gradient text-stone-900 font-semibold px-8 py-6 wine-shadow hover:opacity-90">
                Sí, quiero aprender esto — €12
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* 5. Para quién es / no es */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
            <FadeIn className="wine-card rounded-xl p-8">
              <h3 className="font-playfair text-xl font-semibold text-amber-100 mb-5 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-400" /> Es para ti si...
              </h3>
              <ul className="space-y-3">
                {esParaTi.map((t) => (
                  <li key={t} className="flex gap-3 text-amber-100/80 text-sm leading-relaxed">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    {t}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.1} className="wine-card rounded-xl p-8">
              <h3 className="font-playfair text-xl font-semibold text-amber-100 mb-5 flex items-center gap-2">
                <X className="h-5 w-5 text-amber-100/40" /> Ojo, probablemente no es para ti si...
              </h3>
              <ul className="space-y-3">
                {noEsParaTi.map((t) => (
                  <li key={t} className="flex gap-3 text-amber-100/60 text-sm leading-relaxed">
                    <X className="h-4 w-4 text-amber-100/30 shrink-0 mt-1" />
                    {t}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </section>

        {/* 6. Bonos */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <FadeIn className="text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
                Además de la guía, te llevas esto
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-6">
              {bonos.map((b, i) => (
                <FadeIn key={b.title} delay={i * 0.1} className="wine-card wine-hover rounded-xl p-6 text-center space-y-3">
                  <Sparkles className="h-7 w-7 text-amber-400 mx-auto" />
                  <h3 className="font-playfair text-lg font-semibold text-amber-100">{b.title}</h3>
                  <p className="text-amber-300/80 text-sm font-medium">{b.subtitle}</p>
                  <p className="text-amber-100/70 text-sm leading-relaxed">{b.desc}</p>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.3} className="text-center">
              <Button onClick={() => setNotifyOpen(true)} className="wine-gradient text-stone-900 font-semibold px-8 py-6 wine-shadow hover:opacity-90">
                Llévate la guía + los 3 bonos — €12
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* 8. Oferta y precio */}
        <section id="oferta" className="py-16 md:py-20 scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="wine-glass-effect rounded-2xl p-8 md:p-12 text-center space-y-6 wine-shadow">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-amber-100">
                Todo lo que llevas por €12
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl text-amber-100/40 line-through">€19</span>
                <span className="text-5xl md:text-6xl font-bold wine-text-gradient font-playfair">€12</span>
              </div>
              <p className="text-amber-300 text-sm font-medium">Precio Fundador de la Colección — ahorras €7 (~37%)</p>

              <ul className="text-left space-y-3 max-w-md mx-auto pt-2">
                {incluye.map((t) => (
                  <li key={t} className="flex gap-3 text-amber-100/80 text-sm leading-relaxed">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="wine-card rounded-lg p-4 text-sm text-amber-100/70">
                El Precio Fundador de €12 está disponible solo durante los primeros 14 días desde
                el lanzamiento oficial de la guía. Pasado ese plazo, el precio sube de forma
                indefinida a €19.
              </div>

              <p className="text-amber-100/40 text-xs border border-dashed border-amber-500/30 rounded-lg p-2">
                ⚠ Pendiente de confirmar con Julian: si el precio se muestra "IVA incluido" o "+ IVA".
              </p>

              <Button
                onClick={() => setNotifyOpen(true)}
                className="w-full wine-gradient text-stone-900 font-semibold text-base md:text-lg px-8 py-6 wine-shadow hover:opacity-90"
              >
                Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)
              </Button>
              <p className="text-amber-100/50 text-xs">
                Pago único. Sin suscripción, sin cargos recurrentes. Serás redirigido/a fuera de
                vakoclub.com para completar el pago de forma segura.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* 9. Garantía */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center space-y-4">
              <ShieldCheck className="h-10 w-10 text-amber-400 mx-auto" />
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-amber-100">
                Pruébala sin riesgo
              </h2>
              <p className="text-amber-100/80 leading-relaxed">
                Queremos que abras esta guía con la misma curiosidad con la que abrirías una
                botella nueva. Si dentro de los 14 días posteriores a tu compra sientes que no te
                aportó valor, escríbenos a{' '}
                <a href="mailto:info@vakoclub.com" className="text-amber-300 hover:underline">
                  info@vakoclub.com
                </a>{' '}
                y te devolvemos el 100% de lo que pagaste. Sin necesidad de justificarlo, sin
                preguntas incómodas.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* 10. Prueba social honesta */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="wine-card rounded-2xl p-8 md:p-10 text-center space-y-4">
              <h2 className="font-playfair text-xl md:text-2xl font-bold text-amber-100">
                Todavía no tenemos reseñas — y eso también lo hacemos con transparencia
              </h2>
              <p className="text-amber-100/70 leading-relaxed text-sm md:text-base">
                La Guía del Vino Español es la primera entrega de la nueva serie regional de Vako
                Club, así que ahora mismo no tenemos reseñas publicadas todavía — no nos gusta
                inventarlas, y a ti tampoco te gustaría que lo hiciéramos. Eres bienvenido/a a ser
                de las primeras personas en leerla; en los días después de tu compra te
                pediremos tu opinión honesta para seguir mejorando esta guía y las que vienen
                después.
              </p>
              <p className="text-amber-100/60 text-sm leading-relaxed">
                Vako Club nace de la pasión por el vino y el deseo de hacerlo accesible a
                cualquier nivel de conocimiento, sin esnobismo — esta guía se escribió con esa
                misma idea. Síguenos en Instagram,{' '}
                <a
                  href="https://instagram.com/vakoclub"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline"
                >
                  @vakoclub
                </a>
                .
              </p>
            </FadeIn>
          </div>
        </section>

        {/* 11. Colección completa */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center space-y-6">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold wine-text-gradient">
                La primera entrega de una colección completa
              </h2>
              <p className="text-amber-100/80 leading-relaxed">
                España es la primera parada de una nueva serie de guías regionales de Vako Club —
                después llegarán Argentina y Francia (todavía sin fecha ni precio confirmados). Al
                comprar ahora, quedas como Fundador/a de la Colección: serás de las primeras
                personas en enterarte cuando publiquemos las siguientes guías, con acceso
                anticipado antes que el resto.
              </p>
              <Link to="/suscripcion">
                <Button variant="outline" className="border-amber-500/40 text-amber-200 hover:bg-amber-500/10 px-6 py-5">
                  Únete gratis a la comunidad Vako Club
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* 12. Cierre */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <FadeIn>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
                Deja de sentirte perdido frente al vino español, desde hoy
              </h2>
              <p className="text-amber-100/80 leading-relaxed mt-4 max-w-2xl mx-auto">
                La próxima vez que tengas una botella española en la mano — en el súper, en una
                cena, en un viaje — vas a saber exactamente qué estás bebiendo y por qué. Empieza
                ahora, mientras el Precio Fundador de la Colección sigue activo.
              </p>
              <div className="pt-6">
                <Button
                  onClick={() => setNotifyOpen(true)}
                  className="wine-gradient text-stone-900 font-semibold text-base md:text-lg px-8 py-6 wine-shadow hover:opacity-90"
                >
                  Empieza a entender el vino español hoy — €12
                </Button>
                <p className="text-amber-100/50 text-xs sm:text-sm mt-4">
                  Descarga inmediata en PDF · Garantía de 14 días · Pago seguro fuera de vakoclub.com
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
                Preguntas Frecuentes
              </h2>
            </FadeIn>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={faq.q} delay={Math.min(i * 0.03, 0.3)} className="wine-card rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left p-5"
                  >
                    <span className="font-playfair text-amber-100 font-medium">{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-amber-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-amber-100/70 text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </div>

      <NotifyDialog open={notifyOpen} onOpenChange={setNotifyOpen} />
    </>
  );
};

export default GuiaVinoEspanol;
