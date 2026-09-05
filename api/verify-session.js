import Stripe from 'stripe';
import { GUIAS_CATALOG, parseSessionItems } from './_lib/catalog.js';
import { recordFounderClaim } from './_lib/founderClaims.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe no está configurado todavía en el servidor.' });
  }

  const sessionId = req.query?.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Falta session_id.' });
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(200).json({ paid: false });
    }

    const metaItems = parseSessionItems(session.metadata);
    const email = session.customer_details?.email || session.customer_email || null;

    // Best-effort y una sola vez por sesión (session_id es único en la tabla founder_claims) —
    // un carrito con varias guías cuenta como un solo claim de "Fundador/a" para esta compra, no
    // uno por guía. El cupo se lee hoy como un conteo total de compras tempranas, no por guía.
    await recordFounderClaim({
      sessionId,
      guideId: metaItems[0]?.id || null,
      email,
    });

    // El idioma viaja en los metadatos de la sesión de Stripe — es lo único que este endpoint
    // puede consultar después del pago, ya que el checkout redirige afuera del sitio.
    const items = metaItems
      .map(({ id, lang }) => {
        const guia = GUIAS_CATALOG[id];
        if (!guia) return null;
        return {
          guideId: id,
          guideName: guia.nombre,
          value: guia.amountCents / 100,
          currency: guia.currency,
          // download-guide.js vuelve a verificar el pago contra Stripe y que esta guía
          // efectivamente esté entre las compradas en esta sesión antes de entregar el archivo —
          // nunca sirve el PDF como link público estático.
          downloadUrl: guia.filePath
            ? `/api/download-guide?session_id=${encodeURIComponent(sessionId)}&guideId=${encodeURIComponent(id)}${lang ? `&lang=${encodeURIComponent(lang)}` : ''}`
            : null,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      paid: true,
      email,
      // Suma de todos los ítems — lo usa el evento de compra de GA4/Meta Pixel del frontend.
      value: items.reduce((sum, it) => sum + it.value, 0),
      currency: items[0]?.currency || null,
      items,
    });
  } catch (error) {
    console.error('Error verificando sesión de Stripe:', error);
    return res.status(400).json({ paid: false, error: 'Sesión inválida.' });
  }
}
