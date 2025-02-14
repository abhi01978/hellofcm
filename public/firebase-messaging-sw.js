importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBlyW0jeyCAibY7zTJJpkpuep3MUUo0Vp4",
    authDomain: "my-site-b99bf.firebaseapp.com",
    projectId: "my-site-b99bf",
    storageBucket: "my-site-b99bf.appspot.com",
    messagingSenderId: "716812448739",
    appId: "1:716812448739:web:e3c45c74826985c4cd26d6",
    measurementId: "G-QZF5K6VH5G"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './avatar-9.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

