# Set de anuncios Meta/Instagram Ads — "El Mundo de la Copa"
Fecha: 2026-08-20 | Agente: vako-creatividades

> Basado en: `research/2026-08-20-auditoria-listo-para-ads-el-mundo-de-la-copa.md` (`vako-research`) y `ofertas/2026-08-20-oferta-ads-el-mundo-de-la-copa.md` (`vako-ofertas`), ambos del mismo día. Landing de destino real: `src/pages/tienda/ElMundoDeLaCopaLanding.jsx`, ruta **`/tienda/el-mundo-de-la-copa`**.

---

## 🛑 NO ENCENDER PRESUPUESTO TODAVÍA

Estas piezas están **listas para pautar**, pero hay dos bloqueos técnicos reales, confirmados en `01-ESTADO-ACTUAL.md` y en los informes de hoy, que están **fuera del alcance de `vako-creatividades`**:

1. **Las claves live de Stripe no están cargadas en Vercel** (solo existen en el `.env.local` local de Julian). Sin esto, el sitio desplegado en producción (vakoclub.com) no puede cobrar de verdad — cualquier click de un ad terminaría en un checkout que podría no cobrar.
2. **No hay ningún píxel de conversión instalado** — ni Meta Pixel ni TikTok Pixel, y ni siquiera GA4 dispara un evento de compra en la página de éxito (`CompraResultBanner.jsx`, `verify-session.js`). Sin Meta Pixel, la plataforma no puede optimizar hacia "quién compra" y el costo por venta real se dispara desde el día uno.

**Encender presupuesto antes de resolver ambos puntos desperdicia dinero real.** En cuanto Julian confirme que (1) una compra real se probó y cobró en producción y (2) el Meta Pixel + evento `Purchase` están instalados, estas piezas quedan listas para cargar tal cual.

---

## Elementos comunes a todas las piezas

- **Landing de destino (todas las piezas):** `https://vakoclub.com/tienda/el-mundo-de-la-copa` — nunca `/tienda` genérica.
- **Precio:** $29.99 USD (sin cambios en Stripe, no se toca `api/_lib/catalog.js`).
- **Garantía:** devolución de 14 días, sin pedir justificación — escribir a info@vakoclub.com dentro de los 14 días posteriores a la compra.
- **Bono "Fundador/a":** quien compre entra a la Membresía Gratuita de Vako Club (ya implementada en `/suscripcion`, coste cero) + aviso prioritario cuando salgan las guías de España, Argentina y Francia.
- **Escasez real (adaptación de la Opción B de `vako-ofertas`):** el bono "Fundador/a" se ofrece a los **primeros 50 compradores de esta campaña de ads** (no a los primeros 50 compradores de siempre — ese matiz importa para no prometer de más). Elegimos atar el tope al bono "Fundador/a" (ya construido, cero trabajo extra) y no al bono de fichas imprimibles reempaquetadas que menciona la oferta original, porque ese segundo bono todavía no está exportado como PDF suelto — no prometemos en el anuncio algo que hoy no se puede entregar. **Nota operativa, no de copy:** como el sitio no tiene contador automático de compras por campaña, Julian tiene que llevar la cuenta manual desde el dashboard de Stripe y avisar al equipo cuando se llegue a 50 para retirar la mención del bono de los anuncios activos. Si no se va a cortar de verdad al llegar a 50, no usar esta mención.
- **Nunca usar:** contadores regresivos falsos, "quedan X copias" sin tope verificable, testimonios o cifras de compradores/seguidores inventadas (no hay ninguno documentado todavía).
- **CTA de botón (Meta):** "Comprar ahora" (Shop Now).
- **UTM base (agregar `utm_content` según el concepto):**
  `https://vakoclub.com/tienda/el-mundo-de-la-copa?utm_source=meta&utm_medium=paid-social&utm_campaign=copa-ads-lanzamiento-2026-08&utm_content={concepto}`
- **Nota de fricción a tener en cuenta (no es tarea de `vako-creatividades` resolverla, pero afecta la expectativa de conversión):** la landing tiene una puerta de idioma/edad de un solo paso (elegir idioma + confirmar 18+) antes de mostrar cualquier contenido. Es un click extra para tráfico frío de ads — señalado también por `vako-research` como algo a evaluar por `vako-landing`, no bloquea lanzar.
- **Formatos recomendados por concepto:** Reels/Stories verticales 9:16 (15-30s) como formato principal, con una versión estática 4:5 o cuadrada de respaldo para feed — se indica en cada concepto.

---

## Concepto 1 — "Para quien se siente intimidado eligiendo vino"

- **Ángulo:** el dolor más honesto del público objetivo — pedir "el segundo más barato" para no arriesgar.
- **Pilar de contenido:** Educativo (adelanto real del contenido de la guía) con gancho de dolor.
- **Formato:** Reel/video corto, 9:16, ~20-25s. Versión estática de respaldo: imagen de la tapa + 1 línea de copy superpuesta.

**Gancho / hook (primeros 1-2 seg):**
> "¿Pedís siempre 'el segundo más barato' de la carta?"

**Primary text (copy de anuncio):**
> Te pasan la carta y no tenés ni idea de qué pedir, así que agarrás el segundo más barato para no arriesgarte. No es falta de gusto — es que nadie te enseñó a leer una etiqueta.
>
> "El Mundo de la Copa" son 83 páginas para entender qué estás tomando. Sin esnobismo, sin tecnicismos vacíos. Mirá 6 páginas reales antes de decidir.
>
> Garantía de devolución de 14 días · Descarga inmediata.

**Headline (título, ~40 caracteres):**
> Dejá de elegir vino a ciegas

**Description (opcional, debajo del headline):**
> 83 páginas · $29.99 · Garantía 14 días

**Dirección visual:**
Abre con un plano cercano de una mano dudando frente a una carta de vinos en un restaurante (o una góndola de supermercado), cámara algo temblorosa/handheld para transmitir el momento real de duda. Corte seco a la portada de "El Mundo de la Copa" apareciendo en pantalla (usar el archivo real `el-mundo-de-la-copa-tapa.jpg`), luego 2-3 planos rápidos hojeando las páginas de muestra reales ya existentes en el sitio (`pagina-01-apertura.jpg` a `pagina-06-regiones.jpg` — no generar páginas nuevas, usar las reales). Paleta vino/burdeos + dorado, tipografía tipo Playfair/Cormorant superpuesta para el copy en pantalla ("Sin esnobismo. Sin tecnicismos vacíos."). Cierre con el precio y el botón de compra simulado en pantalla.

**CTA:** "Comprar ahora — $29.99"
**UTM:** `...&utm_content=intimidado`
**Hashtags (para versión boosted/orgánica, no funcionales en ads puros):** #VakoClub #VinoParaPrincipiantes #AprendéDeVino #GuíaDeVino #VinoSinSnobismo #WineLovers

---

## Concepto 2 — "Regalo"

- **Ángulo:** comprador de regalo de bajo compromiso para "alguien que sabe de vino" (o que quiere aprender).
- **Pilar de contenido:** Promocional, con enganche de utilidad/regalo.
- **Formato:** estático cuadrado o 4:5 para feed (funciona bien como "producto claro"), con versión Reel corta como alternativa.

**Gancho / hook:**
> "¿Le vas a regalar otra botella que no sabés si le va a gustar?"

**Primary text:**
> En vez de apostar con una botella más, regalale algo que sí va a usar cada vez que elija una: "El Mundo de la Copa", la guía de Vako Club para entender vino sin escuela de sommelier.
>
> Se compra en 2 minutos, se manda por email al instante — perfecto para el último momento. $29.99, pago único, sin vencimiento.
>
> Garantía de devolución de 14 días, por si no es lo que buscabas.

**Headline:**
> El regalo que sí van a usar

**Description:**
> Envío inmediato por email · $29.99

**Dirección visual:**
Toma cálida, editorial, de una copa de vino junto a la tapa de la guía impresa/mostrada en una tablet, con un detalle de regalo (lazo dorado o cinta burdeos) apoyado al lado — sin mostrar una caja física de producto real (es un PDF, no confundir al comprador). Texto superpuesto corto: "Se manda por email. Llega al instante." Cierre con el precio y "Pago único · Sin vencimiento" (frase ya usada en la landing, mantener consistencia).

**CTA:** "Comprar ahora — $29.99"
**UTM:** `...&utm_content=regalo`
**Hashtags:** #RegaloDeVino #VakoClub #IdeasDeRegalo #GuíaDeVino #WineGift #ParaLosQueSabenDeVino

---

## Concepto 3 — "Aprendé a tu propio ritmo"

- **Ángulo:** contraste contra cursos largos/certificaciones caras e intimidantes (WSET, certificaciones de sommelier) — usa la frase ancla de marca directamente.
- **Pilar de contenido:** Educativo + aspiracional (voz de "sommelier amigo").
- **Formato:** Reel, 9:16, ~20s, tono más pausado/cálido que el Concepto 1 (menos "dolor", más "alivio").

**Gancho / hook:**
> "No hace falta un curso de meses para entender de vino."

**Primary text:**
> No hace falta una certificación cara ni un curso de meses. "El Mundo de la Copa" es una sola guía, 83 páginas, para aprender a tu propio ritmo: de la primera copa hasta poder leer una etiqueta sin dudar.
>
> Cata, servicio, uvas, regiones y maridaje — en el orden en que realmente hace falta aprenderlos, no en el de un programa académico.
>
> Descarga inmediata · Garantía de devolución de 14 días.

**Headline:**
> Aprendé a tu propio ritmo

**Description:**
> 83 páginas · 7 partes · $29.99

**Dirección visual:**
Escena cálida y tranquila: alguien leyendo la guía en una tablet o celular, de noche, con una copa de vino cerca, luz ambiente dorada, sin apuro (contraste deliberado con el ritmo más rápido/handheld del Concepto 1). Se puede intercalar un plano cenital pasando las páginas del índice real de la guía (sección "El índice" de la landing, 7 partes: Fundamentos, Aprender a catar, Las uvas, Las regiones, Mesa y maridaje + apéndices). Cierre con la frase ancla en pantalla: "Aprendé a tu propio ritmo."

**CTA:** "Comprar ahora — $29.99"
**UTM:** `...&utm_content=tu-ritmo`
**Hashtags:** #VakoClub #AprendéDeVino #CulturaDelVino #VinoParaPrincipiantes #WineEducation #TuRitmo

---

## Concepto 4 — "El índice real como prueba de valor"

- **Ángulo:** en vez de vender la promesa en abstracto, mostrar el contenido concreto (el índice real de 7 partes y páginas de muestra reales) como prueba de que no es un PDF genérico de 10 páginas.
- **Pilar de contenido:** Educativo + prueba de producto (no prueba social — no hay testimonios todavía, esto es prueba de contenido).
- **Formato:** Reel tipo "screen record"/carrusel de feed (si el formato de campaña lo permite), mostrando el índice real de la guía.

**Gancho / hook:**
> "Esto es exactamente lo que hay adentro. Sin sorpresas."

**Primary text:**
> Nada de "guía misteriosa" — esto es exactamente lo que vas a recibir: 83 páginas divididas en 7 partes, desde los fundamentos hasta el maridaje, pasando por cómo catar y las regiones del mundo.
>
> Podés ver 6 páginas reales antes de decidir. Si no te sirve, tenés 14 días de garantía de devolución.

**Headline:**
> 83 páginas. Mirá qué hay adentro.

**Description:**
> Índice real · 6 páginas de muestra · $29.99

**Dirección visual:**
Grabación de pantalla (screen recording) tipo "scroll" mostrando la sección real "El índice" de la propia landing (`/tienda/el-mundo-de-la-copa#indice`) — las 7 filas reales (Introducción, I. Fundamentos, II. Aprender a catar, III. Las uvas, IV. Las regiones, V. Mesa y maridaje, Apéndices), seguido de un scroll rápido por las 6 páginas de muestra reales ya cargadas en el sitio (`/adentro`). Si se prefiere formato carrusel de feed en vez de video: cada tarjeta del carrusel es una de las 6 páginas de muestra reales + una tarjeta final con el precio y el CTA. No fabricar capturas ni maquetas nuevas — usar exactamente los archivos ya existentes en `public/images/guias/`.

**CTA:** "Comprar ahora — $29.99"
**UTM:** `...&utm_content=indice-prueba`
**Hashtags:** #VakoClub #GuíaDeVino #WineFolly #VinoParaPrincipiantes #AprendéDeVino #ContenidoReal

---

## Resumen de UTMs (para armar la campaña en Meta Ads Manager)

| Concepto | `utm_content` | CTA |
|---|---|---|
| Intimidado eligiendo vino | `intimidado` | Comprar ahora |
| Regalo | `regalo` | Comprar ahora |
| Aprendé a tu propio ritmo | `tu-ritmo` | Comprar ahora |
| El índice como prueba de valor | `indice-prueba` | Comprar ahora |

URL completa de ejemplo (Concepto 1):
`https://vakoclub.com/tienda/el-mundo-de-la-copa?utm_source=meta&utm_medium=paid-social&utm_campaign=copa-ads-lanzamiento-2026-08&utm_content=intimidado`

---

## 🛑 Recordatorio final — NO encender presupuesto

Estas 4 piezas quedan **listas para cargar en Meta Ads Manager** el día que:
1. Julian confirme que las claves live de Stripe están en Vercel y que una compra real en producción se probó y cobró de verdad.
2. El Meta Pixel (y evento `Purchase` en la página de éxito) esté instalado y disparando correctamente.

Hasta entonces, cualquier presupuesto gastado en estos anuncios se pierde sin poder medirse ni, potencialmente, sin poder cobrarse. Ninguno de los dos bloqueos depende de `vako-creatividades`.
