import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// You can find these values in Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDbIuV7Lbc7Sth14bqhgJRjlFY6sTZh_8c",
  authDomain: "xsavlab.firebaseapp.com",
  projectId: "xsavlab",
  storageBucket: "xsavlab.firebasestorage.app",
  messagingSenderId: "400044598541",
  appId: "1:400044598541:web:6bbc431cf641c8edeabc44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
