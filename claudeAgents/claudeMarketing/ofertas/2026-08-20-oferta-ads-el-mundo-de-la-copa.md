# Oferta: Oferta de venta para tráfico pagado — "El Mundo de la Copa"
Fecha: 2026-08-20 | Agente: vako-ofertas

## Resumen ejecutivo / diagnóstico

**El hueco real:** hoy Vako Club solo tiene un producto realmente comprable — *El Mundo de la Copa* ($29.99, Stripe Checkout en vivo, ver `01-ESTADO-ACTUAL.md`) — y es justamente el único que **no tiene una oferta de venta diseñada**. La serie regional (España/Argentina/Francia) sí tiene ofertas completas (precio Fundador, bonos, garantía, escasez real) pero ninguna de esas tres se puede vender todavía porque su contenido no está escrito. Esta oferta corrige esa inversión: diseña la oferta que le falta al único producto que sí se puede vender ahora mismo, pensada específicamente para **tráfico frío de ads**, no para la audiencia orgánica de Instagram que ya conoce la marca.

**Hallazgo adicional (no documentado en `01-ESTADO-ACTUAL.md`, verificado leyendo el código el 2026-08-20):** ya existe una landing dedicada real y bien construida para este producto — `src/pages/tienda/ElMundoDeLaCopaLanding.jsx`, ruta `/tienda/el-mundo-de-la-copa` — con hero, índice, 6 páginas de muestra interiores, sección "quiénes somos", lista de qué incluye, FAQ, selector ES/EN/PT y un formulario de captura de email. Esto contradice la nota de `01-ESTADO-ACTUAL.md` ("ya no habrá páginas de venta independientes por guía") — esa nota quedó desactualizada para este producto específicamente; el resto del equipo debería saberlo. Lo señalo aquí y lo dejo anotado también en el handoff de estado.

**¿Es débil la oferta actual ($29.99, sin garantía explícita, sin bonos nombrados, sin urgencia, sin prueba social) para convertir tráfico frío pagado?** Sí, y no es un problema de precio — $29.99 no es caro para un PDF curado de 83 páginas. El problema es de **contexto y riesgo percibido**: alguien que llega desde un anuncio nunca oyó hablar de Vako Club, no tiene la confianza que sí tiene un seguidor orgánico de Instagram. La landing actual ya resuelve bien "qué es" (índice, páginas de muestra) pero no resuelve explícitamente "por qué no es un riesgo comprarle a una marca que no conozco" ni "por qué actuar ahora en vez de guardar el anuncio para después". Según la práctica estándar de tráfico frío en infoproductos (ver fuentes al final): CTA específico, garantía repetida junto al precio, urgencia solo si es real (nunca contadores falsos), y bonos/incentivos que suban el valor percibido sin bajar el precio. Hoy la landing tiene **0 de 4**: no hay garantía visible, no hay bono nombrado aparte del propio contenido, no hay ningún mecanismo de urgencia, y no hay prueba social (ninguna reseña, ningún número). Es una landing visualmente sólida pero "neutra" — construida para explicar el producto, no para cerrar venta contra el escepticismo típico de tráfico pagado.

**Bloqueo previo, más urgente que cualquier copy — confirmar antes de gastar un solo dólar en ads:** según `01-ESTADO-ACTUAL.md` (última actualización 2026-08-14), las claves **live** de Stripe estaban activas solo en `.env.local` (entorno local de Julian) y **no** en las variables de entorno de Vercel — sin ese paso, el sitio desplegado en producción (vakoclub.com, adonde apuntaría cualquier anuncio) no puede cobrar de verdad. Han pasado 6 días desde esa nota y puede que ya se haya resuelto, pero no está confirmado en ningún documento de este repositorio. **Acción crítica antes de lanzar cualquier campaña:** Julian debe confirmar que hizo una compra real de prueba en `vakoclub.com/tienda/el-mundo-de-la-copa` (no en local) y que el dinero se cobró de verdad. Pagar tráfico hacia un checkout que no cobra sería el error más caro posible aquí.

**Segundo bloqueo, igual de urgente, confirmado por `vako-research` el mismo día (`research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md`):** no hay ningún píxel de conversión instalado — ni Meta Pixel ni TikTok Pixel, y GA4 tampoco dispara un evento de compra en la página de éxito. Sin esto, Meta/TikTok no pueden optimizar hacia "quién compra" (solo hacia clicks o vistas de landing), lo que encarece mucho el costo por venta real desde el día uno. Se resuelve en horas de trabajo técnico, pero tiene que estar instalado **antes** de encender presupuesto, no después — de lo contrario se pierde toda la primera ventana de datos de conversión. Esto es un bloqueo técnico/de analítica, no de oferta — no depende de `vako-ofertas`, pero condiciona directamente si "vender rápido con ads" es viable esta semana o la próxima.

**Esta oferta y la auditoría de `vako-research` del mismo día llegaron, de forma independiente, a diagnósticos coincidentes:** precio $29.99 no es el problema, la landing dedicada ya es fuerte, y lo que falta es garantía + prueba social + (según research) tracking de conversión. Se recomienda leer ambos documentos juntos antes de lanzar.

## Qué se ofrece y a quién

**Producto principal (oferta core):** *El Mundo de la Copa* — guía general de vino en PDF, 83 páginas, ES/EN/PT, $29.99. Ya terminada, ya vendible, ya con landing propia. Ver `producto-guia-general.md` para el índice completo y `producto-guia-general-CONTENIDO-COMPLETO.md` para el texto real.

**A quién (específicamente tráfico frío de ads, distinto del público orgánico ya usado en otras ofertas del equipo):**
- Personas que nunca oyeron hablar de Vako Club y ven un anuncio en Instagram/Meta/TikTok/Google — llegan sin ningún contexto de marca, tienen que decidir confiar y comprar en la misma visita.
- Principiante-intermedio que se siente perdido eligiendo vino (carta de restaurante, góndola de supermercado, regalo) — mismo público base del sitio, pero en frío necesitan una razón más fuerte para actuar ya, no "algún día".
- Compradores de regalo que buscan algo concreto y de bajo compromiso ($29.99, no una suscripción) para alguien "que sabe de vino".

**Resultado que se vende (no "un PDF de 83 páginas"):** dejar de pedir "el segundo más barato" por miedo a equivocarse, entender qué dice una etiqueta y con qué maridar, y tener eso resuelto en una sola sesión de lectura — no repartido en 15 blogs ni en un curso de semanas.

## Estructura de precio (con la ecuación de valor aplicada)

```
Valor percibido = (Resultado soñado × Probabilidad de lograrlo) ÷ (Tiempo hasta el resultado × Esfuerzo/fricción)
```

| Variable | Estado hoy para tráfico frío |
|---|---|
| Resultado soñado | Alto: dejar de sentirse perdido/avergonzado eligiendo vino, poder hablar con criterio. Bien comunicado ya en el hero de la landing ("El vino se disfruta más cuando lo entendés"). |
| Probabilidad de lograrlo | **Débil para tráfico frío**: el contenido es real y completo, pero nada en la landing le dice a un desconocido "por qué confiar en esto" — no hay garantía, no hay ninguna reseña ni cifra de compradores, no hay quién lo respalde más allá de una bio breve. Un visitante orgánico ya confía por venir de Instagram; uno de ads, no. |
| Tiempo hasta el resultado | Bajo: descarga inmediata, ya comunicado ("Descarga inmediata · Pago seguro"). |
| Esfuerzo/fricción | **Sube por lo que falta, no por el producto**: sin garantía, pagar $29.99 a una marca desconocida es una decisión de "todo o nada" en el momento — la fricción real no es leer el PDF, es el momento de pagar. |

**Precio: no tocar el precio de venta real.** $29.99 vía Stripe es razonable para el producto y cambiarlo requiere editar `api/_lib/catalog.js` (`amountCents`), un archivo de código fuera del alcance de `vako-ofertas` — además, bajar el precio no resuelve el problema real diagnosticado arriba (confianza, no costo). La palanca correcta aquí es subir el valor percibido y bajar el riesgo percibido, no bajar el número.

**Ancla de precio — opción recomendada, ejecutable sin tocar Stripe:** mostrar en la landing y en los anuncios "Precio de lanzamiento $29.99 (precio de catálogo $39.99)" — el cobro real en Stripe sigue siendo $29.99 sin ningún cambio de código; el "$39.99" es solo un ancla visual en el copy. **Condición de honestidad, no negociable:** esto solo es lícito si existe una intención real de que el precio efectivamente sea $39.99 en el futuro (por ejemplo, cuando se lance la serie regional y se revise la escalera de precios del catálogo completo, tarea ya pendiente en `01-ESTADO-ACTUAL.md`, ítem 3/13). Si Julian no piensa subirlo nunca, **no usar esta ancla** — sería un ancla falsa. Alternativa sin ese compromiso: no anclar contra un precio más alto, y en su lugar reforzar valor con el stack de bonos de abajo, que no requiere ninguna promesa de precio futuro.

## Bonos / incentivos

Los tres primeros son ejecutables esta semana con lo que ya existe, sin escribir contenido nuevo:

1. **Estatus de "Fundador/a" + prioridad en la serie regional.** Quien compre *El Mundo de la Copa* recibe invitación explícita a unirse a la **Membresía Gratuita** de Vako Club (ya implementada y funcional en `/suscripcion`) y aviso prioritario cuando salgan las guías de España/Argentina/Francia. Coste marginal: cero, todo ya construido. Mismo mecanismo que ya usa `vako-ofertas` en la oferta de España — se extiende aquí al producto que sí se vende hoy.
2. **Fichas imprimibles reempaquetadas, aparte del PDF completo.** La guía ya incluye en sus apéndices una "Ficha de cata para imprimir" (Apéndice III) y un "Glosario del catador" (Apéndice I). Extraerlas como archivo(s) sueltos de 1 página y presentarlas como bono descargable aparte (no como algo nuevo — hay que decirlo así: "incluido en tu guía, también aparte para que lo tengas siempre a mano") sube el valor percibido sin fabricar nada. Requiere: alguien (Julian o diseño) exporte esas 1-2 páginas del documento maestro como archivo(s) independientes — trabajo de diseño ligero, no de contenido nuevo, ejecutable esta semana.
   - Entrega técnica sin tocar código: `/api/download-guide` solo entrega un archivo por sesión (confirmado leyendo `api/download-guide.js`), así que estos bonos no se pueden sumar automáticamente a la descarga sin un cambio de código. Dos formas de resolverlo sin tocar el sitio: (a) subir esos 1-2 PDFs sueltos como enlaces públicos normales (no necesitan estar protegidos — son contenido que el comprador ya pagó) y ponerlos en el mensaje de confirmación/recibo de Stripe (configurable desde el panel de Stripe, sin código), o (b) que Julian los adjunte manualmente en un email de bienvenida a cada comprador (viable mientras el volumen de ventas sea bajo). La opción (a) es más escalable para ads y no requiere ningún cambio de código del sitio.
3. **Ningún bono inventado ni prometido sin poder cumplirlo hoy.** No se ofrece acceso a catas virtuales ni a los planes Sommelier/Gran Reserva — no son comprables todavía (regla explícita de `00-BRAND-CONTEXT.md`).

## Garantía (reducción de riesgo)

- **Garantía de devolución de 14 días**, sin pedir justificación — escribir a info@vakoclub.com dentro de los 14 días posteriores a la compra. Stripe ya soporta reembolsos manuales desde su panel sin ningún cambio de código; el único trabajo pendiente es **agregar esta garantía al copy de la landing y del anuncio**, algo que hoy no existe en `ElMundoDeLaCopaLanding.jsx`. Para tráfico frío esto es más importante que para tráfico orgánico: es la pieza que más falta hoy en la landing actual — coincide con el hallazgo #1 de `vako-research` del mismo día, que cita un caso de estudio de producto digital donde una garantía de devolución de 30 días visible subió las ventas 21% (con 12% de tasa de reembolso); no es un dato propio de Vako, es referencia de mercado, pero respalda priorizar esto antes que tocar el precio.
- **Muestra gratuita ya existe y es más fuerte que en las ofertas regionales:** la landing ya muestra 6 páginas interiores reales (`/adentro`) — esto ya cumple el rol de "poder hojearlo antes de pagar" que en las guías regionales todavía está pendiente (su contenido ni existe). Solo falta nombrarlo como parte de la reducción de riesgo en el copy de venta ("mirá 6 páginas reales antes de decidir"), no construir nada nuevo.

## Prueba social

Hoy no existe ninguna reseña ni testimonio real de esta guía documentado en este repositorio — **no inventar ninguno.** Cómo conseguir los primeros, de forma honesta y aprovechando que este producto sí tiene compradores reales hoy (a diferencia de la serie regional):
1. Si ya hubo compras reales de *El Mundo de la Copa* antes de esta campaña de ads (`01-ESTADO-ACTUAL.md` no lo confirma — verificar con Julian en el dashboard de Stripe), escribirles pidiendo feedback honesto de 1-2 líneas + permiso para citarlos (nombre o iniciales).
2. A cada comprador nuevo que llegue por esta campaña, sumar un email post-compra (puede ir dentro del mismo bono/bienvenida del punto anterior) pidiendo una reseña corta a cambio de nada — nunca condicionar el bono o la garantía a que la reseña sea positiva.
3. Si Julian quiere usar prueba social "de cantidad" (ej. "ya lo leyeron X personas"), hace falta la cifra real de compradores o de seguidores de Instagram — `[PENDIENTE: cifra real, no inventar]`. Hasta entonces, mejor no mencionar ningún número.

## Urgencia o escasez (si aplica, y por qué es real)

No hay ningún gancho estacional específico para esta guía (a diferencia de la serie regional, que sí tiene fechas reales como el Día del Tempranillo o la vendimia) — es un producto general, no atado a una región ni a una fecha del calendario del vino. `[PENDIENTE: si Julian quiere esperar a la temporada de regalo de fin de año (noviembre-diciembre) como ventana natural, es una opción a futuro, no algo para esta semana]`.

Dos mecánicas reales disponibles para lanzar la campaña de ads ya, sin depender de estacionalidad — **elegir una sola, no combinarlas, para no sonar contradictorio:**

- **Opción A — ventana de precio de campaña (requiere compromiso real de subir el precio después):** "Precio de lanzamiento de esta campaña: $29.99 (precio de catálogo: $39.99, a partir del [fecha real que Julian fije])". Solo usar si existe intención real de subir `amountCents` en `api/_lib/catalog.js` en esa fecha — es un cambio de una línea de código, pero alguien tiene que ejecutarlo de verdad ese día o la urgencia se vuelve falsa. Anotar como tarea con dueño y fecha antes de anunciarlo.
- **Opción B — bono con tope real de unidades (no toca el precio en Stripe, más simple de cumplir):** "Los primeros 50 compradores de esta campaña reciben también [bono del punto 2 de arriba] antes de que se cierre esta ventana." Como el sitio no tiene un contador automático de compras por campaña, Julian tendría que llevar la cuenta manual desde el dashboard de Stripe (viable con el volumen bajo esperado al arrancar) y avisar cuando se cierre. Es escasez real solo si de verdad se corta al llegar al número 50 — si no se va a cortar, no anunciarlo.
- **Explícitamente prohibido:** contador regresivo falso, "quedan 3 copias" sin tope verificable, "oferta expira en 24 horas" si en realidad sigue disponible después.

**Recomendación de `vako-ofertas`:** para arrancar ya, la Opción B (bono con tope de unidades) es más simple de cumplir de forma 100% honesta esta semana, porque no depende de que alguien recuerde volver a tocar código de precios en una fecha futura. La Opción A queda como mejora natural una vez que Julian decida el precio de catálogo real de toda la línea de guías (tarea ya pendiente en `01-ESTADO-ACTUAL.md`).

## Copy del "one-liner" de la oferta

A diferencia de las ofertas regionales (pensadas para audiencia ya tibia de Instagram), estos textos están pensados para funcionar **sin ningún contexto previo de marca** — como tiene que funcionar un anuncio a tráfico frío.

**Principal (headline de anuncio / landing):**
> "Dejá de elegir vino a ciegas. 83 páginas para entender qué estás tomando — sin escuela de sommelier, sin snobismo. Garantía de devolución de 14 días."

**Variante pregunta (hook de anuncio en video/reel):**
> "¿Alguna vez pediste 'el segundo más barato' de la carta solo para no arriesgarte? Esta guía te saca de ahí en una sola lectura."

**Variante corta (caption / feed estático):**
> "El PDF que te enseña a elegir vino sin pasar vergüenza. $29.99 · Garantía de 14 días · Mirá 6 páginas reales antes de comprar."

**CTA (botón / cierre):**
> "Conseguí la guía — $29.99 · Devolución garantizada 14 días"

## Cómo se cobra

**Ya resuelto, a diferencia de la serie regional — no hay nada que confirmar con Julian sobre la herramienta:** Stripe Checkout ya está integrado y probado de punta a punta (`/api/create-checkout-session.js`, `/api/verify-session.js`, `/api/download-guide.js`, catálogo server-side en `api/_lib/catalog.js`), con el PDF real protegido contra descarga sin pagar. **Lo único a confirmar con Julian antes de gastar en ads es operativo, no de herramienta:** que las claves live de Stripe ya estén cargadas en Vercel (no solo en `.env.local` local) y que una compra real en producción se haya probado y cobrado de verdad — ver "Resumen ejecutivo" arriba.

## Escalera: antes y después de la compra (upsell / downsell)

**Antes de comprar (downsell para quien no compra al toque, tráfico frío que duda):** la landing ya tiene un mecanismo de captura de email ("¿Todavía lo estás pensando? Dejanos tu email y te mandamos la primera parte completa, gratis") — no hace falta diseñar un imán de entrada nuevo. **Pero hay un gap operativo real que hay que resolver antes de escalar en ads:** ese formulario envía la solicitud por EmailJS a la bandeja interna de Vako, no le entrega nada automáticamente al usuario — hoy Julian tendría que mandar manualmente "la primera parte" a cada persona que deja su email. Con tráfico orgánico bajo volumen es viable; con tráfico pagado (que puede generar muchos más leads por día) se vuelve un cuello de botella real y una promesa incumplida si se demora. Arreglo mínimo, ejecutable esta semana y sin tocar el flujo de pago:
  1. Exportar un extracto real de la guía (ej. Parte I completa, o la introducción + primer capítulo) como PDF de muestra — trabajo de diseño/contenido, no de código, reutilizando contenido que ya existe en `producto-guia-general-CONTENIDO-COMPLETO.md`.
  2. Subir ese PDF a una ruta pública fija (puede vivir en `public/`, a diferencia del PDF pago — es contenido gratuito, no necesita protección).
  3. Configurar en el panel de EmailJS (sin tocar código del sitio) una plantilla de auto-respuesta al lead con el link de descarga directo, en vez de depender de que Julian responda manualmente a cada uno.

**Después de comprar (upsell):** hoy no hay ningún otro producto pagable al que subir a quien ya compró *El Mundo de la Copa* — ni la serie regional (sin contenido escrito) ni los planes Sommelier/Gran Reserva (no comprables, `00-BRAND-CONTEXT.md`). El único "upsell" honesto disponible es de continuidad no monetaria: invitar a unirse a la Membresía Gratuita (bono ya descrito arriba) y avisar que se viene la serie regional. No forzar ningún mensaje de "upgrade" hacia Sommelier/Gran Reserva como si fuera un flujo real.

## Qué se activa esta semana sin bloqueos técnicos vs. qué requiere trabajo adicional

**Activable esta semana, sin tocar código de pago:**
- Agregar la garantía de 14 días al copy de la landing y de los anuncios.
- Nombrar explícitamente las 6 páginas de muestra ya existentes como reducción de riesgo ("mirá 6 páginas reales antes de decidir").
- Agregar el bono de estatus "Fundador/a" + prioridad en la serie regional al copy (cero dependencia técnica, la Membresía Gratuita ya funciona).
- Escribir los anuncios/copy con los one-liners de esta oferta.
- Definir y anunciar la Opción B de escasez (bono con tope de 50 unidades), si Julian confirma que puede llevar la cuenta manual desde Stripe.

**Requiere trabajo adicional (contenido/diseño, no bloqueado por dependencias externas):**
- Exportar los apéndices (ficha de cata, glosario) como PDFs sueltos para el bono #2.
- Exportar un extracto real de la guía para arreglar el lead magnet gratuito (downsell) y configurar la auto-respuesta en EmailJS.
- Si se usa la Opción A de escasez (ancla $29.99 → $39.99): decidir la fecha real de subida de precio y ejecutar el cambio de una línea en `api/_lib/catalog.js` ese día — trabajo de código mínimo pero con dueño y fecha, no de `vako-ofertas`.

**Bloqueante real, verificar/resolver primero, antes de cualquier otra cosa de esta lista:**
- Confirmar con Julian que las claves live de Stripe ya están en Vercel y que una compra real en producción (no local) se probó y cobró de verdad. Sin esto, cualquier ad que se lance está pagando tráfico hacia un checkout que podría no cobrar.
- Instalar Meta Pixel (y TikTok Pixel si se usa ese canal) + evento de compra en la página de éxito, antes de encender presupuesto — confirmado como hueco real por `vako-research` (`research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md`). Sin esto, la plataforma de ads no puede optimizar hacia ventas desde el primer día, lo cual es tan caro como no cobrar.

## Qué necesita vako-landing / vako-email / vako-creatividades para ejecutarla

**Para `vako-landing`:**
- Sobre `src/pages/tienda/ElMundoDeLaCopaLanding.jsx` (ya existe, no hay que crearla desde cero): agregar la garantía de 14 días visible junto al precio (sección "8 · La oferta"), agregar el bono de estatus "Fundador/a" a la lista `incluye`, y si se usa la Opción A de escasez, agregar el precio ancla tachado junto a `PRICE_LABEL`.
- Revisar y, si hace falta, reforzar la sección "9 · Para quien no está listo" (captura de email) una vez que exista el PDF de muestra real y la auto-respuesta de EmailJS — hoy promete algo que no se entrega automáticamente.
- Confirmar si conviene una versión de landing más corta/directa específica para tráfico de ads (sin el gate de idioma/edad como primer paso, que agrega fricción a alguien que llega con intención de compra desde un anuncio) — decisión de `vako-landing`, señalada aquí como algo a evaluar.

**Para `vako-email`:**
- Secuencia corta de bienvenida para quien deja el email en el formulario "primera parte gratis" de esta landing (no existe todavía — hoy solo se le pide el email, sin secuencia de nutrición después), calentando hacia la compra de la guía completa.
- Email post-compra pidiendo feedback honesto (para construir la prueba social de la sección de arriba) — puede reusar el patrón ya escrito para la Guía del Vino Español.
- Mismo recordatorio técnico ya conocido: no hay ESP de email marketing conectado, solo EmailJS transaccional — redactar listo para cargar en cuanto se conecte uno.

**Para `vako-creatividades`:**
- Piezas de anuncio (no de contenido orgánico) usando los one-liners de esta oferta, mostrando explícitamente: la garantía de 14 días, 1-2 páginas reales de muestra, y el precio con o sin ancla según lo que Julian decida.
- Formato pensado para tráfico frío: el hook tiene que funcionar sin que la persona sepa qué es Vako Club — evitar dar por sentado reconocimiento de marca que sí puede asumirse en contenido orgánico de Instagram.

## Fuentes consultadas

Principios generales de conversión de tráfico frío en ofertas digitales (no cifras específicas de Vako, usados solo como respaldo de las recomendaciones de garantía/urgencia real/CTA de arriba):
- [Jordan Glickman — How to Design a Landing Page That Converts Cold Traffic](https://www.jordanglickman.com/writing/landing-page-cold-traffic-conversion)
- [LeadEnforce — How to Turn Cold Traffic into Loyal Customers](https://leadenforce.com/blog/how-to-turn-cold-traffic-into-loyal-customers)

Ver también `research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md` (`vako-research`, mismo día) para el benchmark de precio con fuentes (Wine Folly, ebooks de Gumroad), la comparación de canales de ads (Meta primero), el hallazgo del píxel de conversión faltante, y el caso de estudio citado de +21% en ventas con garantía de devolución visible.
