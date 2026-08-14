# Vako Club — Contexto de Marca (Fuente Única de Verdad)

> Todos los agentes del equipo de marketing deben leer este archivo completo antes de producir cualquier contenido. Si algo aquí cambia (precio, producto, canal), actualízalo aquí primero — el resto de los archivos del equipo dependen de esta fuente.

## Qué es Vako Club
Vako Club es una guía de vinos exclusiva y una comunidad global para aficionados, expertos y curiosos del vino. Posicionamiento: *"Tu pasaporte al mundo del vino. Descubre, aprende y disfruta."* Nace de la pasión por el vino y el deseo de hacerlo accesible a cualquier nivel de conocimiento, sin esnobismo.

- Sitio web: vakoclub.com (React/Vite, multi-idioma ES/EN/PT)
- Instagram: **@vakoclub** (canal principal — "contenido exclusivo y catas")
- También presente en TikTok y YouTube
- Contacto: info@vakoclub.com

## Objetivo de negocio #1: vender Guías en PDF
Este es el producto prioritario del negocio ahora mismo. Todo el equipo de marketing debe orientarse primero a generar ventas de guías en PDF. La suscripción y la tienda de afiliados son ingresos secundarios que refuerzan el mismo recorrido: la guía es la puerta de entrada, la comunidad/suscripción es la relación a largo plazo.

**Catálogo de guías actuales:** ⚠️ PENDIENTE DE COMPLETAR. Julian ya ha creado guías en PDF con ayuda de Claude en conversaciones anteriores, pero no quedaron documentadas en este repositorio. Antes de generar una oferta, landing page o email sobre una guía concreta, el agente correspondiente debe: (a) revisar `01-ESTADO-ACTUAL.md`, y (b) si sigue vacío, preguntarle a Julian por título(s), tema, precio, formato y público objetivo de cada guía. Nunca inventar estos datos.

## Modelo de negocio (fuentes de ingreso, por prioridad real)
1. **Guías en PDF** (producto estrella / objetivo #1) — venta directa. No existe todavía checkout propio en el sitio (ver "Limitaciones técnicas" abajo), así que hoy se vendería vía un enlace de cobro externo.
2. **Suscripción Vako Club** — copy y planes definidos, pero **hoy en día solo el plan Gratuito está realmente implementado** en `/suscripcion` (formulario de registro gratuito). Los planes de pago existen en el contenido del sitio pero no son seleccionables todavía:

   | Plan | Precio | Incluye | Estado real en el sitio |
   |---|---|---|---|
   | Gratuita | €0 | Descuentos en tienda, acceso a comunidad, participación en foro | ✅ Implementado (registro funcional) |
   | Sommelier | €15/mes | Todo lo de Gratuita + catas virtuales exclusivas + acceso a guías avanzadas | ⚠️ Solo copy — no seleccionable aún |
   | Gran Reserva | €45/mes | Todo lo de Sommelier + envío de vinos trimestral + consultas con expertos | ⚠️ Solo copy — no seleccionable aún |

   No lances campañas que impulsen "hazte Sommelier hoy" como si fuera un flujo de pago activo. Trátalos como planes futuros/aspiracionales hasta que Julian confirme que ya se pueden contratar.
3. **Tienda (comisión de afiliados)** — vinos seleccionados (vía Amazon), arte/decoración y merchandising (vía Etsy), accesorios. Son enlaces externos de afiliado, no inventario propio de Vako Club.

## Público objetivo
Aficionados al vino de nivel principiante-intermedio que quieren aprender sin sentirse intimidados, en mercados de habla hispana, inglesa y portuguesa. Valoran la estética, la curaduría y el aprendizaje ameno y visual. Incluye compradores de regalos (packs, merchandising) y personas que quieren organizar catas propias. Activos en Instagram.

## Identidad de marca
- **Tono de voz:** cercano, apasionado y educativo — nunca esnob ni intimidante. Habla como un sommelier amigo, no como un manual técnico. Frases ancla del propio sitio: *"cada botella tiene una historia que contar"*, *"aprende a tu propio ritmo, de una manera amena y visual"*.
- **Valores:** accesibilidad, comunidad, curiosidad, elegancia sin pretensión.
- **Identidad visual:** tipografía Playfair Display (titulares, elegante/editorial) + Inter (texto). Paleta en tonos vino/burdeos profundo con degradados ámbar/dorado ("wine-gradient"), tarjetas oscuras elegantes ("wine-card"), patrón de fondo temático ("wine-pattern"). Estética premium, cálida, tipo revista de vinos boutique — nunca corporativa ni minimalista fría.
- **Idiomas:** español (principal), inglés, portugués.

## Canales y limitaciones técnicas conocidas (verificado en el código, no supuesto)
- **Pagos:** no hay ningún procesador de pago integrado en el sitio (sin Stripe, sin PayPal, sin checkout propio). Para vender una guía en PDF hoy hace falta un enlace de cobro externo (ej. Gumroad, Stripe Payment Links, Lemon Squeezy). `vako-ofertas` y `vako-landing` deben preguntar a Julian qué herramienta de cobro usa o prefiere en vez de asumir una.
- **Email:** solo está integrado EmailJS, y únicamente para el formulario de contacto (transaccional). No hay un ESP de email marketing (tipo Brevo, Mailchimp, ConvertKit, MailerLite) conectado todavía. `vako-email` debe seguir redactando secuencias completas y listas para cargar, señalando este hueco como acción pendiente.
- **Guías en PDF — dónde se venden:** viven dentro de `/tienda` (sección "Guías en PDF", `src/components/tienda/GuiasSection.jsx`), no en landing pages independientes — decisión de Julian del 2026-08-14. `vako-landing` trabaja el copy/estructura de esa sección y de cualquier vista de detalle futura, no páginas dedicadas por guía.
- **Pago:** todavía no hay ningún proveedor conectado (ver detalle y opciones evaluadas en `01-ESTADO-ACTUAL.md`); mientras tanto, el CTA de compra de cada guía captura el email en una lista de espera vía EmailJS (`NotifyGuideDialog.jsx`).
- **Instagram:** ya existe una campaña de 3 meses creada previamente con Claude para captar leads. Su contenido detallado no quedó guardado en este repositorio — debe recuperarse (pedírselo a Julian) antes de continuar o generar el mes 2/3, para no contradecirla ni repetirla.
- **Investigación de competencia:** ya se hizo una auditoría de Wine Folly (winefolly.com) como referencia competitiva (ver historial en `01-ESTADO-ACTUAL.md`). Puede regenerarse o ampliarse con `vako-research`.

## Reglas para todo el equipo
- Nunca inventes cifras, testimonios, nombres de guías, precios de checkout o resultados. Marca cualquier dato que falte como `[PENDIENTE: ...]`.
- El objetivo comercial que conecta todo el trabajo es vender guías en PDF — cualquier pieza (email, anuncio, post, landing) debe apuntar a ese objetivo salvo que se indique lo contrario.
- Escribe en español por defecto (idioma principal del sitio y de Julian). Genera versión EN/PT solo cuando el playbook o Julian lo pidan.
- Nunca edites archivos dentro de `src/`, `public/` ni ningún archivo de código del sitio. Todo el trabajo del equipo de marketing vive dentro de `claudeAgents/claudeMarketing/`.
