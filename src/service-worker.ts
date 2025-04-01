/// <reference lib="webworker" />

// Typdefinition für Workbox Manifest
interface PrecacheEntry {
  url: string;
  revision?: string;
}

// Erweiterung von `self`, damit __WB_MANIFEST bekannt ist
declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & {
    __WB_MANIFEST: PrecacheEntry[];
  };

// 👇 erzwingt die Manifest-Injektion und vermeidet ESLint-Warnung
const manifest = self.__WB_MANIFEST;
console.debug("Workbox manifest:", manifest);

const CACHE_NAME = "BACKDROP_APP_V1";

// Standard-Fetch-Strategie: Network first, fallback to cache
addEventListener("fetch", (event) => {
  const fetchEvent = event as FetchEvent;

  if (!fetchEvent.request.url.startsWith("http")) return;

  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(fetchEvent.request, responseClone);
          });
        }

        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(fetchEvent.request);
        return (
          cached ??
          new Response("Offline", { status: 503, statusText: "Offline" })
        );
      })
  );
});
