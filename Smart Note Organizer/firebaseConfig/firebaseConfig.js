// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApvgdc7yr44Lsk11ZiM6PHNMQPxwHM_nc",
  authDomain: "smartnoteorganizer-2025.firebaseapp.com",
  projectId: "smartnoteorganizer-2025",
  databaseURL: "https://smartnoteorganizer-2025-default-rtdb.firebaseio.com",
  storageBucket: "smartnoteorganizer-2025.firebasestorage.app",
  messagingSenderId: "927700094333",
  appId: "1:927700094333:web:9bc21ca431a66e29b15014",
  measurementId: "G-71MJ013XTK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
