import Stripe from 'stripe';
import { GUIAS_CATALOG } from './_lib/catalog.js';

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
    const guideId = session.metadata?.guideId;
    const guia = GUIAS_CATALOG[guideId];
    return res.status(200).json({
      paid: true,
      guideName: guia?.nombre || null,
      downloadUrl: guia?.downloadUrl || null,
    });
  } catch (error) {
    console.error('Error verificando sesión de Stripe:', error);
    return res.status(400).json({ paid: false, error: 'Sesión inválida.' });
  }
}
