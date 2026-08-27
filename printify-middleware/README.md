Printify middleware for Vercel (Next.js)

Resumen
-------
Esta carpeta contiene una implementación minimal y lista para desplegar en Vercel (Next.js API routes) que actúa como puente entre tu tienda en Hostinger Website Builder y la API de Printify.

Características
---------------
- Endpoint para crear órdenes en Printify (/api/printify/create-order)
- Endpoint para crear productos en Printify (/api/printify/create-product)
- Endpoint para recibir webhooks de Printify (/api/printify/webhook)
- Endpoint de health check (/api/printify/health)
- Snippet JS para pegar en la página de confirmación de compra de Hostinger

Requisitos de entorno (Vercel env vars)
--------------------------------------
- PRINTIFY_TOKEN: Token de API de Printify (Personal access token o token de aplicación)
- PRINTIFY_SHOP_ID: ID de la tienda Printify (numérico)
- HOST_FORWARD_SECRET: Secreto compartido para validar requests desde Hostinger (string)

Instalación y deploy
--------------------
1. Copia esta carpeta a tu repo Next.js en la ruta deseada (p.ej. en la raíz: /printify-middleware o integra los archivos /api en tu proyecto Next.js).
2. Añade las variables de entorno en Vercel (Project Settings → Environment Variables).
3. Despliega en Vercel (push a GitHub/GitLab/Bitbucket vinculado a Vercel) — las API routes estarán disponibles en https://<tu-proyecto>.vercel.app/api/printify/*

Uso desde Hostinger
-------------------
Pega el archivo `hostinger-snippet.html` (o su contenido) en la página de confirmación de pedido (thank-you/checkout success). El snippet hace POST al endpoint `/api/printify/create-order` con los datos mínimos de la orden.

Seguridad y recomendaciones
---------------------------
- Para un flujo de producción, usar OAuth si planeas soportar múltiples tiendas o usuarios.
- Validar pagos en el backend antes de enviar órdenes automáticamente a Printify.
- Revisa la documentación de Printify para formatos exactos de `line_items` si tus productos tienen variantes complejas: https://developers.printify.com/

Qué contiene este patch
------------------------
- /api/create-order.js
- /api/create-product.js
- /api/webhook.js
- /api/health.js
- /api/printify_utils.js
- /public/hostinger-snippet.html
- .env.example

Siguientes pasos
----------------
Dime si quieres que genere un patch/zip descargable listo para aplicar como PR o si prefieres que lo adapte a la estructura de tu repo (si me das la ruta específica).