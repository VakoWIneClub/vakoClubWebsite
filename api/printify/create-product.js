import { callPrintify } from './_lib/printify.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = process.env.PRINTIFY_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;
  if (!token || !shopId) {
    return res.status(500).json({ error: 'Printify no está configurado todavía en el servidor.' });
  }

  const body = req.body || {};
  if (!body.title) {
    return res.status(400).json({ error: 'Falta el título del producto.' });
  }

  try {
    const created = await callPrintify(`/shops/${shopId}/products.json`, 'POST', token, body);
    if (!created.ok) {
      console.error('Printify create product falló:', created.status, created.data);
      return res.status(502).json({ error: 'Printify rechazó la creación del producto', details: created.data });
    }

    if (body.publish === true && created.data?.id) {
      const publish = await callPrintify(`/shops/${shopId}/products/${created.data.id}/publish.json`, 'POST', token);
      return res.status(200).json({ created: created.data, publish: publish.data });
    }

    return res.status(200).json({ created: created.data });
  } catch (error) {
    console.error('Error creando producto en Printify:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
