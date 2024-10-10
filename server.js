const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const webpush = require('web-push');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set your VAPID keys
const vapidKeys = {
    publicKey: '<YOUR_PUBLIC_VAPID_KEY>',  // Replace with your public key
    privateKey: '<YOUR_PRIVATE_VAPID_KEY>' // Replace with your private key
};

webpush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions in memory (for demo purposes)
let subscriptions = [];

// Serve static files
app.use(express.static(__dirname));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message); // Broadcast message to all clients

        // Send push notification to all subscriptions
        const payload = JSON.stringify({
            title: 'New Message',
            body: message
        });

        subscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, payload).catch(error => {
                console.error('Error sending notification:', error);
            });
        });
    });

    // Store subscription
    socket.on('subscribe', (subscription) => {
        subscriptions.push(subscription);
        console.log('New subscription added:', subscription);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
