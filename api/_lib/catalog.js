// Catálogo de guías vendibles vía Stripe Checkout — fuente de verdad del lado del servidor.
// Refleja los mismos IDs que src/components/tienda/GuiasSection.jsx. Cuando una guía regional
// esté escrita y lista para vender, poner su `disponible` en true y sumar su `filePath`.
//
// `filePath` (y `filePathByLang`) son rutas de servidor (relativas a la raíz del proyecto), NO
// URLs públicas — el archivo vive en `private/`, fuera de `public/`, y sólo se entrega a través de
// `/api/download-guide` después de verificar el pago con Stripe. Nunca apuntar esto a algo
// dentro de `public/`: eso volvería a dejar el PDF descargable por cualquiera con el link.
export const GUIAS_CATALOG = {
  'guia-general': {
    nombre: 'El Mundo de la Copa',
    amountCents: 1499,
    currency: 'usd',
    disponible: true,
    // Español es el archivo por defecto (`filePath`, usado si el idioma pedido no tiene edición
    // propia).
    filePath: 'private/guias/el-mundo-de-la-copa.pdf',
    filePathByLang: {
      es: 'private/guias/el-mundo-de-la-copa.pdf',
      en: 'private/guias/Vako-Club_The-World-of-the-Glass_EN.pdf',
      pt: 'private/guias/Vako-Club_O-Mundo-da-Taca_PT.pdf',
    },
  },
  'guia-espanol': {
    nombre: 'Guía del Vino Español',
    amountCents: 1499,
    currency: 'usd',
    disponible: true,
    filePath: 'private/guias/guia-vino-espanol.pdf',
  },
  'guia-argentino': {
    nombre: 'Guía del Vino Argentino',
    amountCents: 1499,
    currency: 'usd',
    disponible: true,
    filePath: 'private/guias/guia-vino-argentino.pdf',
  },
  'guia-frances': {
    nombre: 'Guía del Vino Francés',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    filePath: null,
  },
};

// Idiomas que el checkout acepta. Cualquier otro valor (o ausente) cae a español.
export const IDIOMAS_DISPONIBLES = ['es', 'en', 'pt'];

export function normalizarIdioma(lang) {
  return IDIOMAS_DISPONIBLES.includes(lang) ? lang : 'es';
}

// Resuelve qué archivo entregar para una guía en un idioma dado, con fallback a la edición en
// español. Guías que todavía no tienen versiones por idioma (o no tienen `filePathByLang`)
// simplemente devuelven su `filePath` de siempre.
export function getGuideFilePath(guia, lang) {
  if (!guia) return null;
  const idioma = normalizarIdioma(lang);
  return guia.filePathByLang?.[idioma] || guia.filePathByLang?.es || guia.filePath || null;
}

// Lee qué guías se pagaron en una Checkout Session, en cualquiera de los dos formatos que puede
// traer `metadata`: el del carrito (`items`, JSON con uno o más `{ id, lang }`) o el de compra
// directa de antes de que existiera el carrito (`guideId`/`lang` sueltos). Una Checkout Session
// de Stripe sigue siendo válida hasta 24h después de creada, así que un link de éxito con el
// formato viejo todavía puede llegar a /api/verify-session o /api/download-guide después de un
// deploy que cambie el formato — por eso ambos endpoints comparten este parser en vez de asumir
// un solo formato.
export function parseSessionItems(metadata) {
  if (metadata?.items) {
    try {
      const parsed = JSON.parse(metadata.items);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // metadata corrupta/no-JSON — cae al formato legado de abajo.
    }
  }
  if (metadata?.guideId) {
    return [{ id: metadata.guideId, lang: metadata.lang }];
  }
  return [];
}
