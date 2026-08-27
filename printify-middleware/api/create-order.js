// API to receive order data from Hostinger and create an order in Printify
// Intended to be deployed as a Next.js API route or any Node serverless endpoint

const { callPrintify } = require('./printify_utils');

const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const HOST_FORWARD_SECRET = process.env.HOST_FORWARD_SECRET; // simple shared secret to validate requests

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const signature = req.headers['x-forward-secret'] || req.body.secret;
  if (!signature || signature !== HOST_FORWARD_SECRET) {
    return res.status(401).json({ error: 'Invalid or missing forward secret' });
  }

  const order = req.body.order;
  if (!order) return res.status(400).json({ error: 'Missing order payload' });

  // Map hostinger order to Printify order format. Adjust fields as needed.
  const printifyOrder = {
    external_id: order.id || `hostinger-${Date.now()}`,
    label: `Order ${order.id || ''}`,
    line_items: (order.items || []).map(item => ({
      variant_id: item.printify_variant_id,
      quantity: item.quantity || 1
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
      country: order.address?.country || 'US'
    },
    send_customer_notification: true
  };

  try {
    const endpoint = `/shops/${PRINTIFY_SHOP_ID}/orders.json`;
    const { status, ok, data } = await callPrintify(endpoint, 'POST', PRINTIFY_TOKEN, printifyOrder);
    if (!ok) {
      console.error('Printify create order failed', status, data);
      return res.status(502).json({ error: 'Printify create order failed', details: data });
    }

    return res.status(200).json({ success: true, printify: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error', details: String(err) });
  }
};
