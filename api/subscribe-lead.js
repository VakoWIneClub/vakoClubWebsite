// Da de alta o etiqueta un contacto en Hostinger Reach (email marketing) según de dónde viene:
// formulario de "primera parte gratis", compra confirmada, alta de socio gratuito o lista de
// espera de una guía regional. Las automatizaciones que mandan los emails reales se arman a mano
// en el panel de Reach — la API no permite crearlas — este endpoint solo etiqueta contactos para
// que esas automatizaciones tengan de qué dispararse.
//
// Best-effort a propósito: si Reach falla (red, token vencido, etc.) nunca debe romper el flujo
// real del sitio (entrega del extracto, alta de cuenta, compra) — mismo criterio que ya usa el
// aviso interno de EmailJS en ElMundoDeLaCopaLanding.jsx. Por eso siempre responde 200: al
// frontend no le interesa si esto falló, solo que no lo bloqueó.

const REACH_API_BASE = 'https://developers.hostinger.com';
const REACH_PROFILE_UUID = '3e2ef855-9400-4837-a10a-e7c16a8b4ce6';

// Etiquetas ya creadas en Reach (ver memoria del equipo de marketing). El cliente nunca manda un
// tag_uuid directo, solo un `source` de esta lista — así no puede etiquetar contactos con
// cualquier cosa.
const SOURCE_TAGS = {
  'lead-magnet-copa': '8d407a8f-3594-4b09-8e0d-266ea58ae3d0',
  'comprador-el-mundo-de-la-copa': '2d00072d-f418-40a2-a079-703bf746eb7f',
  'socio-gratuito': '85a4e5aa-06bc-4567-99fd-cff9cfe43a94',
  'waitlist-vino-espanol': 'be6cb686-0ebe-46ae-92a0-95492197090d',
  'waitlist-vino-argentino': 'b90b9ea8-7627-4299-954e-015fcd3e083f',
  'waitlist-vino-frances': '1a5a02e0-0b47-4f88-bf2a-d4c1f0757a07',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = process.env.HOSTINGER_API_TOKEN;
  if (!token) {
    console.error('HOSTINGER_API_TOKEN no configurado en el servidor.');
    return res.status(200).json({ ok: false });
  }

  const { email, source, name } = req.body || {};
  const tagUuid = SOURCE_TAGS[source];
  if (!email || !/\S+@\S+\.\S+/.test(email) || !tagUuid) {
    return res.status(400).json({ error: 'Datos inválidos.' });
  }

  try {
    const response = await fetch(
      `${REACH_API_BASE}/api/reach/v1/profiles/${REACH_PROFILE_UUID}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...(name ? { name } : {}),
          tag_uuids: [tagUuid],
        }),
      }
    );

    // Un contacto que ya existe puede devolver error acá (comportamiento no documentado del lado
    // de Hostinger para este endpoint) — se trata como no fatal, ver comentario de arriba.
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('Hostinger Reach respondió con error:', response.status, body);
    }

    return res.status(200).json({ ok: response.ok });
  } catch (error) {
    console.error('Error contactando a Hostinger Reach:', error);
    return res.status(200).json({ ok: false });
  }
}
