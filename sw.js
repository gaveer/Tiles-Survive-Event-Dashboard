const CACHE_NAME = "tiles-survive-dashboard-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./gaver.png",
  "./tiles-bg.jpg",
  "./sounds/Xylophone.ogg",
  "./data/announcement.json",
  "./data/maintenance.json",
  "./data/prep.json",
  "./data/specialLong.json",
  "./data/specialShort.json",
  "./data/tasks.json",
  "./data/translations.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isJsonDataRequest =
    url.origin === self.location.origin &&
    url.pathname.includes("/data/") &&
    url.pathname.endsWith(".json");

  if(isJsonDataRequest){
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      });
    }).catch(() => fetch(event.request))
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type:"window", includeUncontrolled:true }).then(clientList => {
      for(const client of clientList){
        if("focus" in client){
          client.navigate("./index.html");
          return client.focus();
        }
      }

      if(clients.openWindow){
        return clients.openWindow("./index.html");
      }
    })
  );
});
