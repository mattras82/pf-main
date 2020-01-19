const CACHE_NAME = 'pf-main-2kspocpg-site-cache';
const urlsToCache = [
	location.origin,
	location.origin + '/offline.html',
	location.origin + '/wp-content/themes/pf-main/assets/images/logo.png',
	location.origin + '/wp-content/themes/pf-main/assets/jquery.min.js',
	location.origin + '/wp-content/themes/pf-main/assets/theme.css?ver=2kspocpg',
	location.origin + '/wp-content/themes/pf-main/assets/theme.js?ver=2kspocpg',
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // Cache all predetermined urls
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          // Remove all caches on this site other than this SW's cache
          return CACHE_NAME !== cacheName ? caches.delete(cacheName) : null;
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Parse the URL
  let requestURL = new URL(event.request.url);
  // Get the client ID so we can interact with the DOM
  let clientID = event.clientId;
  // Make sure we're only caching GET requests from our site
  // as well as google fonts (this may be site-specific)
  if ( (requestURL.origin === location.origin ||
    /fonts.googleapis/.test(requestURL.origin) ||
    /fonts.gstatic/.test(requestURL.origin) )
    && event.request.method === 'GET') {
    // DON'T CACHE ADMIN, PDFs, OR THANK YOU PAGES
    if (/wp-admin/.test(requestURL) || /thank-you/.test(requestURL) || /\.pdf$/.test(requestURL)) return;

    event.respondWith(
      caches.match(event.request.url)
        .then(function (response) {
          // If we've got a response from the cache and the user
          // didn't force a reload then we'll return the cache response
          if (response && !event.isReload) {
            return response;
          }

          // IMPORTANT: Clone the request. A request is a stream and
          // can only be consumed once. Since we are consuming this
          // once by cache and once by the browser for fetch, we need
          // to clone the response.
          let fetchRequest = event.request.clone();

          return fetch(fetchRequest).then(
            function (response) {
              // Check if we received a valid response
              // !
              if (!response || [200,404].indexOf(response.status) === -1 || response.type !== 'basic') {
                return response;
              }

              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              let responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request.url, responseToCache);
                });

              return response;
            }
          );
        })
        .catch(function () {
          // If the user is offline, the fetch() call above will cause an error,
          // So we'll catch that error and return the cached offline page.
          return caches.match(location.origin + '/offline.html');
        })
    );
  }
});

self.addEventListener('message', function (event) {
  if (event.data) {
    let action = event.data.action;
    if (action === 'cache' && event.data.url) {
      caches.open(CACHE_NAME).then((cache) => {
        cache.add(event.data.url);
      });
    } else if (action === 'skipWaiting') {
      self.skipWaiting();
    } else if (action === 'log' && event.data.message) {
      console.log('hello from service worker');
      console.log(event.data.message);
    } else if (action === 'checkPage' && event.data.url) {
      let clientID = event.source.id;
      fetch(event.data.url).then(async (response) => {
        let updateCache = false;
        let resToCache = null;
        const client = await clients.get(clientID);
        if (client) {
          let cache = await caches.open(CACHE_NAME);
          let cacheClone = await cache.match(event.data.url);
          if (response.status === 200) {
            resToCache = response.clone();
            let oldBody = await cacheClone.text();
            let newBody = await response.text();
            if (oldBody !== newBody) {
              console.log('they\'re not equal!');
              updateCache = true;
            }
          }
        }
        if (updateCache) {
          let cache = await caches.open(CACHE_NAME);
          let wait = await cache.put(event.data.url, resToCache);
          client.postMessage({
            action: 'update'
          });
        }
      });
    }
  }
});
