import GuiaRegionalLanding from '@/pages/tienda/GuiaRegionalLanding';

// Contenido de la landing de venta de la Guía del Vino Argentino — segunda entrega de la
// Colección Regional. Precio y checkout: ver api/_lib/catalog.js (guia-argentino, USD 14.99, sin
// ancla de precio "anterior"). Todas las cifras y páginas de muestra citadas acá se verificaron
// contra el PDF real (private/guias/guia-vino-argentino.pdf, 66 páginas) antes de escribirse.
const CONTENT = {
  guideId: 'guia-argentino',
  path: '/tienda/guia-vino-argentino',
  // Nombre traducido a los tres idiomas — se usa en el aviso de "todavía no disponible en
  // inglés/portugués" (ver GuiaRegionalLanding.jsx), que se muestra en el idioma que se clickeó.
  nombre: {
    es: 'La Guía del Vino Argentino',
    en: 'The Argentine Wine Guide',
    pt: 'O Guia do Vinho Argentino',
  },
  meta: {
    title: 'Guía del Vino Argentino — Vako Club',
    description:
      'Guía digital de 66 páginas de Vako Club: Malbec, Bonarda y Torrontés, la altura del viñedo como identidad, y Mendoza, Salta, San Juan y Patagonia explicadas de una vez. Descarga inmediata en PDF.',
  },
  hero: {
    eyebrow: 'Colección Regional Vako Club · Segunda entrega: Argentina',
    titlePre: 'El vino argentino es mucho más que ',
    titleEm: 'Malbec',
    titlePost: '.',
    paragraph:
      'Bonarda, Torrontés, Cabernet Franc y viñedos que llegan a más de 1.700 metros: Mendoza, Salta, San Juan y Patagonia explicadas de una vez, en un solo PDF.',
    ctaSecondary: 'Ver páginas de adentro',
    microcopy: 'Descarga inmediata en PDF · Pago seguro · Garantía de devolución 14 días',
    coverAlt: 'Tapa de la Guía del Vino Argentino, de Vako Club',
    coverSrc: '/images/guias/guia-vino-argentino-tapa.jpg',
    coverWidth: 900,
    coverHeight: 1273,
  },
  adentro: {
    eyebrow: 'Un vistazo',
    title: 'Adentro se ve así.',
    dragHint: 'Arrastrá para ver más',
    pages: [
      { src: '/images/guias/paginas-argentino/pagina-01.jpg', alt: 'Página interior: cómo está organizada la guía y su eje de lectura vertical' },
      { src: '/images/guias/paginas-argentino/pagina-02.jpg', alt: 'Página interior: tamaño, reparto por provincia y destino del viñedo argentino' },
      { src: '/images/guias/paginas-argentino/pagina-03.jpg', alt: 'Página interior: la crisis de los 80 y el nacimiento del Malbec de exportación' },
      { src: '/images/guias/paginas-argentino/pagina-04.jpg', alt: 'Página interior: qué región elegir para cada ocasión' },
      { src: '/images/guias/paginas-argentino/pagina-05.jpg', alt: 'Página interior: espumantes y vinos dulces argentinos' },
      { src: '/images/guias/paginas-argentino/pagina-06.jpg', alt: 'Página interior: Catamarca y La Rioja, y la Torrontés riojana' },
    ],
  },
  dataBar: {
    items: ['66 páginas', 'PDF descargable', 'Español', 'Descarga inmediata'],
  },
  problema: {
    eyebrow: 'Seamos sinceros',
    title: 'Creés que ya sabés de vino argentino porque probaste un Malbec.',
    p1: 'Es el punto de partida más común y el más incompleto. Argentina es el quinto productor mundial de vino y el país con más viñedo de altura del planeta — pero la conversación se queda casi siempre en una sola uva y una sola provincia.',
    p2: 'Bonarda, Torrontés, Cabernet Franc, la Patagonia, Salta a metros que ninguna otra región vitivinícola alcanza: hay mucho más, y no hace falta ser sommelier para entenderlo. Solo hace falta que alguien lo ordene una vez.',
  },
  indice: {
    eyebrow: 'Qué vas a encontrar',
    title: 'Seis maneras de ir más allá del Malbec.',
    rows: [
      { titulo: 'Más allá del Malbec', desc: 'Bonarda, Torrontés riojano, Cabernet Franc y las uvas criollas: lo que te perdés si solo conocés una variedad.' },
      { titulo: 'La altura como identidad', desc: 'Por qué la cota del viñedo cambia lo que hay en la copa — de los 900 metros de media nacional a zonas mucho más altas en Salta y Mendoza.' },
      { titulo: 'El mapa que no es solo Mendoza', desc: 'Valle de Uco, Luján de Cuyo y Maipú puerta adentro, más Salta y Cafayate, San Juan y Patagonia.' },
      { titulo: 'La poda más grande de la historia argentina', desc: 'Cómo la crisis de los 80 terminó ordenando la industria y abriendo paso al Malbec de exportación que hoy conocés.' },
      { titulo: 'Lo que Argentina hace bien y vende mal', desc: 'Espumantes de método tradicional y vinos dulces de tradición casi colonial — dos categorías que casi nadie pide.' },
      { titulo: 'Qué región para qué momento', desc: 'Una guía práctica para elegir según la ocasión — un asado, un regalo, un pescado — no según la jerarquía.' },
    ],
  },
  confianza: {
    items: [
      'Pago 100% seguro, procesado por Stripe',
      'Mirá páginas reales antes de decidir — no es una maqueta',
      'Devolución completa dentro de 14 días, sin preguntas',
    ],
  },
  oferta: {
    eyebrow: 'La guía completa',
    paymentNote: 'Pago único · Sin vencimiento',
    garantia: {
      titulo: 'Garantía de devolución — 14 días.',
      texto: 'Si sentís que no te aportó valor, escribinos a info@vakoclub.com dentro de los 14 días posteriores a la compra y te devolvemos el 100%, sin pedirte explicaciones.',
    },
    secureNote: 'Pago seguro con Stripe · Recibís el enlace de descarga al instante en esta misma página',
    incluye: [
      'Las 66 páginas en PDF de alta calidad',
      'Descarga inmediata, sin vencimiento',
      'Actualizaciones futuras sin costo',
      'Acceso anticipado y aviso prioritario cuando salga la próxima guía de la colección',
      'Invitación a la Membresía Gratuita de Vako Club',
    ],
  },
  coleccion: {
    eyebrow: 'Colección Regional',
    title: 'Argentina es la segunda entrega. España ya está disponible.',
    text: 'La Guía del Vino Español fue la primera entrega de la colección — y más adelante se suma Francia. Comprando ahora quedás con acceso anticipado y aviso prioritario cuando salga cada nueva entrega, más una invitación a la Membresía Gratuita de Vako Club.',
    links: [
      { href: '/tienda/guia-vino-espanol', label: 'Ver la Guía del Vino Español' },
      { href: '/suscripcion', label: 'Unirme gratis a la comunidad' },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    items: [
      { q: '¿Por qué pagar por esto si hay información gratis en internet?', a: 'Tenés razón: hay muchísima información gratuita sobre vino argentino. El problema no es que falte información, es que está repartida en blogs de bodegas, videos y publicaciones sueltas. Esta guía la junta una sola vez, curada y pensada para leerse en una sesión. Una guía, no 15 pestañas.' },
      { q: '¿Es para principiantes o para gente que ya sabe de vino?', a: 'Está pensada sobre todo para quien tiene curiosidad y hoy asocia "vino argentino" solo con Malbec — no hace falta saber nada de vino para empezar. Si ya trabajás en el sector, probablemente ya conozcas buena parte de lo básico que cubre.' },
      { q: '¿En qué formato la recibo y cómo la descargo?', a: 'Es un PDF digital. En cuanto se confirma el pago, esta misma página te muestra el botón de descarga — sin envío físico ni esperas. Se lee en el celular, la tablet o la computadora, y también se puede imprimir.' },
      { q: '¿Puedo pedir un reembolso si no me convence?', a: 'Sí. Tenés 14 días completos desde tu compra para escribirnos a info@vakoclub.com y te devolvemos el 100%, sin necesidad de justificarlo.' },
      { q: '¿Qué incluye exactamente el precio?', a: 'La Guía del Vino Argentino completa en PDF, acceso anticipado a la próxima guía de la colección, y una invitación a la Membresía Gratuita de Vako Club. Todo por un único pago, sin suscripción.' },
      { q: '¿Necesito comprar también El Mundo de la Copa?', a: 'No, son productos independientes y podés comprar cualquiera de los dos por separado.' },
      { q: '¿Esta compra incluye la guía de España o Francia?', a: 'No — cada guía regional se vende por separado. La Guía del Vino Español ya está disponible; Francia todavía no tiene fecha. Como comprador de Argentina, sos de los primeros en enterarte cuando salga.' },
      { q: '¿Cómo se procesa el pago? ¿Es seguro?', a: 'El pago se procesa dentro del sitio con Stripe, de forma segura. Vako Club nunca ve ni guarda los datos de tu tarjeta.' },
      { q: '¿Puedo regalarla?', a: 'Sí. Comprala igual que siempre y escribinos a info@vakoclub.com para indicarnos a quién enviarle el enlace de descarga.' },
      { q: '¿La guía caduca?', a: 'No. Es un archivo que descargás una vez y conservás para siempre, sin depender de ninguna suscripción activa.' },
    ],
  },
  cierre: { title: 'La próxima vez que pidas "un Malbec", vas a saber exactamente cuál.' },
};

const GuiaVinoArgentinoLanding = () => <GuiaRegionalLanding content={CONTENT} />;

export default GuiaVinoArgentinoLanding;
