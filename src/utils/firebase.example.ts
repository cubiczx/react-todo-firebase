import { initializeApp } from "firebase/app";

// Firebase configuration
// Copy this file to firebase.ts and replace with your actual Firebase credentials
// Get your config from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export default initializeApp(firebaseConfig);
