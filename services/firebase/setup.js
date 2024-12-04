// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCDE6Pq7bJ3AYAYYug9Bld5_9HgKutvclk",
//   authDomain: "journeyflow-f7d8a.firebaseapp.com",
//   projectId: "journeyflow-f7d8a",
//   storageBucket: "journeyflow-f7d8a.firebasestorage.app",
//   messagingSenderId: "768696247655",
//   appId: "1:768696247655:web:30f674982a213b5e34bbc2",
//   measurementId: "G-K6TFR579F7"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require("./servicesec.json");

module.exports = class FirebaseEndpoint {
    static db;

    static {
        initializeApp({
            credential: cert(serviceAccount)
        });
        this.db = getFirestore();
    }

    static firestoreReadJourneys(userEmail) {
        return this.db.collection('users')
            .doc(userEmail)
            .collection('journeys')
            .get()
            .then((snapshot) => {
                const journeys = [];
                snapshot.forEach((doc) => {
                    journeys.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                // console.log(journeys); // Log the extracted journeys
                return journeys; // Resolve the promise with the array of journeys
            })
            .catch((error) => {
                console.error('Error reading journeys:', error);
                throw error; // Reject the promise if there's an error
            });
    }

    static firestorePutJourney(userEmail, journeyData) {
        return this.db.collection('users')
            .doc(userEmail)
            .collection('journeys')
            .add(journeyData)  // Use .add() to auto-generate a document ID
            .then((docRef) => {
                console.log('Document successfully written with ID:', docRef.id);
                return { success: true, id: docRef.id }; // Resolve with the new document ID
            })
            .catch((error) => {
                console.error('Error adding document:', error);
                throw error; // Reject the promise with the error
            });
    }
}