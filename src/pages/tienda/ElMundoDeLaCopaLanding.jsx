import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Same EmailJS project already used by the contact form and the "notify me" waitlist
// (src/components/contacto/ContactForm.jsx, src/components/tienda/NotifyGuideDialog.jsx).
const EMAILJS_SERVICE_ID = 'service_2z4rljb';
const EMAILJS_TEMPLATE_ID = 'template_d3yel4f';
const EMAILJS_PUBLIC_KEY = 'G7BJcfLPx0PBVWBOT';

const GUIDE_ID = 'guia-general';
const PRICE_LABEL = 'USD 29.99';

const EASE = [0.2, 0.8, 0.2, 1];

const LANGS = ['es', 'en', 'pt'];
const LANG_NAMES = { es: 'Español', en: 'English', pt: 'Português' };
const LANG_STORAGE_KEY = 'copa-landing-lang';

// Puerta de entrada: el visitante elige idioma y confirma que es mayor de edad antes de ver la
// landing. Se guarda aparte de LANG_STORAGE_KEY porque es un gate de una sola vez — una vez
// pasado, el selector de idioma del header sigue funcionando libremente sin volver a preguntar.
const GATE_STORAGE_KEY = 'copa-landing-gate-passed';
const GATE_COPY = {
  es: {
    ageLabel: 'Confirmo que soy mayor de 18 años.',
    continueLabel: 'Continuar',
    hint: 'Elegí un idioma y confirmá tu edad para continuar.',
  },
  en: {
    ageLabel: 'I confirm I am 18 years of age or older.',
    continueLabel: 'Continue',
    hint: 'Choose a language and confirm your age to continue.',
  },
  pt: {
    ageLabel: 'Confirmo que tenho 18 anos ou mais.',
    continueLabel: 'Continuar',
    hint: 'Escolha um idioma e confirme sua idade para continuar.',
  },
};

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

// Diccionario completo de la landing. Las páginas de muestra ("adentro") y la tapa son artes ya
// diseñados en español — no existen versiones en inglés/portugués de esas imágenes todavía, así
// que se muestran igual en los tres idiomas y se lo aclaramos al usuario donde importa (sección
// "adentro").
const COPY = {
  es: {
    meta: {
      title: 'El mundo de la copa — Vako Club',
      description:
        'Guía digital de 83 páginas de Vako Club para dejar de elegir vino a ciegas: cata, servicio, etiquetas y maridaje, sin esnobismo. Descarga inmediata en español, inglés y portugués.',
    },
    nav: { cta: 'Conseguir la guía', redirecting: 'Redirigiendo…' },
    hero: {
      eyebrow: 'Guía digital · 83 páginas · Español, inglés y portugués',
      titlePre: 'El vino se disfruta más cuando lo ',
      titleEm: 'entendés',
      titlePost: '.',
      paragraph:
        'Ochenta y tres páginas para dejar de elegir a ciegas. Cómo se cata, cómo se sirve, qué dice una etiqueta y con qué va cada botella. Sin esnobismo y sin tecnicismos vacíos.',
      ctaSecondary: 'Ver páginas de adentro',
      microcopy: 'Descarga inmediata · PDF para leer en cualquier dispositivo · Pago seguro',
      coverAlt: 'Tapa de la guía El mundo de la copa, de Vako Club',
    },
    dataBar: {
      ariaLabel: 'Datos de la guía',
      items: ['83 páginas', '7 partes', '3 idiomas', 'Descarga inmediata'],
    },
    problema: {
      eyebrow: 'Seamos sinceros',
      title: 'Te pasan la carta de vinos y elegís el segundo más barato.',
      p1: 'No es falta de gusto. Es falta de mapa. Nadie te enseñó a leer una etiqueta, a distinguir un Malbec de altura de uno de valle, ni a decir "este me gusta" sin sentir que estás inventando.',
      p2: 'El vino tiene un idioma. Se aprende en una tarde y te dura toda la vida. Esta guía es ese idioma, ordenado de la primera copa hasta la góndola.',
    },
    indice: {
      eyebrow: 'El índice',
      title: 'Siete partes. Un criterio propio.',
      rows: [
        { num: '—', titulo: 'Introducción', desc: 'Para qué sirve entender lo que tomás, y cómo leer esta guía sin subrayar nada.' },
        { num: 'I', titulo: 'Fundamentos', desc: 'Qué hay en la copa: uva, clima, tiempo. La copa, la temperatura y el servicio sin ceremonia.' },
        { num: 'II', titulo: 'Aprender a catar', desc: 'Ver, oler, probar: los pasos que ordenan todo lo demás, con palabras que ya usás.' },
        { num: 'III', titulo: 'Las uvas', desc: 'Malbec, Cabernet, Chardonnay y compañía: qué esperar de cada una sin memorizar nada.' },
        { num: 'IV', titulo: 'Las regiones', desc: 'De Mendoza al Loira: por qué el lugar cambia el vino, y cómo se lee eso en la etiqueta.' },
        { num: 'V', titulo: 'Mesa y maridaje', desc: 'Maridaje sin reglas rígidas: qué funciona, por qué, y cuándo da igual.' },
        { num: '—', titulo: 'Apéndices', desc: 'Fichas de cata para imprimir, glosario corto y tabla de temperaturas de servicio.' },
      ],
    },
    adentro: {
      eyebrow: 'Un vistazo',
      title: 'Adentro se ve así.',
      dragHint: 'Arrastrá para ver más',
      previewNote: null,
      pageAlts: [
        'Página interior: apertura de parte',
        'Página interior: texto y diagrama',
        'Página interior: fundamentos',
        'Página interior: cata',
        'Página interior: uvas',
        'Página interior: regiones',
      ],
    },
    quienes: {
      eyebrow: 'Vako Club',
      title: 'No somos una bodega. Somos los que te explican qué estás tomando.',
      label: 'Experiencia',
      bio: 'Sin escuela y sin atajos: leyendo, probando, preguntando y volviendo a probar. Nos llevó diez años llegar hasta acá, y buena parte de ese camino fue dar vueltas de más por no tener a nadie que me dijera por dónde empezar.',
    },
    oferta: {
      eyebrow: 'La guía completa',
      paymentNote: 'Pago único · Sin vencimiento',
      secureNote: 'Pago seguro con Stripe · Recibís el enlace de descarga al instante en tu email',
      langNotice: null,
      incluye: [
        'Las 83 páginas en PDF de alta calidad',
        'Edición en español, inglés o portugués: elegís antes de comprar',
        'Diagramas y fichas de cata para imprimir',
        'Acceso inmediato, sin vencimiento',
        'Actualizaciones futuras sin costo',
      ],
    },
    compra: {
      verificando: 'Confirmando tu pago…',
      exitoTitle: '¡Gracias por tu compra!',
      exitoParagraph: 'Tu descarga debería haber empezado sola. Si no pasó nada, usá este botón.',
      descargar: 'Descargar guía',
      errorTitle: 'No pudimos confirmar el pago',
      errorParagraph: 'Si te hicieron un cobro, escribinos a info@vakoclub.com con tu comprobante y te mandamos la guía al toque.',
      canceladaTitle: 'Compra cancelada',
      canceladaParagraph: 'No se realizó ningún cobro. Podés intentarlo de nuevo cuando quieras.',
      cerrar: 'Cerrar',
    },
    email: {
      title: '¿Todavía lo estás pensando?',
      paragraph: 'Dejanos tu email y te mandamos la primera parte completa, gratis. Si te sirve, ya sabés dónde está el resto.',
      inputLabel: 'Tu email',
      placeholder: 'Tu email',
      submitIdle: 'Enviar la primera parte',
      submitBusy: 'Enviando…',
      defaultMsg: 'Un correo por semana sobre vino. Te podés dar de baja cuando quieras.',
      invalidMsg: 'Escribí un email válido para mandarte la primera parte.',
      successMsg: 'Listo: te llega la primera parte en unos minutos.',
      errorMsg: 'Hubo un problema al enviarlo. Probá de nuevo en un rato.',
    },
    faq: {
      eyebrow: 'Preguntas',
      items: [
        { q: '¿En qué formato llega?', a: 'PDF. Se lee en celular, tablet, computadora o impreso.' },
        { q: '¿Necesito saber algo de vino para empezar?', a: 'No. La guía arranca desde cero y llega lejos.' },
        { q: '¿Hay en otros idiomas?', a: 'Sí, está disponible en inglés y en portugués además de español.' },
        { q: '¿Cómo la recibo?', a: 'Por email, apenas se acredita el pago.' },
        { q: '¿Puedo regalarla?', a: 'Sí. Comprás igual que siempre y nos escribís a quién mandarle el enlace.' },
        { q: '¿Se actualiza?', a: 'Sí, y las actualizaciones te llegan sin costo.' },
      ],
    },
    cierre: { title: 'La próxima botella que abras puede tener sentido.' },
    footer: { instagram: 'Instagram', terminos: 'Términos', privacidad: 'Privacidad', contacto: 'Contacto', copyright: (y) => `© ${y} Vako Club` },
    toastError: { title: 'No se pudo iniciar el pago', fallbackDescription: 'Intenta de nuevo en unos minutos.', fallbackError: 'No se pudo iniciar el pago.' },
  },

  en: {
    meta: {
      title: 'The World of the Glass — Vako Club',
      description:
        'An 83-page digital guide from Vako Club to help you stop choosing wine blind: tasting, serving, labels, and pairing, without the snobbery. Instant download, available in Spanish, English, and Portuguese.',
    },
    nav: { cta: 'Get the guide', redirecting: 'Redirecting…' },
    hero: {
      eyebrow: 'Digital guide · 83 pages · Spanish, English and Portuguese',
      titlePre: 'Wine is more enjoyable when you ',
      titleEm: 'understand it',
      titlePost: '.',
      paragraph:
        'Eighty-three pages to stop choosing wine blind. How to taste it, how to serve it, what a label actually says, and what to pair with each bottle. No snobbery, no empty jargon.',
      ctaSecondary: 'See the inside pages',
      microcopy: 'Instant download · PDF readable on any device · Secure payment',
      coverAlt: 'Cover of The World of the Glass guide, by Vako Club',
    },
    dataBar: {
      ariaLabel: 'Guide details',
      items: ['83 pages', '7 parts', '3 languages', 'Instant download'],
    },
    problema: {
      eyebrow: "Let's be honest",
      title: 'They hand you the wine list and you pick the second-cheapest bottle.',
      p1: 'It\'s not a lack of taste. It\'s a lack of a map. No one ever taught you to read a label, tell a high-altitude Malbec from a valley one, or say "I like this" without feeling like you\'re making it up.',
      p2: 'Wine has a language. You can learn it in an afternoon and it stays with you for life. This guide is that language, laid out from your first glass to the wine aisle.',
    },
    indice: {
      eyebrow: 'The index',
      title: 'Seven parts. A point of view of its own.',
      rows: [
        { num: '—', titulo: 'Introduction', desc: "Why it's worth understanding what you drink, and how to read this guide without underlining a thing." },
        { num: 'I', titulo: 'Fundamentals', desc: "What's actually in the glass: grape, climate, time. The glass, the temperature, and serving it without ceremony." },
        { num: 'II', titulo: 'Learning to taste', desc: 'Look, smell, taste: the steps that make sense of everything else, in words you already use.' },
        { num: 'III', titulo: 'The grapes', desc: 'Malbec, Cabernet, Chardonnay and friends: what to expect from each one without memorizing anything.' },
        { num: 'IV', titulo: 'The regions', desc: 'From Mendoza to the Loire: why place changes the wine, and how that shows up on the label.' },
        { num: 'V', titulo: 'Table and pairing', desc: "Pairing without rigid rules: what works, why, and when it just doesn't matter." },
        { num: '—', titulo: 'Appendices', desc: 'Printable tasting sheets, a short glossary, and a serving-temperature chart.' },
      ],
    },
    adentro: {
      eyebrow: 'A quick look',
      title: "Here's what's inside.",
      dragHint: 'Drag to see more',
      previewNote: 'These sample pages are shown in Spanish — your download will be the full English edition.',
      pageAlts: [
        'Interior page: part opener',
        'Interior page: text and diagram',
        'Interior page: fundamentals',
        'Interior page: tasting',
        'Interior page: grapes',
        'Interior page: regions',
      ],
    },
    quienes: {
      eyebrow: 'Vako Club',
      title: "We're not a winery. We're the ones who explain what you're drinking.",
      label: 'Experience',
      bio: "No formal school, no shortcuts: reading, tasting, asking, and tasting again. It took ten years to get here, and a good part of that road was extra loops from not having anyone to tell me where to start.",
    },
    oferta: {
      eyebrow: 'The complete guide',
      paymentNote: 'One-time payment · No expiration',
      secureNote: 'Secure payment with Stripe · You get the download link instantly by email',
      langNotice: null,
      incluye: [
        'All 83 pages in high-quality PDF',
        'Available in Spanish, English, or Portuguese — pick before you buy',
        'Printable diagrams and tasting sheets',
        'Instant access, no expiration',
        'Future updates at no extra cost',
      ],
    },
    compra: {
      verificando: 'Confirming your payment…',
      exitoTitle: 'Thank you for your purchase!',
      exitoParagraph: 'Your download should have started on its own. If nothing happened, use this button.',
      descargar: 'Download guide',
      errorTitle: "We couldn't confirm the payment",
      errorParagraph: "If you were charged, email us at info@vakoclub.com with your receipt and we'll send you the guide right away.",
      canceladaTitle: 'Purchase cancelled',
      canceladaParagraph: 'No charge was made. You can try again anytime.',
      cerrar: 'Close',
    },
    email: {
      title: 'Still thinking it over?',
      paragraph: "Leave us your email and we'll send you the complete first part, free. If it's useful, you already know where to find the rest.",
      inputLabel: 'Your email',
      placeholder: 'Your email',
      submitIdle: 'Send me the first part',
      submitBusy: 'Sending…',
      defaultMsg: 'One email a week about wine. Unsubscribe whenever you want.',
      invalidMsg: 'Enter a valid email so we can send you the first part.',
      successMsg: 'Done: the first part will land in your inbox in a few minutes.',
      errorMsg: 'Something went wrong sending it. Try again in a bit.',
    },
    faq: {
      eyebrow: 'Questions',
      items: [
        { q: 'What format does it come in?', a: 'PDF. Readable on your phone, tablet, computer, or printed.' },
        { q: 'Do I need to know anything about wine to start?', a: 'No. The guide starts from zero and goes far.' },
        { q: 'Is it available in other languages?', a: 'Yes — it\'s available in English and Portuguese as well as Spanish.' },
        { q: 'How do I receive it?', a: 'By email, as soon as the payment is confirmed.' },
        { q: 'Can I gift it?', a: 'Yes. Buy it the same way as always and let us know who to send the link to.' },
        { q: 'Does it get updated?', a: 'Yes, and updates reach you at no extra cost.' },
      ],
    },
    cierre: { title: 'The next bottle you open might actually make sense.' },
    footer: { instagram: 'Instagram', terminos: 'Terms', privacidad: 'Privacy', contacto: 'Contact', copyright: (y) => `© ${y} Vako Club` },
    toastError: { title: "We couldn't start the payment", fallbackDescription: 'Try again in a few minutes.', fallbackError: "We couldn't start the payment." },
  },

  pt: {
    meta: {
      title: 'O Mundo da Taça — Vako Club',
      description:
        'Um guia digital de 83 páginas da Vako Club para você parar de escolher vinho no escuro: degustação, serviço, rótulos e harmonização, sem esnobismo. Download imediato, disponível em espanhol, inglês e português.',
    },
    nav: { cta: 'Consiga o guia', redirecting: 'Redirecionando…' },
    hero: {
      eyebrow: 'Guia digital · 83 páginas · Espanhol, inglês e português',
      titlePre: 'O vinho é mais gostoso quando você ',
      titleEm: 'entende',
      titlePost: '.',
      paragraph:
        'Oitenta e três páginas para parar de escolher vinho no escuro. Como degustar, como servir, o que um rótulo realmente diz e com que harmonizar cada garrafa. Sem esnobismo e sem jargão vazio.',
      ctaSecondary: 'Ver páginas internas',
      microcopy: 'Download imediato · PDF para ler em qualquer dispositivo · Pagamento seguro',
      coverAlt: 'Capa do guia O Mundo da Taça, da Vako Club',
    },
    dataBar: {
      ariaLabel: 'Dados do guia',
      items: ['83 páginas', '7 partes', '3 idiomas', 'Download imediato'],
    },
    problema: {
      eyebrow: 'Sejamos sinceros',
      title: 'Te entregam a carta de vinhos e você escolhe o segundo mais barato.',
      p1: 'Não é falta de gosto. É falta de mapa. Ninguém te ensinou a ler um rótulo, a diferenciar um Malbec de altitude de um de vale, nem a dizer "gostei desse" sem sentir que está inventando.',
      p2: 'O vinho tem um idioma próprio. Aprende-se em uma tarde e dura a vida toda. Este guia é esse idioma, organizado da primeira taça até a prateleira do mercado.',
    },
    indice: {
      eyebrow: 'O índice',
      title: 'Sete partes. Um critério próprio.',
      rows: [
        { num: '—', titulo: 'Introdução', desc: 'Para que serve entender o que você bebe, e como ler este guia sem grifar nada.' },
        { num: 'I', titulo: 'Fundamentos', desc: 'O que há na taça: uva, clima, tempo. A taça, a temperatura e o serviço sem cerimônia.' },
        { num: 'II', titulo: 'Aprender a degustar', desc: 'Ver, cheirar, provar: os passos que organizam tudo o resto, com palavras que você já usa.' },
        { num: 'III', titulo: 'As uvas', desc: 'Malbec, Cabernet, Chardonnay e companhia: o que esperar de cada uma sem decorar nada.' },
        { num: 'IV', titulo: 'As regiões', desc: 'De Mendoza ao Loire: por que o lugar muda o vinho, e como isso aparece no rótulo.' },
        { num: 'V', titulo: 'Mesa e harmonização', desc: 'Harmonização sem regras rígidas: o que funciona, por quê, e quando tanto faz.' },
        { num: '—', titulo: 'Apêndices', desc: 'Fichas de degustação para imprimir, glossário curto e tabela de temperaturas de serviço.' },
      ],
    },
    adentro: {
      eyebrow: 'Uma prévia',
      title: 'Por dentro é assim.',
      dragHint: 'Arraste para ver mais',
      previewNote: 'Estas páginas de amostra estão em espanhol — seu download será a edição completa em português.',
      pageAlts: [
        'Página interna: abertura de parte',
        'Página interna: texto e diagrama',
        'Página interna: fundamentos',
        'Página interna: degustação',
        'Página interna: uvas',
        'Página interna: regiões',
      ],
    },
    quienes: {
      eyebrow: 'Vako Club',
      title: 'Não somos uma vinícola. Somos quem te explica o que você está bebendo.',
      label: 'Experiência',
      bio: 'Sem escola e sem atalhos: lendo, provando, perguntando e provando de novo. Levou dez anos para chegar até aqui, e boa parte desse caminho foi dar voltas a mais por não ter ninguém que me dissesse por onde começar.',
    },
    oferta: {
      eyebrow: 'O guia completo',
      paymentNote: 'Pagamento único · Sem vencimento',
      secureNote: 'Pagamento seguro com Stripe · Você recebe o link de download na hora, por email',
      langNotice: null,
      incluye: [
        'As 83 páginas em PDF de alta qualidade',
        'Disponível em espanhol, inglês ou português — escolha antes de comprar',
        'Diagramas e fichas de degustação para imprimir',
        'Acesso imediato, sem vencimento',
        'Atualizações futuras sem custo',
      ],
    },
    compra: {
      verificando: 'Confirmando seu pagamento…',
      exitoTitle: 'Obrigado pela sua compra!',
      exitoParagraph: 'Seu download deveria ter começado sozinho. Se nada aconteceu, use este botão.',
      descargar: 'Baixar guia',
      errorTitle: 'Não conseguimos confirmar o pagamento',
      errorParagraph: 'Se você foi cobrado, escreva para info@vakoclub.com com seu comprovante e mandamos o guia na hora.',
      canceladaTitle: 'Compra cancelada',
      canceladaParagraph: 'Nenhuma cobrança foi feita. Você pode tentar de novo quando quiser.',
      cerrar: 'Fechar',
    },
    email: {
      title: 'Ainda está pensando?',
      paragraph: 'Deixe seu email e mandamos a primeira parte completa, de graça. Se gostar, você já sabe onde está o resto.',
      inputLabel: 'Seu email',
      placeholder: 'Seu email',
      submitIdle: 'Enviar a primeira parte',
      submitBusy: 'Enviando…',
      defaultMsg: 'Um email por semana sobre vinho. Você pode cancelar quando quiser.',
      invalidMsg: 'Digite um email válido para receber a primeira parte.',
      successMsg: 'Pronto: a primeira parte chega em alguns minutos.',
      errorMsg: 'Houve um problema ao enviar. Tente de novo daqui a pouco.',
    },
    faq: {
      eyebrow: 'Perguntas',
      items: [
        { q: 'Em que formato chega?', a: 'PDF. Pode ler no celular, tablet, computador ou impresso.' },
        { q: 'Preciso saber algo de vinho para começar?', a: 'Não. O guia começa do zero e vai longe.' },
        { q: 'Está disponível em outros idiomas?', a: 'Sim — está disponível em inglês e em português, além do espanhol.' },
        { q: 'Como recebo?', a: 'Por email, assim que o pagamento é confirmado.' },
        { q: 'Posso presentear?', a: 'Sim. Compre normalmente e nos escreva para quem enviar o link.' },
        { q: 'É atualizado?', a: 'Sim, e as atualizações chegam sem custo.' },
      ],
    },
    cierre: { title: 'A próxima garrafa que você abrir pode fazer sentido.' },
    footer: { instagram: 'Instagram', terminos: 'Termos', privacidad: 'Privacidade', contacto: 'Contato', copyright: (y) => `© ${y} Vako Club` },
    toastError: { title: 'Não foi possível iniciar o pagamento', fallbackDescription: 'Tente novamente em alguns minutos.', fallbackError: 'Não foi possível iniciar o pagamento.' },
  },
};

const PAGINAS_SRC = [
  '/images/guias/paginas/pagina-01-apertura.jpg',
  '/images/guias/paginas/pagina-02-diagrama.jpg',
  '/images/guias/paginas/pagina-03-fundamentos.jpg',
  '/images/guias/paginas/pagina-04-cata.jpg',
  '/images/guias/paginas/pagina-05-uvas.jpg',
  '/images/guias/paginas/pagina-06-regiones.jpg',
];

const btnPrimary =
  'inline-flex items-center justify-center font-jost text-xs font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy px-8 py-[19px] transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60 disabled:cursor-not-allowed';

const eyebrow = 'font-jost text-[11px] tracking-[0.22em] uppercase text-copa-gold';

const readStoredLang = () => {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    return LANGS.includes(saved) ? saved : 'es';
  } catch {
    return 'es';
  }
};

const readGatePassed = () => {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(GATE_STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
};

const ElMundoDeLaCopaLanding = () => {
  const { toast } = useToast();
  const [lang, setLang] = useState(readStoredLang);
  const [gateOpen, setGateOpen] = useState(() => !readGatePassed());
  const [gateLang, setGateLang] = useState(null);
  const [gateAge, setGateAge] = useState(false);
  const [comprando, setComprando] = useState(false);
  const [email, setEmail] = useState('');
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState(null);
  const [openFaq, setOpenFaq] = useState({});
  const [fillY, setFillY] = useState(8);
  const [trazoOro, setTrazoOro] = useState(true);
  const reducedRef = useRef(false);
  const autoDownloadRef = useRef(false);

  const problemaRef = useRef(null);
  const ofertaRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const compra = searchParams.get('compra');
  const sessionId = searchParams.get('session_id');
  const [compraStatus, setCompraStatus] = useState(compra === 'exito' ? 'verificando' : null);
  const [compraResultado, setCompraResultado] = useState(null);

  const t = COPY[lang];
  const gateT = GATE_COPY[gateLang || 'es'];
  const paginas = useMemo(
    () => PAGINAS_SRC.map((src, i) => ({ src, alt: t.adentro.pageAlts[i] })),
    [t]
  );

  useEffect(() => {
    document.body.classList.add('copa-landing-active');
    return () => document.body.classList.remove('copa-landing-active');
  }, []);

  // Mientras la puerta de idioma/edad está abierta, bloqueamos el scroll de fondo.
  useEffect(() => {
    document.body.style.overflow = gateOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gateOpen]);

  const confirmGate = () => {
    if (!gateLang || !gateAge) return;
    setLang(gateLang);
    try {
      window.localStorage.setItem(GATE_STORAGE_KEY, 'true');
    } catch {
      // localStorage puede fallar en modo privado — no es crítico, sólo vuelve a preguntar.
    }
    setGateOpen(false);
  };

  // Stripe redirige de vuelta acá con ?compra=exito&session_id=... — se verifica el pago contra
  // el servidor (nunca se confía en el query param solo) y, si está pagado, se dispara la
  // descarga del PDF automáticamente. El botón "Descargar guía" del banner queda como respaldo
  // manual por si el navegador bloquea la descarga automática.
  useEffect(() => {
    if (compra !== 'exito' || !sessionId) return;
    let cancelado = false;
    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelado) return;
        setCompraResultado(data);
        setCompraStatus(data.paid ? 'pagado' : 'no-pagado');
        if (data.paid && data.downloadUrl && !autoDownloadRef.current) {
          autoDownloadRef.current = true;
          window.location.href = data.downloadUrl;
        }
      })
      .catch(() => {
        if (!cancelado) setCompraStatus('error');
      });
    return () => {
      cancelado = true;
    };
  }, [compra, sessionId]);

  const cerrarCompra = () => {
    searchParams.delete('compra');
    searchParams.delete('session_id');
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // localStorage puede fallar en modo privado — no es crítico, sólo pierde la preferencia.
    }
  }, [lang]);

  // El mensaje de ayuda del formulario de email depende del idioma — si el usuario cambia de
  // idioma a mitad de camino, que vuelva al texto neutral en vez de dejar un mensaje viejo.
  useEffect(() => {
    setEmailMsg(null);
  }, [lang]);

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
        body: JSON.stringify({ guideId: GUIDE_ID, lang, returnPath: '/tienda/el-mundo-de-la-copa' }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || t.toastError.fallbackError);
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: t.toastError.title,
        description: error.message || t.toastError.fallbackDescription,
        variant: 'destructive',
      });
      setComprando(false);
    }
  };

  const enviarEmail = (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailMsg(t.email.invalidMsg);
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
          mensaje: `Pidió la primera parte gratis de "El mundo de la copa" desde la landing (idioma de la página: ${lang}). Email de contacto: ${email}`,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setEmailMsg(t.email.successMsg);
        setEmail('');
      })
      .catch(() => {
        setEmailMsg(t.email.errorMsg);
      })
      .finally(() => setEnviandoEmail(false));
  };

  const toggleFaq = (i) => setOpenFaq((s) => ({ ...s, [i]: !s[i] }));

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet htmlAttributes={{ lang }}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=EB+Garamond:ital,wght@0,400;1,400&family=Jost:wght@400;500&display=swap"
        />
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
      </Helmet>

      {/* Puerta de entrada — idioma + confirmación de mayoría de edad, ambos en el mismo paso.
          No tiene botón de cerrar ni se cierra clickeando afuera: hay que completar los dos
          campos para ver la landing. */}
      <AnimatePresence>
        {gateOpen && (
          <motion.div
            key="copa-gate"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-copa-ink/70 backdrop-blur-sm px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Idioma / Language / Idioma"
          >
            <motion.div
              className="w-full max-w-[440px] bg-copa-cream border border-copa-gold px-7 sm:px-10 py-10 sm:py-12 text-center"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <svg width="34" height="56" viewBox="0 0 62 120" fill="none" stroke="#B08D57" strokeWidth="1" className="mx-auto" style={{ display: 'block' }}>
                <path d="M13 8 C13 45 20 60 31 63 C42 60 49 45 49 8 Z" />
                <path d="M13 8 H49" />
                <path d="M31 63 V104" />
                <path d="M18 110 C18 105 44 105 44 110" />
                <path d="M18 110 H44" />
              </svg>

              <div className={`${eyebrow} mt-6`}>Vako Club</div>
              <h2 className="font-cormorant leading-[1.05] mt-3" style={{ fontSize: 'clamp(24px,3.2vw,30px)' }}>
                Elegí tu idioma · Choose your language · Escolha seu idioma
              </h2>

              <div className="flex flex-wrap gap-3 justify-center mt-8">
                {LANGS.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setGateLang(code)}
                    aria-pressed={gateLang === code}
                    className={
                      gateLang === code
                        ? 'font-jost text-xs tracking-[0.14em] uppercase px-5 py-3 border border-copa-burgundy bg-copa-burgundy text-copa-cream transition-colors'
                        : 'font-jost text-xs tracking-[0.14em] uppercase px-5 py-3 border border-copa-gold text-copa-ink/80 hover:border-copa-burgundy hover:text-copa-burgundy transition-colors'
                    }
                  >
                    {LANG_NAMES[code]}
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-3 mt-9 text-left">
                <Checkbox id="copa-gate-age" checked={gateAge} onCheckedChange={setGateAge} className="mt-1 flex-none" />
                <Label htmlFor="copa-gate-age" className="text-copa-ink/80 cursor-pointer font-normal" style={{ fontSize: 15, lineHeight: 1.5 }}>
                  {gateT.ageLabel}
                </Label>
              </div>

              <button
                type="button"
                onClick={confirmGate}
                disabled={!gateLang || !gateAge}
                className={`${btnPrimary} mt-9 w-full`}
              >
                {gateT.continueLabel}
              </button>
              <div className="font-jost text-[10px] tracking-[0.12em] uppercase text-copa-ink/45 mt-4">
                {gateT.hint}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <nav aria-label="Language / Idioma / Idioma" className="flex items-center gap-2.5 font-jost text-[11px] tracking-[0.14em]">
              {LANGS.map((code, i) => (
                <React.Fragment key={code}>
                  {i > 0 && <span className="text-copa-ink/30">·</span>}
                  <button
                    type="button"
                    onClick={() => setLang(code)}
                    aria-current={lang === code ? 'page' : undefined}
                    aria-label={LANG_NAMES[code]}
                    className={
                      lang === code
                        ? 'text-copa-burgundy cursor-default'
                        : 'text-copa-ink/50 hover:text-copa-ink transition-colors cursor-pointer'
                    }
                  >
                    {code.toUpperCase()}
                  </button>
                </React.Fragment>
              ))}
            </nav>
            <button
              type="button"
              onClick={irACheckout}
              disabled={comprando}
              className="font-jost text-[11px] font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy px-[18px] py-[11px] whitespace-nowrap transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60"
            >
              {comprando ? t.nav.redirecting : t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      {/* Resultado de la compra — Stripe redirige acá con ?compra=exito&session_id=... */}
      {compra && (
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 pt-8">
          <div className="border border-copa-gold bg-copa-creamDeep px-6 py-5 flex flex-wrap items-start gap-4">
            {compra === 'cancelada' && (
              <div className="flex-1 min-w-[240px]">
                <h3 className="font-cormorant" style={{ fontSize: 22 }}>{t.compra.canceladaTitle}</h3>
                <p className="text-copa-ink/70 mt-1" style={{ fontSize: 15 }}>{t.compra.canceladaParagraph}</p>
              </div>
            )}
            {compra === 'exito' && compraStatus === 'verificando' && (
              <p className="font-jost text-xs tracking-[0.14em] uppercase text-copa-ink/70">{t.compra.verificando}</p>
            )}
            {compra === 'exito' && compraStatus === 'pagado' && (
              <div className="flex-1 min-w-[240px]">
                <h3 className="font-cormorant" style={{ fontSize: 22 }}>{t.compra.exitoTitle}</h3>
                <p className="text-copa-ink/70 mt-1" style={{ fontSize: 15 }}>{t.compra.exitoParagraph}</p>
                {compraResultado?.downloadUrl && (
                  <a href={compraResultado.downloadUrl} download className={`${btnPrimary} mt-4 inline-flex`}>
                    {t.compra.descargar}
                  </a>
                )}
              </div>
            )}
            {compra === 'exito' && (compraStatus === 'no-pagado' || compraStatus === 'error') && (
              <div className="flex-1 min-w-[240px]">
                <h3 className="font-cormorant text-copa-burgundy" style={{ fontSize: 22 }}>{t.compra.errorTitle}</h3>
                <p className="text-copa-ink/70 mt-1" style={{ fontSize: 15 }}>{t.compra.errorParagraph}</p>
              </div>
            )}
            <button
              type="button"
              onClick={cerrarCompra}
              className="ml-auto font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/50 hover:text-copa-ink"
            >
              {t.compra.cerrar}
            </button>
          </div>
        </div>
      )}

      {/* 1 · Hero */}
      <section id="top" className="max-w-[1160px] mx-auto px-6 sm:px-8 pt-20 sm:pt-28 lg:pt-[132px] pb-16 sm:pb-24 lg:pb-[110px]">
        <div className="flex flex-wrap items-center gap-10 sm:gap-16 lg:gap-20">
          <div className="flex-[1_1_420px] min-w-[300px] max-w-[640px]">
            <Reveal className={eyebrow}>{t.hero.eyebrow}</Reveal>
            <Reveal delay={0.05}>
              <h1
                className="font-cormorant font-light leading-[0.98] tracking-tight mt-6"
                style={{ fontSize: 'clamp(44px,6.6vw,88px)' }}
              >
                {t.hero.titlePre}
                <em className="not-italic text-copa-burgundy">{t.hero.titleEm}</em>
                {t.hero.titlePost}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-[34em] text-copa-ink/90 mt-10" style={{ fontSize: 'clamp(18px,1.6vw,22px)', lineHeight: 1.6 }}>
                {t.hero.paragraph}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap items-center gap-7 mt-12">
              <button type="button" onClick={irACheckout} disabled={comprando} className={btnPrimary}>
                {comprando ? t.nav.redirecting : `${t.nav.cta} — ${PRICE_LABEL}`}
              </button>
              <a
                href="#adentro"
                className="font-jost text-xs tracking-[0.14em] uppercase text-copa-ink border-b border-copa-gold pb-1.5 transition-colors hover:text-copa-burgundy hover:border-copa-burgundy"
              >
                {t.hero.ctaSecondary}
              </a>
            </Reveal>
            <Reveal delay={0.2} className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-6 leading-loose">
              {t.hero.microcopy}
            </Reveal>
          </div>
          <div className="flex-[0_1_380px] min-w-[280px] flex justify-center p-7 sm:p-12 bg-copa-creamDeep">
            <img
              src="/images/guias/el-mundo-de-la-copa-tapa.jpg"
              alt={t.hero.coverAlt}
              width="451"
              height="627"
              className="w-full max-w-[340px] h-auto block"
              style={{ boxShadow: '14px 14px 0 rgba(43,35,32,.14)' }}
            />
          </div>
        </div>
      </section>

      {/* 2 · Barra de datos */}
      <section aria-label={t.dataBar.ariaLabel} className="border-y border-copa-gold">
        <div className="max-w-[1160px] mx-auto px-6 sm:px-8 py-6 flex flex-wrap gap-x-6 gap-y-2.5 justify-between font-jost text-[11px] tracking-[0.18em] uppercase">
          {t.dataBar.items.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && <span className="text-copa-gold">·</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 3 · El problema — única sección en borgoña a sangre */}
      <section ref={problemaRef} className="bg-copa-burgundy text-copa-cream py-24 sm:py-36 lg:py-[200px] px-6 sm:px-8">
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal className="font-jost text-[11px] tracking-[0.22em] uppercase text-copa-gold">{t.problema.eyebrow}</Reveal>
          <Reveal delay={0.05}>
            <h2
              className="font-cormorant font-light leading-[1.02] mt-6"
              style={{ fontSize: 'clamp(34px,5vw,64px)' }}
            >
              {t.problema.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="w-[90px] h-px bg-copa-gold mx-auto my-14" />
          <div className="flex flex-wrap gap-7 sm:gap-14 text-left justify-center">
            <Reveal className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              {t.problema.p1}
            </Reveal>
            <Reveal delay={0.05} className="flex-[1_1_300px] max-w-[34em] text-copa-cream/85" style={{ fontSize: 'clamp(17px,1.4vw,19px)', lineHeight: 1.65 }}>
              {t.problema.p2}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · El índice */}
      <section id="indice" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>{t.indice.eyebrow}</Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
            {t.indice.title}
          </h2>
        </Reveal>
        <div className="mt-20 border-t border-copa-gold">
          {t.indice.rows.map((row, i) => (
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
          <Reveal className={eyebrow}>{t.adentro.eyebrow}</Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-cormorant leading-[1.05] mt-6" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
              {t.adentro.title}
            </h2>
          </Reveal>
        </div>
        <div
          className="mt-16 flex gap-7 overflow-x-auto px-6 sm:px-8 pb-6"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {paginas.map((p) => (
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
          {t.adentro.dragHint}
        </div>
        {t.adentro.previewNote && (
          <div className="max-w-[1160px] mx-auto px-6 sm:px-8 mt-4 text-copa-ink/60" style={{ fontSize: 15, lineHeight: 1.5 }}>
            {t.adentro.previewNote}
          </div>
        )}
      </section>

      {/* 6 · Quién está atrás */}
      <section id="quienes" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <div className="flex flex-wrap gap-10 sm:gap-16 lg:gap-[88px]">
          <div className="flex-[1_1_420px] min-w-[280px]">
            <Reveal className={eyebrow}>{t.quienes.eyebrow}</Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-cormorant leading-[1.08] mt-6 max-w-[22em]" style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>
                {t.quienes.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 py-7 pl-6 border-l-2 border-dashed border-copa-burgundy/60">
              <div className="font-jost text-[11px] tracking-[0.18em] uppercase text-copa-burgundy">
                {t.quienes.label}
              </div>
              <p className="max-w-[34em] text-copa-ink/70 mt-3.5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                {t.quienes.bio}
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
            <Reveal className={eyebrow}>{t.oferta.eyebrow}</Reveal>
            <Reveal delay={0.05}>
              <div
                className="font-cormorant font-light leading-none text-copa-burgundy mt-5"
                style={{ fontSize: 'clamp(52px,7vw,72px)', fontFeatureSettings: "'tnum'" }}
              >
                {PRICE_LABEL}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="font-jost text-[11px] tracking-[0.16em] uppercase text-copa-ink/60 mt-[18px]">
              {t.oferta.paymentNote}
            </Reveal>
            <Reveal delay={0.15}>
              <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-10`}>
                {comprando ? t.nav.redirecting : `${t.nav.cta} — ${PRICE_LABEL}`}
              </button>
            </Reveal>
            <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-5 leading-loose">
              {t.oferta.secureNote}
            </div>
            {t.oferta.langNotice && (
              <div className="text-copa-burgundy mt-3" style={{ fontSize: 14, lineHeight: 1.5 }}>
                {t.oferta.langNotice}
              </div>
            )}
          </div>
          <div className="flex-[1_1_360px] max-w-[520px] flex flex-col gap-5">
            {t.oferta.incluye.map((item, i) => (
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
                {t.email.title}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-[32em] text-copa-ink/80 mt-5" style={{ fontSize: 18, lineHeight: 1.65 }}>
                {t.email.paragraph}
              </p>
            </Reveal>
          </div>
          <form onSubmit={enviarEmail} className="flex-[1_1_380px] max-w-[520px]">
            <div className="flex flex-wrap">
              <label htmlFor="copa-email-input" className="sr-only">{t.email.inputLabel}</label>
              <input
                id="copa-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email.placeholder}
                className="flex-[1_1_200px] min-w-0 bg-transparent border-0 border-b border-copa-gold rounded-none px-0.5 py-4 focus:outline-none"
                style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: '#2B2320' }}
              />
              <button
                type="submit"
                disabled={enviandoEmail}
                className="font-jost text-[11px] font-medium tracking-[0.14em] uppercase text-copa-cream bg-copa-burgundy border-0 px-5 py-[17px] cursor-pointer transition-colors duration-300 hover:bg-copa-ink disabled:opacity-60"
              >
                {enviandoEmail ? t.email.submitBusy : t.email.submitIdle}
              </button>
            </div>
            <div className="font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/60 mt-4 leading-loose">
              {emailMsg || t.email.defaultMsg}
            </div>
          </form>
        </div>
      </section>

      {/* 10 · Preguntas */}
      <section id="faq" className="max-w-[1160px] mx-auto px-6 sm:px-8 py-20 sm:py-32 lg:py-40">
        <Reveal className={eyebrow}>{t.faq.eyebrow}</Reveal>
        <div className="max-w-[820px] mt-14 border-t border-copa-gold/55">
          {t.faq.items.map((item, i) => {
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
            {t.cierre.title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <button type="button" onClick={irACheckout} disabled={comprando} className={`${btnPrimary} mt-14`}>
            {comprando ? t.nav.redirecting : `${t.nav.cta} — ${PRICE_LABEL}`}
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
            {t.footer.instagram}
          </a>
          <div className="flex gap-4 flex-wrap">
            <Link to="/terminos" className="text-copa-cream/80 hover:text-copa-gold transition-colors">{t.footer.terminos}</Link>
            <Link to="/politica-privacidad" className="text-copa-cream/80 hover:text-copa-gold transition-colors">{t.footer.privacidad}</Link>
            <Link to="/contacto" className="text-copa-cream/80 hover:text-copa-gold transition-colors">{t.footer.contacto}</Link>
          </div>
          <span className="text-copa-cream/60">{t.footer.copyright(new Date().getFullYear())}</span>
        </div>
      </footer>
    </div>
  );
};

export default ElMundoDeLaCopaLanding;
