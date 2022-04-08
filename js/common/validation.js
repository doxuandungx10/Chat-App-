export const checkEmail = (email) => {
	if (!email || email.length === 0) {
		// return true;
		return 'Email is required!';
	}
	// return false;
	return null;
};
export const checkPassword = (password) => {
	if (!password || password.length === 0) {
		// return true;
		return 'Password is required!';
	}
	if (password.length < 8) {
		return 'Password is not strong enough!!';
	}
	// return false;
	return null;
};

export const checkPhone = (phone) => {
	if (!phone || phone.length === 0) {
		return 'Phone number is required!';
	}
	const regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
	if (!regex.test(phone)) {
		return 'Invalid phone number!!';
	}
	return null; // ?
};

export const checkName = (name) => {
	if (!name || name.length === 0) {
		return 'Name is required!';
	}
	if (name.length > 20) {
		return 'Name can only contain 20 characters max!';
	}
	return null; // ?
};
