# Estado de Producto — Vako Club
> Mantenido por el agente **Vako-PO**. Es un resumen ejecutivo de todo el proyecto (negocio + técnico + marketing), no un duplicado de `claudeAgents/claudeMarketing/01-ESTADO-ACTUAL.md` (que es la memoria compartida del equipo de marketing, mucho más detallada). Si algo de aquí contradice el código real, el código manda — corregir acá.

**Última revisión:** 2026-08-28

## Estado por frente

| Frente | Estado | Detalle |
|---|---|---|
| Pagos (Stripe) | ✅ En producción | Solo "El Mundo de la Copa" ($29.99) es comprable hoy. Claves live activas en Vercel desde 2026-08-20. Descarga del PDF protegida contra piratería (`/api/download-guide`, verifica pago contra Stripe). |
| Tracking de conversión (Meta Pixel + GA4) | ✅ En producción | Evento `Purchase`/`purchase` disparado en ambas rutas de compra (`CompraResultBanner.jsx` y `ElMundoDeLaCopaLanding.jsx`), con guarda de `value` numérico > 0 (fix 2026-08-25 de un bug real de "100% de eventos sin valor"). Pixel deshabilitado en `localhost` a propósito. |
| Guías en PDF — catálogo | ⚠️ Parcial | Solo "El Mundo de la Copa" (guía general) tiene contenido escrito y está a la venta. Serie regional (España/Argentina/Francia) tiene oferta/landing/email/creatividades ya diseñados por el equipo de marketing, pero **sin contenido de guía escrito todavía** — bloqueante real para vender, no de marketing. |
| Email marketing (ESP) | ⚠️ Parcial | Hostinger Reach conectado (2026-08-24), alta de contactos/tags funcional vía `/api/subscribe-lead`. Automatizaciones con delays no son creables por API — Julian las arma a mano en el panel con el copy que escribe `vako-email`. Formulario de `/suscripcion` (Membresía Gratuita) todavía no llama al endpoint. |
| Directorio de bodegas (Explorador) | ✅ Funcional | `/guia`, gateado por login, no indexado. Renombrado de "Guía" a "Explorador" en todo el front el 2026-08-28 para no confundirlo con la guía en PDF (rutas sin cambios). |
| Comunidad / Suscripción | ⚠️ Solo plan gratuito real | Planes de pago (Sommelier, Gran Reserva) existen como copy en el sitio pero no son contratables — no presentarlos como comprables en ninguna pieza de marketing. |
| Tienda de afiliados / merchandising | ✅ Funcional | Printify + Hostinger Ecommerce, sync de pedidos vía cron diario (`api/printify/sync-orders`, 06:00). |
| SEO técnico | ✅ Resuelto (2026-08-25) | robots.txt, sitemap.xml dinámico, Open Graph vía `Seo.jsx` en páginas públicas. Pendiente menor no bloqueante: `<html lang="en">` hardcodeado en `index.html` fuera de la landing de la guía general. |
| Marketing — oferta activa | Ver `claudeAgents/claudeMarketing/01-ESTADO-ACTUAL.md` | Ese doc es la fuente de verdad detallada; este archivo no lo duplica. |

## Próximas decisiones que necesitan a Julian
- Escribir el contenido real de las guías regionales (España/Argentina/Francia) — todo lo demás (oferta, landing, email, creatividades) ya está listo y esperando.
- Decidir el ángulo de diferenciación entre la Guía General y la serie regional (hay solapamiento de contenido documentado, ver `producto-guia-general.md`).
- Conectar `/suscripcion` al endpoint de Hostinger Reach y armar a mano la automatización de bienvenida en el panel.
- Continuar la campaña de Instagram de 3 meses (contenido de semanas siguientes pendiente de que Julian comparta lo ya creado).

## Notas para quien recién llega al proyecto (Julian, colaborador externo, u otro agente)
- El repo mezcla dos mundos: código de producto (`src/`, `api/`, editable por cualquier sesión normal de Claude Code) y trabajo del equipo de marketing (`claudeAgents/claudeMarketing/**`, propiedad exclusiva de los agentes `vako-*`, con su propio doc de estado y reglas).
- Nunca inventar cifras, testimonios ni datos de negocio — marcar como `[PENDIENTE: ...]`.
- La tienda cotiza en USD (decisión explícita, aunque otras secciones del sitio usen €).
- `dist/` está versionado en git pero no refleja el build real de Vercel — no tocarlo a mano.
