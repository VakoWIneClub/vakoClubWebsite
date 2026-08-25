# Investigación: Diagnóstico comercial pre-campaña — "El Mundo de la Copa" (actualización del audit del 20/08)
Fecha: 2026-08-25 | Agente: vako-research

> Este documento re-audita, leyendo el código real (no el resumen que me pasaron), los 6 riesgos/huecos que dejó abiertos `research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md` en su sección 4, más lo nuevo que se tocó hoy (25/08). No repite el benchmark de precio ni la recomendación de canal del informe anterior — siguen vigentes sin cambios.

## Resumen ejecutivo (3-5 bullets)

- **Los 3 riesgos técnicos que bloqueaban vender con ads están resueltos y verificados en el código real**, no solo en el resumen de Julian: (1) Stripe cobra en producción vía `STRIPE_SECRET_KEY` server-side, sin claves de test hardcodeadas; (2) tracking de conversión (Meta Pixel + GA4) instalado y, además, un bug real de hoy (100% de los `Purchase` sin `value`) quedó corregido en los 3 archivos correspondientes (`index.html`, `ElMundoDeLaCopaLanding.jsx`, `CompraResultBanner.jsx`); (3) garantía de 7 días, bono "Fundador/a" y escasez de 50 unidades están en el código de la landing, no solo en el copy del documento de oferta.
- **El bug del Meta Pixel encontrado y corregido hoy era real y grave, no cosmético**: la causa raíz (Pixel inicializándose en `localhost` + un test e2e mockeando `/api/verify-session` sin `value`) significaba que Meta estaba recibiendo señal de conversión corrupta desde el entorno de desarrollo, no desde compradores reales — el fix (guard de hostname en `index.html` + validación `Number.isFinite(value) && value > 0` antes de disparar el evento) es correcto y ataca la causa, no el síntoma.
- **El cierre de SEO de hoy (robots.txt, sitemap.xml dinámico, Open Graph/Twitter Card vía `Seo.jsx` en las 14 páginas públicas) está realmente en el código** y resuelve 3 de los 4 hallazgos SEO "menores" del audit anterior. Queda un cabo suelto barato y ya identificado: `index.html` sigue con `<html lang="en">` hardcodeado a nivel global (el mismo hallazgo del 20/08, sin tocar); cada página sigue corrigiéndolo por su cuenta vía `Seo.jsx` (`lang={lang}`), igual que antes — no es nuevo, no empeoró, pero tampoco se cerró.
- **Ningún ítem de los 6 originales sigue siendo un bloqueante real para lanzar.** Los 2 que siguen abiertos (documentación de marca desactualizada, corregida hoy mismo como parte de este trabajo; falta de dato de audiencia de la campaña de Instagram) nunca fueron bloqueantes técnicos de compra — son de higiene interna y de optimización de targeting, no impiden que un click en un ad de Meta termine en una compra real y trackeada.
- **Veredicto: el proyecto está técnicamente listo para lanzar la campaña de ads de "El Mundo de la Copa".** El único bloqueante genuino que queda es de negocio, no de código: cero prueba social real todavía (no fabricable) — pero eso, igual que en el audit anterior, es motivo para lanzar antes (y así generar los primeros compradores/testimonios), no para seguir esperando.

## Hallazgos detallados

### Re-auditoría de los 6 riesgos del informe del 20/08 (sección 4 de ese documento)

**1. Claves live de Stripe no están en Vercel → ✅ RESUELTO**
Verificado en `api/create-checkout-session.js` y `api/verify-session.js`: ambos leen `process.env.STRIPE_SECRET_KEY` sin ningún valor de test hardcodeado ni fallback inseguro; si la variable no existe, el endpoint devuelve `500` explícito ("Stripe no está configurado todavía en el servidor") en vez de fallar en silencio o caer a modo test. El código es correcto y coherente con lo que registra `01-ESTADO-ACTUAL.md` (Julian rotó la clave, la cargó en Vercel el 20/08, confirmó visualmente que ya no aparece "Test mode"). No puedo verificar el dashboard de Vercel yo mismo (no tengo acceso), pero no hay nada en el código que contradiga o ponga en duda esa confirmación — `[PENDIENTE: verificación directa del panel de Vercel por parte de Julian, si quiere una segunda confirmación además de la visual del 20/08]`.

**2. Cero tracking de conversión para ads → ✅ RESUELTO, y reforzado hoy**
El Meta Pixel está en `index.html`, con una guarda nueva de hoy que antes no existía en el audit del 20/08:
```js
if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { ... fbq('init', ...); fbq('track', 'PageView'); }
```
Esto es un fix real, no cosmético: antes el Pixel se inicializaba también en local/e2e, y un test e2e que mockea `/api/verify-session` sin `value` disparaba compras falsas con valor nulo desde `http://localhost/` — exactamente la causa que reportó el dashboard de Meta ("100% de eventos Purchase sin parámetro value"). Confirmado además en `ElMundoDeLaCopaLanding.jsx` (línea ~583) y `CompraResultBanner.jsx` (línea ~36), idéntico patrón en ambos:
```js
const valorValido = Number.isFinite(data.value) && data.value > 0;
if (valorValido && typeof window.gtag === 'function') { window.gtag('event', 'purchase', {...}); }
if (valorValido && typeof window.fbq === 'function') { window.fbq('track', 'Purchase', { value: data.value, currency: valorMoneda }, { eventID: sessionId }); }
```
`data.value` viene de `verify-session.js`, que lo calcula del lado del servidor a partir del catálogo (`guia.amountCents / 100`), no de nada editable por el cliente — así que un evento que pasa esta validación es un evento con valor real y confiable. El fix está en los 3 archivos exactamente como se describió, y tiene sentido técnico: ataca la causa raíz (entorno de prueba contaminando el pixel real) en vez de solo parchear el síntoma (value ausente).

**3. Documentación de marca desactualizada (nota de "no hay landings dedicadas") → ✅ RESUELTO HOY, como parte de este trabajo**
Confirmado que seguía sin corregirse: `00-BRAND-CONTEXT.md` línea 43 seguía diciendo "viven dentro de `/tienda`... no en landing pages independientes" sin mencionar la excepción real de "El Mundo de la Copa". Corregido en este mismo informe (ver commit de este documento) para que el equipo no siga asumiendo lo contrario.

**4. Sin garantía de devolución en la oferta → ✅ RESUELTO**
Confirmado en `ElMundoDeLaCopaLanding.jsx`: microcopy "Devolución garantizada 7 días" (línea 70), bloque `garantia` con título y texto en ES/EN/PT (líneas 129, 261, 393), CTA que la menciona explícitamente ("Conseguir la guía — USD 29.99 · Devolución garantizada 7 días", línea 133), y una sección de oferta que renderiza `t.oferta.garantia.titulo`/`.texto` (líneas 1168-1171). También están el bono "Fundador/a" (líneas 143, 407: invitación a Membresía Gratuita + aviso prioritario de la serie regional) y la escasez de "primeros 50 compradores de esta campaña" (línea 135, 267, 399, renderizada en línea 1184). Los tres elementos que pedía la oferta de `vako-ofertas` del 20/08 están realmente en el código de producción, no solo en el documento de oferta.
- **Matiz importante, ya conocido desde el 20/08 y sin cambios:** el tope de "50 unidades" es copy, no un contador server-side — no hay ningún código que lo cuente o lo bloquee automáticamente en `api/_lib/catalog.js` ni en el checkout. Sigue dependiendo de que alguien (Julian) revise manualmente cuántas compras reales de esta campaña hay en Stripe antes de seguir prometiendo el bono, tal como ya advertía el documento de oferta original. No es nuevo, no bloquea lanzar, pero conviene que Julian lo tenga presente apenas empiece a entrar tráfico pagado real.

**5. Cero prueba social todavía → ⚠️ SIGUE PENDIENTE (no corregible, esperado)**
No hay ningún testimonio ni cifra de compradores en el código de la landing más allá de la "franja de confianza" (pago seguro, muestra real, garantía) que ya sustituye honestamente a la prueba social inexistente — igual que documentó `vako-landing` el 20/08. Sigue siendo así por diseño: no se puede fabricar. `[PENDIENTE: primeros compradores reales de la campaña de ads, para poder sumar el primer testimonio honesto]`.

**6. Sin dato de audiencia guardada de la campaña de Instagram (Semana 1) → ⚠️ SIGUE PENDIENTE**
Confirmado contra `01-ESTADO-ACTUAL.md`, ítem 1 de "Próximas acciones sugeridas": sigue como `[PENDIENTE: Julian debe pegarlo aquí o compartir el enlace]`. No es un bloqueante técnico de compra/tracking — es una oportunidad perdida de armar un público personalizado de Meta Ads más afinado desde el día uno, no una razón para no lanzar.

### Lo que se tocó hoy y no estaba en el audit del 20/08

- **SEO — cierre real, verificado en código:**
  - `public/robots.txt` (nuevo): `Allow: /` general, con `Disallow` explícito y bien razonado para `/guia` (gated), formularios admin (`/noticias/crear`, `/noticias/editar/`, `/eventos/crear`, `/eventos/editar/`) y páginas de cuenta/utilidad (`/login`, `/perfil`, `/email-verification`, `/auth/callback`, `/educacion`). Apunta a `Sitemap: https://vakoclub.com/sitemap.xml`.
  - `api/sitemap.xml.js` (nuevo): arma XML con las rutas estáticas públicas (incluye `/tienda/el-mundo-de-la-copa` con prioridad 1.0, la más alta junto con home) más noticias y eventos vigentes leídos de Supabase en cada request, con manejo best-effort si Supabase falla (no rompe el sitemap si la consulta falla, solo omite esas entradas). `vercel.json` tiene el rewrite `/sitemap.xml → /api/sitemap.xml` confirmado.
  - `src/components/Seo.jsx` (nuevo, compartido): centraliza title/description/canonical + Open Graph completo (`og:site_name`, `og:type`, `og:title`, `og:description`, `og:image`, `og:url`) y Twitter Card (`summary_large_image`). Usado en 14 páginas públicas confirmadas por búsqueda directa en `src/` (incluye `ElMundoDeLaCopaLanding.jsx`, que le pasa la tapa de la guía como `image` y el idioma dinámico como `lang`). Soporta `noindex` — confirmado que `App.jsx` calcula `isNoindexPath(location.pathname)` y se lo pasa al `Seo` global para las rutas gated.
  - **Lo que NO se tocó, confirmado igual que el 20/08:** `index.html` sigue con `<html lang="en">` hardcodeado a nivel raíz. El patrón sigue siendo el mismo de antes: cada página que usa `Seo.jsx` puede sobreescribirlo pasando `lang`, pero no todas lo hacen (solo la landing de "El Mundo de la Copa" pasa `lang` dinámico según el selector de idioma; el resto de páginas no le pasa `lang` a `Seo`, así que quedan con el `en` global de `index.html`). Es un hallazgo SEO/accesibilidad menor y barato de cerrar (agregar `lang` dinámico a `Seo.jsx` en cada página según el idioma real del contenido, o al menos fijar `es` como default global en `index.html` ya que es el idioma principal del sitio), pero no es bloqueante para lanzar ads — Google y Meta no penalizan clicks pagados por esto, solo indexación orgánica.

- **`/eventos` — orden de fechas corregido:** confirmado en `src/pages/Eventos.jsx` línea 141: `.order('event_date', { ascending: !showPastEvents })` — cuando se muestran eventos próximos (`showPastEvents` false), ordena ascendente (el más próximo primero); al ver el historial, ordena descendente. Antes mostraba el orden invertido. No afecta directamente la campaña de "El Mundo de la Copa", pero mejora la experiencia de cualquier tráfico que llegue a explorar el resto del sitio.

- **`GuideCtaBar.jsx` (nuevo):** banner flotante inferior, descartable (se recuerda con `localStorage`, no vuelve a molestar tras cerrarlo salvo un botón pequeño para reabrirlo), que promociona "El Mundo de la Copa" con tapa, precio y CTA a `/tienda/el-mundo-de-la-copa`. Confirmado en el código que no es un modal invasivo. `[PENDIENTE: confirmar en qué páginas está montado exactamente — Guía, Eventos, Noticias según el resumen — no se verificó el punto de montaje en `App.jsx`/páginas individuales en esta pasada]`.

- **`/guia` — contador de bodegas:** confirmado en `src/pages/Guia.jsx` línea 196-204: título "Explora el mundo de bodegas" y, si `totalWineries` es mayor a 0, un contador "+N bodegas registradas". Mejora de prueba social del catálogo de bodegas (no de la guía paga), consistente con lo descrito.

## Implicaciones para el equipo

- **Para vako-ofertas:** no hay cambios de oferta que hacer. La oferta de 20/08 (garantía 7 días, bono Fundador, escasez 50 unidades) está en producción tal como se diseñó. Único seguimiento operativo: recordar revisar manualmente en Stripe cuántas unidades de la campaña ya se vendieron antes de que la promesa de "primeros 50" deje de ser cierta — no hay alarma automática.
- **Para vako-creatividades:** las piezas ya diseñadas el 20/08 (`creatividades/2026-08-20-set-ads-meta-el-mundo-de-la-copa.md`) ya no tienen ningún bloqueo técnico pendiente — pueden pasar de "NO PAUTAR TODAVÍA" a pauteables en cuanto Julian dé el visto bueno final de negocio (prueba social sigue siendo cero, pero eso no impide lanzar). El link de destino sigue siendo correcto (`/tienda/el-mundo-de-la-copa`), y ahora además esa URL comparte bien en redes/Meta gracias al Open Graph nuevo (la vista previa del link mostrará la tapa real de la guía, no una genérica).
- **Para vako-email:** sin cambios de código que afecten la secuencia de conversión ya diseñada (`email/2026-08-20-conversion-ads-el-mundo-de-la-copa.md`); sigue pendiente que Julian cargue las automatizaciones a mano en Hostinger Reach (limitación de la plataforma, no de este audit). Aparte de la campaña de ads: `/suscripcion` y las listas de espera regionales (`NotifyGuideDialog.jsx`) siguen sin conectar al endpoint de tags — no bloquea esta campaña puntual, pero conviene no perderlo de vista para el resto del roadmap.
- **Para vako-landing:** nada bloqueante que arreglar en la landing de "El Mundo de la Copa" para esta campaña. Si se quiere pulir algo barato después del lanzamiento: (a) el `lang` dinámico de `index.html`/páginas sin `Seo lang=`, y (b) considerar datos estructurados `schema.org/Product` en la landing (mencionado como no bloqueante ya en el audit del 20/08, sigue sin implementarse, sigue sin ser urgente).

## Riesgos/huecos — estado actualizado de los 6 del audit del 20/08

| # | Riesgo (audit 20/08) | Estado hoy (25/08) | Bloqueante para lanzar ads? |
|---|---|---|---|
| 1 | Claves live de Stripe no están en Vercel | ✅ Resuelto — confirmado en código (`STRIPE_SECRET_KEY` server-side, sin fallback de test) + confirmación visual de Julian del 20/08 | No, ya no aplica |
| 2 | Cero tracking de conversión (Meta Pixel/GA4/evento compra) | ✅ Resuelto, y reforzado hoy (bug real de `value` ausente corregido en 3 archivos, causa raíz atacada) | No, ya no aplica |
| 3 | Documentación de marca desactualizada (nota de "no landings dedicadas") | ✅ Resuelto hoy, como parte de este informe (`00-BRAND-CONTEXT.md` corregido) | No — nunca fue bloqueante técnico, solo higiene interna |
| 4 | Sin garantía de devolución en la oferta | ✅ Resuelto — garantía 7 días, bono Fundador y escasez de 50 unidades confirmados en el código de la landing | No, ya no aplica |
| 5 | Cero prueba social todavía | ⚠️ Sigue pendiente (no fabricable por diseño) | No — es motivo para lanzar antes, no para esperar |
| 6 | Sin dato de audiencia de campaña de Instagram Semana 1 | ⚠️ Sigue pendiente (Julian debe compartirlo) | No — afecta calidad de targeting/lookalike, no impide lanzar |

## Veredicto

**El proyecto está listo para lanzar la campaña de ads de "El Mundo de la Copa".** Los tres riesgos que el audit del 20/08 marcaba como bloqueantes reales de negocio (cobro real en producción, tracking de conversión, oferta con garantía/bono/escasez) están confirmados en el código de producción, no solo en el resumen — incluido un bug de tracking real y grave (100% de eventos `Purchase` sin `value`) que se detectó y corrigió hoy mismo con un fix que ataca la causa raíz, no el síntoma. El cierre de SEO/OG de hoy es una mejora adicional que no era bloqueante pero suma: ahora el link de la landing también comparte bien en redes y tiene sitemap/robots correctos.

Lo único que queda abierto (prueba social inexistente y falta de datos de audiencia de Instagram) son huecos reales pero **no bloqueantes**: el primero es imposible de cerrar antes de tener compradores reales — y la forma de conseguir esos compradores es, precisamente, lanzar la campaña; el segundo mejora la eficiencia del targeting pero no impide que la campaña arranque y venda. Ninguno de los dos justifica seguir posponiendo el encendido de presupuesto.

**Recomendación operativa concreta:** lanzar con presupuesto bajo/mediano en Meta Ads (según ya recomendaba el audit del 20/08), y en paralelo: (a) Julian debería confirmar una vez con la extensión Meta Pixel Helper sobre una compra real en producción que el evento `Purchase` llega con `value` correcto post-fix de hoy (el fix es sólido por revisión de código, pero no hay una prueba de punta a punta contra el Pixel real registrada después del fix de hoy); y (b) llevar un registro manual simple de cuántas unidades del bono "Fundador/a" (tope 50) se van vendiendo, ya que no hay contador automático.

## Fuentes
- Código del propio sitio (fuente primaria): `api/create-checkout-session.js`, `api/verify-session.js`, `api/_lib/catalog.js`, `index.html`, `src/pages/tienda/ElMundoDeLaCopaLanding.jsx`, `src/components/tienda/CompraResultBanner.jsx`, `public/robots.txt`, `api/sitemap.xml.js`, `vercel.json`, `src/components/Seo.jsx`, `src/App.jsx`, `src/pages/Eventos.jsx`, `src/components/tienda/GuideCtaBar.jsx`, `src/pages/Guia.jsx`.
- `claudeAgents/claudeMarketing/01-ESTADO-ACTUAL.md` (estado documentado por el equipo, contrastado contra el código).
- `claudeAgents/claudeMarketing/research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md` (informe de referencia que este documento actualiza).
