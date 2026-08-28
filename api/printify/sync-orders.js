import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { callPrintify } from './_lib/printify.js';
import { listAllOrders, tryFulfillOrder } from './_lib/hostinger.js';
import { HOSTINGER_TO_PRINTIFY_VARIANT } from './_lib/hostingerVariantMap.js';

const HOSTINGER_STORE_ID = 'store_01M0YWCN5GTW7AGM0YBNYR8B2W';

function secretsMatch(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Divide "Julian Santamaria Battaglini" en first_name/last_name porque Hostinger guarda el nombre
// completo en un solo campo y Printify necesita los dos por separado.
function splitName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/);
  return { first: parts[0] || 'Cliente', last: parts.slice(1).join(' ') || '' };
}

// Acepta dos formas de autenticar: el header que Vercel Cron manda solo automáticamente
// (Authorization: Bearer $CRON_SECRET, para el cron diario) o el secreto propio por header/query
// (para disparar el sync a mano o desde un scheduler externo si más adelante hace falta más
// frecuencia que 1 vez/día — límite del plan Hobby de Vercel).
function isAuthorized(req) {
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;
  const secret = req.headers['x-sync-secret'] || req.query?.secret;
  return secretsMatch(secret, process.env.PRINTIFY_SYNC_SECRET);
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Secreto inválido o ausente' });
  }

  const hostingerToken = process.env.HOSTINGER_API_TOKEN;
  const printifyToken = process.env.PRINTIFY_TOKEN;
  const printifyShopId = process.env.PRINTIFY_SHOP_ID;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://anqmpchicyejgjqxbhmd.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hostingerToken || !printifyToken || !printifyShopId || !serviceRoleKey) {
    return res.status(500).json({ error: 'Sync no está completamente configurado en el servidor.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const summary = { checked: 0, claimed: 0, skippedNotClaimed: 0, sent: 0, failed: 0, details: [] };

  try {
    const orders = await listAllOrders(HOSTINGER_STORE_ID, hostingerToken);
    const pending = orders.filter((o) => o.payment_status === 'captured' && o.fulfillment_status !== 'fulfilled');
    summary.checked = pending.length;

    for (const order of pending) {
      // Reclama el pedido ANTES de llamar a Printify: si dos corridas del sync se superponen, solo
      // una gana el insert (hostinger_order_id es PK). Sin esto, un fulfill fallido en Hostinger
      // (shape del endpoint sin confirmar) podría hacer que el próximo polling mande el mismo
      // pedido dos veces a producción real en Printify.
      const { error: claimError } = await supabase
        .from('printify_synced_orders')
        .insert({ hostinger_order_id: order.id, status: 'pending' });
      if (claimError) {
        if (claimError.code === '23505') {
          summary.skippedNotClaimed++;
          continue;
        }
        throw claimError;
      }
      summary.claimed++;

      try {
        const items = order.items
          .map((item) => ({ ...item, printifyVariant: HOSTINGER_TO_PRINTIFY_VARIANT[item.variant_id] }))
          .filter((item) => {
            if (!item.printifyVariant) {
              console.warn(`Sin mapeo Printify para variante ${item.variant_id} (pedido ${order.id}) — se omite.`);
              return false;
            }
            return true;
          });

        if (items.length === 0) throw new Error('Ningún item del pedido tiene variante mapeada a Printify.');

        const { first, last } = splitName(order.shipping_address?.name);
        const printifyOrder = {
          external_id: order.id,
          label: `Hostinger #${order.display_id}`,
          line_items: items.map((item) => ({
            variant_id: item.printifyVariant.printifyVariantId,
            quantity: item.quantity,
          })),
          shipping_address: {
            first_name: first,
            last_name: last,
            email: order.customer_email,
            phone: order.shipping_address?.phone || '',
            address1: order.shipping_address?.address_1,
            address2: order.shipping_address?.address_2 || '',
            city: order.shipping_address?.city,
            state: order.shipping_address?.province_code || '',
            zip: order.shipping_address?.postal_code,
            country: order.shipping_address?.country_code?.toUpperCase() || 'ES',
          },
          send_shipping_notification: true,
        };

        const result = await callPrintify(`/shops/${printifyShopId}/orders.json`, 'POST', printifyToken, printifyOrder);
        if (!result.ok) throw new Error(`Printify create order falló: ${result.status} ${JSON.stringify(result.data)}`);

        await supabase
          .from('printify_synced_orders')
          .update({ status: 'sent', printify_order_id: result.data.id, updated_at: new Date().toISOString() })
          .eq('hostinger_order_id', order.id);

        await tryFulfillOrder(HOSTINGER_STORE_ID, order.id, order.items, hostingerToken);

        summary.sent++;
        summary.details.push({ hostinger_order_id: order.id, printify_order_id: result.data.id, status: 'sent' });
      } catch (error) {
        console.error(`Error procesando pedido ${order.id}:`, error);
        await supabase
          .from('printify_synced_orders')
          .update({ status: 'failed', error: String(error.message || error), updated_at: new Date().toISOString() })
          .eq('hostinger_order_id', order.id);
        summary.failed++;
        summary.details.push({ hostinger_order_id: order.id, status: 'failed', error: String(error.message || error) });
      }
    }

    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error en sync-orders:', error);
    return res.status(500).json({ error: 'Error interno', details: String(error.message || error), summary });
  }
}
