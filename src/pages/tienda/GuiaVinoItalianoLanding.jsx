import GuiaRegionalLanding from '@/pages/tienda/GuiaRegionalLanding';

// Contenido de la landing de venta de la Guía del Vino Italiano — cuarta entrega de la Colección
// Regional (Nº 04 en la tapa). Precio y checkout: ver api/_lib/catalog.js (guia-italiano, USD
// 14.99, sin ancla de precio "anterior"). Página cuenta, capítulos y cifras (90 páginas, 17
// capítulos, 20 regiones, 500+ uvas, ley DOC de 1963) tomados del PDF completo; el índice y las 6
// páginas de muestra son los gráficos B, C, D, H, O y Q de la guía (páginas 9, 12, 17, 31, 69 y 74).
const CONTENT = {
  guideId: 'guia-italiano',
  path: '/tienda/guia-vino-italiano',
  // Nombre traducido a los tres idiomas — se usa en el aviso de "todavía no disponible en
  // inglés/portugués" (ver GuiaRegionalLanding.jsx), que se muestra en el idioma que se clickeó.
  nombre: {
    es: 'La Guía del Vino Italiano',
    en: 'The Italian Wine Guide',
    pt: 'O Guia do Vinho Italiano',
  },
  meta: {
    title: 'Guía del Vino Italiano — Vako Club',
    description:
      'Guía digital de 90 páginas de Vako Club: DOCG, Barolo, Chianti, Amarone y los Supertuscans, con las veinte regiones de Italia explicadas de una vez. Descarga inmediata en PDF.',
  },
  hero: {
    eyebrow: 'Colección Regional Vako Club · Cuarta entrega: Italia',
    titlePre: 'Si Francia se entiende como sistema, Italia se entiende como ',
    titleEm: 'suma de excepciones',
    titlePost: '.',
    paragraph:
      'Veinte regiones, más de quinientas uvas propias y una ley que llegó cuando el vino ya estaba hecho. Del Piamonte a Sicilia, qué hay detrás de cada nombre y por qué en Italia se compra primero el productor.',
    ctaSecondary: 'Ver páginas de adentro',
    microcopy: 'Descarga inmediata en PDF · Pago seguro · Garantía de devolución 7 días',
    coverAlt: 'Tapa de la Guía del Vino Italiano, de Vako Club',
    coverSrc: '/images/guias/guia-vino-italiano-tapa.jpg',
    coverWidth: 900,
    coverHeight: 1273,
  },
  adentro: {
    eyebrow: 'Un vistazo',
    title: 'Adentro se ve así.',
    dragHint: 'Arrastrá para ver más',
    pages: [
      { src: '/images/guias/paginas-italiano/pagina-01.jpg', alt: 'Página interior: mapa maestro de Italia con las regiones de la guía, del Piamonte a Sicilia y Cerdeña' },
      { src: '/images/guias/paginas-italiano/pagina-02.jpg', alt: 'Página interior: la pirámide DOCG, DOC, IGT y Vino frente a la escalera del precio de mercado' },
      { src: '/images/guias/paginas-italiano/pagina-03.jpg', alt: 'Página interior: Barolo y Barbaresco a uno y otro lado de Alba, con sus comunas y suelos' },
      { src: '/images/guias/paginas-italiano/pagina-04.jpg', alt: 'Página interior: la escalera de Valpolicella, de la uva fresca al Amarone y el Recioto' },
      { src: '/images/guias/paginas-italiano/pagina-05.jpg', alt: 'Página interior: Sangiovese y Nebbiolo comparados rasgo por rasgo para distinguirlos a ciegas' },
      { src: '/images/guias/paginas-italiano/pagina-06.jpg', alt: 'Página interior: cuadro de catorce añadas de Barolo, Brunello y Chianti Classico' },
    ],
  },
  dataBar: {
    items: ['90 páginas', 'PDF descargable', 'Español', 'Descarga inmediata'],
  },
  problema: {
    eyebrow: 'Seamos sinceros',
    title: 'Italia es el país del vino más fácil de disfrutar — y el más difícil de entender.',
    p1: 'Montepulciano es una uva en los Abruzos y un pueblo en Toscana. Un IGT puede costar más que casi cualquier DOCG. Hay más de quinientas uvas registradas y cada una de las veinte regiones hace vino. Si nadie te dio el mapa, cada carta italiana es una lista de nombres sueltos.',
    p2: 'No hace falta memorizarlos — hace falta ordenarlos. Diecisiete capítulos que van de la identidad y la clasificación a las regiones de norte a sur, y de ahí a la cata, las añadas, la mesa y la compra: esta guía es ese orden.',
  },
  indice: {
    eyebrow: 'Qué vas a encontrar',
    title: 'Seis maneras de dejar de adivinar frente a una etiqueta italiana.',
    rows: [
      { titulo: 'El mapa que ordena la bota', desc: 'Las regiones de la guía ubicadas entre los Alpes y los Apeninos, agrupadas en norte, centro y sur con islas — y qué estilo de vino esperar de cada una.' },
      { titulo: 'La pirámide y el precio', desc: 'DOCG, DOC, IGT y Vino: qué garantiza cada sigla, y por qué un Supertuscan como Tignanello se vende como IGT por encima de casi cualquier DOCG toscana.' },
      { titulo: 'Barolo y Barbaresco, lado a lado', desc: 'La misma uva a quince kilómetros de distancia: las comunas de cada denominación y cómo el suelo separa un Barolo perfumado de uno de guarda larga.' },
      { titulo: 'La escalera de Valpolicella', desc: 'Del Valpolicella joven al Ripasso, el Amarone y el Recioto: cómo el appassimento concentra la uva y cambia el vino escalón por escalón.' },
      { titulo: 'Sangiovese o Nebbiolo, a ciegas', desc: 'Las dos comparten acidez y tanino; la diferencia está en el color y el perfume. Las señales concretas para distinguirlas en la copa.' },
      { titulo: 'Catorce añadas, en un cuadro', desc: 'Qué años de Barolo, Brunello y Chianti Classico guardar, cuáles beber ya y cuáles elegir con cuidado — porque en Piamonte y Toscana el clima decide.' },
    ],
  },
  confianza: {
    items: [
      'Pago 100% seguro, procesado por Stripe',
      'Mirá páginas reales antes de decidir — no es una maqueta',
      'Devolución completa dentro de 7 días, sin preguntas',
    ],
  },
  oferta: {
    eyebrow: 'La guía completa',
    paymentNote: 'Pago único · Sin vencimiento',
    garantia: {
      titulo: 'Garantía de devolución — 7 días.',
      texto: 'Si sentís que no te aportó valor, escribinos a info@vakoclub.com dentro de los 7 días posteriores a la compra y te devolvemos el 100%, sin pedirte explicaciones.',
    },
    secureNote: 'Pago seguro con Stripe · Recibís el enlace de descarga al instante en esta misma página',
    incluye: [
      'Las 90 páginas en PDF de alta calidad',
      'Glosario final de sesenta términos italianos',
      'Descarga inmediata, sin vencimiento',
      'Actualizaciones futuras sin costo',
      'Invitación a la Membresía Gratuita de Vako Club',
    ],
  },
  coleccion: {
    eyebrow: 'Colección Regional',
    title: 'Italia es la cuarta entrega. España, Argentina y Francia ya están disponibles.',
    text: 'La Guía del Vino Español, la Guía del Vino Argentino y la Guía del Vino Francés fueron las tres primeras entregas de la colección. Comprando ahora quedás con una invitación a la Membresía Gratuita de Vako Club.',
    links: [
      { href: '/tienda/guia-vino-espanol', label: 'Ver la Guía del Vino Español' },
      { href: '/tienda/guia-vino-argentino', label: 'Ver la Guía del Vino Argentino' },
      { href: '/tienda/guia-vino-frances', label: 'Ver la Guía del Vino Francés' },
      { href: '/suscripcion', label: 'Unirme gratis a la comunidad' },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    items: [
      { q: '¿Por qué pagar por esto si hay información gratis en internet?', a: 'Tenés razón: hay muchísima información gratuita sobre vino italiano. El problema no es que falte información, es que está repartida en blogs, videos y publicaciones sueltas, con niveles de calidad muy distintos. Esta guía la junta una sola vez, curada y pensada para leerse en una sesión. Una guía, no 15 pestañas.' },
      { q: '¿Es para principiantes o para gente que ya sabe de vino?', a: 'Está pensada sobre todo para quien tiene curiosidad y se pierde con los nombres de región y de uva — no hace falta saber nada de vino para empezar. Si ya trabajás en el sector o preparás una certificación profesional, probablemente ya conozcas buena parte de lo básico que cubre.' },
      { q: '¿En qué formato la recibo y cómo la descargo?', a: 'Es un PDF digital. En cuanto se confirma el pago, esta misma página te muestra el botón de descarga — sin envío físico ni esperas. Se lee en el celular, la tablet o la computadora, y también se puede imprimir.' },
      { q: '¿Puedo pedir un reembolso si no me convence?', a: 'Sí. Tenés 7 días completos desde tu compra para escribirnos a info@vakoclub.com y te devolvemos el 100%, sin necesidad de justificarlo.' },
      { q: '¿Qué incluye exactamente el precio?', a: 'La Guía del Vino Italiano completa en PDF y una invitación a la Membresía Gratuita de Vako Club. Todo por un único pago, sin suscripción.' },
      { q: '¿Necesito comprar también El Mundo de la Copa?', a: 'No, son productos independientes y podés comprar cualquiera de los dos por separado.' },
      { q: '¿Esta compra incluye las guías de España, Argentina o Francia?', a: 'No — cada guía regional se vende por separado. Las guías de España, Argentina y Francia ya están disponibles, así que como comprador de Italia podés sumarlas cuando quieras.' },
      { q: '¿Cómo se procesa el pago? ¿Es seguro?', a: 'El pago se procesa dentro del sitio con Stripe, de forma segura. Vako Club nunca ve ni guarda los datos de tu tarjeta.' },
      { q: '¿Puedo regalarla?', a: 'Sí. Comprala igual que siempre y escribinos a info@vakoclub.com para indicarnos a quién enviarle el enlace de descarga.' },
      { q: '¿La guía caduca?', a: 'No. Es un archivo que descargás una vez y conservás para siempre, sin depender de ninguna suscripción activa.' },
    ],
  },
  cierre: { title: 'La próxima vez que leas "Montepulciano" en una carta, vas a saber si es una uva o un pueblo.' },
};

const GuiaVinoItalianoLanding = () => <GuiaRegionalLanding content={CONTENT} />;

export default GuiaVinoItalianoLanding;
