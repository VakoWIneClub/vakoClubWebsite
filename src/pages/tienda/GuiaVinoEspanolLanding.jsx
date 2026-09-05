import GuiaRegionalLanding from '@/pages/tienda/GuiaRegionalLanding';

// Contenido de la landing de venta de la Guía del Vino Español — primera entrega de la Colección
// Regional. Precio y checkout: ver api/_lib/catalog.js (guia-espanol, USD 14.99, sin ancla de
// precio "anterior" porque nunca se cobró un precio más alto — decisión explícita de Julian).
// Todas las cifras y páginas de muestra citadas acá se verificaron contra el PDF real
// (private/guias/guia-vino-espanol.pdf, 128 páginas) antes de escribirse.
const CONTENT = {
  guideId: 'guia-espanol',
  path: '/tienda/guia-vino-espanol',
  // Nombre traducido a los tres idiomas — se usa en el aviso de "todavía no disponible en
  // inglés/portugués" (ver GuiaRegionalLanding.jsx), que se muestra en el idioma que se clickeó.
  nombre: {
    es: 'La Guía del Vino Español',
    en: 'The Spanish Wine Guide',
    pt: 'O Guia do Vinho Espanhol',
  },
  meta: {
    title: 'Guía del Vino Español — Vako Club',
    description:
      'Guía digital de 128 páginas de Vako Club para entender de una vez Crianza, Reserva y Gran Reserva, las Denominaciones de Origen y las uvas autóctonas de España. Descarga inmediata en PDF.',
  },
  hero: {
    eyebrow: 'Colección Regional Vako Club · Primera entrega: España',
    titlePre: 'Dejá de sentirte ',
    titleEm: 'perdido',
    titlePost: ' frente al vino español.',
    paragraph:
      'De Rioja a Rías Baixas, de Tempranillo a Albariño: por fin vas a entender qué significa de verdad Crianza, Reserva y Gran Reserva. Todo en un solo PDF — sin abrir 15 pestañas.',
    ctaSecondary: 'Ver páginas de adentro',
    microcopy: 'Descarga inmediata en PDF · Pago seguro · Garantía de devolución 14 días',
    coverAlt: 'Tapa de la Guía del Vino Español, de Vako Club',
    coverSrc: '/images/guias/guia-vino-espanol-tapa.jpg',
    coverWidth: 1000,
    coverHeight: 1412,
  },
  adentro: {
    eyebrow: 'Un vistazo',
    title: 'Adentro se ve así.',
    dragHint: 'Arrastrá para ver más',
    pages: [
      { src: '/images/guias/paginas-espanol/pagina-01.jpg', alt: 'Página interior: por qué España tiene tanto viñedo y produce menos que Francia o Italia' },
      { src: '/images/guias/paginas-espanol/pagina-02.jpg', alt: 'Página interior: tres uvas tintas que cambian el cliché del vino español' },
      { src: '/images/guias/paginas-espanol/pagina-03.jpg', alt: 'Página interior: mapa de Rías Baixas, clima, suelo y altitud' },
      { src: '/images/guias/paginas-espanol/pagina-04.jpg', alt: 'Página interior: las uvas y los niveles de gama de Navarra' },
      { src: '/images/guias/paginas-espanol/pagina-05.jpg', alt: 'Página interior: Manchuela, Empordà y Mallorca explicadas' },
      { src: '/images/guias/paginas-espanol/pagina-06.jpg', alt: 'Página interior: la lista de la estantería para llevar al bolsillo' },
    ],
  },
  dataBar: {
    items: ['128 páginas', 'PDF descargable', 'Español', 'Descarga inmediata'],
  },
  problema: {
    eyebrow: 'Seamos sinceros',
    title: '¿Sabés de verdad la diferencia entre Crianza, Reserva y Gran Reserva?',
    p1: 'Estás frente a la sección de vinos españoles del súper, o a la carta de un restaurante, y todas las etiquetas parecen decir lo mismo con palabras distintas: Rioja, Ribera del Duero, DOCa, DO, Crianza, Reserva, Gran Reserva. Sabés que hay una diferencia real — pero no la sabrías explicar si te preguntaran.',
    p2: 'No es falta de curiosidad. Es que nadie te lo explicó nunca en un solo lugar, de forma simple, sin necesitar conocimientos previos. Esta guía es ese lugar.',
  },
  indice: {
    eyebrow: 'Qué vas a encontrar',
    title: 'Seis maneras de dejar de improvisar frente a una etiqueta española.',
    rows: [
      { titulo: 'El código de la etiqueta', desc: 'Joven, Crianza, Reserva y Gran Reserva, explicados de una vez — y por qué una botella cuesta el doble que otra con el mismo nombre de DO.' },
      { titulo: 'El mapa que ya conocés de nombre', desc: 'Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda y Cava: qué hace diferente a cada una, no solo dónde están en el mapa.' },
      { titulo: 'Las uvas que hacen a España única', desc: 'Tempranillo, Garnacha, Albariño, Verdejo, Mencía, Monastrell — y variedades menos obvias como Bobal y Graciano.' },
      { titulo: 'Cómo llegamos hasta acá', desc: 'De la filoxera francesa que trajo la barrica a La Rioja, al Priorat de los años 80, al giro atlántico de hoy — contado como una historia, no como una lista de fechas.' },
      { titulo: 'Maridaje español de verdad', desc: 'Qué abrir con jamón ibérico, tapas clásicas, paella y marisco gallego — sin genéricos tipo "carne roja".' },
      { titulo: 'La lista de la estantería', desc: 'Qué elegir según lo que busques: seguro, fresco, con potencia, para sorprender, para gastar poco o para guardar diez años.' },
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
    ctaConGarantia: 'Conseguir la guía — USD 14.99',
    secureNote: 'Pago seguro con Stripe · Recibís el enlace de descarga al instante en esta misma página',
    incluye: [
      'Las 128 páginas en PDF de alta calidad',
      'Descarga inmediata, sin vencimiento',
      'Actualizaciones futuras sin costo',
      'Acceso anticipado y aviso prioritario cuando salga la próxima guía de la colección',
      'Invitación a la Membresía Gratuita de Vako Club',
    ],
  },
  coleccion: {
    eyebrow: 'Colección Regional',
    title: 'España es la primera entrega. Argentina ya está disponible.',
    text: 'Después de España llegó la Guía del Vino Argentino — y más adelante se suma Francia. Comprando ahora quedás con acceso anticipado y aviso prioritario cuando salga cada nueva entrega, más una invitación a la Membresía Gratuita de Vako Club.',
    links: [
      { href: '/tienda/guia-vino-argentino', label: 'Ver la Guía del Vino Argentino' },
      { href: '/suscripcion', label: 'Unirme gratis a la comunidad' },
    ],
  },
  faq: {
    eyebrow: 'Preguntas',
    items: [
      { q: '¿Por qué pagar por esto si hay información gratis en internet?', a: 'Tenés razón: hay muchísima información gratuita sobre vino español. El problema no es que falte información, es que está repartida en decenas de sitios distintos, con niveles de calidad muy distintos. Esta guía la junta una sola vez, curada y pensada para leerse en una sesión. Una guía, no 15 pestañas.' },
      { q: '¿Es para principiantes o para gente que ya sabe de vino?', a: 'Está pensada sobre todo para quien tiene curiosidad y se pierde con los tecnicismos — no hace falta saber nada de vino para empezar. Si ya trabajás en el sector o preparás una certificación profesional, probablemente ya conozcas buena parte de lo básico que cubre.' },
      { q: '¿En qué formato la recibo y cómo la descargo?', a: 'Es un PDF digital. En cuanto se confirma el pago, esta misma página te muestra el botón de descarga — sin envío físico ni esperas. Se lee en el celular, la tablet o la computadora, y también se puede imprimir.' },
      { q: '¿Puedo pedir un reembolso si no me convence?', a: 'Sí. Tenés 14 días completos desde tu compra para escribirnos a info@vakoclub.com y te devolvemos el 100%, sin necesidad de justificarlo.' },
      { q: '¿Qué incluye exactamente el precio?', a: 'La Guía del Vino Español completa en PDF, acceso anticipado a la próxima guía de la colección, y una invitación a la Membresía Gratuita de Vako Club. Todo por un único pago, sin suscripción.' },
      { q: '¿Necesito comprar también El Mundo de la Copa?', a: 'No, son productos independientes y podés comprar cualquiera de los dos por separado.' },
      { q: '¿Esta compra incluye la guía de Argentina o Francia?', a: 'No — cada guía regional se vende por separado. La Guía del Vino Argentino ya está disponible; Francia todavía no tiene fecha. Como comprador de España, sos de los primeros en enterarte cuando salga.' },
      { q: '¿Cómo se procesa el pago? ¿Es seguro?', a: 'El pago se procesa dentro del sitio con Stripe, de forma segura. Vako Club nunca ve ni guarda los datos de tu tarjeta.' },
      { q: '¿Puedo regalarla?', a: 'Sí. Comprala igual que siempre y escribinos a info@vakoclub.com para indicarnos a quién enviarle el enlace de descarga.' },
      { q: '¿La guía caduca?', a: 'No. Es un archivo que descargás una vez y conservás para siempre, sin depender de ninguna suscripción activa.' },
    ],
  },
  cierre: { title: 'La próxima botella española que abras puede tener sentido.' },
};

const GuiaVinoEspanolLanding = () => <GuiaRegionalLanding content={CONTENT} />;

export default GuiaVinoEspanolLanding;
