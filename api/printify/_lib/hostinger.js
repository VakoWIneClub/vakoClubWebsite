// Cliente mínimo para la API de Hostinger Ecommerce (store real, no el Website Builder genérico).
// Mismo host/patrón de auth que ya usan hostinger-reach/hostinger-dns (Bearer HOSTINGER_API_TOKEN).
const HOSTINGER_BASE = 'https://developers.hostinger.com/api/ecommerce/v1';

async function callHostinger(path, token, options = {}) {
  const res = await fetch(`${HOSTINGER_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { status: res.status, ok: res.ok, data };
}

// Trae todos los pedidos de la tienda (paginado). Volumen bajo esperado (tienda de merch chica),
// así que no hace falta filtrar server-side — se filtra en memoria en sync-orders.js.
export async function listAllOrders(storeId, token) {
  const orders = [];
  let page = 1;
  for (;;) {
    const { ok, data, status } = await callHostinger(`/stores/${storeId}/orders?page=${page}&per_page=100`, token);
    if (!ok) throw new Error(`Hostinger orders list falló: ${status} ${JSON.stringify(data)}`);
    orders.push(...(data.data || []));
    if (!data.meta || data.meta.current_page >= data.meta.last_page) break;
    // Fallback por si esta versión de la API no manda last_page (solo total/per_page).
    if (!data.meta.last_page && orders.length >= (data.meta.total || 0)) break;
    page++;
  }
  return orders;
}

export async function getOrder(storeId, orderId, token) {
  const { ok, data, status } = await callHostinger(`/stores/${storeId}/orders/${orderId}`, token);
  if (!ok) throw new Error(`Hostinger get order falló: ${status} ${JSON.stringify(data)}`);
  return data.data;
}

// Best-effort: el shape exacto del body no está confirmado (no se pudo probar contra un pedido real
// sin marcarlo como cumplido de verdad). Si falla, no importa — printify_synced_orders en Supabase
// es la fuente real de "ya procesado", esto es solo para que el pedido no quede visualmente
// pendiente en el panel de Hostinger.
export async function tryFulfillOrder(storeId, orderId, items, token) {
  try {
    const { ok, data, status } = await callHostinger(`/stores/${storeId}/orders/${orderId}/fulfill`, token, {
      method: 'POST',
      body: { items: items.map((i) => ({ id: i.id, quantity: i.quantity })) },
    });
    if (!ok) console.warn('Hostinger fulfill respondió con error (no bloqueante):', status, data);
  } catch (error) {
    console.warn('Hostinger fulfill falló (no bloqueante):', error.message);
  }
}
