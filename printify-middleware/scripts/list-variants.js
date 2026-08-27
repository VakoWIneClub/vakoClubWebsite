#!/usr/bin/env node
/*
  list-variants.js (ESM)
  Usage:
    $env:PRINTIFY_TOKEN='yourtoken'; node printify-middleware/scripts/list-variants.js
  Output:
    printify-middleware/output/mapping.json
*/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.PRINTIFY_TOKEN;
if (!token) {
  console.error('ERROR: PRINTIFY_TOKEN environment variable is required');
  process.exit(1);
}

const shopId = process.argv[2] || '28715716';
const limit = 50;
const outDir = path.join(__dirname, '..', 'output');
const outFile = path.join(outDir, 'mapping.json');

(async function main() {
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    let page = 1;
    const results = [];

    while (true) {
      const url = `https://api.printify.com/v1/shops/${shopId}/products.json?page=${page}&limit=${limit}`;
      const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Printify API error: ${res.status} ${text}`);
      }
      // Printify pagina al estilo Laravel: { data: [...], current_page, last_page }, no un array plano.
      const body = await res.json();
      const products = body.data || [];
      if (products.length === 0) break;

      for (const p of products) {
        const variants = (p.variants || []).map(v => ({ variant_id: v.id, sku: v.sku, title: v.title }));
        results.push({ product_id: p.id, title: p.title, variants });
      }

      if (body.current_page >= body.last_page) break;
      page++;
    }

    fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Wrote mapping to ${outFile} (${results.length} products)`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(2);
  }
})();
