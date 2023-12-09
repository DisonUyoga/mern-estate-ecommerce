// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ad2ca.firebaseapp.com",
  projectId: "mern-estate-ad2ca",
  storageBucket: "mern-estate-ad2ca.appspot.com",
  messagingSenderId: "795578508383",
  appId: "1:795578508383:web:530ed96bcf39e6aeb6a7ea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);