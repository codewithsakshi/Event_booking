// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCbsK3JSzDMGu_qjVwClSqFcs1xq11ceD8",
    authDomain: "eventbooking-64cfc.firebaseapp.com",
    projectId: "eventbooking-64cfc",
    storageBucket: "eventbooking-64cfc.appspot.com",
    messagingSenderId: "192294559685",
    appId: "1:192294559685:web:2a7965222fe0082d2e35ac",
    measurementId: "G-56LXND10TT"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
