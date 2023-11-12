import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB6OMDiGIuzU0o-is8CLn_yAqIdiORk-vc",
    authDomain: "ieatcs465.firebaseapp.com",
    databaseURL: "https://ieatcs465-default-rtdb.firebaseio.com",
    projectId: "ieatcs465",
    storageBucket: "ieatcs465.appspot.com",
    messagingSenderId: "86450940860",
    appId: "1:86450940860:web:8b798a96c3292a626d19b9",
    measurementId: "G-WC6BY9CG6S"
  };
  
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export { db };