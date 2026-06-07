// pages/sitemap.xml.js
import { getAllPagePaths } from '../lib/calculations';
import { getAllAffordPaths } from '../lib/calculations';
import { getAllRefiPaths } from '../lib/calculations';
import { VEHICLES } from '../lib/vehicles-data';
import { STORIES } from '../lib/stories-data';

const BASE = 'https://tools.automotivist.com';
function url(loc, priority = '0.7', changefreq = 'monthly') {
  return '<url><loc>' + loc + '</loc><changefreq>' + changefreq + '</changefreq><priority>' + priority + '</priority></url>';
}
export default function Sitemap() { return null; }
export async function getServerSideProps({ res }) {
  const paymentPaths = getAllPagePaths();
  const affordPaths = getAllAffordPaths();
  const refiPaths = getAllRefiPaths();
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    url(BASE, '1.0', 'weekly') +
    url(BASE + '/calculator', '0.9', 'weekly') +
    url(BASE + '/guides/car-payment-guide', '0.9', 'monthly') +
    url(BASE + '/guides/true-cost-of-ownership', '0.9', 'monthly') +
    url(BASE + '/guides/car-loan-refinancing', '0.9', 'monthly') +
    STORIES.map(s => url(BASE + '/stories/' + s.slug, '0.9', 'monthly')).join('') +
    affordPaths.map(p => url(BASE + '/afford/' + p.params.slug, '0.8')).join('') +
    refiPaths.map(p => url(BASE + '/refinance/' + p.params.slug, '0.7')).join('') +
    VEHICLES.map(v => url(BASE + '/cars/' + v.slug, '0.8')).join('') +
    paymentPaths.map(p => url(BASE + '/car-payment/' + p.params.slug, '0.7')).join('') +
    '</urlset>';
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400');
  res.write(sitemap);
  res.end();
  return { props: {} };
}
