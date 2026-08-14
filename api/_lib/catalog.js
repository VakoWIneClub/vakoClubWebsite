// Catálogo de guías vendibles vía Stripe Checkout — fuente de verdad del lado del servidor.
// Refleja los mismos IDs que src/components/tienda/GuiasSection.jsx. Cuando una guía regional
// esté escrita y lista para vender, poner su `disponible` en true y sumar su `filePath`.
//
// `filePath` es una ruta de servidor (relativa a la raíz del proyecto), NO una URL pública — el
// archivo vive en `private/`, fuera de `public/`, y sólo se entrega a través de
// `/api/download-guide` después de verificar el pago con Stripe. Nunca apuntar esto a algo
// dentro de `public/`: eso volvería a dejar el PDF descargable por cualquiera con el link.
export const GUIAS_CATALOG = {
  'guia-general': {
    nombre: 'El Mundo de la Copa',
    amountCents: 2999,
    currency: 'usd',
    disponible: true,
    filePath: 'private/guias/el-mundo-de-la-copa.pdf',
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
