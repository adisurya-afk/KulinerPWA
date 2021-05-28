var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
'/',
'/css/style-menu.css',
'/css/style.css',
'/js/main.js',
'/fallback.json',
'/img/nasi_angin.jpg',
'/img/kuah_pindang.jpg',
'/img/lempuyang.jpg',
'/img/nasi_lawar.jpg',
'/img/nature.jpg',
'/img/sate.jpg',
'/img/sate2.jpg',
'/img/urutanb2.jpg',
'/tanaman.html',
'/urutan.html',
'/sate.html',
'/rujak.html',
'/menu.html',
'/lawar.html',
'/angin.html',
'/index.html'

];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('In install service worker. Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function(event) {
    
  var request = event.request
  var url = new URL(request.url)

  //pisahkan request API dan Internal
  if(url.origin === location.origin) {
  event.respondWith(
      caches.match(request).then(function(response){
          return response || fetch(request)
      })
  )

  }else{
      event.respondWith(
          caches.open('plant-cache').then(function(cache){
              return fetch(request).then(function(LiveResponse){
                  cache.put(request, LiveResponse.clone())
                  return LiveResponse
              }).catch(function(){
                  return caches.match(request).then(function(response){
                      if(response) return response
                      return caches.match('/fallback.json')
                  })
              })
          })
      )

  }

});


self.addEventListener('activate', function(event) {

    var cacheAllowlist = ['pages-cache-v1', 'blog-posts-cache-v1'];
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName){
              return cacheName != CACHE_NAME
          }).map(function(cacheName){
              return caches.delete(cacheName)
          })
        );
      })
    );
  });