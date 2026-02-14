const CACHE_NAME = "dropText_cache"

const FILES_TO_CACHE = [
    "/",
    "/index.js"
]


self.addEventListener("install", (e) => {
    e.waitUntil(

        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(FILES_TO_CACHE)
        }).then(() => {
            self.skipWaiting()
        })


    )
})


self.addEventListener("activate", (e) => {
    e.waitUntil(

        caches.keys().then((keys) => {
            Promise.all(
                keys.map((i) => {
                    if (i !== CACHE_NAME) {
                        caches.delete(i)
                    }

                })
            )
        })

    )
    self.clients.claim()
})


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(resp => resp || fetch(event.request))
    );
});
