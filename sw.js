let appVersion = '1.0';

const files = [
    './',
    './css/style.css',
    './css/responsive.css',
    './js/app.js',
    './images/logo.png',
    './images/favicon.png',
    './images/noresults.png',
    './images/banner-1.jpg',
];

self.addEventListener('install', async e => {
    const cache = await caches.open(appVersion);
    cache.addAll(files);
})

self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);
    if(url.origin === location.origin){
        e.respondWith(cacheFirst(req));
    }else{
        e.respondWith(networkFirst(req));
    }
})

async function cacheFirst(req){
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req){
    const cache = await caches.open('dynamic');
    try{
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    }catch(error){
        return await cache.match(req);
    }
}