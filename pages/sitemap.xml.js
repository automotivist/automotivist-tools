// pages/sitemap.xml.js
import { getAllPagePaths } from '../lib/calculations';
const BASE_URL = 'https://tools.automotivist.com';
function generateSitemap(paths) {
  const staticPages = ['', '/calculator'];
  const allPaths = [...staticPages.map(p => ({loc:`${BASE_URL}${p}`,priority: p===''?'1.0':'0.9',changefreq:'monthly'})),...paths.map(({params}) => ({loc:`${BASE_URL}/car-payment/${params.slug}`,priority:'0.8',changefreq:'monthly'}))];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allPaths.map(p=>`<url><loc>${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('')}</urlset>`;
}
export async function getServerSideProps({res}) { const paths=getAllPagePaths();const sitemap=generateSitemap(paths);res.setHeader('Content-Type','text/xml');res.setHeader('Cache-Control','public,s-maxage=86400,stale-while-revalidate');res.write(sitemap);res.end();return{props:{}}; }
export default function Sitemap(){return null;}
