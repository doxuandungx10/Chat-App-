// <<<<<<< HEAD
import ButtonComponent from "../../../components/button.js";
import * as _noti from "../../../common/notify.js";
import { sendMessage } from "../../../fireBase/store.js";
import { getCurrentUser } from "../../../fireBase/authentication.js";
class Composer {
  $container;

  $inputMessage;
  $buttonSend;

  $activeConversation;
  constructor(cons) {
    this.$activeConversation = cons;

    this.$container = document.createElement("form");
    this.$container.classList.add("composer-container", "d-flex");
    this.$container.addEventListener("submit", this.handleSendMessage);

    this.$inputMessage = document.createElement("input");
    this.$inputMessage.classList.add("grow-1");
    this.$inputMessage.placeholder = "Enter your message...";
    this.$inputMessage.type = "text";
    this.$inputMessage.name = "contentMsg";

    this.$buttonSend = new ButtonComponent("Send", "submit", [
      "btn",
      "btn-primary",
      "d-block",
      "sendBtn",
    ]);
  }

  unMount = () => {
    this.$container.remove();
  };

  handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      if (this.$activeConversation) {
        const { value } = e.target.contentMsg;
        const user = getCurrentUser();
        const info = JSON.parse(localStorage.getItem("auth-info"));
        this.$inputMessage.value = "";
        await sendMessage(
          user.email,
          value,
          this.$activeConversation.id,
          info.imageUrl || ""
        );
      }
    } catch (error) {
      _noti.error(error.code, error.message);
    }
  };

  render() {
    this.$container.append(this.$inputMessage, this.$buttonSend.render());
    return this.$container;
  }
}

export default Composer;
