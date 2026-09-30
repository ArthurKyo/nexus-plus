import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
async function list(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await list(full)));
    else if (!entry.name.startsWith("service-worker")) files.push(full);
  }
  return files;
}
const files = await list("dist");
const hash = createHash("sha256");
for (const file of files) hash.update(await readFile(file));
const version = "nexus-" + hash.digest("hex").slice(0, 12);
const base = process.env.VITE_BASE_PATH || "/";
const urls = files.map((f) => base + f.slice(5));
urls.push(base);
const worker = `const BASE=${JSON.stringify(base)};const CACHE=${JSON.stringify(version)};const ASSETS=${JSON.stringify(urls)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nexus-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(BASE))return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(async()=>{const cached=await caches.match(url.pathname);return cached||await caches.match(BASE+'index.html')||await caches.match(BASE+'offline.html');}));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});`;
await writeFile("dist/service-worker.js", worker);
console.log(`PWA: ${urls.length} arquivos pré-armazenados (${version}).`);
