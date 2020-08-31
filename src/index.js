import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

const messaging = firebase.messaging();
messaging.usePublicVapidKey("BEoveXjJ7r1dZtIyNDCoAeXznxU99gk60GHt7Zt0ag0XntrAaayOoxdRuU7eoRjfnDlGcjuOvyaC8aQ4wD2D-LU");
  
  messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
      console.log('Token refreshed.');
  
    }).catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
      
    });
  });

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    alert(payload.notification.body);

  });

ReactDOM.render(
    <App />
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
