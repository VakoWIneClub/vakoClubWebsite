// Catálogo de guías vendibles vía Stripe Checkout — fuente de verdad del lado del servidor.
// Refleja los mismos IDs que src/components/tienda/GuiasSection.jsx. Cuando una guía regional
// esté escrita y lista para vender, poner su `disponible` en true y sumar su `downloadUrl`.
export const GUIAS_CATALOG = {
  'guia-general': {
    nombre: 'El Mundo de la Copa',
    amountCents: 2999,
    currency: 'usd',
    disponible: true,
    downloadUrl: '/guias/Vako-Club_El-mundo-de-la-copa_1.pdf',
  },
  'guia-espanol': {
    nombre: 'Guía del Vino Español',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    downloadUrl: null,
  },
  'guia-argentino': {
    nombre: 'Guía del Vino Argentino',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    downloadUrl: null,
  },
  'guia-frances': {
    nombre: 'Guía del Vino Francés',
    amountCents: 1200,
    currency: 'usd',
    disponible: false,
    downloadUrl: null,
  },
};
