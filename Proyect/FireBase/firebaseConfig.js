import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyCJv2zvC0BEAjNUmnWRbvDNSBiq1y7lIuY",
  authDomain: "demeter-485d6.firebaseapp.com",
  projectId: "demeter-485d6",
  storageBucket: "demeter-485d6.firebasestorage.app",
  messagingSenderId: "1011807970627",
  appId: "1:1011807970627:web:3d58095f3a8b2aad0cbbf6",
  measurementId: "G-BM0TB3LBRY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);