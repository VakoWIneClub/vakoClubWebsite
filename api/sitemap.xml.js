import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://vakoclub.com';

// Mismo fallback que src/lib/customSupabaseClient.js: la anon key ya viaja pública en el bundle
// del cliente, así que reusar el mismo valor por defecto acá no expone nada nuevo.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://anqmpchicyejgjqxbhmd.supabase.co';
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucW1wY2hpY3llamdqcXhiaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzYxMTMsImV4cCI6MjA2ODk1MjExM30.OJQAWZ0Qv-8dWdbqsp18AW2dCA6uydcvmtqDkMt0x1I';

// Rutas estáticas indexables — mismo criterio que public/robots.txt: /guia queda afuera porque
// está detrás de un login y un crawler anónimo nunca ve contenido real ahí.
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/noticias', priority: '0.9', changefreq: 'daily' },
  { path: '/eventos', priority: '0.8', changefreq: 'daily' },
  { path: '/comunidad', priority: '0.6', changefreq: 'weekly' },
  { path: '/tienda', priority: '0.9', changefreq: 'weekly' },
  { path: '/tienda/el-mundo-de-la-copa', priority: '1.0', changefreq: 'weekly' },
  { path: '/sobre-nosotros', priority: '0.5', changefreq: 'monthly' },
  { path: '/contacto', priority: '0.4', changefreq: 'monthly' },
  { path: '/suscripcion', priority: '0.5', changefreq: 'monthly' },
  { path: '/terminos', priority: '0.2', changefreq: 'yearly' },
  { path: '/politica-privacidad', priority: '0.2', changefreq: 'yearly' },
];

const escapeXml = (value) =>
  String(value).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[c]));

const urlEntry = ({ path, lastmod, priority, changefreq }) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>
${lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>\n` : ''}${changefreq ? `    <changefreq>${changefreq}</changefreq>\n` : ''}${priority ? `    <priority>${priority}</priority>\n` : ''}  </url>`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Best-effort: si Supabase falla, el sitemap igual sale con las rutas estáticas en vez de
  // devolver un 500 y dejar a Google sin nada que indexar.
  const [articles, events] = await Promise.all([
    supabase.from('articles').select('slug, created_at').then(({ data }) => data || [], () => []),
    supabase.from('events').select('slug, created_at').then(({ data }) => data || [], () => []),
  ]);

  const entries = [
    ...STATIC_ROUTES.map(urlEntry),
    ...articles.map((a) => urlEntry({ path: `/noticias/${a.slug}`, lastmod: a.created_at, changefreq: 'monthly', priority: '0.7' })),
    ...events.map((e) => urlEntry({ path: `/eventos/${e.slug}`, lastmod: e.created_at, changefreq: 'weekly', priority: '0.6' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Regenerado desde Supabase en cada request — cachea 1h en el edge/CDN de Vercel y sirve una
  // copia vencida hasta 24h más mientras revalida, para no pegarle a la base en cada crawl.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(xml);
}
