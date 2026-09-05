import Stripe from 'stripe';
import { GUIAS_CATALOG, normalizarIdioma } from './_lib/catalog.js';

// A dónde puede volver Stripe después del pago. Se valida contra esta lista en vez de confiar en
// el `returnPath` que manda el cliente, para no abrir un open-redirect vía el body del POST.
const RETURN_PATHS = ['/tienda', '/tienda/el-mundo-de-la-copa', '/tienda/guia-vino-espanol', '/tienda/guia-vino-argentino'];

// Tope defensivo del carrito — el catálogo hoy tiene 4 guías en total, así que esto nunca debería
// alcanzarse; solo evita un body abusivo con cientos de ítems repetidos.
const MAX_CART_ITEMS = 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe no está configurado todavía en el servidor.' });
  }

  const body = req.body || {};
  // Acepta tanto la compra directa de siempre ({ guideId, lang }) como el carrito
  // ({ items: [{ guideId, lang }, ...] }) — se normalizan a una sola forma interna para no
  // duplicar la validación ni el armado de line_items entre los dos casos.
  const rawItems = Array.isArray(body.items) && body.items.length > 0
    ? body.items
    : [{ guideId: body.guideId, lang: body.lang }];

  if (rawItems.length > MAX_CART_ITEMS) {
    return res.status(400).json({ error: 'Demasiadas guías en un solo pago.' });
  }

  // Cada guía se valida y se cobra al precio del catálogo del servidor — nunca se confía en un
  // precio, nombre o disponibilidad que venga del cliente (el carrito del lado del navegador es
  // solo para mostrar, no fuente de verdad).
  const items = [];
  for (const raw of rawItems) {
    const guia = GUIAS_CATALOG[raw?.guideId];
    if (!guia || !guia.disponible) {
      return res.status(400).json({ error: 'Una de las guías elegidas no está disponible para compra todavía.' });
    }
    items.push({ guideId: raw.guideId, lang: normalizarIdioma(raw.lang), guia });
  }

  // Ninguna guía repetida — evita cobrar la misma guía dos veces por un carrito con un ítem duplicado.
  if (new Set(items.map((it) => it.guideId)).size !== items.length) {
    return res.status(400).json({ error: 'Hay una guía repetida en el carrito.' });
  }

  const basePath = RETURN_PATHS.includes(body.returnPath) ? body.returnPath : '/tienda';

  const stripe = new Stripe(secretKey);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Managed Payments (habilitado por defecto en la cuenta) exige un tax_code de producto que
      // implica decisiones de impuestos que Julian no definió — se desactiva para este checkout simple.
      managed_payments: { enabled: false },
      line_items: items.map(({ guia }) => ({
        price_data: {
          currency: guia.currency,
          product_data: { name: guia.nombre },
          unit_amount: guia.amountCents,
        },
        quantity: 1,
      })),
      success_url: `${origin}${basePath}?compra=exito&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${basePath}?compra=cancelada`,
      // Un único campo de metadata con todos los ítems (id + idioma) — api/verify-session.js y
      // api/download-guide.js lo leen para saber qué se pagó y en qué idioma entregar cada uno.
      // Muy por debajo del límite de 500 caracteres por valor de metadata de Stripe para el
      // tamaño de carrito que soporta hoy (MAX_CART_ITEMS = 10).
      metadata: { items: JSON.stringify(items.map(({ guideId, lang }) => ({ id: guideId, lang }))) },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    return res.status(500).json({ error: 'No se pudo iniciar el pago. Intenta de nuevo.' });
  }
}
