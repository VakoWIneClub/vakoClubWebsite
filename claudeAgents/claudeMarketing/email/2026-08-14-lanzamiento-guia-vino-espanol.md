# Secuencia de Lanzamiento — Guía del Vino Español (Precio Fundador de la Colección)
Fecha: 2026-08-14 | Agente: vako-email

## Resumen ejecutivo

- **Objetivo de la secuencia:** anunciar y vender la *Guía del Vino Español* (primera entrega de la nueva serie regional de Vako Club) a la **lista de email ya existente de Vako Club** — no es la campaña de contenido de Instagram (esa sigue su propio calendario, ver `01-ESTADO-ACTUAL.md`) ni una secuencia de bienvenida para leads nuevos que recién descargan un imán de entrada (ese es otro tipo de secuencia del mismo playbook, todavía no escrita).
- **Oferta usada, exactamente como la definió `vako-ofertas`** (`ofertas/2026-08-14-lanzamiento-guia-vino-espanol.md`): Precio Fundador de la Colección **€12** durante una ventana real de **14 días** desde el lanzamiento → sube a **€19** de precio regular. Bonos: ficha imprimible "Tapas & Vino Español", mapa visual de las DO de España, estatus de "Fundador/a de la Colección" (acceso anticipado a Argentina/Francia + invitación a la membresía Gratuita). Garantía de devolución de 14 días, sin preguntas, escribiendo a info@vakoclub.com.
- **6 emails**, estructura anticipación → apertura → urgencia real de cierre de la ventana de 14 días, tal como se pidió.
- **No se incluye** el cuarto bono opcional de la oferta (sesión en vivo de preguntas y respuestas) porque sigue sin confirmación de Julian — no se anuncia nada que no esté garantizado.
- **No se citan cifras exactas de meses de Crianza/Reserva/Gran Reserva** en ningún email: la propia investigación de `vako-research` marcó que esas cifras varían entre fuentes no oficiales y deben verificarse contra el reglamento oficial antes de publicarse. El copy se apoya en la confusión/el dolor (que sí está validado) sin arriesgar un dato incorrecto.
- **Gancho de calendario usado:** la vendimia española, en marcha ahora mismo, como telón de fondo cultural del lanzamiento (email 1 y 2). El Día Internacional del Tempranillo (12/11/2026) y el regalo de Navidad (desde inicios de noviembre) **no se usan aquí a propósito** — la propia investigación los identifica como ventanas de *relanzamiento/recordatorio*, no del lanzamiento inicial. Quedan disponibles para una secuencia corta aparte más adelante si Julian quiere reactivar la oferta o recordar la guía en esas fechas.

## Notas antes de cargar esta secuencia

**1. Falta el ESP de email marketing (acción pendiente conocida).** El sitio solo tiene EmailJS conectado, y únicamente para el formulario de contacto transaccional. No hay todavía un proveedor de email marketing (Brevo, MailerLite, Mailchimp, ConvertKit u otro con plan gratuito para listas pequeñas) conectado para poder automatizar el envío de esta secuencia a una lista. Esta secuencia está escrita completa y lista para pegar en cuanto se resuelva esa pieza.

**2. Marcadores/placeholders que hay que rellenar antes de enviar:**
| Marcador | Qué es | Quién lo resuelve |
|---|---|---|
| `{{nombre}}` | Campo de personalización estándar en la mayoría de ESPs (Brevo, Mailchimp, MailerLite, ConvertKit). Ajustar la sintaxis exacta si el proveedor final usa otra (ej. `*|FNAME|*` en Mailchimp). | Quien cargue la secuencia en el ESP |
| `[FECHA DE LANZAMIENTO]` | Día 0 real de la secuencia — se fija cuando el contenido de la guía esté terminado y la herramienta de cobro esté activa. | Julian / vako-ofertas |
| `[FECHA DE CIERRE]` | `[FECHA DE LANZAMIENTO]` + 14 días exactos — es la fecha en la que el precio sube de verdad de €12 a €19. | Se calcula en automático una vez se fije la fecha de lanzamiento |
| `[ENLACE DE COMPRA]` | Enlace de cobro externo (Gumroad recomendado por `vako-ofertas`, o la herramienta que Julian confirme). | Julian |

**3. Footer legal/baja de suscripción:** no se incluye en el cuerpo de cada email porque la mayoría de ESPs lo añaden automáticamente vía la plantilla (enlace de baja, dirección, etc.). Verificar que el ESP elegido lo incluya antes del primer envío.

**4. Escasez real, no inventada:** toda la urgencia de esta secuencia se apoya en la ventana de 14 días ya definida por `vako-ofertas` (mecánica principal de la oferta). Si el precio Fundador se extiende, hay que comunicarlo con transparencia ("ampliamos unos días más") en los emails 5 y 6 en vez de enviarlos tal cual con una fecha que ya pasó.

## Resumen de la secuencia

| Email # | Asunto | Día de envío | Objetivo |
|---|---|---|---|
| 1 | Se acerca la primera guía de una nueva colección | Día -3 (antes del lanzamiento) | Anticipación: generar curiosidad con un adelanto de valor, sin vender ni mencionar precio |
| 2 | Ya está aquí: la Guía del Vino Español (Precio Fundador €12) | Día 0 (lanzamiento) | Apertura: presentar la guía y la oferta, activar la primera ola de compras |
| 3 | ¿Por qué pagar si esto está gratis en internet? | Día 3 | Reforzar el valor superando la objeción principal (curación vs. información dispersa) |
| 4 | Todo lo que te llevas si compras esta semana | Día 7 | Bajar el riesgo percibido destacando bonos, garantía y estatus de Fundador/a |
| 5 | Quedan 2 días de Precio Fundador | Día 12 | Urgencia real: recordar que la ventana de 14 días está por cerrarse |
| 6 | Última llamada: el precio sube esta noche | Día 14 (último día) | Urgencia final: última oportunidad antes de que €12 pase a ser €19 |

---

## Email 1 — Anticipación

**Objetivo:** generar curiosidad por el lanzamiento y entregar un adelanto de valor puro. Cero venta, cero precio, cero CTA de compra.

**Asunto (variantes para probar):**
1. Se acerca la primera guía de una nueva colección
2. Algo se está gestando en Vako Club (y huele a vendimia)
3. ¿Sabes de verdad la diferencia entre Crianza y Reserva? (casi nadie la sabe bien)

**Preheader:** Un adelanto antes del lanzamiento oficial — todavía sin hablar de precio.

**Cuerpo:**

Hola {{nombre}},

Mientras en Rioja ya está en marcha la vendimia de este año, en Vako Club llevamos semanas preparando algo que veníamos posponiendo desde hace tiempo: la primera guía de una nueva colección dedicada, región por región, a los países que hacen el vino que más nos apasiona.

Empezamos por España.

Antes de contarte más, quiero dejarte un adelanto que probablemente te resuelva una duda que casi todo el mundo tiene frente a una estantería de vino español: ¿qué diferencia real hay entre un Joven, un Crianza, un Reserva y un Gran Reserva?

Spoiler: no es solo "cuánto tiempo lleva la botella guardada". Tiene que ver con el tiempo en barrica y el tiempo en botella, y varía según sea tinto, blanco o rosado — por eso casi nadie te lo explica bien en una sola frase, y por eso tantas personas asienten en la tienda sin estar del todo seguras.

En los próximos días vas a recibir la guía completa: Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda, Cava... y las uvas que las hacen únicas — Tempranillo, Garnacha, Albariño, Verdejo, Mencía. Todo explicado como nos gusta hacerlo en Vako Club: sin esnobismo, sin jerga innecesaria, de forma visual y amena.

Por ahora, solo quería que lo supieras antes que nadie.

**CTA único:** Responde a este correo y cuéntanos: ¿cuál es la región de vino español que más te gustaría dominar?

Un abrazo,
El equipo de Vako Club

**Nota de timing:** Día -3 (tres días antes de `[FECHA DE LANZAMIENTO]`).

---

## Email 2 — Apertura / Lanzamiento

**Objetivo:** anunciar que la guía ya está disponible y presentar la oferta completa (Precio Fundador, bonos, garantía). Un único CTA: comprar.

**Asunto (variantes para probar):**
1. Ya está aquí: la Guía del Vino Español (Precio Fundador €12)
2. De Rioja a Rías Baixas: la guía que veníamos preparando ya es tuya
3. Crianza, Reserva y Gran Reserva, explicados de una vez por todas

**Preheader:** Precio Fundador de la Colección: €12 (después sube a €19). Ventana de 14 días.

**Cuerpo:**

Hola {{nombre}},

Ya está lista. La *Guía del Vino Español*, la primera entrega de nuestra nueva colección regional, ya está disponible.

No es una guía general de vino con un capítulo dedicado a España. Es todo lo que hace falta para dejar de sentirte perdido/a frente a una etiqueta española y empezar a elegir con criterio:

- El sistema Joven / Crianza / Reserva / Gran Reserva, explicado de una vez por todas — sin líos, sin letra pequeña.
- Las denominaciones de origen que seguro ya has visto en alguna botella: Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda, Cava.
- Las uvas autóctonas que hacen único a cada vino español: Tempranillo, Garnacha, Albariño, Verdejo, Mencía, Monastrell.
- Maridaje pensado para mesa española de verdad: jamón ibérico, tapas, paella, marisco gallego.

Todo en un solo PDF curado y visual, pensado para leerse de un tirón — no para saltar entre quince pestañas de blogs distintos.

Por ser de los primeros en conseguirla, hoy la tienes al Precio Fundador de la Colección: ~~€19~~ **€12**. Esta ventana dura 14 días exactos — el `[FECHA DE CIERRE]` el precio sube de verdad a €19.

Si compras dentro de esta ventana, además te llevas:
- La ficha imprimible **"Tapas & Vino Español"** — qué vino con qué plato, sin adivinar.
- El **mapa visual de las Denominaciones de Origen de España**, para guardar en el móvil o imprimir.
- Tu **estatus de Fundador/a de la Colección**: acceso anticipado y aviso prioritario cuando lancemos las guías de Argentina y Francia, además de invitación directa a la membresía Gratuita de Vako Club.

Y si la lees y sientes que no era para ti, tienes 14 días para escribirnos a info@vakoclub.com y te devolvemos el 100% — sin preguntas incómodas.

**CTA único:** Consigue la Guía del Vino Español — Precio Fundador €12 (antes €19) → `[ENLACE DE COMPRA]`

Un abrazo,
El equipo de Vako Club

P.D. Esta es la primera guía de una colección más grande. Cuanto antes la consigas, antes te llevas tu estatus de Fundador/a — y eso no se puede conseguir después.

**Nota de timing:** Día 0 (día real de lanzamiento — `[FECHA DE LANZAMIENTO]`).

---

## Email 3 — Valor / Objeción

**Objetivo:** superar la objeción más probable ("¿por qué pagar si hay información gratis?") reforzando el valor real de la curación y el tiempo ahorrado. Un único CTA: comprar.

**Asunto (variantes para probar):**
1. ¿Por qué pagar si esto está gratis en internet?
2. Hay miles de blogs sobre vino español. Por eso hicimos esto.
3. 15 pestañas abiertas vs. 1 solo PDF

**Preheader:** No te vendemos información secreta. Te vendemos las horas que no vas a perder buscándola.

**Cuerpo:**

Hola {{nombre}},

Hay una pregunta honesta que seguramente te hiciste al ver el email de hace unos días: "¿por qué voy a pagar por esto si hay información de vino español gratis en internet?"

Tienes razón, en parte. Hay muchísima. Blogs de bodegas, artículos sueltos, vídeos, cuentas de Instagram, fichas técnicas de denominaciones de origen... El problema nunca fue que faltara información sobre vino español.

El problema es que está repartida en quince sitios distintos, sin un orden claro, con partes que hasta se contradicen entre sí, y sin nadie que la traduzca a algo que puedas leer en una tarde y quedarte tranquilo/a de verdad.

Eso es exactamente lo que resuelve la *Guía del Vino Español*: no es información exclusiva que no exista en ningún otro lado — es el trabajo de juntarla, ordenarla, quitarle la jerga y presentarla de forma visual, para que en vez de pasar horas saltando de pestaña en pestaña, la tengas resuelta en una sola sesión de lectura.

Lo que te ahorra esta guía no es información. Es tiempo — y esa sensación de "otra vez no me acuerdo si esto era Crianza o Reserva" justo delante de la persona con la que estás cenando.

El Precio Fundador de ~~€19~~ **€12** sigue activo por unos días más.

**CTA único:** Consigue tu ejemplar — Precio Fundador €12 → `[ENLACE DE COMPRA]`

Un abrazo,
El equipo de Vako Club

**Nota de timing:** Día 3.

---

## Email 4 — Bonos, garantía y estatus de Fundador/a

**Objetivo:** bajar el riesgo percibido destacando todo lo que se lleva quien compra dentro de la ventana (bonos + garantía + estatus). Un único CTA: comprar.

**Asunto (variantes para probar):**
1. Todo lo que te llevas si compras esta semana
2. 3 regalos + una garantía de 14 días
3. Esto significa ser Fundador/a de la Colección

**Preheader:** Dos fichas imprimibles, tu estatus de Fundador/a y una garantía sin letra pequeña.

**Cuerpo:**

Hola {{nombre}},

Llevamos ya unos días con el Precio Fundador de la *Guía del Vino Español* activo (~~€19~~ **€12**), y quería asegurarme de que sepas exactamente todo lo que te llevas si compras dentro de esta ventana — porque no es solo el PDF.

Te llevas:

1. **La Guía del Vino Español completa** — Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda, Cava, las uvas autóctonas que las definen, y el sistema Joven / Crianza / Reserva / Gran Reserva explicado sin líos.
2. **La ficha imprimible "Tapas & Vino Español"** — qué vino combina con jamón ibérico, croquetas, paella o marisco gallego, lista para tener a mano.
3. **El mapa visual de las Denominaciones de Origen de España** — para guardarlo en el móvil o imprimirlo como referencia rápida.
4. **Tu estatus de Fundador/a de la Colección** — serás de los primeros en enterarte, con acceso anticipado, cuando lancemos las guías de Argentina y Francia, además de una invitación directa a la membresía Gratuita de Vako Club.

Y si la lees y sientes que no era para ti: escríbenos a info@vakoclub.com dentro de los 14 días siguientes a tu compra y te devolvemos el 100%. Sin justificar nada, sin letra pequeña.

El Precio Fundador sigue activo, pero la ventana de 14 días se va acortando.

**CTA único:** Quiero mi ejemplar + los bonos — Precio Fundador €12 → `[ENLACE DE COMPRA]`

Un abrazo,
El equipo de Vako Club

**Nota de timing:** Día 7.

---

## Email 5 — Urgencia (quedan 2 días)

**Objetivo:** recordatorio directo de que la ventana del Precio Fundador está por cerrarse. Un único CTA: comprar antes de que suba el precio.

**Asunto (variantes para probar):**
1. Quedan 2 días de Precio Fundador
2. El [FECHA DE CIERRE] el precio sube a €19
3. Todavía puedes conseguirla a €12 (por poco tiempo)

**Preheader:** Después de esta ventana, el precio Fundador desaparece de verdad.

**Cuerpo:**

Hola {{nombre}},

Aviso rápido y directo: quedan 2 días para que el Precio Fundador de la *Guía del Vino Español* (**€12**) siga activo. El `[FECHA DE CIERRE]` a las 23:59, sube a su precio regular de **€19**.

No es una táctica de "últimas unidades" inventada — es literalmente la ventana de 14 días que anunciamos el día del lanzamiento, y ya casi se cierra.

Si todavía no la tienes, esto es lo que te espera dentro:
- El sistema Joven / Crianza / Reserva / Gran Reserva, por fin explicado sin rodeos.
- Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda y Cava, una por una.
- Las uvas que hacen único cada estilo: Tempranillo, Garnacha, Albariño, Verdejo, Mencía.
- Maridaje real, con jamón ibérico, tapas, paella y marisco gallego.
- Los dos bonos imprimibles + tu estatus de Fundador/a de la Colección.
- Garantía de devolución de 14 días, por si acaso.

**CTA único:** Consigue la Guía del Vino Español antes de que suba el precio → `[ENLACE DE COMPRA]`

Un abrazo,
El equipo de Vako Club

P.D. Si tienes alguna duda antes de decidirte, responde a este correo — lo leemos y contestamos nosotros, no un bot.

**Nota de timing:** Día 12 (2 días antes del cierre de la ventana de 14 días).

---

## Email 6 — Última llamada

**Objetivo:** última oportunidad, urgencia máxima y honesta, es el último día del Precio Fundador. Un único CTA: comprar ahora.

**Asunto (variantes para probar):**
1. Última llamada: el precio sube esta noche
2. Se cierra hoy: Precio Fundador de la Guía del Vino Español
3. En unas horas, €12 pasa a ser €19

**Preheader:** Mañana la Guía del Vino Español ya cuesta €19. Hoy es el último día a €12.

**Cuerpo:**

Hola {{nombre}},

Hoy es el último día. A partir de mañana, el Precio Fundador de la *Guía del Vino Español* desaparece de verdad: de **€12** pasa a costar **€19**.

No vamos a alargar la ventana ni a inventar una excusa para extenderla — 14 días es 14 días, y hoy se cumplen.

Si llevas unos días pensándolo, este es el momento. Si ya la tienes, no hace falta que hagas nada más — y si conoces a alguien que se pierde cada vez que ve una etiqueta de vino español, este es un buen momento para reenviarle este correo.

Recuerda todo lo que te llevas hoy: el PDF completo (Rioja, Ribera del Duero, Rías Baixas, Priorat, Jerez, Rueda, Cava, las uvas autóctonas y el sistema Crianza/Reserva/Gran Reserva explicado sin líos), los dos bonos imprimibles, tu estatus de Fundador/a de la Colección, y 14 días de garantía por si sientes que no era para ti.

**CTA único:** Consigue la Guía del Vino Español — Últimas horas a €12 → `[ENLACE DE COMPRA]`

Un abrazo,
El equipo de Vako Club

P.D. Mañana a esta misma hora, esta guía cuesta 7€ más. Es la única razón de este correo.

**Nota de timing:** Día 14, por la mañana (último día de la ventana de 14 días — el precio sube a partir del día 15 / `[FECHA DE CIERRE]`).

---

## Qué falta para poder enviar esta secuencia de verdad

1. **Contenido de la guía terminado** — hoy sigue "🆕 Planificada, por crear" en el catálogo de `01-ESTADO-ACTUAL.md`. Sin la guía escrita no hay nada que entregar tras la compra.
2. **Herramienta de cobro externo confirmada** (Gumroad recomendado por `vako-ofertas`, o la que Julian elija) — resuelve `[ENLACE DE COMPRA]` y el código de descuento con caducidad real a los 14 días.
3. **Fecha real de lanzamiento fijada** — resuelve `[FECHA DE LANZAMIENTO]` y `[FECHA DE CIERRE]`, y con eso las fechas de envío reales de los 6 emails.
4. **ESP de email marketing conectado** — sin esto, la secuencia está lista pero no hay dónde cargarla ni forma de automatizar el envío a la lista.
5. **Bonos imprimibles maquetados** ("Tapas & Vino Español" y el mapa de DO) — hoy son contenido definido en la oferta pero todavía no diseñado como pieza descargable independiente.

Ninguna de estas dependencias bloqueó escribir la secuencia (tal como pide el playbook de `vako-email`), pero sí bloquean enviarla de verdad.
