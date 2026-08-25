import { createClient } from '@supabase/supabase-js';

// Mismo proyecto que src/lib/customSupabaseClient.js (fallback = la URL pública de producción,
// no es un secreto). La SERVICE_ROLE key sí lo es y no tiene fallback: sin ella simplemente no
// se registra el claim — nunca debe romper la verificación de pago ni la descarga del PDF.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://anqmpchicyejgjqxbhmd.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let adminClient = null;
if (serviceRoleKey) {
  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Registra una compra pagada para el cupo de "primeros 50 Fundadores/as". Idempotente por
// session_id (una recarga de la página de éxito nunca duplica el conteo) y best-effort: cualquier
// error queda en el log pero no se propaga, para no bloquear la confirmación de pago real.
export async function recordFounderClaim({ sessionId, guideId, email }) {
  if (!adminClient) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY no configurada — no se registró el claim de Fundador/a.');
    return;
  }
  try {
    const { error } = await adminClient
      .from('founder_claims')
      .upsert(
        { session_id: sessionId, guide_id: guideId || 'guia-general', email },
        { onConflict: 'session_id', ignoreDuplicates: true }
      );
    if (error) throw error;
  } catch (error) {
    console.error('Error registrando claim de Fundador/a:', error);
  }
}
