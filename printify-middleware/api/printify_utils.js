// utils for calling Printify API
const PRINTIFY_BASE = 'https://api.printify.com/v1';

async function callPrintify(path, method = 'GET', token, body) {
  const url = `${PRINTIFY_BASE}${path}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }
  return { status: res.status, ok: res.ok, data };
}

module.exports = { callPrintify };
