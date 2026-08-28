Puente Printify ↔ Hostinger Ecommerce para Vako Club
======================================================

Por qué existe esto
--------------------
Hostinger Ecommerce (la tienda real, `ecommerce.hostinger.com`, distinta del "Website Builder"
genérico) solo tiene integración nativa de print-on-demand con **Printful**, no con Printify. Como
el catálogo ya está cargado en Printify, este puente reemplaza esa integración que no existe.

Cómo funciona (arquitectura actual)
-------------------------------------
Se descartó la idea original de un snippet JS pegado en la página de confirmación de compra:
Hostinger Ecommerce no expone ese tipo de código personalizado, y el enfoque además dependía de un
secreto visible en HTML público. En su lugar, `api/printify/sync-orders.js` corre por cron (una vez
al día, `vercel.json` → `crons`, límite del plan Hobby de Vercel) y:

1. Trae los pedidos de la tienda vía la API real de Hostinger Ecommerce
   (`developers.hostinger.com/api/ecommerce/v1/stores/{id}/orders`, mismo token `HOSTINGER_API_TOKEN`
   que ya usa `api/subscribe-lead.js` para Reach).
2. Filtra los que están pagados (`payment_status: captured`) y no cumplidos todavía.
3. Mapea cada variante comprada a su variante de Printify vía
   `api/printify/_lib/hostingerVariantMap.js` — el catálogo de Hostinger **no** está sincronizado
   con Printify (son productos recreados a mano ahí, sin SKU, y la API de Hostinger no permite
   setear el SKU para vincularlos automáticamente), así que ese mapeo se mantiene a mano en el repo.
4. Crea el pedido en Printify.
5. Registra el resultado en la tabla `printify_synced_orders` de Supabase — es la fuente real de
   "ya procesado" (evita mandar el mismo pedido dos veces a producción si el sync corre dos veces
   seguidas o si falla el intento de marcarlo cumplido en Hostinger).
6. Intenta marcar el pedido como cumplido en Hostinger (`POST .../orders/{id}/fulfill`) — best
   effort, el shape exacto de ese endpoint no se pudo confirmar sin marcar como cumplido un pedido
   real antes de tener el flujo completo, así que si falla, no importa: no es la fuente de verdad.

Dónde vive el código
---------------------
- `api/printify/sync-orders.js` — el job de sincronización (protegido por `CRON_SECRET` que Vercel
  manda solo al disparar el cron, o por `PRINTIFY_SYNC_SECRET` para dispararlo a mano).
- `api/printify/_lib/hostinger.js` — cliente mínimo para la API de Hostinger Ecommerce.
- `api/printify/_lib/hostingerVariantMap.js` — mapeo variant_id de Hostinger → variant_id de
  Printify. **Actualizar esto cada vez que se agregue un producto nuevo a la tienda** — si un item
  no está mapeado, el sync lo omite y lo loguea (no rompe el resto del pedido).
- `supabase/migrations/20260827210000_printify_synced_orders.sql` — tabla de idempotencia.
- `api/printify/health.js`, `create-order.js`, `create-product.js`, `webhook.js` — quedaron del
  enfoque anterior (snippet + webhooks de Printify). `create-order.js` y el snippet en
  `public/hostinger-snippet.html` están obsoletos con la arquitectura actual (nadie los llama) —
  decidir si conviene borrarlos o dejarlos como fallback manual.
- `scripts/list-variants.js` / `.ps1` — exporta el catálogo completo de Printify (variant_id, sku,
  título) a `output/mapping.json`, útil para armar `hostingerVariantMap.js` a mano.

Variables de entorno (Vercel)
------------------------------
Ver `.env.example`. Además de lo que ya estaba (`PRINTIFY_TOKEN`, `PRINTIFY_SHOP_ID`,
`HOST_FORWARD_SECRET`, `PRINTIFY_WEBHOOK_SECRET`), el sync necesita:
- `CRON_SECRET` — la manda Vercel solo al invocar el cron.
- `PRINTIFY_SYNC_SECRET` — para dispararlo a mano o desde afuera.
- `HOSTINGER_API_TOKEN` — ya debería existir (lo usa Reach).
- `SUPABASE_SERVICE_ROLE_KEY` — ya debería existir (lo usa `founder_claims`).

Lo que falta para que esto funcione de punta a punta
------------------------------------------------------
1. **Aplicar la migración** `supabase/migrations/20260827210000_printify_synced_orders.sql` contra
   el proyecto real de Supabase (`supabase db push`, o pegarla en el SQL Editor del dashboard).
2. **Agregar `CRON_SECRET` y `PRINTIFY_SYNC_SECRET`** a Vercel y redesplegar.
3. **Confirmar que el mapeo de variantes esté completo** antes de anunciar la tienda — hoy solo
   cubre los 2 productos reales que existen en Hostinger Ecommerce.
4. **Probar el sync a mano** llamando `POST /api/printify/sync-orders?secret=<PRINTIFY_SYNC_SECRET>`
   después de un pedido de prueba real, y confirmar en el dashboard de Printify que el pedido
   apareció con la dirección y variante correctas.
5. Decidir qué hacer con el snippet/`create-order.js` del enfoque anterior (borrar o dejar).
