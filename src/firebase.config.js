// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy6l4ocspURbkNmj5X0MdUxlo3jtfhoes",
  authDomain: "flats-market-place.firebaseapp.com",
  projectId: "flats-market-place",
  storageBucket: "flats-market-place.appspot.com",
  messagingSenderId: "1064350327483",
  appId: "1:1064350327483:web:bec2fd38b5b1db1b85ff9e",
  measurementId: "G-PFBF14XV10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 getAnalytics(app);
export const db = getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

