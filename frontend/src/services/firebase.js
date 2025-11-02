// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBz_lzQVorlnpXl892uES-BLSE3DhYgQUA",
  authDomain: "movie-review-platform-e33bf.firebaseapp.com",
  projectId: "movie-review-platform-e33bf",
  storageBucket: "movie-review-platform-e33bf.firebasestorage.app",
  messagingSenderId: "406637069225",
  appId: "1:406637069225:web:7f473ef587040470e0bab8",
  measurementId: "G-00PJ1T8F1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;