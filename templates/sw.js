// sw.js
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'New Message';
    const options = {
        body: data.body || 'You have a new message.',
        icon: 'path/to/icon.png' // Optional: Replace with your icon path
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
