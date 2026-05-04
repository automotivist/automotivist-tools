// pages/sitemap.xml.js — includes all page types
import { getAllPagePaths, getAllAffordPaths, getAllRefiPaths } from '../lib/calculations';
import { getAllVehiclePaths } from '../lib/vehicles';

const BASE = 'https://tools.automotivist.com';

function url(loc, priority='0.7', changefreq='monthly') {
  return `<url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export default function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
  const paymentPaths = getAllPagePaths();
  const affordPaths = getAllAffordPaths();
  const refiPaths = getAllRefiPaths();
  const vehiclePaths = getAllVehiclePaths();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(BASE, '1.0', 'weekly')}
${url(`${BASE}/calculator`, '0.9', 'monthly')}
${affordPaths.map(p => url(`${BASE}/afford/${p.params.slug}`, '0.8', 'monthly')).join('\n')}
${vehiclePaths.map(p => url(`${BASE}/cars/${p.params.slug}`, '0.8', 'monthly')).join('\n')}
${refiPaths.map(p => url(`${BASE}/refinance/${p.params.slug}`, '0.7', 'monthly')).join('\n')}
${paymentPaths.map(p => url(`${BASE}/car-payment/${p.params.slug}`, '0.7', 'monthly')).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();
  return { props: {} };
}
