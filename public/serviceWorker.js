const cacheName = "portfolio-cache"
const assets = [
  "/",
  "/index.html",
  "/assets/css/all.min.css",
  "/assets/css/bootstrap.min.css",
  "/assets/css/css.css",
  "/assets/css/custom.css",
  "/assets/css/magnific-popup.css",
  "/assets/css/skin6.css",
  "/assets/js/bootstrap.min.js",
  "/assets/js/custom.js",
  "/assets/js/imagesloaded.pkgd.min.js",
  "/assets/js/isotope.pkgd.min.js",
  "/assets/js/jquery-3.3.1.min.js",
  "/assets/js/magnific-popup.min.js",
  "/assets/js/typeit.min.js"
]

self.addEventListener(cacheName, (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then((cache) => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request)
    })
  )
})
