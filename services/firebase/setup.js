
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
// const serviceAccount = require("./servicesec.json");

// Load environment variables from .env for local development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

module.exports = class FirebaseEndpoint {
    static db;

    static {
        initializeApp({
            credential: cert(JSON.parse(serviceAccount))
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