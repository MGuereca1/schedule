// 6:36 vid

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIRE_BASE_APIKEY,
    authDomain: import.meta.env.VITE_FIRE_BASE_AUTHDOMAIN ,
    projectId: import.meta.env.VITE_FIRE_BASE_PROJECTID ,
    storageBucket: import.meta.env.VITE_FIRE_BASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIRE_BASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIRE_BASE_APPID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)

// cloud firestore db
// every user gets a unique id when signing in 
// modify rules for users