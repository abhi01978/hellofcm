// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyBlyW0jeyCAibY7zTJJpkpuep3MUUo0Vp4",
        authDomain: "my-site-b99bf.firebaseapp.com",
        projectId: "my-site-b99bf",
        storageBucket: "my-site-b99bf.appspot.com",
        messagingSenderId: "716812448739",
        appId: "1:716812448739:web:e3c45c74826985c4cd26d6",
        measurementId: "G-QZF5K6VH5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission for notifications
Notification.requestPermission()
    .then(() => {
        console.log('Notification permission granted.');
        return getToken(messaging);
    })
    .then((token) => {
        console.log('FCM Token:', token);
        document.getElementById('sendNotification').onclick = function() {
            const title = document.getElementById('title').value;
            const body = document.getElementById('body').value;

            fetch('/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    token: token,
                }),
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                alert('Notification sent!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to send notification.');
            });
        };
    })
    .catch((error) => {
        console.error('Error getting permission or token:', error);
    });

// onMessage(messaging, (payload) => {
//     console.log('Message received. ', payload);
//     // Customize notification here
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: './avatar-9.png' // Optional icon
//     };

//     new Notification(notificationTitle, notificationOptions);
// });
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
        console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
}

