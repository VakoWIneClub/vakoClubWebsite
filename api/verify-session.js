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
      // Lo junta Stripe Checkout solo (siempre pide email para mandar el recibo) — se expone acá
      // para poder etiquetar al comprador en Hostinger Reach del lado del cliente, sin agregar
      // otra llamada a Stripe.
      email: session.customer_details?.email || session.customer_email || null,
      // Value/currency van al frontend para el evento de compra de GA4/Meta Pixel — se leen del
      // catálogo (fuente de verdad del precio), no del session_id, para no confiar en nada editable
      // del lado del cliente.
      value: guia ? guia.amountCents / 100 : null,
      currency: guia?.currency || null,
      guideId: guideId || null,
      // El link ya lleva el session_id verificado: /api/download-guide lo vuelve a comprobar
      // contra Stripe antes de entregar el archivo, nunca sirve el PDF como link público estático.
      downloadUrl: guia?.filePath ? `/api/download-guide?session_id=${encodeURIComponent(sessionId)}` : null,
    });
  } catch (error) {
    console.error('Error verificando sesión de Stripe:', error);
    return res.status(400).json({ paid: false, error: 'Sesión inválida.' });
  }
}
