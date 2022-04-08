import { checkName, checkPhone } from '../../common/validation.js';
import ButtonComponent from '../../components/button.js';
import InputComponent from '../../components/input.js';
import {
	createNewAccount,
	getCurrentUser,
} from '../../fireBase/authentication.js';
import {
	createUser,
	getUserByEmail,
	updateUser,
} from '../../fireBase/store.js';
import { MainScreen } from '../Main/main.js';
import appContainer from '../../script.js';
import * as _noti from '../../common/notify.js';

class InfoScreen {
	$container;

	$paper;
	$avatarContainer;
	$avatar;

	$form;
	$title;
	$email;
	$phone;
	$imageUrl;
	$name;

	$buttonSubmit;

	$userID;

	constructor() {
		this.$container = document.createElement('div');
		this.$container.classList.add('info-screen');

		this.$paper = document.createElement('div');
		this.$paper.classList.add('paper');

		this.$avatarContainer = document.createElement('div');
		this.$avatarContainer.classList.add('avatar-container');

		this.$title = document.createElement('div');
		this.$title.classList.add('big-title');
		this.$title.innerText = 'Your Profile';

		this.$form = document.createElement('form');
		this.$form.classList.add('form-container');
		this.$form.addEventListener('submit', this.handleSubmit);

		this.$avatar = document.createElement('div');
		this.$avatar.classList.add('avatar');

		// const user = localStorage.getItem('emailLogined');

		const user = getCurrentUser();
		console.log(user);

		this.$email = new InputComponent(
			'Email address',
			'email',
			'infor-email',
			'text'
		);

		this.$email.setAttribute('value', user.email);
		this.$email.setAttribute('disabled', true);

		this.$name = new InputComponent('Full name', 'name', 'infor-name', 'text');
		this.$phone = new InputComponent(
			'Phone number',
			'phone',
			'infor-phone',
			'text'
		);

		this.$imageUrl = new InputComponent(
			'Avatar URL',
			'imgURL',
			'infor-imgURL',
			'text'
		);

		this.$imageUrl.setEventListener('input', this.handleChangeAvatar);

		this.$buttonSubmit = new ButtonComponent('Continue to chat', 'submit', [
			'btn',
			'btn-primary',
			'd-block',
			'mt-3',
		]);

		this.handleFetchUserByEmail();
	}

	async handleFetchUserByEmail() {
		//Because fetch is an async function (that's the rule)
		const user = getCurrentUser();
		const userStored = await getUserByEmail(user.email);
		if (userStored) {
			this.$userID = userStored.id;

			this.$name.setAttribute('value', userStored.name);
			this.$phone.setAttribute('value', userStored.phone);
			this.$imageUrl.setAttribute('value', userStored.imgURL);

			this.$avatar.style.backgroundImage = `url(${userStored.imgURL})`;
		} else {
			this.$userID = '';
		}
	}

	handleChangeAvatar = (e) => {
		e.preventDefault();
		this.$avatar.style.backgroundImage = `url(${e.target.value})`;
	}; //only JPG file

	handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const { name, phone, imgURL } = e.target;
			// console.log([name.value, phone.value, imgURL.value]);
			const user = getCurrentUser();

			let isError = false;
			if (checkName(name.value)) {
				isError = true;
				this.$name.setError(checkName(name.value));
			} else {
				this.$name.setError('');
			}

			if (checkPhone(phone.value)) {
				isError = true;
				this.$phone.setError(checkPhone(phone.value));
			} else {
				this.$phone.setError('');
			}
			if (isError) {
				return;
			}

			if (this.$userID) {
				await updateUser(
					this.$userID,
					user.email,
					name.value,
					phone.value,
					imgURL.value
				);
			} else {
				createUser(user.email, '', name.value, phone.value, imgURL.value);
			}

			const newMain = new MainScreen();
			appContainer.changeActiveScreen(newMain);
		} catch (error) {
			_noti.error(error.errorCode, error.errorMessage);
		}
	};

	render(appEle) {
		appEle.appendChild(this.$container);
		this.$container.append(this.$paper);
		this.$paper.append(this.$form, this.$avatarContainer);
		this.$form.append(
			this.$title,
			this.$email.render(),
			this.$name.render(),
			this.$phone.render(),
			this.$imageUrl.render(),
			this.$buttonSubmit.render()
		);
		this.$avatarContainer.appendChild(this.$avatar);
	}
}

export default InfoScreen;
