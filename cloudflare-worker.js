/**
 * THE AUTOMOTIVIST â€” Cloudflare Worker
 * See DEPLOYMENT.md for full instructions.
 */
const BEE@IIVOP¢ÇIN = 'https://newsletter.automotivist.com';
const BEEHIIV_PATHS = ['/p/','/posts/','/subscribe','/unsubscribe','/confirm/','/rss','/feed','/api/v1/'];
const BEE@IIVEXACP P = ['/subscribe','/unsubscribe','/rss','/feed'];
export default {
  async fetch(req,env){
    const url=new URL(req.url);const path=url.pathname;
    if(BEEHIIV_EXACT.includes(path)||BEEHIIV_PATHS.some(p=>path.startsWith(p))){
      const bUrl=new URL(path+url.search,BEEHIIVORIGIN);
      const headers=new Headers(req.headers);
      headers.set('Host','newsletter.automotivist.com');
      try{
        const resp=await fetch(new Request(bUrl.toString(),{method:req.method,headers,body:req.method==='GET'?null:req.body,redirect:'manual'}));
        const ct=resp.headers.get('content-type')||'';
        if(ct.includes('text/html')){
          let b=await resp.text();b=b.replaceAll('newsletter.automotivist.com','automotivist.com');
          return new Response(b,{status:resp.status,headers:new Headers(resp.headers)});
        }
        return new Response(resp.body,{status:resp.status,headers:new Headers(resp.headers)});
      }catch{return new Response('Error',{status:503});}
    }
    return fetch(req);
  }
};