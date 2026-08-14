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
    amountCents: 2999,
    currency: 'usd',
    disponible: true,
    // Español es el archivo por defecto (`filePath`, usado si el idioma pedido no tiene edición
    // propia). El portugués todavía no está escrito — hasta que exista, se entrega en inglés.
    filePath: 'private/guias/el-mundo-de-la-copa.pdf',
    filePathByLang: {
      es: 'private/guias/el-mundo-de-la-copa.pdf',
      en: 'private/guias/Vako-Club_The-World-of-the-Glass_EN.pdf',
      pt: 'private/guias/Vako-Club_The-World-of-the-Glass_EN.pdf',
    },
  },
  'guia-espanol': {
    nombre: 'Guía del Vino Español',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    filePath: null,
  },
  'guia-argentino': {
    nombre: 'Guía del Vino Argentino',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    filePath: null,
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
