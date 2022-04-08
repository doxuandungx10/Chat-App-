import LoginScreen from './containers/Login/login.js';
import RegisterScreen from './containers/Register/register.js';
import CheckEmailScreen from './containers/CheckEmail/checkEmail.js';
import { MainScreen } from './containers/Main/main.js';
import InfoScreen from './containers/Infor/infor.js';

// const app = document.getElementById('app');

// const loginScreen = new LoginScreen();
// // const registerScreen = new RegisterScreen();

// app.appendChild(loginScreen.render());

class App {
	$activeScreen;

	constructor() {
		this.setUpAuthListener();
	}

	setUpAuthListener() {
		// const emailLogined = localStorage.getItem('emailLogined');
		// let screen;
		// if (emailLogined) {
		// 	screen = new MainScreen();
		// } else {
		// 	screen = new LoginScreen();
		// }
		// this.changeActiveScreen(screen); // setting the main screen active if we have already signed in
		firebase.auth().onAuthStateChanged((user) => {
			let screen;

			// console.log(user);

			if (user && user.emailVerified) {
				// TODO:
				screen = new InfoScreen();
				// screen = new MainScreen();
			} else if (user && !user.emailVerified) {
				screen = new CheckEmailScreen();
			} else {
				screen = new LoginScreen();
			}
			this.changeActiveScreen(screen);
		});
	}

	changeActiveScreen(screen) {
		const appEle = document.getElementById('app');
		if (appEle) {
			if (this.$activeScreen) {
				appEle.innerHTML = '';
			}
			this.$activeScreen = screen;
			screen.render(appEle);
		}
	}
}
// const signIn = new LoginScreen(); // this create a new screen
const app = new App();
// const checkEmailScreen = new CheckEmailScreen();
// app.changeActiveScreen(signIn); // and this put the that previous screen on the page
export default app;
