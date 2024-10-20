// Load environment variables
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

dotenv.config()

// Firebase configuration
const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
}

const app = initializeApp(firebaseConfig)

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app)
