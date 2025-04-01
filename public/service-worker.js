const CACHE_NAME = "BACKDROP_APP_V1"

self.addEventListener("fetch", event => {
    if (!event.request.url.startsWith("http")) return;
    console.log('SW:', event.request.url)
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Nur Response cachen, wenn er gültig ist
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    networkResponse.type === "basic"
                ) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Wenn fetch fehlschlägt → Cache versuchen
                return caches.match(event.request);
            })
    );
});
