// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGBdohqD2CY2mydKGPU_kOf6jFBcDgjMc",
  authDomain: "hisaab-244f8.firebaseapp.com",
  projectId: "hisaab-244f8",
  storageBucket: "hisaab-244f8.firebasestorage.app",
  messagingSenderId: "231179039088",
  appId: "1:231179039088:web:2cffcc922729bead709fb5",
  measurementId: "G-PV4GKW70CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics could not be initialized:", e);
}

export { analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
