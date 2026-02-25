import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBSz-iEFspJKvhH2qCR5SHVonUj0ELHpp0",
  authDomain: "javni-spiritual-arts.firebaseapp.com",
  projectId: "javni-spiritual-arts",
  storageBucket: "javni-spiritual-arts.firebasestorage.app",
  messagingSenderId: "118397355026",
  appId: "1:118397355026:web:806ebb4a85e72b7d6244cb",
  measurementId: "G-QJVK8VMVTK",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
