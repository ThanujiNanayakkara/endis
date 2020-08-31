import { firebaseConfig } from './config';
import firebase from 'firebase';


firebase.initializeApp(firebaseConfig);



export const auth = firebase.auth();
export const messaging = firebase.messaging();
export default firebase; 
export const fireauth = firebase.auth;

// const settings = {timestampsInSnapshots: true};
// firebase.firestore().settings(settings);
export const firestore = firebase.firestore();
export const firebasestore = firebase.firestore;
export const functions = firebase.functions();