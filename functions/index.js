const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
 

exports.userJoined= functions.auth.user()
    .onCreate(user=>{
        //console.log('user created',user.email,user.uid);
        return admin.firestore().collection('userDetails')
        .doc(user.uid).set({
            email:user.email,
            productId: ""
        });

});

exports.userDeleted= functions.auth.user()
    .onDelete(user=>{
        //console.log('user created',user.email,user.uid);
        const doc = admin.firestore().collection('userDetails').doc(user.uid);
        return doc.delete();

});