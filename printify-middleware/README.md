Puente Printify ↔ Hostinger para Vako Club
===========================================

Por qué existe esto
--------------------
Hostinger Website Builder solo tiene integración nativa de print-on-demand con **Printful**, no con
Printify. Como el catálogo ya está cargado en Printify, este puente reemplaza esa integración nativa
que no existe.

Dónde vive el código
---------------------
Los endpoints reales están en `api/printify/` (raíz del repo, junto al resto de `api/*`), no en esta
carpeta — Vercel solo despliega funciones serverless desde `/api`. Esta carpeta (`printify-middleware/`)
solo guarda documentación, el snippet para Hostinger y scripts de uso puntual:

- `api/printify/health.js` — health check
- `api/printify/create-order.js` — recibe el pedido desde el snippet de Hostinger y lo crea en Printify
- `api/printify/create-product.js` — crea (y opcionalmente publica) un producto en Printify
- `api/printify/webhook.js` — recibe eventos de Printify (verifica firma HMAC si `PRINTIFY_WEBHOOK_SECRET` está seteado)
- `printify-middleware/public/hostinger-snippet.html` — se pega en el "Custom code" de la página de gracias de la tienda de Hostinger
- `printify-middleware/scripts/list-variants.js` — exporta el mapeo producto/variante de tu shop Printify a `printify-middleware/output/mapping.json`

Variables de entorno (Vercel)
------------------------------
Ver `.env.example`. Se configuran en el mismo proyecto de Vercel donde ya vive vakoclub.com.

Lo que falta para que esto funcione de punta a punta
------------------------------------------------------
1. **Setear las env vars en Vercel** (`PRINTIFY_TOKEN`, `PRINTIFY_SHOP_ID`, `HOST_FORWARD_SECRET`, `PRINTIFY_WEBHOOK_SECRET`) y redesplegar.
2. **Correr `scripts/list-variants.js`** con tu `PRINTIFY_TOKEN` real para generar el mapeo de variantes — el snippet necesita el `printify_variant_id` de cada producto que vendas.
3. **Confirmar qué expone realmente la página de confirmación de Hostinger.** No está documentado públicamente. Hay que abrir un pedido de prueba en la tienda de Hostinger, inspeccionar esa página (DOM/variables disponibles) y reescribir la parte marcada `TODO` de `hostinger-snippet.html` para leer ahí el pedido real — el archivo actual usa nombres de variable de ejemplo (`window.HOSTINGER_ORDER_ID`, etc.) que no están confirmados contra la plataforma real.
4. **Pegar el snippet ya corregido** en Hostinger Website Builder → (⋮) → Integrations → Custom code, solo en la página de confirmación/gracias.
5. **Registrar el webhook en Printify** (Shop settings → Webhooks) apuntando a `https://www.vakoclub.com/api/printify/webhook`, con el mismo secreto que `PRINTIFY_WEBHOOK_SECRET`.
6. **Probar con un pedido real de bajo valor** antes de anunciar la tienda: confirmar que el pedido aparece en Printify con la dirección y variante correctas, y que Printify efectivamente lo manda a producción.

Límite de seguridad conocido
------------------------------
`HOST_FORWARD_SECRET` queda visible en el HTML público de la página de gracias — no es un secreto
real, solo frena bots genéricos. Hostinger Website Builder no ofrece un webhook servidor-a-servidor
de "pedido pagado" para integraciones externas (solo Printful está integrado de forma nativa), así
que no hay forma de evitar esto sin cambiar de plataforma de tienda. Rotar el secreto si se filtra o
si empiezan a aparecer pedidos falsos en Printify.
