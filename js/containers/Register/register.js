import InputComponent from "../../components/input.js";
import ButtonComponent from "../../components/button.js";
import LoginScreen from "../Login/login.js";
import CheckEmailScreen from "../CheckEmail/checkEmail.js";
import app from "../../script.js";
import { checkEmail, checkPassword } from "../../common/validation.js";
import { createNewAccount } from "../../fireBase/authentication.js";
class RegisterScreen {
  $email;
  $password;
  $rePassword;

  $container;

  $link;

  $formLogin;
  $btnSubmit;
  $titleScreen;

  constructor() {
    this.$container = document.createElement("div");
    this.$container.classList.add("div-container");

    this.$formLogin = document.createElement("form");
    this.$formLogin.classList.add("form-container");
    this.$formLogin.addEventListener("submit", this.handleSubmit);

    this.$titleScreen = document.createElement("div");
    this.$titleScreen.classList.add("big-title");
    this.$titleScreen.innerText = "CREATE A NEW ACCOUNT";

    this.$link = document.createElement("a");
    this.$link.classList.add("d-block", "link");
    this.$link.innerText = `I've already had an account`;
    this.$link.addEventListener("click", this.handleChangeScreen);

    this.$email = new InputComponent("Email", "email", " ", "email");
    this.$password = new InputComponent(
      "Password",
      "password",
      " ",
      "password"
    );
    this.$rePassword = new InputComponent(
      "Retype Password",
      "rePassword",
      " ",
      "password"
    );

    this.$btnSubmit = new ButtonComponent("Create", "submit", [
      "btn",
      "btn-primary",
      "d-block",
      "mt-3",
    ]);
  }

  handleChangeScreen = (e) => {
    e.preventDefault();
    const login = new LoginScreen();
    // const app = document.getElementById('app');
    // app.innerHTML = '';
    // app.appendChild(login.render());
    app.changeActiveScreen(login);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rePassword } = e.target;
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

    if (checkPassword(rePassword.value) !== null) {
      // console.log('Password is Invalid!');
      this.$rePassword.setError(checkPassword(rePassword.value));
      isError = true;
    } else if (password.value !== rePassword.value) {
      this.$rePassword.setError("Your passwords are not match!!");
      isError = true;
    } else {
      this.$rePassword.setError("");
    }

    if (!isError) {
      console.log("Success!");
      await createNewAccount(email.value, password.value);
      const checkScreen = new CheckEmailScreen();
      app.changeActiveScreen(checkScreen);
    }
  };
  render(appEle) {
    this.$formLogin.append(
      this.$titleScreen,
      this.$email.render(),
      this.$password.render(),
      this.$rePassword.render(),
      this.$btnSubmit.render(),
      this.$link
    );
    this.$container.appendChild(this.$formLogin);
    appEle.appendChild(this.$container);
  }
}
export default RegisterScreen;
