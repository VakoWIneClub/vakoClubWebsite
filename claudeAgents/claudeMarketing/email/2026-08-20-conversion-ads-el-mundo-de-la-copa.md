# Conversión para tráfico de ads — "El Mundo de la Copa" (quien no compra al instante)
Fecha: 2026-08-20 | Agente: vako-email

## Resumen ejecutivo

- **Para quién:** alguien que llegó por un anuncio pagado a `/tienda/el-mundo-de-la-copa`, no compró en la primera visita, y dejó su email en el formulario "¿Todavía lo estás pensando? Dejanos tu email y te mandamos la primera parte completa, gratis" (sección `#email` de la landing, `ElMundoDeLaCopaLanding.jsx`). Es tráfico frío — no conoce Vako Club, así que ningún email de esta pieza asume familiaridad previa con la marca.
- **Oferta usada, exactamente como la definió `vako-ofertas`** (`ofertas/2026-08-20-oferta-ads-el-mundo-de-la-copa.md`): *El Mundo de la Copa*, $29.99 (sin tocar Stripe), garantía de devolución de 7 días sin preguntas, bono de estatus "Fundador/a" (Membresía Gratuita + aviso prioritario de la serie regional), bono de fichas imprimibles (Ficha de Cata + Glosario del Catador) limitado a los primeros 50 compradores de esta campaña (Opción B de escasez real, no un precio con fecha de vencimiento).
- **Dos piezas entregadas en este documento:**
  1. **Auto-respuesta de EmailJS (Día 0, envío instantáneo)** — resuelve el gap operativo que encontró `vako-ofertas`: hoy el formulario de "primera parte gratis" solo le avisa a Julian por email, no le entrega nada a quien dejó su dirección. Diseño de asunto + cuerpo abajo.
  2. **Secuencia de 4 emails cortos (Días 1, 3, 6 y 9)** que siguen a esa auto-respuesta, cada uno reforzando un único elemento de la oferta: garantía → bono Fundador → tope de 50 unidades → resumen y última llamada.
- **Un email, un objetivo, un CTA** en los 5 (incluida la auto-respuesta): nunca se mezclan dos pedidos en el mismo correo.
- **No se inventa ningún extracto de la guía** — el fragmento citado en la auto-respuesta (los cinco componentes del vino, el "truco del té") está tomado literal de `producto-guia-general-CONTENIDO-COMPLETO.md` (Capítulo 1, "Anatomía de una copa"), no parafraseado de memoria.
- **No se inventa ningún testimonio ni cifra de ventas** — donde hiciera falta un dato real que no existe todavía (cupos restantes del tope de 50, por ejemplo), queda marcado `[PENDIENTE: ...]`.
- **Coherencia con `vako-landing`:** `landing/2026-08-20-cierre-de-brechas-el-mundo-de-la-copa.md` (mismo día) ya dejó un borrador corto de esta misma auto-respuesta a modo de sugerencia, y un copy interino para `email.successMsg` en la landing ("te lo enviamos en las próximas 24 horas" en vez de "en unos minutos") mientras el auto-responder real no esté activo — para no prometer algo que hoy no se cumple. Este documento desarrolla esa auto-respuesta completa (asunto, cuerpo con extracto real citado, especificación técnica) y agrega la secuencia de 4 emails que la siguen. Una vez la auto-respuesta esté configurada de verdad, `vako-landing` debe volver `email.successMsg` a su versión original.

## Antes de cargar esto — dependencias y bloqueos reales

| # | Bloqueo/dependencia | Qué falta | Quién lo resuelve |
|---|---|---|---|
| 1 | ✅ **Resuelto 2026-08-21.** PDF de extracto exportado y subido: `public/guias/el-mundo-de-la-copa-parte-1-fundamentos.pdf`, público en `https://vakoclub.com/guias/el-mundo-de-la-copa-parte-1-fundamentos.pdf` una vez desplegado. Maquetado con el diseño de marca real (Cormorant Garamond/EB Garamond/Jost, burdeos/dorado) a partir del texto íntegro de `producto-guia-general-CONTENIDO-COMPLETO.md` (Capítulos 1–4), con portada y cierre con CTA a la guía completa. No necesita protección como el PDF pago porque es contenido gratuito. | — | — |
| 2 | **Plantilla de Auto-Reply de EmailJS no está configurada.** El formulario ya envía `email` como parámetro (`enviarEmail()` en `ElMundoDeLaCopaLanding.jsx`), pero solo dispara la plantilla que notifica el inbox interno de Vako. EmailJS tiene una función nativa de "Auto-Reply" por plantilla (panel de EmailJS, sin tocar código) que puede mandar un email aparte a quien completó el formulario, mapeando el campo `email` ya enviado como destinatario. | Configurar el Auto-Reply en el panel de EmailJS con el asunto/cuerpo de este documento, usando `{{email}}` como destinatario. Alternativa si el panel no alcanza: un segundo `emailjs.send()` en el código con una plantilla dedicada — esto sí requeriría una línea de código, fuera del alcance de `vako-email`. | Julian (config de panel) o un dev si se necesita la alternativa de código |
| 3 | **No hay campo de nombre en el formulario** — solo pide email (`copa-email-input`, `type="email"`, sin input de nombre). Por eso ningún email de esta pieza usa `{{nombre}}`: todos abren con un saludo genérico ("Hola,"). Si en algún momento se agrega un campo de nombre al formulario, se puede personalizar; no es bloqueante, solo una nota para no prometer una personalización que no existe hoy. | — | — |
| 4 | **El ESP de email marketing sigue sin conectarse** (recordatorio ya conocido, ver `00-BRAND-CONTEXT.md`). Esto bloquea específicamente los **Emails 1 a 4** (Días 1, 3, 6, 9): EmailJS solo puede disparar un envío instantáneo al momento del submit (la auto-respuesta), no programar envíos automáticos varios días después según la fecha en que cada persona dejó su email. La auto-respuesta (Día 0) sí se puede activar sin ESP, en cuanto existan los puntos 1 y 2 de esta tabla. La secuencia completa (1-4) queda lista para cargar en cuanto se conecte un ESP (Brevo, MailerLite, Mailchimp, ConvertKit u otro con plan gratuito). | Conectar un ESP | Julian |
| 5 | **Tope real de 50 unidades — requiere conteo manual.** El sitio no tiene un contador automático de compras por campaña (confirmado por `vako-ofertas`). Antes de programar o enviar el Email 3 (y de repetir la mención en el Email 4), alguien tiene que confirmar en el dashboard de Stripe cuántos cupos del bono quedan. Si el cupo ya se agotó o si nadie está llevando la cuenta de verdad, **no enviar estos emails mencionando el tope** — sería escasez falsa, algo explícitamente prohibido por la oferta de `vako-ofertas`. | Confirmar cupos reales antes de cada envío | Julian |

## Tabla resumen

| Email | Asunto (variante principal) | Envío | Objetivo |
|---|---|---|---|
| 0 — Auto-respuesta EmailJS | Tu primera parte de El Mundo de la Copa ya está lista | Inmediato (disparado por EmailJS al enviar el formulario) | Entregar el extracto real prometido y sembrar la secuencia de conversión |
| 1 | Por si te está frenando el "¿y si no me sirve?" | Día 1 | Bajar el riesgo percibido: garantía de devolución de 7 días |
| 2 | Lo que se lleva quien compra ahora (no es solo el PDF) | Día 3 | Subir el valor percibido: bono de estatus Fundador/a + prioridad regional |
| 3 | Los primeros 50, nada más | Día 6 | Urgencia real: tope de 50 unidades del bono de fichas imprimibles |
| 4 | Antes de que dejemos de escribirte sobre esto | Día 9 | Resumen de toda la oferta + última llamada, cierre suave de la serie |

---

## Email 0 — Auto-respuesta de EmailJS (entrega del extracto)

**Objetivo:** cumplir la promesa del formulario ("te mandamos la primera parte completa, gratis") sin depender de que Julian responda manualmente, y sembrar la expectativa de los emails que siguen. Cero venta directa — es el primer contacto real después de un formulario, y la filosofía del equipo es no vender en el primer envío.

**Especificación técnica (para quien configure el panel de EmailJS):**
- Se configura como **Auto-Reply** de la plantilla que ya usa `enviarEmail()` en `ElMundoDeLaCopaLanding.jsx` (o una plantilla nueva dedicada, si se prefiere no tocar la que notifica a Julian).
- Destinatario del Auto-Reply: mapear al parámetro `email` que el formulario ya envía (`{{email}}`) — no requiere cambios en el código del formulario, ese dato ya viaja hoy.
- El link de descarga del cuerpo del email apunta a `https://vakoclub.com/guias/el-mundo-de-la-copa-parte-1-fundamentos.pdf` — PDF real exportado y subido el 2026-08-21 (`public/guias/el-mundo-de-la-copa-parte-1-fundamentos.pdf`), con el diseño de marca (Cormorant Garamond/EB Garamond/Jost, paleta burdeos/dorada) y el texto real de los 4 capítulos de la Parte I, cerrando con un CTA a la guía completa.
- Remitente sugerido: `info@vakoclub.com` (mismo remitente que ya usa el sitio para contacto).

**Asunto (variantes para probar):**
1. Tu primera parte de El Mundo de la Copa ya está lista
2. Acá está: la Parte I completa, gratis
3. Cinco minutos y vas a entender por qué te gusta un vino (o no)

**Preheader:** Fundamentos: dulzor, acidez, taninos, alcohol y cuerpo — explicados sin jerga.

**Cuerpo:**

Hola,

Gracias por dejarnos tu email en *El Mundo de la Copa*.

Como prometimos, acá tenés la **Parte I completa de la guía — "Fundamentos"** — gratis, sin letra chica:

**[Descargar la Parte I gratis]** → `https://vakoclub.com/guias/el-mundo-de-la-copa-parte-1-fundamentos.pdf`

En estas páginas vas a aprender a identificar los cinco componentes que explican casi cualquier vino: dulzor, acidez, taninos, alcohol y cuerpo. Un adelanto real, tomado directo de la guía:

> "Todo vino, sin importar su origen o su precio, se puede describir con cinco variables (...). Aprender a identificarlas por separado es el paso que transforma «me gusta» en «entiendo por qué me gusta», y lo que permite anticipar cómo se comportará una botella en la mesa antes de descorcharla."

Y un truco que usamos nosotros para calibrar el tanino, tal cual está en la guía: dejá una bolsita de té negro en agua diez minutos y probá. Esa sequedad rasposa es tanino puro, sin fruta ni alcohol que lo disimule. Una vez que lo identificás ahí, no se te vuelve a escapar en una copa.

Esto es solo el Capítulo 1 de los 4 que tiene la Parte I. La guía completa son 83 páginas: cata en cinco pasos, las uvas más importantes, todas las regiones del mundo (España, Argentina, Francia, Italia, Estados Unidos y más) y una matriz de maridaje plato por plato — mismo enfoque en todo el libro, sin esnobismo.

En los próximos días te vamos a escribir un par de veces más, cada vez sobre algo puntual — nada de spam. Si en algún momento preferís ir directo al grano, la guía completa está acá:

**[Conseguir El Mundo de la Copa — $29.99]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Un abrazo,
El equipo de Vako Club

**CTA único:** Descargar la Parte I gratis.

**Nota de timing:** Inmediato — disparado por EmailJS al completar el formulario de la landing, no requiere ESP.

---

## Email 1 — Garantía (bajar el riesgo)

**Objetivo:** recordar que ya recibió valor real, y presentar la garantía de 7 días como respuesta directa a la duda más común de comprarle a una marca desconocida. Un único CTA de compra, sin presionar de más — es apenas el segundo contacto.

**Asunto (variantes para probar):**
1. Por si te está frenando el "¿y si no me sirve?"
2. Sin letra chica: 7 días para probarla
3. La pregunta que más nos hacen antes de comprar

**Preheader:** Si no te sirve, te devolvemos el dinero. Simple.

**Cuerpo:**

Hola,

Ayer te mandamos la Parte I de *El Mundo de la Copa* (si no te llegó, revisá spam o escribinos a info@vakoclub.com y te la reenviamos).

Hoy queremos contarte algo que no suele decirse en una guía de $29.99, pero que para nosotros es importante: tenés **7 días de garantía completa**. Si la comprás y sentís que no era lo que esperabas, nos escribís a info@vakoclub.com dentro de esos 7 días y te devolvemos el dinero, sin pedirte que justifiques nada.

No lo decimos porque esperemos devoluciones — lo decimos porque decidir comprarle a una marca que recién estás conociendo no debería sentirse como un salto al vacío. Ya leíste el primer capítulo; el resto de la guía sigue el mismo nivel, la misma claridad y el mismo objetivo: que entiendas qué estás tomando, no que memorices un manual.

**[Conseguí la guía completa — $29.99 · Garantía de 7 días]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Un abrazo,
El equipo de Vako Club

**CTA único:** Conseguir la guía completa (con la garantía como refuerzo, no como oferta aparte).

**Nota de timing:** Día 1 (un día después de la auto-respuesta / de dejar el email en la landing).

---

## Email 2 — Bono Fundador/a (subir el valor percibido)

**Objetivo:** presentar el bono de estatus "Fundador/a" y recordar la muestra de páginas reales de la landing, para subir el valor percibido sin tocar el precio. Un único CTA de compra.

**Asunto (variantes para probar):**
1. Lo que se lleva quien compra ahora (no es solo el PDF)
2. Un estatus que no vas a poder conseguir más adelante
3. Fundador/a: lo que ganás por comprar temprano

**Preheader:** Estatus de Fundador/a + prioridad en la próxima serie de guías, sin costo extra.

**Cuerpo:**

Hola,

Ya viste la Parte I de *El Mundo de la Copa* — fundamentos, sin vueltas. La guía completa sigue con el mismo criterio en cata, uvas, todas las regiones del mundo y maridaje.

Algo que quizás no sabías: quien compra la guía hoy entra automáticamente como **Fundador/a de Vako Club**. Eso significa:

- Invitación directa a la **Membresía Gratuita** de Vako Club (comunidad + descuentos en tienda).
- **Aviso prioritario** apenas salgan las próximas guías de la colección regional (España, Argentina, Francia) — antes que nadie más.

No es un descuento ni un truco de precio: es un lugar en la fila, y solo lo tienen quienes ya forman parte de la guía general desde ahora.

Si todavía dudás si vale la pena, en la landing hay **6 páginas reales de la guía** para hojear antes de decidir — no son capturas genéricas, son páginas del PDF real:

**[Ver páginas reales antes de comprar]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#adentro`

**[Conseguí la guía y tu estatus de Fundador/a — $29.99]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Un abrazo,
El equipo de Vako Club

**CTA único:** Conseguir la guía y el estatus de Fundador/a.

**Nota de timing:** Día 3.

---

## Email 3 — Tope de 50 unidades (urgencia real)

**Objetivo:** comunicar la escasez real definida por `vako-ofertas` (Opción B: bono limitado a 50 compradores, no el precio ni la guía en sí) de forma honesta, sin contadores falsos. **No enviar este email sin confirmar antes el cupo real restante** (ver dependencia #5 de la tabla de arriba).

**Asunto (variantes para probar):**
1. Los primeros 50, nada más
2. Esto no lo repetimos con todos
3. Quedan pocos cupos del bono de esta semana `[VERIFICAR CUPO ANTES DE ENVIAR]`

**Preheader:** Cupo limitado, no precio limitado — te explicamos por qué.

**Cuerpo:**

Hola,

Una aclaración antes que nada: en Vako Club no usamos contadores falsos ni "quedan 3 unidades" inventado. Así que esto es real: **los primeros 50 compradores de esta campaña** reciben, además de la guía completa, las **fichas imprimibles** de la guía —Ficha de Cata y Glosario del Catador— como archivo aparte, para tener siempre a mano sin abrir el PDF completo cada vez.

No es contenido nuevo (ya está dentro de la guía, en los apéndices), pero mientras dure el cupo lo entregamos también suelto, listo para imprimir.

`[PENDIENTE: confirmar con Julian cuántos cupos quedan del tope de 50 antes de enviar este email — si ya se agotó, no enviarlo mencionando el tope, o ajustarlo al número real]`

Importante: la guía en sí no tiene fecha de vencimiento ni deja de estar disponible — lo único que se termina es este bono puntual para quienes decidan durante esta campaña.

**[Conseguí la guía + las fichas imprimibles — $29.99]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Un abrazo,
El equipo de Vako Club

**CTA único:** Conseguir la guía + el bono de fichas imprimibles.

**Nota de timing:** Día 6.

---

## Email 4 — Resumen y última llamada

**Objetivo:** cerrar la serie con un resumen completo de la oferta (garantía + bono Fundador + tope de 50) en un solo lugar, sin agregar presión nueva, y dejar la puerta abierta para quien no compre ahora. Última pieza de esta secuencia — después de este email no se vuelve a insistir con este mismo ángulo.

**Asunto (variantes para probar):**
1. Antes de que dejemos de escribirte sobre esto
2. Todo lo que incluye tu $29.99, en un solo email
3. Última vez que te hablamos de esta guía (por ahora)

**Preheader:** Garantía de 7 días, estatus de Fundador/a, y el bono mientras dure el cupo.

**Cuerpo:**

Hola,

Este es el último email de esta serie sobre *El Mundo de la Copa* — no te vamos a seguir escribiendo todos los días sobre lo mismo.

Antes de cerrar el tema, todo junto:

- **La guía completa:** 83 páginas — fundamentos, cata, uvas, todas las regiones del mundo y maridaje, sin esnobismo. $29.99.
- **Garantía de devolución de 7 días**, sin preguntas.
- **Estatus de Fundador/a:** Membresía Gratuita + prioridad en la próxima serie de guías regionales.
- **Mientras dure el cupo de esta campaña:** las fichas imprimibles (Ficha de Cata + Glosario) como bono aparte. `[PENDIENTE: confirmar disponibilidad real del cupo antes de enviar este email]`

Ya leíste la Parte I gratis — si te sirvió, ya sabés qué esperar del resto.

**[Conseguí la guía completa ahora — $29.99]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Si no es el momento, no pasa nada: seguís en nuestra lista y de vez en cuando te vamos a escribir sobre vino, no solo para vender.

Un abrazo,
El equipo de Vako Club

**CTA único:** Conseguir la guía completa ahora.

**Nota de timing:** Día 9 (último email de esta serie).

---

## Qué falta para que esto funcione de verdad

1. **Extracto real exportado y subido** (Parte I / 4 capítulos) — sin esto, la auto-respuesta no tiene qué entregar. Ver dependencia #1.
2. **Auto-Reply de EmailJS configurado** en el panel, mapeando `{{email}}` como destinatario — sin código nuevo si el panel lo permite. Ver dependencia #2.
3. **ESP de email marketing conectado** — bloquea programar los Emails 1 a 4 (Días 1/3/6/9). La auto-respuesta (Email 0) no depende de esto y puede activarse antes, en cuanto existan los puntos 1 y 2.
4. **Conteo manual del cupo de 50** antes de cada envío de los Emails 3 y 4 — de lo contrario, no enviar la mención del tope.
5. Si Julian confirma antes que se agregará un campo de nombre al formulario, se puede volver a escribir esta secuencia con `{{nombre}}`; hoy no existe ese dato.
