const a=[{"revision":null,"url":"assets/index-CRN_scuc.css"},{"revision":null,"url":"assets/index-CsYKXThZ.js"},{"revision":null,"url":"assets/workbox-window.prod.es5-B9K5rw8f.js"},{"revision":"ca561ad793ef07af8bba6e2c7c3af83e","url":"index.html"},{"revision":"63dd96626ae04cad7671472e26233916","url":"icon.png"},{"revision":"53f3a103b7fd627521154a5c37ace522","url":"manifest.webmanifest"}];console.debug("Workbox manifest:",a);const h="BACKDROP_APP_V1";addEventListener("fetch",c=>{const e=c;e.request.url.startsWith("http")&&e.respondWith(fetch(e.request).then(t=>{if(t&&t.status===200&&t.type==="basic"){const s=t.clone();caches.open(h).then(n=>{n.put(e.request,s)})}return t}).catch(async()=>await caches.match(e.request)??new Response("Offline",{status:503,statusText:"Offline"})))});
