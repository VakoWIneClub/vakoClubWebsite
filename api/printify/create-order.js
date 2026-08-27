import crypto from 'crypto';
import { callPrintify } from './_lib/printify.js';

// Recibe el pedido desde el snippet pegado en la página de confirmación de la tienda de Hostinger
// y lo reenvía como orden a Printify. Hostinger Website Builder no expone webhooks de "pedido
// pagado" a servicios externos (confirmado: solo tiene integración nativa con Printful, y su app
// de "Custom code" es JS del lado del cliente, no un webhook server-to-server) — por eso este
// endpoint depende de un secreto compartido en vez de una firma real del lado de Hostinger.
// Ese secreto queda visible en el HTML público de la página de confirmación: no es un candado real,
// solo evita que un bot genérico dispare pedidos al azar. Rotar HOST_FORWARD_SECRET si se filtra.
function secretsMatch(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = process.env.PRINTIFY_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  const forwardSecret = process.env.HOST_FORWARD_SECRET;
  if (!token || !shopId || !forwardSecret) {
    return res.status(500).json({ error: 'Printify no está configurado todavía en el servidor.' });
  }

  const provided = req.headers['x-forward-secret'] || req.body?.secret;
  if (!secretsMatch(provided, forwardSecret)) {
    return res.status(401).json({ error: 'Secreto inválido o ausente' });
  }

  const order = req.body?.order;
  const items = (order?.items || []).filter((item) => item.printify_variant_id);
  if (!order || items.length === 0) {
    return res.status(400).json({ error: 'Pedido inválido: falta order.items con printify_variant_id' });
  }

  const printifyOrder = {
    // external_id ata el pedido de Hostinger al de Printify — si el snippet se dispara dos veces
    // (recarga de la página de gracias), Printify debería deduplicar por este campo.
    external_id: String(order.id || `hostinger-${Date.now()}`),
    label: `Pedido ${order.id || ''}`,
    line_items: items.map((item) => ({
      variant_id: item.printify_variant_id,
      quantity: item.quantity || 1,
    })),
    shipping_address: {
      first_name: order.customer?.first_name || order.customer?.name || 'Cliente',
      last_name: order.customer?.last_name || '',
      email: order.customer?.email,
      phone: order.customer?.phone,
      address1: order.address?.line1 || order.address?.address1,
      address2: order.address?.line2 || '',
      city: order.address?.city,
      state: order.address?.state || order.address?.province || '',
      zip: order.address?.postal_code || order.address?.zip,
      country: order.address?.country || 'ES',
    },
    send_shipping_notification: true,
  };

  try {
    const result = await callPrintify(`/shops/${shopId}/orders.json`, 'POST', token, printifyOrder);
    if (!result.ok) {
      console.error('Printify create order falló:', result.status, result.data);
      return res.status(502).json({ error: 'Printify rechazó el pedido', details: result.data });
    }

    return res.status(200).json({ success: true, printify: result.data });
  } catch (error) {
    console.error('Error creando pedido en Printify:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
