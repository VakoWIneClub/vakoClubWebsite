import Stripe from 'stripe';
import { GUIAS_CATALOG } from './_lib/catalog.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe no está configurado todavía en el servidor.' });
  }

  const { guideId } = req.body || {};
  const guia = GUIAS_CATALOG[guideId];
  if (!guia || !guia.disponible) {
    return res.status(400).json({ error: 'Esta guía no está disponible para compra todavía.' });
  }

  const stripe = new Stripe(secretKey);
  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: guia.currency,
            product_data: { name: guia.nombre },
            unit_amount: guia.amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/tienda?compra=exito&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tienda?compra=cancelada`,
      metadata: { guideId },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión de Stripe:', error);
    return res.status(500).json({ error: 'No se pudo iniciar el pago. Intenta de nuevo.' });
  }
}
