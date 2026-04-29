const CACHE_NAME = "tiles-survive-dashboard-v3";

// Basic service worker - no caching
self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  // Clean up old caches if any exist
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Let browser handle all requests normally - no caching
  return;
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
