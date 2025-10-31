// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "meeting-scheduler-3414c.firebaseapp.com",
  projectId: "meeting-scheduler-3414c",
  storageBucket: "meeting-scheduler-3414c.firebasestorage.app",
  messagingSenderId: "1077191117677",
  appId: "1:1077191117677:web:be566cf2f081b385cca864",
  measurementId: "G-EX84PHVV4W",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
