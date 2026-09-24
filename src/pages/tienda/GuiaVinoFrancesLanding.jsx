import GuiaRegionalLanding from '@/pages/tienda/GuiaRegionalLanding';

// Contenido de la landing de venta de la Guía del Vino Francés — tercera y última entrega de la
// Colección Regional. Precio y checkout: ver api/_lib/catalog.js (guia-frances, USD 14.99, sin
// ancla de precio "anterior"). Página cuenta y capítulos (90 páginas, 16 capítulos, diez regiones)
// tomados de la tapa real de la guía; el copy de índice y problema se basa en las 6 páginas de
// muestra provistas por Julian (mapa maestro, márgenes de Burdeos, assemblage, Côte d'Or, escala
// de dosage de Champagne y tabla de cata) — a diferencia de España/Argentina, todavía no se
// verificó contra el PDF completo.
const CONTENT = {
  guideId: 'guia-frances',
  path: '/tienda/guia-vino-frances',
  // Nombre traducido a los tres idiomas — se usa en el aviso de "todavía no disponible en
  // inglés/portugués" (ver GuiaRegionalLanding.jsx), que se muestra en el idioma que se clickeó.
  nombre: {
    es: 'La Guía del Vino Francés',
    en: 'The French Wine Guide',
    pt: 'O Guia do Vinho Francês',
  },
  meta: {
    title: 'Guía del Vino Francés — Vako Club',
    description:
      'Guía digital de 90 páginas de Vako Club: Burdeos vs. Borgoña, Champagne sin el mito del "seco", y las diez regiones de Francia explicadas de una vez. Descarga inmediata en PDF.',
  },
  hero: {
    eyebrow: 'Colección Regional Vako Club · Tercera entrega: Francia',
    titlePre: 'El vino francés deja de intimidar cuando dejás de ver un mapa y empezás a ver un ',
    titleEm: 'sistema',
    titlePost: '.',
    paragraph:
      'Burdeos, Borgoña, Champagne, Ródano y seis regiones más explicadas de una vez: qué uva hay detrás de cada nombre, por qué la etiqueta casi nunca la dice, y cómo leer un Grand Cru sin adivinar.',
    ctaSecondary: 'Ver páginas de adentro',
    microcopy: 'Descarga inmediata en PDF · Pago seguro · Garantía de devolución 14 días',
    coverAlt: 'Tapa de la Guía del Vino Francés, de Vako Club',
    coverSrc: '/images/guias/guia-vino-frances-tapa.jpg',
    coverWidth: 900,
    coverHeight: 1273,
  },
  adentro: {
    eyebrow: 'Un vistazo',
    title: 'Adentro se ve así.',
    dragHint: 'Arrastrá para ver más',
    pages: [
      { src: '/images/guias/paginas-frances/pagina-01.jpg', alt: 'Página interior: mapa maestro con las diez regiones de Francia y los ríos que las ordenan' },
      { src: '/images/guias/paginas-frances/pagina-02.jpg', alt: 'Página interior: las dos márgenes de Burdeos, Médoc y Pomerol explicados por su suelo' },
      { src: '/images/guias/paginas-frances/pagina-03.jpg', alt: 'Página interior: las cinco uvas de Burdeos y el assemblage de cada margen' },
      { src: '/images/guias/paginas-frances/pagina-04.jpg', alt: 'Página interior: mapa de la Côte d\'Or y los Grands Crus de Borgoña, pueblo por pueblo' },
      { src: '/images/guias/paginas-frances/pagina-05.jpg', alt: 'Página interior: la escala real de dosage del Champagne, de Brut Nature a Doux' },
      { src: '/images/guias/paginas-frances/pagina-06.jpg', alt: 'Página interior: tabla comparativa de acidez, tanino, cuerpo y alcohol de ocho vinos franceses' },
    ],
  },
  dataBar: {
    items: ['90 páginas', 'PDF descargable', 'Español', 'Descarga inmediata'],
  },
  problema: {
    eyebrow: 'Seamos sinceros',
    title: 'Francia tiene el vocabulario más intimidante del mundo del vino — y no es casualidad.',
    p1: 'Es el único país donde la etiqueta casi nunca dice la uva: dice el lugar. Saint-Julien, Pouilly-Fuissé, Gevrey-Chambertin. Si no sabés qué uva y qué estilo esconde cada nombre, cada botella francesa es una apuesta a ciegas.',
    p2: 'No es que el sistema sea arbitrario — es que nadie te explicó la lógica una sola vez, de punta a punta. Diez regiones, dieciséis capítulos, un solo idioma común para entenderlas todas: esta guía es esa explicación.',
  },
  indice: {
    eyebrow: 'Qué vas a encontrar',
    title: 'Seis maneras de dejar de adivinar frente a una etiqueta francesa.',
    rows: [
      { titulo: 'El mapa que ordena todo', desc: 'Las diez regiones de Francia ubicadas por los cuatro ríos que las atraviesan — Loira, Ródano, Garona y Marne — en vez de una lista para memorizar.' },
      { titulo: 'Burdeos por sus dos márgenes', desc: 'Por qué Médoc y Pomerol, separados por un mismo estuario, producen vinos tan distintos: grava y Cabernet de un lado, arcilla y Merlot del otro.' },
      { titulo: 'El assemblage, con proporciones reales', desc: 'Cabernet Sauvignon, Merlot, Cabernet Franc y Petit Verdot: qué aporta cada uva a la mezcla y por qué Burdeos casi nunca embotella un varietal solo.' },
      { titulo: 'Borgoña, pueblo por pueblo', desc: 'La Côte d\'Or recorrida de norte a sur, con los Grands Crus de Gevrey-Chambertin a Puligny-Montrachet, para entender por qué dos viñedos vecinos valen precios tan distintos.' },
      { titulo: 'Champagne sin el mito del "seco"', desc: 'La escala real de dosage, de Brut Nature a Doux, y por qué un Extra Dry es en realidad más dulce que un Brut.' },
      { titulo: 'Cómo catar como se cata en Francia', desc: 'Acidez, tanino, cuerpo y alcohol de ocho perfiles de referencia — de Muscadet a Châteauneuf-du-Pape — para dejar de describir un vino solo por si "gusta" o no.' },
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
      'Las 90 páginas en PDF de alta calidad',
      'Descarga inmediata, sin vencimiento',
      'Actualizaciones futuras sin costo',
      'Invitación a la Membresía Gratuita de Vako Club',
    ],
  },
  coleccion: {
    eyebrow: 'Colección Regional',
    title: 'Francia cierra la colección. España y Argentina ya están disponibles.',
    text: 'La Guía del Vino Español y la Guía del Vino Argentino fueron las dos primeras entregas de la colección. Comprando ahora quedás con una invitación a la Membresía Gratuita de Vako Club.',
    links: [
      { href: '/tienda/guia-vino-espanol', label: 'Ver la Guía del Vino Español' },
      { href: '/tienda/guia-vino-argentino', label: 'Ver la Guía del Vino Argentino' },
      { href: '/suscripcion', label: 'Unirme gratis a la comunidad' },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    items: [
      { q: '¿Por qué pagar por esto si hay información gratis en internet?', a: 'Tenés razón: hay muchísima información gratuita sobre vino francés. El problema no es que falte información, es que está repartida en blogs, videos y publicaciones sueltas, con niveles de calidad muy distintos. Esta guía la junta una sola vez, curada y pensada para leerse en una sesión. Una guía, no 15 pestañas.' },
      { q: '¿Es para principiantes o para gente que ya sabe de vino?', a: 'Está pensada sobre todo para quien tiene curiosidad y se pierde con los nombres de región — no hace falta saber nada de vino para empezar. Si ya trabajás en el sector o preparás una certificación profesional, probablemente ya conozcas buena parte de lo básico que cubre.' },
      { q: '¿En qué formato la recibo y cómo la descargo?', a: 'Es un PDF digital. En cuanto se confirma el pago, esta misma página te muestra el botón de descarga — sin envío físico ni esperas. Se lee en el celular, la tablet o la computadora, y también se puede imprimir.' },
      { q: '¿Puedo pedir un reembolso si no me convence?', a: 'Sí. Tenés 14 días completos desde tu compra para escribirnos a info@vakoclub.com y te devolvemos el 100%, sin necesidad de justificarlo.' },
      { q: '¿Qué incluye exactamente el precio?', a: 'La Guía del Vino Francés completa en PDF y una invitación a la Membresía Gratuita de Vako Club. Todo por un único pago, sin suscripción.' },
      { q: '¿Necesito comprar también El Mundo de la Copa?', a: 'No, son productos independientes y podés comprar cualquiera de los dos por separado.' },
      { q: '¿Esta compra incluye la guía de España o Argentina?', a: 'No — cada guía regional se vende por separado. Las guías de España y Argentina ya están disponibles, así que como comprador de Francia podés sumarlas cuando quieras.' },
      { q: '¿Cómo se procesa el pago? ¿Es seguro?', a: 'El pago se procesa dentro del sitio con Stripe, de forma segura. Vako Club nunca ve ni guarda los datos de tu tarjeta.' },
      { q: '¿Puedo regalarla?', a: 'Sí. Comprala igual que siempre y escribinos a info@vakoclub.com para indicarnos a quién enviarle el enlace de descarga.' },
      { q: '¿La guía caduca?', a: 'No. Es un archivo que descargás una vez y conservás para siempre, sin depender de ninguna suscripción activa.' },
    ],
  },
  cierre: { title: 'La próxima vez que leas "Saint-Julien" en una carta, vas a saber exactamente qué estás por pedir.' },
};

const GuiaVinoFrancesLanding = () => <GuiaRegionalLanding content={CONTENT} />;

export default GuiaVinoFrancesLanding;
