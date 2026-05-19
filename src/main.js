import Phaser from 'phaser';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { gameConfig } from './game.js';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Attempt Anonymous Login
signInAnonymously(auth)
  .then(() => {
    console.log("Firebase Anonymous Login Successful");
  })
  .catch((error) => {
    console.error("Firebase Auth Error:", error.code, error.message);
    console.warn("Please update firebaseConfig in src/main.js to enable Firebase features.");
  });

// Initialize Phaser Game
const game = new Phaser.Game(gameConfig);
