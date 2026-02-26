import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAN7wb7o91N_9b-zVcOwTReaoHHOSlhHKg",
  authDomain: "javani-181d5.firebaseapp.com",
  projectId: "javani-181d5",
  storageBucket: "javani-181d5.firebasestorage.app",
  messagingSenderId: "898711359281",
  appId: "1:898711359281:web:c12eb1742b54d70d2eea10",
  measurementId: "G-WHJ0TJ1VX6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
