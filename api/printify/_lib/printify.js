// Cliente mínimo para la API de Printify. Compartido por los endpoints de api/printify/*.
const PRINTIFY_BASE = 'https://api.printify.com/v1';

export async function callPrintify(path, method = 'GET', token, body) {
  const res = await fetch(`${PRINTIFY_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { status: res.status, ok: res.ok, data };
}
