// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdUsJH4o0UpdmP1DAOUm-qE6vZ8i8hgRY",
  authDomain: "musculatech.firebaseapp.com",
  projectId: "musculatech",
  storageBucket: "musculatech.firebasestorage.app",
  messagingSenderId: "313657406677",
  appId: "1:313657406677:web:c2f8e5c459eb7ff37bde5c"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);