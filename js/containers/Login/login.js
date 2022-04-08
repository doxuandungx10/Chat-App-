import InputComponent from "../../components/input.js";
import ButtonComponent from "../../components/button.js";
import RegisterScreen from "../Register/register.js";
import app from "../../script.js";
import { checkEmail, checkPassword } from "../../common/validation.js";
import { loginWithEmailPassword } from "../../fireBase/authentication.js";
import { MainScreen } from "../Main/main.js";
class LoginScreen {
  $email;
  $password;

  $container;

  $link;

  $formLogin;
  $btnSubmit;
  $titleScreen;

  $labelSocial;
  $socials;
  $facebook;
  $imgFaceBook;
  $twitter;
  $google;

  constructor() {
    this.$container = document.createElement("div");
    this.$container.classList.add("div-container");

    this.$formLogin = document.createElement("form");
    this.$formLogin.classList.add("form-container");
    this.$formLogin.addEventListener("submit", this.handleSubmit);

    this.$titleScreen = document.createElement("div");
    this.$titleScreen.classList.add("big-title");
    this.$titleScreen.innerText = "LOGIN";

    this.$link = document.createElement("a");
    this.$link.classList.add("link");
    this.$link.innerText = "Create a new account";
    this.$link.addEventListener("click", this.handleChangeScreen);

    this.$labelSocial = document.createElement("span");

    this.$socials = document.createElement("div");

    this.$facebook = document.createElement("a");
    this.$imgFaceBook = document.createElement("img");
    this.$imgFaceBook.setAttribute("style", "width: 20px; height: 20px");
    this.$imgFaceBook.setAttribute("src", "../../../images/facebook.png");

    this.$twitter = document.createElement("a");
    this.$imgTwitter = document.createElement("img");
    this.$imgTwitter.setAttribute("style", "width: 20px; height: 20px");
    this.$imgTwitter.setAttribute("src", "../../../images/twitter.png");

    this.$google = document.createElement("a");
    this.$imgGoogle = document.createElement("img");
    this.$imgGoogle.setAttribute("style", "width: 20px; height: 20px");
    this.$imgGoogle.setAttribute("src", "../../../images/google.png");

    this.$labelSocial.innerHTML = "Or login with";

    this.$socials.classList.add("socials");

    this.$facebook.appendChild(this.$imgFaceBook);
    this.$facebook.href = "https://vi-vn.facebook.com/";

    this.$twitter.appendChild(this.$imgTwitter);
    this.$twitter.href = "https://twitter.com/i/flow/login";

    this.$google.appendChild(this.$imgGoogle);
    this.$google.href = "https://accounts.google.com/";

    this.$email = new InputComponent("Email", "email", " ", "email");
    this.$password = new InputComponent(
      "Password",
      "password",
      " ",
      "password"
    );

    this.$btnSubmit = new ButtonComponent("Log In", "submit", [
      "btn",
      "btn-primary",
      "d-block",
      "mt-3",
    ]);
  }

  handleChangeScreen = (e) => {
    e.preventDefault();
    // const app = document.getElementById('app');
    const signUp = new RegisterScreen();
    // app.innerHTML = '';
    // app.appendChild(register.render());
    app.changeActiveScreen(signUp);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target;
    let isError = false;

    // console.log('email', email.value, 'password', password.value);
    if (checkEmail(email.value) !== null) {
      // console.log('Email is Invalid!');
      this.$email.setError(checkEmail(email.value));
      isError = true;
    } else {
      this.$email.setError("");
    }
    if (checkPassword(password.value) !== null) {
      // console.log('Password is Invalid!');
      this.$password.setError(checkPassword(password.value));
      isError = true;
    } else {
      this.$password.setError("");
    }
    if (!isError) {
      console.log("Success!");
      const userLogin = await loginWithEmailPassword(
        email.value,
        password.value
      );
      const mainScreen = new MainScreen();
      app.changeActiveScreen(mainScreen);
    }
  };

  setLoading() {}

  render(appEle) {
    this.$formLogin.append(
      this.$titleScreen,
      this.$email.render(),
      this.$password.render(),
      this.$btnSubmit.render(),
      this.$link,
      this.$socials
    );
    this.$socials.append(
      this.$labelSocial,
      this.$facebook,
      this.$twitter,
      this.$google
    );
    this.$container.appendChild(this.$formLogin);

    appEle.appendChild(this.$container);
  }
}
export default LoginScreen;
