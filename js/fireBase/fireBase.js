const firebaseConfig = {
	apiKey: 'AIzaSyChl8UeMm9bzYcgl4WCxLaIrxNVwqszn68',
	authDomain: 'ci72-6d7e7.firebaseapp.com',
	projectId: 'ci72-6d7e7',
	storageBucket: 'ci72-6d7e7.appspot.com',
	messagingSenderId: '773929903644',
	appId: '1:773929903644:web:800e2765b010def81ea1d9',
	measurementId: 'G-NT7HFJD7QH',
};
const appFB = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
