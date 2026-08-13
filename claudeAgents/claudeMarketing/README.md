# 🍷 Equipo de Marketing IA — Vako Club

Tu equipo de marketing, construido con agentes y skills de Claude Code dentro de este repositorio. Está diseñado para que pidas trabajo con una frase corta y el equipo se coordine solo, con el mínimo tiempo posible de tu parte.

## Estructura
```
claudeAgents/claudeMarketing/
├── 00-BRAND-CONTEXT.md    ← la "biblia" de marca (quiénes somos, qué vendemos, tono, límites técnicos)
├── 01-ESTADO-ACTUAL.md    ← memoria compartida viva (catálogo, oferta activa, campaña IG, historial)
├── README.md              ← este archivo
├── research/               ← informes de vako-research
├── ofertas/                 ← ofertas y precios de vako-ofertas
├── email/                   ← secuencias de vako-email
├── creatividades/           ← posts, guiones y anuncios de vako-creatividades
└── landing/                  ← copy de páginas de venta de vako-landing

.claude/agents/vako-*.md          ← definición de cada agente especialista
.claude/skills/vako-marketing/    ← el "jefe de equipo" que coordina a los 5 agentes
```

## Los 5 agentes
| Agente | Sector | Cuándo usarlo | Ejemplo de petición |
|---|---|---|---|
| `vako-research` | Data / Investigación | Antes de lanzar algo nuevo, o para entender competencia y tendencias | "Investiga qué están haciendo otras guías de vino en Instagram" |
| `vako-ofertas` | Ofertas | Para diseñar o ajustar precios, bundles y promociones | "Diseña una oferta de lanzamiento para la guía nueva" |
| `vako-creatividades` | Creatividades | Para posts, reels, anuncios, ganchos, guiones | "Dame 5 ideas de reels para esta semana" |
| `vako-email` | Email | Para secuencias de email (bienvenida, lanzamiento, nutrición) | "Escribe la secuencia de bienvenida para quien descarga la guía gratuita" |
| `vako-landing` | Landing Page | Para auditar o redactar páginas de venta | "Redacta la página de venta de la guía de maridajes" |

## Cómo pedir trabajo (dos formas)
1. **Directo:** pide la tarea en lenguaje natural — Claude Code elige el agente correcto automáticamente (ej. "necesito los captions de Instagram de esta semana").
2. **Con el jefe de equipo:** invoca la skill `vako-marketing` para correr un "playbook" completo que coordina a varios agentes a la vez — por ejemplo, un lanzamiento completo de guía nueva en un solo pedido.

## Playbooks del jefe de equipo (`vako-marketing`)
- **Sprint semanal** — pulso rápido de investigación + revisión de oferta + contenido de la semana. Pensado para correr ~1 vez por semana en pocos minutos de tu tiempo.
- **Lanzamiento de guía nueva** — de investigación a oferta a landing/email/creatividades, todo coordinado.
- **Continuar campaña de Instagram** — retoma el plan de 3 meses ya existente.
- **Auditoría rápida** — investigación + landing en paralelo sobre una página o el sitio completo.

## Para que el equipo funcione con el mínimo esfuerzo de tu parte
- Todo el contexto de marca vive en `00-BRAND-CONTEXT.md` — solo tienes que tocarlo si cambia algo estructural (precio, producto nuevo, canal nuevo, herramienta de cobro).
- El estado del negocio (catálogo, oferta activa, campaña IG) vive en `01-ESTADO-ACTUAL.md` y cada agente lo actualiza solo.
- Ningún agente toca el código del sitio (`src/`, `public/`) — solo generan contenido y estrategia dentro de esta carpeta, así que no hay riesgo de que rompan la web.

## Pendientes para que el equipo tenga datos 100% reales (no genéricos)
1. **Catálogo real de tus guías en PDF** (título, tema, precio, dónde se cobran) → complétalo en `01-ESTADO-ACTUAL.md` o díselo a cualquier agente y él lo actualiza.
2. **El plan/contenido de la campaña de Instagram de 3 meses ya creada** → pégaselo a `vako-creatividades` una vez para que quede guardado y el equipo no la repita ni la contradiga.
3. **Herramienta de cobro para las guías** (el sitio no tiene checkout propio todavía) → dile a `vako-ofertas` o `vako-landing` qué usas (Gumroad, Stripe Payment Links, etc.) o si aún no has decidido.

## Automatización opcional (para que corra realmente solo)
Ahora mismo el equipo funciona bajo demanda: tú pides o Claude Code detecta la tarea y llama al agente correcto. Si además quieres que, por ejemplo, el Sprint semanal se dispare solo sin que tú lo pidas, eso se puede programar con la skill `schedule` de Claude Code (cron en la nube). No está activado por defecto — pídemelo cuando quieras encenderlo y con qué frecuencia.
