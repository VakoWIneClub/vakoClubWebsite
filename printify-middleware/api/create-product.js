// API route to create a product (draft) in Printify and optionally publish

const { callPrintify } = require('./printify_utils');
const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN;
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  if (!body || !body.title) return res.status(400).json({ error: 'Missing product body (title required)' });

  try {
    // Create product draft
    const endpoint = `/shops/${PRINTIFY_SHOP_ID}/products.json`;
    const { ok, data, status } = await callPrintify(endpoint, 'POST', PRINTIFY_TOKEN, body);
    if (!ok) return res.status(502).json({ error: 'Printify create product failed', details: data });

    // Optionally publish if caller asks
    if (body.publish === true && data && data.id) {
      const publishEndpoint = `/shops/${PRINTIFY_SHOP_ID}/products/${data.id}/publish.json`;
      const pub = await callPrintify(publishEndpoint, 'POST', PRINTIFY_TOKEN);
      return res.status(200).json({ created: data, publish: pub.data });
    }

    return res.status(200).json({ created: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error', details: String(err) });
  }
};
