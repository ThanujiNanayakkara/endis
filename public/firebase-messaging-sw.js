// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDUe-0KRNdpcrY4t5vQOdj4ZAGJQJXUHP4",
    authDomain: "elecmoni.firebaseapp.com",
    databaseURL: "https://elecmoni.firebaseio.com",
    projectId: "elecmoni",
    storageBucket: "elecmoni.appspot.com",
    messagingSenderId: "962937467481",
    appId: "1:962937467481:web:c936f1f2a1919f02333748",
    measurementId: "G-9Q0RHTBGD4"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    console.log('title', title);
    const options = {
       body: payload.notification.body
    }
    return self.registration.showNotification(title, options);
 })
self.addEventListener("notificationclick", function(event) {
    console.log(event);
});