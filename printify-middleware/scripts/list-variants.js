#!/usr/bin/env node
/*
  list-variants.js
  Usage:
    PRINTIFY_TOKEN=yourtoken node list-variants.js
  Output:
    printify-middleware/output/mapping.json
*/
const fs = require('fs');
const path = require('path');

const token = process.env.PRINTIFY_TOKEN;
if (!token) {
  console.error('ERROR: PRINTIFY_TOKEN environment variable is required');
  process.exit(1);
}

const shopId = process.argv[2] || '28715716'; // default to provided shop id
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
      const products = await res.json();
      if (!products || products.length === 0) break;

      for (const p of products) {
        const variants = (p.variants || []).map(v => ({ variant_id: v.id, sku: v.sku, title: v.title }));
        results.push({ product_id: p.id, title: p.title, variants });
      }

      if (products.length < limit) break; // likely last page
      page++;
    }

    fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf8');
    console.log(`Wrote mapping to ${outFile} (${results.length} products)`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(2);
  }
})();
