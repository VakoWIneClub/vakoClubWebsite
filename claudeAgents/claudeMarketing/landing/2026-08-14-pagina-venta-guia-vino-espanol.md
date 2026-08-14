# Página de venta: Guía del Vino Español
Fecha: 2026-08-14 | Agente: vako-landing

**Estado:** copy y estructura completos, listos para maquetar. **Bloqueada para publicarse en vivo** hasta que (1) el contenido real de la Guía del Vino Español esté escrito y (2) Julian confirme la herramienta de cobro externo (Gumroad / Payhip / Stripe Payment Links). Ninguna de las dos cosas bloquea tener esta página lista de antemano.

**Fuentes usadas (fuente única de verdad para este documento):**
- Investigación: `claudeAgents/claudeMarketing/research/2026-08-13-guia-vino-espanol-angulo-demanda.md`
- Oferta: `claudeAgents/claudeMarketing/ofertas/2026-08-14-lanzamiento-guia-vino-espanol.md`

Precio, bonos, garantía y mecánica de urgencia usados **exactamente** como los definió `vako-ofertas`, sin modificarlos. No se ha inventado ningún testimonio, cifra de comunidad ni fecha de cierre — donde falta un dato real se deja marcado `[PENDIENTE]`.

## Resumen

- Producto: *Guía del Vino Español* en PDF, primera entrega de la serie regional de Vako Club.
- Precio: **€12 "Precio Fundador de la Colección"** (lanzamiento, ventana de 14 días desde que el enlace de cobro esté activo) → **€19 precio regular** después.
- Bonos incluidos (los 3 confirmados por `vako-ofertas`; el 4º bono —sesión en vivo— queda fuera de esta página porque sigue sin confirmar): ficha de maridaje imprimible, mapa de las DO de España, estatus de Fundador/a de la Colección.
- Garantía: devolución del 100% dentro de los 14 días posteriores a la compra, sin justificar.
- **No incluye bundle con la Guía General de Vino** (esa combinación sigue pendiente — el precio de la Guía General todavía no existe, ver `01-ESTADO-ACTUAL.md`).
- El botón de compra apunta a un **checkout externo todavía sin confirmar** (Gumroad, Payhip o Stripe Payment Links) — nunca a un checkout propio del sitio, porque no existe. Ver el detalle exacto en "CTAs" y en "Notas para implementación".
- Ángulo central (validado por la investigación): el hueco de contenido más buscado y peor resuelto es "Crianza vs. Reserva vs. Gran Reserva", y la promesa central de venta es "una guía, no 15 pestañas" frente a contenido gratis disperso.

---

## Estructura sección por sección (con el copy completo de cada sección)

### 0. Barra de anuncio superior (sticky, opcional)

Franja fina y fija en la parte superior de la página, visible todo el scroll, para mantener la oferta presente sin depender solo del hero.

> Precio Fundador de la Colección Regional: **€12** (antes €19) — disponible los primeros 14 días desde el lanzamiento.

Clic en la franja lleva al bloque de precio (sección 8), no directo al checkout (para no saltarse la garantía/objeciones).

---

### 1. Hero

**Objetivo (framework, 25% del puntaje):** titular con el beneficio en menos de 10 palabras, subtítulo que lo concreta, CTA por encima del pliegue, visual de apoyo.

- **Kicker (línea pequeña sobre el titular):** Colección Regional Vako Club — Primera entrega: España
- **Titular (H1):** Deja de sentirte perdido frente al vino español
- **Subtítulo:** De Rioja a Rías Baixas, de Tempranillo a Albariño: por fin vas a entender qué significa de verdad Crianza, Reserva y Gran Reserva. Todo el vino español que necesitas conocer, en un solo PDF — sin abrir 15 pestañas.
- **Visual — `[ASSET PENDIENTE, no existe todavía]`:** mockup de la guía en PDF (portada) sobre una tablet/laptop, o como páginas flotantes estilo revista boutique. Dirección de arte sugerida: paleta vino/dorado (clase `wine-gradient` ya definida en el sitio), tipografía Playfair Display en el título simulado de portada. Coordinar con quien maquete el contenido final de la guía — no simular contenido interior real hasta que exista.
- **CTA principal (botón, encima del pliegue):** **Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)**
  → Apunta a un enlace de pago **externo, todavía sin confirmar** (Gumroad / Payhip / Stripe Payment Links). No es un checkout propio del sitio — vakoclub.com no procesa pagos hoy.
- **Microcopy de confianza bajo el botón:** Descarga en PDF inmediata tras la compra · Garantía de devolución de 14 días · Pago seguro fuera de vakoclub.com

---

### 2. El momento incómodo (agitación del problema)

**Objetivo:** conectar emocionalmente con el dolor real antes de presentar la solución (parte del "Útil" del marco 4U).

> ¿Sabes de verdad la diferencia entre Crianza, Reserva y Gran Reserva? (casi nadie la sabe bien)

Estás delante de la sección de vinos españoles del supermercado, o de la carta de un restaurante, y todas las etiquetas parecen decir lo mismo con palabras distintas: Rioja, Ribera del Duero, DOCa, DO, Crianza, Reserva, Gran Reserva. Sabes que hay una diferencia real entre ellas — pero no la sabrías explicar si te preguntaran. Así que haces lo de siempre: eliges la botella que ya conoces, o le preguntas a quien esté cerca y te olvidas de la respuesta cinco minutos después.

No es que te falte curiosidad. Es que nadie te lo ha explicado nunca de forma simple, en un solo sitio, sin necesidad de tener conocimientos previos.

---

### 3. La solución: una guía, no 15 pestañas

**Objetivo:** presentar el PDF como la respuesta directa al dolor de la sección 2, y adelantar la objeción "¿por qué pagar si hay info gratis?" (el "Único" del marco 4U).

**Subtítulo de sección:** Una guía. No 15 pestañas.

Sí, hay muchísima información gratis sobre vino español — reseñas, vídeos, publicaciones de Instagram, blogs de bodegas. El problema nunca fue que faltara información. El problema es que está repartida en decenas de sitios distintos, con niveles de calidad muy distintos, escrita para públicos distintos (turistas, sumilleres, compradores de vino de inversión) — y casi nunca pensada para alguien que solo quiere aprender, de una vez, de forma ordenada y visual.

La Guía del Vino Español junta lo que de verdad importa en un único documento: legible en una sola sesión, pensado para leerse en el móvil o imprimirse, sin tecnicismos innecesarios y sin necesidad de saber nada de vino para empezar.

**Cómo se compara (datos reales, sin exagerar):**

| | Contenido gratis disperso | Guía del Vino Español (Vako Club) | Certificación profesional (ej. Spanish Wine Scholar) |
|---|---|---|---|
| Precio | €0 | €12 Fundador / €19 después | $725–$1.395 |
| Tiempo hasta el resultado | Horas saltando entre fuentes | Una sesión de lectura | Semanas o meses de estudio |
| Formato | Repartido en decenas de sitios distintos | Un único PDF visual y curado | Curso + examen |
| Pensado para | Quien tiene tiempo y paciencia para buscar y cruzar fuentes | Quien quiere aprender rápido y bien, sin tecnicismos | Quien busca certificarse profesionalmente |

**CTA:** **Quiero mi copia — €12 Precio Fundador**
→ Mismo enlace de pago externo (pendiente de confirmar, ver sección 1).

---

### 4. Qué vas a aprender (índice de la guía)

**Objetivo:** ultra-especificidad del marco 4U — nombrar lo concreto, no lo abstracto. Contenido tomado directamente del alcance ya aprobado por `vako-ofertas` en la oferta (no inventado). El índice capítulo-por-capítulo final debe confirmarse cuando exista el contenido real — ver "Notas para implementación".

**Subtítulo de sección:** Esto es exactamente lo que vas a poder hacer después de leerla

1. **El código de la etiqueta.** Vas a distinguir Joven, Crianza, Reserva y Gran Reserva con tiempos reales y verificados (no cifras aproximadas de blog) — y a saber por fin por qué una botella cuesta el doble que otra con el mismo nombre de DO.
2. **Las Denominaciones de Origen que ya conoces de nombre.** Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda y Cava explicadas una por una: qué las hace diferentes entre sí, no solo un mapa con nombres.
3. **Las uvas que hacen a España única.** Tempranillo, Garnacha, Albariño, Verdejo, Mencía y Monastrell: cómo reconocer su carácter en la copa, sin necesidad de un curso de cata.
4. **Maridaje español de verdad (no genérico).** Qué abrir con jamón ibérico, con tapas clásicas (croquetas, gambas al ajillo), con paella y con marisco gallego.

**CTA:** **Sí, quiero aprender esto — €12**
→ Mismo enlace de pago externo (pendiente de confirmar).

> **Nota interna — cómo cumple esta página el marco 4U (no es copy publicable, es para revisión del equipo):**
> - **Útil:** secciones 2 y 4 — resuelve el problema real de no saber leer una etiqueta española ni distinguir Crianza/Reserva/Gran Reserva.
> - **Urgente:** sección 8 — ventana real de 14 días del Precio Fundador (urgencia real, no inventada; ver oferta del 2026-08-14).
> - **Único:** sección 3 — frente a contenido gratis disperso en decenas de fuentes y frente a certificaciones profesionales de $725–$1.395, no existe competencia directa vendiendo un PDF curado de vino español en canales de venta directa, según `vako-research`.
> - **Ultra-específico:** sección 4 — no "aprende sobre vino español" sino Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda y Cava nombradas una por una; Tempranillo, Garnacha, Albariño, Verdejo, Mencía y Monastrell nombradas una por una.

---

### 5. Para quién es esta guía (y para quién no)

**Objetivo:** manejar por adelantado la objeción "¿es para principiantes o para gente que ya sabe?" y evitar compras/devoluciones por expectativas mal alineadas.

**Es para ti si:**
- Nunca has sabido explicar la diferencia entre Crianza y Reserva.
- Te intimida un poco la sección de vinos españoles del súper o la carta de un restaurante.
- Quieres regalar algo especial a alguien que "sabe de vino" y no quieres fallar.
- Te encanta la comida española y quieres acertar con el maridaje.
- Vas a viajar (o ya viajaste) a España y quieres entender mejor qué bebes.
- Ya sigues a Vako Club y quieres profundizar en una región concreta del mundo del vino.

**Ojo, probablemente no es para ti si:**
- Buscas prepararte para una certificación profesional o un examen de sumiller — para eso existen programas certificados, esta guía no sustituye eso.
- Ya trabajas en el sector del vino español y dominas el sistema de DO de memoria.

---

### 6. Los 3 bonos incluidos

**Objetivo:** subir el valor percibido sin tocar el precio (bonos exactamente como los definió `vako-ofertas`; se omite deliberadamente el 4º bono opcional —sesión en vivo— porque sigue sin confirmar y no debe anunciarse todavía).

**Subtítulo de sección:** Además de la guía, te llevas esto

1. **Ficha de maridaje imprimible "Tapas & Vino Español"** — una página lista para imprimir o guardar en el móvil, que cruza vinos españoles con platos reconocibles: jamón ibérico, tapas clásicas (croquetas, gambas al ajillo), paella y marisco gallego.
2. **Mapa visual imprimible de las Denominaciones de Origen de España** — una versión simplificada y visual de las DO que ya buscas por nombre (Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda, Cava), pensada para imprimir o guardar. Dato curioso: pósters de mapas de regiones de vino español se venden por separado desde $49.99 hasta $99.99 en tiendas especializadas — este viene incluido, gratis, con tu guía.
3. **Estatus de Fundador/a de la Colección** — al comprar durante el lanzamiento, quedas como early-adopter de la serie regional completa (España → Argentina → Francia): acceso anticipado y aviso prioritario en cuanto salgan las siguientes guías, además de una invitación directa a unirte a la membresía Gratuita de Vako Club.

**CTA:** **Llévate la guía + los 3 bonos — €12**
→ Mismo enlace de pago externo (pendiente de confirmar).

---

### 7. Vista previa — `[PENDIENTE, bloqueado hasta que exista contenido maquetado]`

**Objetivo (reducción de fricción):** dejar "hojear" el producto antes de pagar, tal y como sugirió `vako-ofertas` en la garantía.

Esta sección todavía no se puede construir: requiere al menos un borrador maquetado de la guía, y hoy sigue en estado "planificada, por crear" en el catálogo. Cuando exista, debería mostrar 2-3 páginas reales — idealmente la página de Crianza/Reserva/Gran Reserva explicada visualmente (el ángulo más fuerte de la investigación) más el índice completo.

**Mientras tanto:** usar el bloque de la sección 4 (índice/temario) como sustituto de vista previa — ya es contenido real y aprobado, aunque no sean páginas reales del PDF.

---

### 8. Oferta y precio completo

**Objetivo (framework):** usar exactamente la oferta activa — sin definir precio por cuenta propia.

**Título de sección:** Todo lo que llevas por €12

**Ancla de precio:** ~~€19~~ → **€12** — Precio Fundador de la Colección *(ahorras €7, ~37%)*

**Qué incluye tu compra:**
- La Guía del Vino Español completa, en PDF.
- Bono: Ficha de maridaje imprimible "Tapas & Vino Español".
- Bono: Mapa visual imprimible de las Denominaciones de Origen de España.
- Bono: Estatus de Fundador/a de la Colección (acceso anticipado a las próximas guías + invitación a la membresía Gratuita de Vako Club).
- Garantía de devolución de 14 días.

**Urgencia real (mecánica principal, ya definida por `vako-ofertas` — usar solo esta, no combinar con la mecánica de tope de unidades para no generar mensajes contradictorios):**
> El Precio Fundador de €12 está disponible solo durante los primeros 14 días desde el lanzamiento oficial de la guía. Pasado ese plazo, el precio sube de forma indefinida a €19.

`[FECHA DE CIERRE — completar cuando se fije la fecha real de lanzamiento; no hardcodear una fecha hoy]`

**Nota de precio:** Precios en EUR. `[PENDIENTE: confirmar si se muestran "IVA incluido" o "+ IVA"]`

**CTA:** **Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)**
→ Apunta a un enlace de pago **externo, todavía sin confirmar** (Gumroad / Payhip / Stripe Payment Links). No es un checkout propio del sitio.

**Microcopy bajo el botón:** Pago único. Sin suscripción, sin cargos recurrentes. Serás redirigido/a fuera de vakoclub.com para completar el pago de forma segura.

---

### 9. Garantía de 14 días, sin letra pequeña

**Objetivo:** reducir la fricción de comprar un PDF "a ciegas".

**Título:** Pruébala sin riesgo

Queremos que abras esta guía con la misma curiosidad con la que abrirías una botella nueva. Si dentro de los 14 días posteriores a tu compra sientes que no te aportó valor, escríbenos a **info@vakoclub.com** y te devolvemos el 100% de lo que pagaste. Sin necesidad de justificarlo, sin preguntas incómodas.

---

### 10. Todavía no tenemos reseñas — y eso también lo hacemos con transparencia

**Objetivo (framework, prueba social):** no inventar testimonios; convertir la honestidad en un punto de confianza.

La Guía del Vino Español es la primera entrega de la nueva serie regional de Vako Club, así que ahora mismo no tenemos reseñas publicadas todavía — no nos gusta inventarlas, y a ti tampoco te gustaría que lo hiciéramos. Lo que sí podemos ofrecerte es esto: eres bienvenido/a a ser de las primeras personas en leerla, y en los días después de tu compra te pediremos tu opinión honesta — buena o mala — para seguir mejorando esta guía y las que vienen después. Si te animas a dejarnos tu reseña, con tu permiso la compartiremos aquí mismo.

`[Bloque reservado para reseñas reales — no publicar testimonios hasta contar con 3-5 reseñas auténticas y con permiso explícito de cada persona. Ver cómo conseguirlas en "Notas para implementación".]`

Vako Club nace de la pasión por el vino y el deseo de hacerlo accesible a cualquier nivel de conocimiento, sin esnobismo — esta guía se escribió con esa misma idea. Síguenos en Instagram, [@vakoclub](https://instagram.com/vakoclub).

---

### 11. La primera entrega de una colección completa

**Objetivo:** dar contexto honesto al estatus de Fundador/a sin prometer nada que el equipo no pueda cumplir todavía.

España es la primera parada de una nueva serie de guías regionales de Vako Club — después llegarán Argentina y Francia (todavía sin fecha ni precio confirmados). Al comprar ahora, quedas como Fundador/a de la Colección: serás de las primeras personas en enterarte cuando publiquemos las siguientes guías, con acceso anticipado antes que el resto. También te invitamos a unirte a la membresía Gratuita de Vako Club, para seguir formando parte de la comunidad más allá de esta guía.

**CTA secundario (no es de compra):** **Únete gratis a la comunidad Vako Club**
→ Enlace interno a `/suscripcion` (registro gratuito, ya funcional hoy en el sitio).

---

### 12. Cierre / CTA final

**Título:** Deja de sentirte perdido frente al vino español, desde hoy

La próxima vez que tengas una botella española en la mano — en el súper, en una cena, en un viaje — vas a saber exactamente qué estás bebiendo y por qué. Empieza ahora, mientras el Precio Fundador de la Colección sigue activo.

**CTA:** **Empieza a entender el vino español hoy — €12**
→ Mismo enlace de pago externo (pendiente de confirmar).

**Microcopy:** Descarga inmediata en PDF · Garantía de 14 días · Pago seguro fuera de vakoclub.com

---

### 13. Puente opcional al imán de entrada gratuito — `[depende de un activo que todavía no existe]`

**Objetivo:** no perder a quien todavía no está listo/a para comprar; capturar su email para nutrir hacia la compra más adelante (sugerido por `vako-research` y `vako-ofertas` como el imán de entrada más fuerte encontrado).

**Título:** ¿Todavía no estás segur@?

Si quieres probar el estilo de Vako Club antes de decidirte, llévate gratis nuestra chuleta de una página — *Joven, Crianza, Reserva y Gran Reserva en 60 segundos* — a cambio de tu email. Así, cuando decidas dar el paso a la guía completa, ya sabrás si nuestro estilo es para ti.

**CTA:** **Enviarme la chuleta gratis** *(campo de email)*
→ Formulario de captura, no un checkout. Requiere: (a) que exista el PDF de una página de la chuleta gratuita, y (b) un destino real para esos emails — hoy no hay ESP de marketing conectado, solo EmailJS transaccional. Dejar este bloque fuera de la página hasta resolver ambas dependencias no afecta la venta principal.

---

### 14. Pie de página de confianza

- Enlaces a `/terminos` y `/politica-privacidad` (ya existen en el sitio).
- Contacto: **info@vakoclub.com** — "¿Dudas antes de comprar? Escríbenos."
- Instagram: [@vakoclub](https://instagram.com/vakoclub).

---

## FAQ / manejo de objeciones

**1. ¿Por qué pagar por esto si hay información gratis en internet?**
Tienes razón: hay muchísima información gratuita sobre vino español. El problema no es que falte información, es que está repartida en decenas de sitios distintos, con niveles de calidad muy distintos, y casi nunca pensada para alguien que quiere aprender de forma ordenada. No compras "información exclusiva que no existe en ningún otro lado" — compras el tiempo que te ahorras al no tener que buscarla, cruzarla y ordenarla tú mismo/a, presentada de forma visual, curada y pensada para leerse en una sola sesión. Una guía, no 15 pestañas.

**2. ¿Esta guía es para principiantes o para gente que ya sabe de vino?**
Está pensada sobre todo para quien tiene curiosidad y ganas de aprender, pero se pierde con los tecnicismos — no hace falta que sepas nada de vino para empezar. Si ya eres una persona muy avanzada (por ejemplo, si estás preparando una certificación profesional de sumiller), es probable que ya conozcas buena parte de lo básico que cubrimos aquí; esta guía brilla más como el punto de partida claro y visual que te faltaba, no como programa de certificación.

**3. ¿En qué formato la recibo y cómo la descargo?**
Es un PDF digital. En cuanto completas la compra, recibes el enlace de descarga de inmediato — no hay envío físico ni esperas. Puedes leerla desde el móvil, la tablet o el ordenador, y también imprimir las partes pensadas para eso (como los bonos). Es tuya para siempre: la descargas una vez y se queda contigo, sin caducidad.

**4. ¿Puedo pedir un reembolso si no me convence?**
Sí. Tienes 14 días completos desde tu compra para decidir si la guía te aportó valor. Si no es así, escríbenos a info@vakoclub.com dentro de ese plazo y te devolvemos el 100% de lo que pagaste, sin necesidad de justificarlo.

**5. ¿Qué incluye exactamente el precio de €12?**
La Guía del Vino Español completa en PDF + la ficha de maridaje imprimible "Tapas & Vino Español" + el mapa visual imprimible de las Denominaciones de Origen de España + tu estatus de Fundador/a de la Colección (acceso anticipado a las próximas guías + invitación a la membresía Gratuita de Vako Club) + la garantía de devolución de 14 días. Todo por un único pago, sin suscripción ni cargos recurrentes.

**6. ¿Por qué €12 ahora y no siempre este precio?**
Porque eres parte de la primera entrega de una colección nueva (España es la primera de varias guías regionales que estamos preparando) y queremos premiar a quienes confían en el proyecto desde el principio. El Precio Fundador de €12 está disponible solo durante los primeros 14 días desde el lanzamiento; después, el precio pasa a ser €19 de forma indefinida.

**7. ¿Necesito comprar también la Guía General de Vino de Vako Club?**
No, son productos independientes y puedes comprar cualquiera de las dos por separado. Todavía no existe un paquete conjunto ("bundle") entre la Guía General y esta guía de España — si en el futuro lo creamos, avisaremos primero a quienes ya forman parte de la comunidad.

**8. ¿Esta compra incluye las guías de Argentina y Francia?**
No — cada guía regional se vende por separado, y todavía estamos escribiendo las próximas entregas. Lo que sí obtienes como Fundador/a de la Colección es acceso anticipado y aviso prioritario en cuanto estén listas, antes que nadie más. Todavía no tenemos fecha ni precio cerrados para esas guías, así que no podemos prometerte un descuento concreto — solo que serás de las primeras personas en enterarte.

**9. ¿Esto es lo mismo que hacerme miembro "Sommelier" o "Gran Reserva" de Vako Club?**
No, son cosas distintas (y sabemos que el nombre "Gran Reserva" puede confundir: dentro de la guía es una categoría de envejecimiento del vino español, y también es el nombre de uno de nuestros futuros planes de membresía). Comprar esta guía es un pago único por un PDF descargable. La membresía de pago de Vako Club (planes Sommelier y Gran Reserva) todavía no está disponible para contratar en el sitio — hoy solo puedes unirte gratis a la membresía Gratuita, y eso sí lo incluye tu estatus de Fundador/a de la Colección como invitación.

**10. ¿Cómo se procesa el pago? ¿Es seguro?**
Al hacer clic en el botón de compra saldrás de vakoclub.com hacia nuestra plataforma de pago externa, donde se procesa la transacción de forma segura. No guardamos ni vemos los datos de tu tarjeta en ningún momento.

**11. ¿Puedo regalarla a otra persona?**
Sí, es una idea estupenda, sobre todo si conoces a alguien a quien le encanta el vino o va a visitar España. `[PENDIENTE: confirmar si la herramienta de pago final permite marcar la compra "como regalo" o enviar el PDF directamente al correo de otra persona; hasta entonces, la forma más simple es descargarla tú y reenviarla.]`

**12. ¿La guía caduca? ¿La puedo conservar para siempre?**
La puedes conservar para siempre. Es un archivo PDF que te descargas una vez — no depende de una suscripción activa ni de que sigas conectado/a a ningún sitio.

---

## CTAs (texto exacto de cada botón)

Todos los CTA de compra (1-6) llevan al **mismo enlace de pago externo, todavía sin confirmar** — Gumroad, Payhip o Stripe Payment Links (ver comparativa de herramientas en `ofertas/2026-08-14-lanzamiento-guia-vino-espanol.md`). Ninguno de los seis apunta a un checkout dentro de vakoclub.com, porque el sitio no tiene uno. Hasta que exista el enlace real, ver la recomendación de "botón temporal" en "Notas para implementación".

1. **"Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)"** — Hero (sección 1).
2. **"Quiero mi copia — €12 Precio Fundador"** — tras "La solución" (sección 3).
3. **"Sí, quiero aprender esto — €12"** — tras el índice (sección 4).
4. **"Llévate la guía + los 3 bonos — €12"** — tras los bonos (sección 6).
5. **"Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19)"** — bloque de oferta y precio (sección 8).
6. **"Empieza a entender el vino español hoy — €12"** — cierre (sección 12).
7. **"Únete gratis a la comunidad Vako Club"** — sección 11. *No es un CTA de compra* → enlaza a `/suscripcion` (registro gratuito, ya funcional).
8. **"Enviarme la chuleta gratis"** — sección 13 (opcional). *No es un CTA de compra* → formulario de captura de email para el imán de entrada gratuito, bloqueado hasta que exista ese activo y un destino real para los emails.

---

## Notas para implementación (qué necesitaría un desarrollador para construirla)

**Ruta y componente**
- Ruta sugerida: `/guias/vino-espanol`. Ojo: ya existe la ruta `/guia` (singular) en `src/App.jsx` para la sección de bodegas — usar un nombre claramente distinto (`/guias/...`, plural) para no confundir ambas secciones.
- Componente sugerido: `src/pages/GuiaVinoEspanol.jsx`, o mejor, un componente genérico reutilizable (ej. `src/pages/GuiaProducto.jsx` con props de contenido) ya que esta misma plantilla se necesitará para Argentina y Francia cuando lleguen — evita reconstruir la página desde cero cada vez.

**Identidad visual a reutilizar (ya verificada en el código, no supuesta)**
- Tipografía: `font-playfair` (titulares) + Inter por defecto en `body` — ambas ya cargadas vía Google Fonts en `src/index.css`.
- Clases ya existentes para reutilizar: `wine-gradient` / `wine-text-gradient` (acentos dorados, precio, CTAs), `wine-card` / `wine-glass-effect` (tarjetas de bonos, FAQ, oferta), `wine-pattern` (fondo de sección), `wine-hover` / `wine-shadow` (interacciones de botones y tarjetas).
- Paleta ya definida en `:root` de `src/index.css`: `--wine-burgundy #4a0e1d`, `--wine-gold #c5a572`, `--wine-cream #f3e9e0`, `--wine-dark #1a110f`, `--wine-light #8b4b5c`.
- Para la sección FAQ, reutilizar el patrón ya existente en `src/components/contacto/FaqSection.jsx` (animación con `framer-motion`, tarjetas `wine-card`, grid de 2 columnas) — con 12 preguntas puede convenir pasar a formato acordeón; revisar si el proyecto ya tiene un componente `Accordion` de shadcn/ui instalado, dado que `tailwind.config.js` ya define los keyframes `accordion-down` / `accordion-up` (sugiere que esa librería ya está contemplada en el proyecto).

**CTA / checkout (el punto más importante a resolver antes de publicar)**
- El botón de compra debe apuntar a un enlace de pago **externo** — Gumroad, Payhip o Stripe Payment Links, herramienta todavía sin confirmar por Julian (ver comparativa completa en `ofertas/2026-08-14-lanzamiento-guia-vino-espanol.md`). Centralizar ese enlace en una única constante o variable de entorno (ej. `PURCHASE_LINK_GUIA_ESPANOL`) para poder actualizarlo en un solo lugar.
- Hasta que exista el enlace real: no publicar esta página en ningún menú de navegación pública; si se publica antes de tiempo, sustituir los 6 botones de compra por una captura de email tipo "Avísame cuando esté disponible" en vez de un enlace roto o un botón inactivo.

**Ventana del Precio Fundador (14 días)**
- La fecha de cierre depende de la fecha real de lanzamiento, todavía sin fijar. No hardcodear una fecha de cierre en el copy: calcularla dinámicamente (fecha de lanzamiento + 14 días) o, como mínimo, dejarla como una constante fácil de actualizar antes de publicar.
- Si en cambio se decide usar la mecánica alternativa (tope de 100 copias, solo si la herramienta de cobro elegida la soporta de forma nativa), sustituir **todo** el copy de "primeros 14 días" por copy de tope de unidades — nunca mostrar ambas mecánicas a la vez (la propia oferta lo marca como explícitamente prohibido, para no generar mensajes contradictorios).

**Activos visuales pendientes (no existen todavía)**
- Portada/mockup del PDF de la guía (sección 1).
- Vista previa de 2-3 páginas reales (sección 7) — bloqueada hasta que exista al menos un borrador maquetado del contenido.
- Miniaturas de los 3 bonos imprimibles.
- Mientras tanto, usar únicamente el patrón visual `wine-pattern` + tipografía Playfair Display sobre degradado vino/dorado — nunca simular contenido interior real de la guía que todavía no existe.

**Prueba social**
- No incluir testimonios hasta contar con 3-5 reseñas reales. Cómo conseguirlas (ya sugerido por `vako-ofertas`, repetido aquí para quien construya la página): (a) antes o en el lanzamiento, enviar la guía gratis o a precio simbólico a 5-10 seguidores comprometidos de Instagram o de la comunidad Gratuita a cambio de feedback sincero, con permiso explícito para citarlos; (b) a los primeros compradores Fundadores, pasados unos días, pedirles 1-2 líneas de feedback + permiso para citarlos.
- Construir el componente de testimonios ya integrado en la sección 10, pero oculto/comentado (feature flag) hasta tener esas 3-5 reseñas verificadas.

**Idioma**
- Esta página está redactada solo en español (idioma principal del sitio). El sitio es multi-idioma (ES/EN/PT) — confirmar con Julian si esta guía también se vende en inglés/portugués antes de traducir la página; si es así, revisar primero si el contenido interno de la guía existirá en esos idiomas.

**Cifras de envejecimiento (Crianza/Reserva/Gran Reserva)**
- Esta página, deliberadamente, no imprime meses/años exactos de envejecimiento en ningún punto — la investigación encontró cifras contradictorias entre fuentes no oficiales. Antes de publicar cualquier cifra exacta (aquí o en el contenido de la guía), verificarla contra el reglamento oficial (BOE / normativa de cada DOCa/DO citada en `research/2026-08-13-guia-vino-espanol-angulo-demanda.md`, sección 4).

**SEO (fuera del alcance de esta página, anotado para más adelante)**
- La investigación detectó una oportunidad de contenido evergreen sin cubrir por Vako todavía: búsquedas de alto interés como "crianza reserva gran reserva diferencia" o "denominaciones de origen España". Encajaría como artículo aparte (no esta página de venta) en la sección `/noticias` ya existente del sitio.

**Tracking**
- Añadir un evento de analítica en cada uno de los 6 CTA de compra (ej. `cta_click_guia_espanol`) para poder medir la tasa de conversión real de la página una vez tenga tráfico, y compararla contra el rango de referencia de 5-10% mencionado en el framework de `vako-landing` para este tipo de página.

**Legal**
- Enlazar en el pie de página a `/terminos` y `/politica-privacidad` (ya existen en el sitio) — buena práctica estándar en cualquier página de venta, y especialmente relevante al vender un producto digital. `[PENDIENTE: confirmar con Julian/asesoría legal cómo se concilia el derecho de desistimiento de contenido digital en la UE con la garantía de devolución de 14 días ya definida por `vako-ofertas` — probablemente se complementan, pero no se ha verificado formalmente.]`
- IVA: mantener el `[PENDIENTE: IVA incluido o + IVA]` visible en el precio hasta que Julian lo resuelva — no decidirlo por cuenta propia.

**Checklist de dependencias que bloquean publicar esta página en vivo (no bloquean tenerla lista, igual que señaló `vako-ofertas`)**
1. El contenido de la Guía del Vino Español todavía no está escrito.
2. La herramienta de cobro externo todavía no está confirmada.
3. El imán de entrada gratuito (chuleta) todavía no existe como archivo, y no hay ESP de email marketing conectado (solo EmailJS transaccional) para capturar esos emails — bloquea solo la sección 13 (opcional), no el resto de la página.
4. El precio de la Guía General sigue `[PENDIENTE: precio]` — no bloquea esta página (los precios se diseñaron de forma independiente), pero si cambia, revisar la sección 7 de la FAQ ("¿necesito comprar también la Guía General?") por si conviene mencionar un futuro bundle.
