import fs from 'node:fs';
import path from 'node:path';
import Stripe from 'stripe';
import { GUIAS_CATALOG, getGuideFilePath, parseSessionItems } from './_lib/catalog.js';

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

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Error verificando sesión de Stripe en download-guide:', error);
    return res.status(403).json({ error: 'Sesión inválida.' });
  }

  if (session.payment_status !== 'paid') {
    return res.status(403).json({ error: 'Esta compra todavía no está confirmada.' });
  }

  const items = parseSessionItems(session.metadata);
  // `guideId` es obligatorio desde que existe el carrito (una sesión puede traer más de una
  // guía) — si no viene en la URL, se asume la primera/única guía de la sesión, así los links de
  // éxito ya generados antes del carrito (que no lo mandaban) siguen funcionando.
  const guideId = req.query?.guideId || items[0]?.id;
  const item = items.find((it) => it.id === guideId);
  // La guía pedida tiene que estar entre las que efectivamente se pagaron en ESTA sesión — evita
  // que alguien cambie el guideId de la URL a mano para bajar una guía que no compró.
  if (!item) {
    return res.status(403).json({ error: 'Esa guía no forma parte de esta compra.' });
  }

  const guia = GUIAS_CATALOG[item.id];
  const filePath = getGuideFilePath(guia, req.query?.lang || item.lang);
  if (!filePath) {
    return res.status(404).json({ error: 'No hay un archivo disponible para esta guía todavía.' });
  }

  const absolutePath = path.join(process.cwd(), filePath);
  let fileBuffer;
  try {
    fileBuffer = fs.readFileSync(absolutePath);
  } catch (error) {
    console.error('Error leyendo el archivo de la guía:', error);
    return res.status(500).json({ error: 'No se pudo leer el archivo. Escribinos a info@vakoclub.com.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${guia.nombre} - Vako Club.pdf"`);
  return res.status(200).send(fileBuffer);
}
