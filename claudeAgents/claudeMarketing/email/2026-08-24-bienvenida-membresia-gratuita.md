# Bienvenida / nutrición — Membresía Gratuita de Vako Club

Fecha: 2026-08-24 | Agente: vako-email

## Resumen ejecutivo

- **Para quién:** alguien que completó el registro real en `/suscripcion` (`src/pages/Suscripcion.jsx`) — nombre, email y contraseña, cuenta de verdad vía Supabase. Es la **primera secuencia que existe para este público**: hoy `email/` solo tenía la secuencia de lanzamiento de España y la de conversión de ads de "El Mundo de la Copa" (ambas para tráfico frío o compradores potenciales, no para socios ya registrados).
- **Diferencia de tono respecto a la secuencia de ads (`2026-08-20-conversion-ads-el-mundo-de-la-copa.md`):** ese público es tráfico frío que dejó el email a cambio de un extracto, sin cuenta ni compromiso. Este público ya creó una cuenta real — se permite algo más de calidez y personalidad de marca desde el Email 1, aunque sin presionar de más ni vender antes de tiempo.
- **Qué promete hoy el formulario de `/suscripcion` (verificado en `Suscripcion.jsx`, no asumido):** tres beneficios — "Acceso a la Guía Exclusiva" (el directorio curado de bodegas del sitio, ruta protegida `/guia`, **no** es la guía en PDF "El Mundo de la Copa" — son cosas distintas y esta secuencia nunca las confunde), "Guarda tus Favoritos" (`/perfil`) y "Participa en la Comunidad" (`/comunidad`). Los tres son reales y ya funcionan hoy.
- **Objetivo comercial del equipo:** vender guías en PDF sigue siendo la prioridad #1, así que la secuencia sí termina en una oferta real de "El Mundo de la Copa" ($29.99, único producto vendible hoy) — pero respetando el ratio recomendado de 3 partes de valor puro por 1 de venta directa y la regla de nunca vender en el primer email. De 6 emails, 4 son valor puro (entrega de los beneficios ya prometidos por el formulario), 1 es un puente suave que recién menciona la guía paga por primera vez sin pedir la compra, y 1 es la única oferta de venta directa de toda la secuencia.
- **Nunca se ofrecen los planes Sommelier/Gran Reserva como comprables** — no están implementados (ver `00-BRAND-CONTEXT.md`).
- **No se inventa nada del contenido de la guía paga citado en el Email 5** — todo lo citado (tabla de contenidos, hábitos de cata, reglas de maridaje) sale literal de `producto-guia-general-CONTENIDO-COMPLETO.md`.
- **Decisión propia de este documento — no se reutiliza la escasez de "primeros 50" de la secuencia de ads.** Esa escasez (fichas imprimibles limitadas a los primeros 50 compradores de *la campaña de ads*) tiene su propio contador manual y su propio público. Prometerla también acá, sin un contador compartido entre ambos canales, sería escasez falsa o un doble conteo del mismo cupo — algo que la oferta de `vako-ofertas` prohíbe explícitamente. Si Julian quiere extender el mismo cupo a este público, hay que decidirlo a propósito y compartir el mismo contador, no copiar el email tal cual.

## Antes de cargar esto — dependencias y bloqueos reales

| # | Bloqueo/dependencia | Qué falta | Quién lo resuelve |
|---|---|---|---|
| 1 | **El ESP ya no es el bloqueo — Hostinger Reach está conectado e integrado en el sitio (2026-08-24).** `api/subscribe-lead.js` ya existe, ya soporta el tag `socio-gratuito` en su mapa `SOURCE_TAGS`, y ya está probado de punta a punta contra la cuenta real de Reach (verificado con un contacto de prueba, luego borrado). | — | — |
| 2 | **El formulario de `/suscripcion` todavía no llama a ese endpoint.** Hoy `handleSubmit` en `Suscripcion.jsx` solo crea la cuenta en Supabase (`signUp`) — no dispara ningún `fetch` a `/api/subscribe-lead`, así que nadie que se registre hoy queda tageado como `socio-gratuito` en Reach todavía. Julian ya describió esto como "trivial" de conectar. | Agregar una llamada a `/api/subscribe-lead` (`{ email, name, source: 'socio-gratuito' }`) dentro de `handleSubmit`, después de que `signUp` confirme éxito — mismo patrón best-effort/silencioso ya usado en el lead magnet de la landing de "El Mundo de la Copa", para que un fallo de Reach nunca rompa el registro real. | Un dev (fuera del alcance de `vako-email`) |
| 3 | **La automatización en sí hay que construirla a mano en el panel de Reach.** Las 45 herramientas del MCP de Reach permiten leer y listar automatizaciones, pero no crearlas ni editarlas — no existe endpoint de creación. | Julian entra al panel de Reach → Automations → trigger "tag añadido: `socio-gratuito`" → encadena los 6 pasos Email/Delay de abajo, pegando el asunto y cuerpo tal cual están en este documento. | Julian |
| 4 | **Sintaxis exacta del campo de personalización de nombre en Reach, sin confirmar.** El formulario sí capta el nombre real (`formData.name`) y `api/subscribe-lead.js` ya acepta un campo `name` opcional, así que el dato viaja — pero no verifiqué en el panel de Reach si el campo de fusión se escribe `{{nombre}}`, `{{first_name}}` u otra variante. Los emails de abajo usan `{{nombre}}` como placeholder de contenido; ajustar la sintaxis exacta al cargarlos si Reach usa otra. | `[PENDIENTE: confirmar sintaxis real del campo de personalización en el editor de Reach]` | Julian, al cargar la automatización |
| 5 | **La ruta `/guia` (directorio de bodegas) requiere sesión iniciada.** Es una `ProtectedRoute`, así que el CTA del Email 1 solo funciona si quien hace clic ya inició sesión en ese dispositivo/navegador (normalmente sí, porque acaba de registrarse) — no hace falta ningún cambio, solo queda anotado por si alguien hace clic desde otro dispositivo y le pide loguearse primero. | — | — |

## Tabla resumen

| Email | Asunto (variante principal) | Envío | Objetivo |
|---|---|---|---|
| 1 | ¡Bienvenido/a a Vako Club, {{nombre}}! | Día 0 | Bienvenida cálida + entregar los 3 beneficios ya prometidos por el formulario (guía de bodegas, favoritos, comunidad) |
| 2 | Los 3 hábitos que valen más que memorizar añadas | Día 2 | Valor puro: enseñar un método simple de cata + activar el hábito de guardar favoritos en el perfil |
| 3 | La única regla de maridaje que nunca falla | Día 5 | Valor puro: enseñar una regla de maridaje práctica, invitar a compartir el resultado |
| 4 | Lo que se pierde quien no entra nunca a la comunidad | Día 8 | Valor puro: mostrar el valor real de `/comunidad` y de seguir a @vakoclub |
| 5 | La guía que resume todo lo que te venimos contando | Día 11 | Puente suave: primera mención de "El Mundo de la Copa" como recurso completo, sin pedir la compra |
| 6 | Ya sos socio/a — esto es lo que te falta para la guía completa | Día 14 | Venta directa: oferta completa de "El Mundo de la Copa" ($29.99, garantía 7 días) |

---

## Email 1 — Bienvenida

**Objetivo:** dar la bienvenida con calidez real (ya es una cuenta creada, no un lead frío) y entregar de inmediato el primero de los tres beneficios prometidos por el formulario: el directorio curado de bodegas. Cero venta — es el primer contacto después del registro.

**Asunto (variantes para probar):**
1. ¡Bienvenido/a a Vako Club, {{nombre}}!
2. Tu cuenta ya está lista — esto es lo que podés hacer hoy
3. {{nombre}}, esto es lo primero que te recomendamos abrir

**Preheader:** Tu directorio de bodegas, tus favoritos y la comunidad — ya podés usarlos.

**Cuerpo:**

Hola {{nombre}},

Bienvenido/a a Vako Club. En serio — no es una frase de bienvenida automática: alguien de nuestro equipo lee cada registro nuevo, y el tuyo llegó hoy.

Tu cuenta ya está activa, así que estos tres beneficios ya son tuyos:

- **Acceso a la Guía Exclusiva.** Un directorio curado de bodegas y vinos, pensado para explorar sin perderte entre miles de opciones. Está en tu cuenta, no es un PDF que tengas que descargar.
- **Guarda tus Favoritos.** Cada bodega o vino que te llame la atención lo podés guardar en tu perfil y armar tu propia lista, a tu ritmo.
- **Participa en la Comunidad.** Un espacio para compartir lo que estás probando y aprendiendo, con gente que le pasa lo mismo que a vos: le gusta el vino, pero nadie le explicó nunca por qué le gusta.

No hace falta que uses los tres hoy. Si tuviéramos que elegir por dónde empezar, sería por el directorio — es el beneficio que más gente nos dice que no esperaba encontrar tan curado.

**[Explorar el directorio de bodegas]** → `https://vakoclub.com/guia`

En los próximos días te vamos a escribir un par de veces más — casi todo valor puro, cosas que podés usar la próxima vez que abras una botella. Nada de spam, y nada de venderte algo todavía.

Un abrazo,
El equipo de Vako Club

**CTA único:** Explorar el directorio de bodegas (`/guia`).

**Nota de timing:** Día 0 — disparado por Reach al momento en que se añade el tag `socio-gratuito` (justo después del registro exitoso en `/suscripcion`).

---

## Email 2 — Valor: los 3 hábitos que valen más que memorizar añadas

**Objetivo:** entregar valor real y accionable (nada que dependa de comprar nada), y de paso activar el segundo beneficio prometido: guardar favoritos en el perfil. Sigue sin venta.

**Asunto (variantes para probar):**
1. Los 3 hábitos que valen más que memorizar añadas
2. Nadie necesita memorizar 200 denominaciones para entender de vino
3. Un hábito de 10 segundos que construye criterio en meses

**Preheader:** Comparar, anotar y cuidar la temperatura — así se aprende de vino de verdad.

**Cuerpo:**

Hola {{nombre}},

Hay dos formas de acercarse al vino: memorizar denominaciones, añadas y puntajes, o entender por qué un vino sabe como sabe. En Vako Club siempre elegimos la segunda — es más simple, y se te queda para toda la vida.

Tres hábitos que valen más que cien datos sueltos:

- **Comparar siempre.** Dos copas al lado te enseñan más que diez botellas separadas por meses. La memoria del gusto es corta; la comparación directa, inmediata.
- **Anotar en una línea.** No hace falta una ficha completa — una frase por botella (nombre, año y qué te llamó la atención) construye criterio en pocos meses.
- **Cuidar la temperatura.** Es la variable que más vinos arruina, y la más fácil de corregir. Un tinto servido a 24°C sabe a alcohol; el mismo vino a 16°C parece otro completamente distinto.

Ese segundo hábito — anotar en una línea — es exactamente para lo que sirve **Guardar Favoritos** en tu perfil. La próxima vez que abras una botella que te guste (o que no), guardala ahí con una frase corta. En un par de meses vas a tener tu propio historial de gustos, sin haber "estudiado" nada.

**[Guardar mi primer vino en Favoritos]** → `https://vakoclub.com/perfil`

Un abrazo,
El equipo de Vako Club

**CTA único:** Guardar el primer vino en Favoritos (`/perfil`).

**Nota de timing:** Día 2.

---

## Email 3 — Valor: la única regla de maridaje que nunca falla

**Objetivo:** otra pieza de valor práctico y aplicable esta misma semana, sin ningún link a la tienda. Cierra pidiendo una respuesta (engagement, no venta) en vez de un clic.

**Asunto (variantes para probar):**
1. La única regla de maridaje que nunca falla
2. Por qué el vino "desaparece" con ciertos platos
3. Un experimento de 3 minutos con dos copas del mismo vino

**Preheader:** Si el plato le gana en intensidad al vino, el vino pierde. Siempre.

**Cuerpo:**

Hola {{nombre}},

De todas las reglas de maridaje que existen, hay una que resume casi todas las demás:

> *"Si el plato es más ácido, más dulce o más intenso que el vino, el vino desaparece."*

Así de simple. No hace falta memorizar qué uva va con qué carne — alcanza con preguntarte si el plato le va a "ganar" en intensidad al vino que elegiste.

Un experimento que podés hacer esta semana, sin gastar nada extra: la próxima vez que tengas un tinto con algo de cuerpo, serví dos copas iguales. Probá la primera con pan solo, y la segunda con un queso curado o un corte con algo de grasa. Vas a sentir que es casi otro vino — el tanino necesita grasa o proteína para "ablandarse", y sin eso se siente más áspero de lo que es.

Si lo probás, contanos cómo te fue — respondé este mismo email. Leemos todo, aunque tardemos un poco en contestar uno por uno.

Un abrazo,
El equipo de Vako Club

**CTA único:** Responder este email contando el resultado del experimento (engagement, sin link a comprar nada).

**Nota de timing:** Día 5.

---

## Email 4 — Valor: la comunidad

**Objetivo:** entregar el tercer beneficio prometido por el formulario — la comunidad — mostrando por qué vale la pena participar, no solo que existe. Último email puramente de valor antes del puente hacia la guía paga.

**Asunto (variantes para probar):**
1. Lo que se pierde quien no entra nunca a la comunidad
2. No hace falta saber "de vino" para participar acá
3. Un lugar para preguntar lo que te da vergüenza preguntar en una vinoteca

**Preheader:** Comunidad Vako: para compartir lo que estás aprendiendo, sin que nadie te mire raro.

**Cuerpo:**

Hola {{nombre}},

Te venimos escribiendo con tips que podés probar solo/a, con tu copa y nada más. Hoy es distinto: te queremos hablar de la parte de Vako Club que se disfruta mejor acompañado/a.

**Participa en la Comunidad** — el tercer beneficio de tu cuenta — es exactamente eso: un espacio para compartir qué estás tomando, preguntar lo que te dé curiosidad (o vergüenza preguntar en una vinoteca con alguien mirando) y ver qué está probando gente con el mismo nivel que vos. Nadie ahí llegó sabiendo todo, y así se mantiene.

Si ya guardaste algún vino en Favoritos (o hiciste el experimento del tanino de la semana pasada), la comunidad es un buen lugar para contarlo — es más entretenido comparar notas que anotar solo/a en un rincón.

También nos podés encontrar en Instagram, en **@vakoclub**, si preferís algo más visual mientras tanto.

**[Entrar a la Comunidad]** → `https://vakoclub.com/comunidad`

Un abrazo,
El equipo de Vako Club

**CTA único:** Entrar a la Comunidad (`/comunidad`).

**Nota de timing:** Día 8.

---

## Email 5 — Puente: la guía que resume todo esto

**Objetivo:** primera mención de "El Mundo de la Copa" en toda la secuencia — presentarla como el recurso completo detrás de los tips que ya recibió, sin pedir la compra todavía. El CTA lleva a *conocer* la guía (páginas de muestra, índice), no a comprarla.

**Asunto (variantes para probar):**
1. La guía que resume todo lo que te venimos contando
2. Los hábitos de las últimas semanas, en 83 páginas
3. Por si te gustó lo que te fuimos mandando

**Preheader:** Todo lo que aprendiste hasta ahora es apenas una fracción de lo que hay en la guía completa.

**Cuerpo:**

Hola {{nombre}},

Los últimos tres emails —los hábitos de cata, la regla de maridaje, la comunidad— salen del mismo lugar: *El Mundo de la Copa*, la guía completa de Vako Club. No te lo dijimos antes a propósito; preferimos que primero veas el tipo de contenido que hacemos, sin pedirte nada a cambio.

Son 83 páginas con el mismo criterio que ya probaste en tu bandeja de entrada, mucho más desarrollado:

- **Fundamentos y cata** — de dónde sale el sabor de un vino y cómo catarlo en cinco pasos, sin vocabulario impostado.
- **Las uvas más importantes**, tintas y blancas, en fichas comparables entre sí.
- **Todas las regiones del mundo** — Francia, Italia, España y Portugal, Alemania y Austria, Argentina, Chile, Uruguay, Brasil, Estados Unidos, Australia, Nueva Zelanda y Sudáfrica.
- **Una matriz de maridaje plato por plato**, para no tener que adivinar qué abrir cada vez.

No hace falta que hagas nada con esto ahora — no es una oferta, es solo para que sepas que existe y de dónde sale todo lo que te venimos mandando gratis. Si tenés curiosidad, podés ver el índice completo y varias páginas reales antes de decidir nada:

**[Ver el índice y páginas de muestra]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa`

Un abrazo,
El equipo de Vako Club

**CTA único:** Ver el índice y páginas de muestra (exploratorio, no un botón de compra).

**Nota de timing:** Día 11.

---

## Email 6 — Venta directa: la oferta completa

**Objetivo:** única oferta de venta directa de toda la secuencia. Presenta precio, garantía y el ángulo real para alguien que ya es socio/a gratuito/a (no se le ofrece la membresía como bono, porque ya la tiene — se le explica qué gana de más).

**Asunto (variantes para probar):**
1. Ya sos socio/a — esto es lo que te falta para la guía completa
2. Todo lo que ya usás gratis, más 83 páginas
3. Con garantía de 7 días, así que no hay mucho que pensar

**Preheader:** $29.99, garantía de devolución de 7 días, y aviso prioritario de lo que viene después.

**Cuerpo:**

Hola {{nombre}},

Este es el único email de esta serie donde te vamos a pedir algo directamente: te contamos la oferta completa de *El Mundo de la Copa*, y después seguimos como siempre, mandándote contenido, no publicidad todos los días.

Lo que incluye:

- **La guía completa, 83 páginas:** fundamentos, cata en cinco pasos, las uvas más importantes, todas las regiones del mundo y una matriz de maridaje plato por plato — el mismo criterio de los últimos emails, mucho más desarrollado.
- **Garantía de devolución de 7 días.** Si la comprás y sentís que no era para vos, nos escribís a info@vakoclub.com dentro de esos 7 días y te devolvemos el dinero, sin pedirte que justifiques nada.
- **Aviso prioritario de la próxima serie de guías regionales** (España, Argentina, Francia), antes que nadie más — no te ofrecemos la Membresía Gratuita como bono porque ya la tenés desde que te registraste; esto sí es nuevo.

Precio: **$29.99**, pago único, descarga inmediata.

**[Conseguir El Mundo de la Copa — $29.99]** → `https://vakoclub.com/tienda/el-mundo-de-la-copa#oferta`

Si no es el momento, no pasa nada — seguís siendo socio/a igual, con acceso al directorio de bodegas, tus favoritos y la comunidad. Vamos a seguir escribiéndote de vez en cuando, mayormente para compartir algo útil, no para insistir con esto.

Un abrazo,
El equipo de Vako Club

**CTA único:** Conseguir El Mundo de la Copa ($29.99).

**Nota de timing:** Día 14 — cierre de la secuencia de bienvenida.

---

## Qué falta para que esto funcione de verdad

1. **Conectar el formulario de `/suscripcion` al endpoint ya construido** (`/api/subscribe-lead`, tag `socio-gratuito`) — hoy nadie que se registre queda tageado en Reach. Ver dependencia #2 de la tabla de arriba; tarea de desarrollo, fuera del alcance de este agente.
2. **Construir la automatización a mano en el panel de Reach** (trigger: tag `socio-gratuito` → 6 pasos Email/Delay con los días de la tabla resumen) — no se puede hacer vía API/MCP, solo Julian puede cargarla en el editor visual.
3. **Confirmar la sintaxis real del campo de personalización de nombre en Reach** antes de cargar los asuntos/cuerpos — los emails de este documento usan `{{nombre}}` como placeholder de contenido, hay que ajustarlo si Reach usa otra variable.
4. Si en algún momento se decide extender el bono de fichas imprimibles / cupo de 50 unidades a este público también, hacerlo a propósito y con un contador compartido con la campaña de ads — no copiar ese email tal cual, por el riesgo de escasez falsa explicado en el resumen ejecutivo.
