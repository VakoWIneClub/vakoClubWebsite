# Auditoría + cierre de brechas: landing "El Mundo de la Copa"
Fecha: 2026-08-20 | Agente: vako-landing

**Qué se audita:** `src/pages/tienda/ElMundoDeLaCopaLanding.jsx` (ruta en vivo `/tienda/el-mundo-de-la-copa`), contra la oferta nueva diseñada hoy por `vako-ofertas` (`ofertas/2026-08-20-oferta-ads-el-mundo-de-la-copa.md`) y el hallazgo de `vako-research` (`research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md`). No se toca código: todo lo de abajo es copy + estructura para que un desarrollador lo implemente.

---

## 1. Puntuación 1-10 por sección (estado actual, antes de este cierre de brechas)

| Sección | Puntuación | Hallazgo |
|---|---|---|
| **Hero (25%)** | 8/10 | Titular con beneficio ("El vino se disfruta más cuando lo *entendés*"), subtítulo concreto, CTA primario + secundario, imagen de tapa. Bien construido. Le falta un ancla de confianza en el primer scroll — hoy el microcopy solo dice "Descarga inmediata · PDF para leer en cualquier dispositivo · Pago seguro", sin mencionar la garantía. |
| **Propuesta de valor / 4U (20%)** | 6/10 | Útil, Único y Ultra-específico están resueltos (sección "El problema" + índice de 7 partes con descripciones concretas). **Urgente falla del todo**: no hay ningún motivo para actuar hoy en vez de "guardar el anuncio para después". Es el hueco más grande de este bloque. |
| **Prueba social** | 2/10 | No existe ninguna reseña, cifra ni testimonio (correcto no inventarlos — no hay compradores confirmados documentados). Solo hay una bio de autoridad ("Quiénes somos"), que no es prueba social sino credibilidad de marca. Para tráfico frío eso no alcanza solo. |
| **FAQ / objeciones** | 6/10 | 6 preguntas bien resueltas (formato, nivel, idiomas, entrega, regalo, actualizaciones). Faltan las dos objeciones más típicas de un infoproducto pago: reembolso y "¿por qué pagar si hay info gratis en internet?". |
| **Oferta y precio** | 5/10 | Precio ($29.99) claro, consistente con Stripe, bien anclado contra el mercado (research de hoy). Pero el paquete de oferta que definió `vako-ofertas` hoy (garantía, bono Fundador, escasez) todavía no está reflejado en el copy — la sección "8 · La oferta" muestra solo precio + lista de qué incluye el PDF, sin ninguno de los tres elementos nuevos. |
| **CTA repetido** | 9/10 | Ya está muy bien resuelto: CTA en el header, en el hero, en la sección de oferta y en el cierre — los cuatro con el precio visible. No hace falta agregar más CTAs, solo enriquecer el texto de los que ya existen (ver abajo). |
| **Confianza / fricción técnica** | 6/10 | El botón de compra va directo a Stripe Checkout (`irACheckout` → `/api/create-checkout-session`), sin carrito ni pasos intermedios — bajísima fricción de por sí. Pero el **gate de idioma/edad** es lo primero que ve cualquier visitante, incluido tráfico de ads con intención de compra ya calificada, y exige dos clics antes de ver una sola palabra del hero. Es la fricción real más grande del camino a la compra hoy (detalle en punto 4 abajo). |

**Promedio ponderado aproximado:** ~6/10. La landing es una base sólida (mejor que "neutra" en estructura, como ya señaló `vako-ofertas`), pero le faltan justo los cuatro elementos que la oferta nueva definió para tráfico frío: garantía visible, bono, escasez honesta y sustituto de prueba social.

---

## 2. Garantía de 7 días, bono "Fundador" y escasez de 50 unidades — dónde y cómo insertarlos

Todos estos cambios son sobre el diccionario `COPY` (objeto `es`/`en`/`pt`) y el JSX de la sección **"8 · La oferta"** (`id="oferta"`, línea ~1013 del archivo actual). No requieren tocar Stripe ni el flujo de pago.

### 2.1 Refuerzo del hero (bajo costo, alto impacto — primer scroll)

Cambiar `hero.microcopy` de:
> "Descarga inmediata · PDF para leer en cualquier dispositivo · Pago seguro"

a:

**ES:**
> "Descarga inmediata · Pago seguro · Devolución garantizada 7 días"

**EN:**
> "Instant download · Secure payment · 7-day money-back guarantee"

**PT:**
> "Download imediato · Pagamento seguro · Garantia de devolução em 7 dias"

*(Se quita "PDF para leer en cualquier dispositivo" porque ya se sobreentiende y así el espacio se usa para el elemento de confianza que realmente falta. Si se prefiere no perder esa frase, usar cuatro elementos en vez de tres — el patrón de "·" ya soporta cualquier cantidad.)*

### 2.2 Badge de confianza junto al precio (sección "8 · La oferta")

Insertar un bloque nuevo, visualmente distinto (no solo una línea más de la lista `incluye`), justo debajo del botón de compra y antes de `secureNote`. Investigación de hoy (`vako-research`) cita que una garantía *visible junto al precio* es lo que más influye en conversión de tráfico frío — por eso va aparte de la lista larga, no perdida adentro.

**Copy sugerido (nuevo campo `t.oferta.garantia`):**

**ES:**
> **Garantía de devolución — 7 días.** Si no te sirve, escribinos a info@vakoclub.com dentro de los 7 días y te devolvemos el 100%, sin pedirte explicaciones.

**EN:**
> **7-day money-back guarantee.** If it's not for you, email us at info@vakoclub.com within 7 days and we'll refund you in full, no questions asked.

**PT:**
> **Garantia de devolução — 7 dias.** Se não for para você, escreva para info@vakoclub.com dentro de 7 dias e devolvemos 100%, sem perguntas.

### 2.3 Bono "Fundador/a" — sumar a la lista `oferta.incluye`

Agregar como nuevo ítem a `t.oferta.incluye` (se renderiza igual que el resto, sin cambios de JSX):

**ES:**
> "Estatus de Fundador/a de Vako Club: invitación a la Membresía Gratuita + aviso prioritario cuando salga la serie regional (España, Argentina, Francia)"

**EN:**
> "Vako Club Founding Member status: invitation to the Free Membership + priority notice when the regional series (Spain, Argentina, France) launches"

**PT:**
> "Status de Fundador(a) da Vako Club: convite para a Membresia Gratuita + aviso prioritário quando sair a série regional (Espanha, Argentina, França)"

*(Importante: esto no promete nada que hoy no exista — la Membresía Gratuita ya está implementada y funcional en `/suscripcion`. No mencionar los planes Sommelier/Gran Reserva de pago junto a este bono, por la regla de `00-BRAND-CONTEXT.md`.)*

### 2.4 Escasez real — tope de 50 unidades (Opción B de `vako-ofertas`, sin tocar Stripe)

Insertar como línea corta, justo arriba o debajo del botón de compra principal (sección oferta), **sin ningún contador numérico dinámico** (el sitio no tiene uno automático — un número que no baja de verdad sería un contador falso, prohibido explícitamente por la oferta).

**Copy sugerido (nuevo campo `t.oferta.escasez`):**

**ES:**
> "El estatus de Fundador/a está disponible para los primeros 50 compradores de esta campaña."

**EN:**
> "Founding Member status is available to the first 50 buyers of this campaign."

**PT:**
> "O status de Fundador(a) está disponível para os primeiros 50 compradores desta campanha."

**Nota operativa para Julian (no es copy, es una condición de honestidad):** esto solo puede publicarse si alguien lleva la cuenta real (dashboard de Stripe) y el copy se retira o se actualiza en cuanto se llegue a 50 compradores por esta campaña. Si nadie va a llevar esa cuenta, no publicar esta línea — mejor dejar solo la garantía y el bono, que no dependen de un conteo.

### 2.5 Cómo queda la sección "8 · La oferta" de arriba a abajo (orden recomendado)

1. Precio (`PRICE_LABEL`, sin cambios)
2. `paymentNote` ("Pago único · Sin vencimiento", sin cambios)
3. **Nuevo:** badge de garantía (2.2)
4. Botón de compra (sin cambios de texto — ver 2.6)
5. `secureNote` (sin cambios)
6. **Nuevo:** línea de escasez (2.4), en un tono más discreto que la garantía — es información, no presión agresiva
7. Lista `incluye`, con el nuevo bullet de Fundador/a agregado al final (2.3)

### 2.6 Reforzar el texto de los botones de CTA ya existentes

No hace falta agregar botones nuevos (ya hay 4, ver puntuación arriba). Sí conviene que el botón de la sección de oferta y el de cierre incluyan la garantía en el texto, no solo el precio — coincide con el one-liner que ya definió `vako-ofertas`:

**Antes (texto actual del botón, `t.nav.cta` + `PRICE_LABEL`):**
> "Conseguir la guía — USD 29.99"

**Después (solo en la sección de oferta y en el cierre, no en el header ni el hero para no hacerlo largo dos veces):**

**ES:** "Conseguir la guía — USD 29.99 · Devolución garantizada 7 días"
**EN:** "Get the guide — USD 29.99 · 7-day money-back guarantee"
**PT:** "Consiga o guia — USD 29.99 · Garantia de devolução em 7 dias"

### 2.7 FAQ — dos objeciones que faltan

Agregar a `t.faq.items` (después de la última pregunta actual, "¿Se actualiza?"):

**Nueva pregunta 1 — reembolso:**

**ES:** { q: "¿Puedo pedir reembolso?", a: "Sí. Tenés 7 días desde la compra para escribirnos a info@vakoclub.com y te devolvemos el 100%, sin pedirte explicaciones." }

**EN:** { q: "Can I get a refund?", a: "Yes. You have 7 days from your purchase to email us at info@vakoclub.com and we'll refund you in full, no questions asked." }

**PT:** { q: "Posso pedir reembolso?", a: "Sim. Você tem 7 dias a partir da compra para escrever para info@vakoclub.com e devolvemos 100%, sem perguntas." }

**Nueva pregunta 2 — "¿por qué pagar si hay info gratis?":**

**ES:** { q: "¿Por qué pagar si hay información gratis en internet?", a: "Porque está toda repartida en videos, blogs y opiniones contradictorias. Esta guía la ordena una sola vez, de la primera copa a la góndola, en 83 páginas pensadas para leerse — no para googlear cada duda por separado." }

**EN:** { q: "Why pay if there's free information online?", a: "Because it's scattered across videos, blogs, and contradicting opinions. This guide puts it in one place, from your first glass to the wine aisle, in 83 pages meant to be read — not googled one question at a time." }

**PT:** { q: "Por que pagar se há informação gratuita na internet?", a: "Porque está toda espalhada em vídeos, blogs e opiniões contraditórias. Este guia organiza tudo de uma vez, da primeira taça até a prateleira do mercado, em 83 páginas pensadas para ler — não para pesquisar cada dúvida em separado." }

---

## 3. Ausencia de prueba social real — qué usar mientras tanto (sin inventar nada)

No hay testimonios ni cifras hoy — `[PENDIENTE: primeras reseñas reales, a conseguir según el plan de vako-ofertas: pedir feedback a compradores existentes si los hay, y a cada comprador nuevo de esta campaña]`. Mientras tanto, reemplazar el rol de la prueba social con **elementos de confianza verificables que sí existen hoy**, agrupados en una sola franja visual (no dispersos), ubicada justo antes de la sección "8 · La oferta" (después de "6 · Quiénes somos" o inmediatamente arriba del precio) — es el punto donde el visitante ya leyó el índice y las páginas de muestra y está por decidir.

**Franja de confianza (nuevo bloque, tres columnas cortas, campo sugerido `t.confianza`):**

**ES:**
- "Pago 100% seguro, procesado por Stripe"
- "Mirá 6 páginas reales antes de decidir — no es una maqueta"
- "Devolución completa dentro de 7 días, sin preguntas"

**EN:**
- "100% secure payment, processed by Stripe"
- "See 6 real pages before you decide — not a mockup"
- "Full refund within 7 days, no questions asked"

**PT:**
- "Pagamento 100% seguro, processado pela Stripe"
- "Veja 6 páginas reais antes de decidir — não é uma maquete"
- "Devolução completa em até 7 dias, sem perguntas"

**Por qué esto funciona como sustituto honesto:** las 6 páginas de muestra ya existen (`/adentro`) y hoy están enmarcadas solo como "un vistazo" — reencuadrarlas explícitamente como *reducción de riesgo* ("no es una maqueta, es el PDF real") les da el mismo trabajo que haría un testimonio: bajar el miedo a comprar algo que no es lo que promete. Es la recomendación que ya dejó `vako-ofertas` en su oferta de hoy, aquí convertida en copy insertable.

**Además, reencuadrar la escasez del punto 2.4 como marco de exclusividad, no de volumen:** en ausencia de "ya lo compraron 500 personas", el ángulo "sé de los primeros 50 Fundadores" cumple una función parecida (pertenecer a un grupo temprano) sin fabricar ningún número de compradores que no existe.

**Apenas existan los primeros 3-5 compradores reales dispuestos a dar feedback:** reemplazar (no sumar indefinidamente) la franja de confianza de arriba por una franja mixta: 1-2 testimonios reales + la garantía + el dato de páginas de muestra. No hace falta esperar a tener muchos — con 3 honestos alcanza para pasar de "0 prueba social" a "prueba social real, aunque chica". Acción recomendada al equipo: `vako-email` ya tiene sugerido en la oferta de hoy un email post-compra pidiendo ese feedback — es el paso que destraba esto.

---

## 4. Lead magnet "primera parte gratis" — copy/UX del punto de captura (sección "9 · Para quien no está listo")

Gap operativo confirmado por `vako-ofertas` hoy: el formulario ya promete "la primera parte completa, gratis" y el mensaje de éxito dice "te llega la primera parte en unos minutos" — pero hoy `enviarEmail` solo manda una notificación a la bandeja interna de Vako Club por EmailJS (`EMAILJS_TEMPLATE_ID`), sin ningún adjunto ni auto-respuesta al usuario. Con tráfico pagado esto puede generar muchos más leads por día de los que Julian puede responder a mano — y hoy la landing le promete al usuario algo que no se cumple solo. La solución técnica (plantilla de auto-respuesta en EmailJS, PDF de muestra real) la define `vako-email`; acá va el copy/UX para los dos escenarios.

### 4.1 Copy interino — mientras el auto-responder no esté configurado

No cambiar la promesa a "nunca vas a recibir nada" (seguiría siendo cierto que Julian puede mandarlo a mano por ahora), pero sí bajar la expectativa de tiempo para no generar una promesa incumplida ("minutos" hoy no es cierto si depende de que Julian lo vea y responda):

**Cambiar `email.successMsg` de:**
> "Listo: te llega la primera parte en unos minutos."

**a (versión interina, ES):**
> "Listo, ya lo tenemos. Te lo mandamos por email en las próximas 24 horas."

**EN (interina):** "Got it — we'll email it to you within the next 24 hours."
**PT (interina):** "Pronto, já recebemos. Te enviamos por email nas próximas 24 horas."

*(Este cambio es puramente de expectativa, para no generar una promesa rota mientras el flujo es manual. En cuanto exista la auto-respuesta real, volver al texto original "en unos minutos" — ver 4.2.)*

### 4.2 Copy final — una vez configurada la auto-respuesta (recomendado a `vako-email`)

Mantener el copy original del formulario tal como está (`email.title`, `email.paragraph`, `email.submitIdle` ya están bien resueltos y no hace falta tocarlos), pero hacer más concreta la promesa para que el usuario sepa exactamente qué va a recibir — hoy dice "la primera parte" de forma vaga. Según la propia recomendación de `vako-ofertas`, el extracto real sería la Parte I (Fundamentos):

**Cambiar `email.paragraph` de:**
> "Dejanos tu email y te mandamos la primera parte completa, gratis. Si te sirve, ya sabés dónde está el resto."

**a:**

**ES:** "Dejanos tu email y te mandamos gratis la Parte I completa (Fundamentos) en PDF. Si te sirve, ya sabés dónde está el resto."

**EN:** "Leave us your email and we'll send you Part I (Fundamentals) in full, free, as a PDF. If it's useful, you already know where to find the rest."

**PT:** "Deixe seu email e mandamos de graça a Parte I completa (Fundamentos) em PDF. Se gostar, você já sabe onde está o resto."

Y una vez el envío sea automático de verdad, volver `email.successMsg` a su versión original ("en unos minutos"), porque en ese momento sí sería cierto.

**Copy sugerido para el email de auto-respuesta (asunto + cuerpo corto — para que `vako-email`/quien configure la plantilla de EmailJS lo use directo, sin diseñar la pieza completa que le corresponde a `vako-email`):**

- **Asunto (ES):** "Tu primera parte de El mundo de la copa 🍷"
- **Cuerpo (ES, corto):** "Hola, acá está la Parte I completa de *El mundo de la copa* (Fundamentos), como prometimos: [link de descarga]. Es un adelanto real del PDF completo — 83 páginas, con las otras 6 partes (cata, uvas, regiones, maridaje) y los apéndices. Si te sirve, la guía completa está acá: [link a /tienda/el-mundo-de-la-copa#oferta]. — Vako Club"

*(Versión EN/PT: mismo patrón, se puede replicar 1:1 traduciendo — no las escribo enteras acá para no invadir el trabajo de `vako-email`, que es quien arma la secuencia completa.)*

### 4.3 UX del formulario — un ajuste chico, sin tocar el flujo de pago

El formulario hoy no aclara qué pasa si el usuario ya compró (podría dejar el mismo email por las dudas). No es un problema grave, pero para tráfico de ads (más volumen, más gente distraída) conviene una microcopy que filtre mejor: agregar, debajo del botón, una aclaración corta de que este formulario es solo para la muestra gratis, no para la compra — evita confundir a alguien que en realidad quiere comprar ya con el flujo equivocado. Sugerido, opcional (impacto bajo, prioridad baja frente al resto de este documento):

**ES:** "¿Ya decidiste? Comprá la guía completa arriba — este formulario es solo para la muestra gratis."

---

## 5. Landing como destino de ads y fricción de checkout — confirmación

**Sí, `/tienda/el-mundo-de-la-copa` es el destino correcto para el link de ads**, no la tarjeta genérica de `/tienda`. Confirmado en el código, no solo por el copy:

- `api/create-checkout-session.js` valida el `returnPath` recibido contra una lista blanca fija (`RETURN_PATHS = ['/tienda', '/tienda/el-mundo-de-la-copa']`) para evitar open-redirect — la landing dedicada ya está contemplada explícitamente como un destino válido de ida y vuelta del checkout, no es una página aislada del flujo de pago.
- La landing pasa `guideId: 'guia-general'`, que en `api/_lib/catalog.js` tiene `disponible: true`, `amountCents: 2999` y sus tres archivos por idioma (`filePathByLang`) — el único producto realmente vendible hoy coincide exactamente con el único producto que tiene landing dedicada. No hay ambigüedad de a dónde debe apuntar el anuncio.
- La landing es, además, la única superficie del sitio con hero + índice + páginas de muestra + FAQ para este producto — la tarjeta de `/tienda` es comparativamente genérica (coincide con el hallazgo de `vako-research` de hoy).

**Fricción real encontrada en el camino a la compra (revisando el código, no solo el copy):**

1. **El gate de idioma/edad (`gateOpen`) es la primera pantalla que ve cualquier visitante**, incluido tráfico de ads que ya llega con intención de compra clara (vio un anuncio en español, hace clic sabiendo qué es). Exige dos clics (elegir idioma + tildar mayoría de edad) antes de mostrar una sola palabra del hero. Es fricción real, aunque razonable por el tema (contenido sobre alcohol). Recomendación de copy/UX, sin tocar código: para la campaña de ads en español, evaluar que el gate llegue con el idioma pre-seleccionado en "Español" (dejando solo el checkbox de edad por confirmar) en vez de forzar a elegir entre 3 idiomas primero — reduce el gate de 2 decisiones a 1. Esto es una decisión de implementación (leer un parámetro de idioma de la URL de la campaña o el idioma del navegador), fuera del alcance de copy puro, pero queda anotado para quien lo implemente.
2. **Fuera de eso, el checkout en sí tiene fricción mínima:** un solo clic dispara `irACheckout` → Stripe Checkout hospedado, sin carrito, sin formulario propio de datos de tarjeta, sin pasos intermedios. El regreso post-pago verifica el pago del lado del servidor (`/api/verify-session`) y dispara la descarga automática, con un botón manual de respaldo si el navegador bloquea la descarga — bien resuelto, no requiere cambios de copy.
3. **Nada relacionado con impuestos o dirección de facturación se le pide al comprador** (Managed Payments está desactivado a propósito, según `01-ESTADO-ACTUAL.md`) — esto de hecho *reduce* fricción para el comprador (menos campos), aunque tiene la contrapartida ya documentada de no calcular impuestos automáticamente; no es un problema de copy ni bloquea esta campaña.
4. **No hay ningún elemento de "carrito abandonado" o segundo intento** si alguien cierra Stripe Checkout sin pagar — vuelve a `/tienda/el-mundo-de-la-copa?compra=cancelada`, que sí muestra un mensaje claro ("Compra cancelada... Podés intentarlo de nuevo cuando quieras") y dispara la sección de FAQ/garantía otra vez al hacer scroll. Suficiente para esta etapa; no se requiere ningún cambio.

**Conclusión del punto 4:** el checkout en sí no es el problema — es rápido y claro. La única fricción real y accionable en el camino a la compra es el gate de idioma/edad como primera pantalla, y es una fricción menor comparada con los tres huecos de oferta ya cerrados en las secciones 2 y 3 de este documento.

---

## Notas para implementación (resumen para quien lo construya)

Sobre `src/pages/tienda/ElMundoDeLaCopaLanding.jsx`, dentro del objeto `COPY` (los tres idiomas, `es`/`en`/`pt`):

1. Editar `hero.microcopy` (punto 2.1).
2. Agregar `oferta.garantia` (punto 2.2) y renderizarlo como badge visualmente distinto entre el botón de compra y `secureNote`, dentro de la sección `id="oferta"`.
3. Agregar un ítem nuevo al final del array `oferta.incluye` (punto 2.3, bono Fundador).
4. Agregar `oferta.escasez` (punto 2.4) y renderizarlo cerca del botón de compra, en tono más discreto que la garantía.
5. Cambiar el texto de los botones de compra de la sección oferta y de cierre para incluir la garantía (punto 2.6) — el botón del header y del hero pueden quedar como están, más cortos.
6. Agregar dos ítems nuevos a `faq.items` (punto 2.7).
7. Agregar un nuevo bloque `confianza` (3 líneas cortas, punto 3) y renderizarlo como franja de tres columnas entre la sección "6 · Quiénes somos" y "8 · La oferta".
8. Cambiar `email.paragraph` y (temporalmente) `email.successMsg` según el escenario en que esté el auto-responder (punto 4.1/4.2) — coordinar con `vako-email` para saber cuál de las dos versiones cargar.
9. Ninguno de estos cambios toca `irACheckout`, `create-checkout-session.js`, `catalog.js` ni `download-guide.js` — son puramente de copy dentro del diccionario `COPY` y de estructura visual dentro del JSX ya existente.
10. Pendiente de decisión de producto (no de copy): si se implementa el gate de idioma pre-seleccionado para tráfico de ads en español (punto 5.1), es un cambio de lógica (leer parámetro de URL o idioma del navegador), no de este documento.

**Dependencias con otros agentes:**
- `vako-email`: define la solución técnica de auto-respuesta (plantilla EmailJS) y la secuencia de nutrición para quien deja el email en el formulario de "primera parte gratis" — el copy del email de auto-respuesta sugerido en el punto 4.2 queda a su disposición para ajustar/ampliar.
- `vako-creatividades`: cualquier pieza de ads debe enlazar a `/tienda/el-mundo-de-la-copa` (confirmado en la sección 5), y puede reusar los one-liners de garantía/bono/escasez de este documento y del de `vako-ofertas` para mantener consistencia entre anuncio y landing.
