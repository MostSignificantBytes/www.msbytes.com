// Remplace le service worker de l'ancien site Gatsby (gatsby-plugin-offline) chez les visiteurs qui
// l'ont encore : vide ses caches, se désinscrit et recharge les onglets ouverts sur la version en ligne.
// Le site Astro n'a pas de mode hors ligne (décision D3 du 25/11/2026).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys()
            await Promise.all(keys.map((key) => caches.delete(key)))
            await self.registration.unregister()
            const clients = await self.clients.matchAll({ type: 'window' })
            clients.forEach((client) => client.navigate(client.url))
        })()
    )
})
