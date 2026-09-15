const CACHE_NAME = "stockpro-v3";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];

self.addEventListener("install", function(event) {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(FILES);

            })

    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys().then(function(names) {

            return Promise.all(

                names.map(function(name) {

                    if (name !== CACHE_NAME) {

                        return caches.delete(name);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        fetch(event.request)
            .then(function(response) {

                const copie =
                    response.clone();

                caches.open(CACHE_NAME)
                    .then(function(cache) {

                        cache.put(
                            event.request,
                            copie
                        );

                    });

                return response;

            })
            .catch(function() {

                return caches.match(
                    event.request
                );

            })

    );

});