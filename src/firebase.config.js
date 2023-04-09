// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHHV4bAxM4n91zlwgsSK4fN2iplx6idA4",
  authDomain: "courseworkapp-1c477.firebaseapp.com",
  projectId: "courseworkapp-1c477",
  storageBucket: "courseworkapp-1c477.appspot.com",
  messagingSenderId: "12600363517",
  appId: "1:12600363517:web:8101948c6b9fbf03e93194",
  measurementId: "G-FKDDWG0XF2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const firestore = getFirestore(app)
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

const auth = getAuth(app)

export default auth