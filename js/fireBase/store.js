import db from './fireBase.js';
import * as _noti from '../common/notify.js';

async function createUser(email, password, name, phone, imageUrl) {
	try {
		const response = await db.collection('users').add({
			email,
			password,
			name,
			phone,
			imageUrl,
		});
		localStorage.removeItem('auth-info');
		localStorage.setItem(
			'auth-info',
			JSON.stringify({
				email,
				name,
				phone,
				imageUrl,
			})
		);
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		_noti.error(errorCode, errorMessage);
		throw error;
	}
}

async function getUserByEmail(email) {
	// Because to functioning with firebase data so we need to try catch it
	// console.log(email);
	try {
		const querySnapshot = await db //this querySnapshot is an array
			.collection('users') //point at the users collection
			.where('email', '==', email)
			.get();

		if (querySnapshot.docs === 0) {
			return null;
		}
		// 		.then((querySnapshot) => {
		// 			querySnapshot.forEach((doc) => {
		// 				// console.log(`${doc.id} => ${doc.data()}`); //this will log out the ID and also the object type of the data
		// 				console.log(doc.data());
		// 			});
		// 		});
		return {
			id: querySnapshot.docs[0].id,
			...querySnapshot.docs[0].data(), // Normally, when we fetch an API, we have to parse the data, but firebase has data() that parse data for us already
		};
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		_noti.error(errorCode, errorMessage);
		throw error;
	}
}

async function updateUser(uid, email, name, phone, imageUrl) {
	try {
		const response = await db.collection('users').doc(uid).update({
			email,
			name,
			phone,
			imageUrl,
		});
		localStorage.removeItem('auth-info');
		localStorage.setItem(
			'auth-info',
			JSON.stringify({
				email,
				name,
				phone,
				imageUrl,
			})
		);
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function createConversation(name, imgURL, users, email) {
	try {
		const response = await db.collection('conversations').add({
			name,
			imgURL,
			users,
			creator: email,
			updateAt: new Date().getTime(),
		});
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function updateConversation(id, name, imgURL, users, email) {
	try {
		const response = await db.collection('conversations').doc(id).update({
			name,
			imgURL,
			users,
			creator: email,
			updateAt: new Date().getTime(),
		});
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function deleteConversation(id) {
	try {
		const response = await db.collection('conversations').doc(id).delete();
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function addUserByEmail(conversation, newEmail) {
	try {
		const response = await db
			.collection('conversations')
			.doc(conversation.id)
			.update({
				...conversation,
				users: [...conversation.users, newEmail],
				updateAt: new Date().getTime(),
			});
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function confirmAddUserByEmail(conversation) {
	try {
		const result = await Swal.fire({
			title: 'Submit your email...',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
			},
			showCancelButton: true,
			confirmButtonText: 'Add',
			showLoaderOnConfirm: true,
			preConfirm: async (email) => {
				const user = await getUserByEmail(email);
				return user;
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});

		if (result.value) {
			const { email } = result.value;
			const respose = await addUserByEmail(conversation, email);
		} else {
			_noti.error('Oops...', 'Your email is not exist!');
			return null;
		}
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

async function sendMessage(sender, content, conversationId, imgURL) {
	try {
		const response = await db.collection('message').add({
			sender,
			content,
			conversationId,
			sendAt: firebase.firestore.FieldValue.serverTimestamp(),
			avatar: imgURL,
		});
		console.log(response);
	} catch (error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		console.log(errorCode, errorMessage);
		throw error;
	}
}

export {
	createUser,
	getUserByEmail,
	updateUser,
	createConversation,
	updateConversation,
	deleteConversation,
	confirmAddUserByEmail,
	sendMessage,
};
