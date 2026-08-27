import crypto from 'crypto';

// Recibe eventos de Printify (production:created, order:shipment:created, etc). Configurar la URL
// https://<tu-dominio>/api/printify/webhook en Printify → Shop settings → Webhooks, con un secreto
// que se guarda acá como PRINTIFY_WEBHOOK_SECRET. Printify firma cada payload con HMAC-SHA256 en el
// header X-Pfy-Signature: https://developers.printify.com/#webhooks
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function isValidSignature(rawBody, signature, secret) {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (expectedBuf.length !== signatureBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  const rawBody = await readRawBody(req);

  if (secret) {
    const signature = req.headers['x-pfy-signature'];
    if (!isValidSignature(rawBody, signature, secret)) {
      console.error('Firma de webhook de Printify inválida.');
      return res.status(401).json({ error: 'Firma inválida' });
    }
  } else {
    console.warn('PRINTIFY_WEBHOOK_SECRET no configurado — aceptando webhook sin verificar firma.');
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8') || '{}');
  } catch {
    return res.status(400).json({ error: 'JSON inválido' });
  }

  console.log('Evento de Printify recibido:', event.type, event.resource?.id);

  // TODO cuando haga falta: persistir el estado del pedido (Supabase) y notificar al cliente por
  // email cuando el tipo sea order:shipment:created / order:shipment:delivered.

  return res.status(200).json({ received: true });
}
