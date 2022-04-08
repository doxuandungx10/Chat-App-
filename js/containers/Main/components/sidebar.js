import { checkName } from "../../../common/validation.js";
import SidebarItem from "./sidebar-item.js";
import * as _noti from "../../../common/notify.js";
import {
  confirmAddUserByEmail,
  createConversation,
  deleteConversation,
  updateConversation,
} from "../../../fireBase/store.js";
import db from "../../../fireBase/fireBase.js";
import { getCurrentUser } from "../../../fireBase/authentication.js";

class sideBarComponent {
  $container;

  $title;
  $buttonCreate;
  $buttonLogOut;
  $modal;

  $listContainer;

  // $listItems = [];
  $objectItems = {}; //Instead of putting the data into an array, we put it in an object

  $updateConversation;

  $callBackActive;

  constructor(callBackActive) {
    this.$callBackActive = callBackActive;

    this.$container = document.createElement("div");
    this.$container.classList.add("sidebar-container", "d-flex");

    this.$title = document.createElement("div");
    this.$title.classList.add("sidebar-title");
    this.$title.innerText = "Chat App";

    this.$buttonCreate = document.createElement("div");
    this.$buttonCreate.classList.add("btn-create");
    this.$buttonCreate.setAttribute("data-bs-toggle", "modal");
    this.$buttonCreate.setAttribute("data-bs-target", "#conversationModal");
    this.$buttonCreate.innerText = "+";
    this.$buttonCreate.addEventListener("click", this.resetDataModal);

    this.$listContainer = document.createElement("div");
    this.$listContainer.classList.add("cs-list");

    this.$buttonLogOut = document.createElement("button");
    this.$buttonLogOut.classList.add("btn-logout");
    this.$buttonLogOut.innerHTML = "Log Out";
    this.$buttonLogOut.addEventListener("click", this.handleLogOut);

    this.renderModal();
    this.setUpConversationListener();
  }

  handleUpdateCon = (currentUpdateCon) => {
    this.$updateConversation = currentUpdateCon; //Here we get the whole item object out and take the name only to set a new name for the modal
    const titleModal = document.getElementById("modalTittle");
    const btnSubmitModal = document.getElementById("btn-create-converstation");
    if (titleModal) {
      titleModal.innerText = currentUpdateCon.name;
    }
    if (btnSubmitModal) {
      btnSubmitModal.setAttribute("id-update", currentUpdateCon.id);
    }

    this.$buttonCreate.click();
  };
  handleDeleteCon = (id, name) => {
    _noti.confirm(
      `Are you sure you want to delete ${name}`,
      "Your file has been deleted",
      () => deleteConversation(id)
    );
  };

  handleAddCon = async (item) => {
    try {
      const response = await confirmAddUserByEmail(item);
    } catch (error) {
      _noti.error(error.code, error.message);
    }
  };
  // TODO:
  handleActiveCon = (item) => {
    this.$callBackActive(item);
  };

  setUpConversationListener() {
    const user = getCurrentUser();
    db.collection("conversations")
      .where("users", "array-contains", user.email)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // console.log(change.doc.data());

            const newConversation = {
              ...change.doc.data(),
              id: change.doc.id,
            };
            const addedConversation = new SidebarItem(
              newConversation,
              this.handleAddCon,
              this.handleUpdateCon,
              this.handleDeleteCon,
              this.handleActiveCon
            );

            // this.$listItems.push(addedConversation); //we dont need to render() here because the addedConversation is an object that we push inside the array
            this.$objectItems[change.doc.id] = addedConversation;
            this.$listContainer.append(addedConversation.render()); //we do this so every time we new that SidebarItem(), we push the doc.data in already
          }
          if (change.type === "modified") {
            //Every time we make change, which firebase recognize this action is MODIFIED, it will send us back the data we changed
            //And this data will be caught by this setUpConversationListener() function
            //But we need the old data because we only update it in, before that we have already saved them in that listItems[] or the objectItems{}
            console.log(change.doc.data());
            console.log("something2");

            // const updatedConversation = this.$listItems.find(
            // (item) => item.$id === change.doc.id
            // );
            // // Here we find the item of which id is identical to the firebase id
            // //	Then we fetch it out
            if (this.$objectItems[change.doc.id]) {
              // I changed it to object[value] so that we dont have to use find() function of the array
              this.$objectItems[change.doc.id].setUpData(
                {
                  ...change.doc.data(),
                  id: change.doc.id,
                },
                this.handleAddCon,
                this.handleUpdateCon,
                this.handleDeleteCon,
                this.handleActiveCon
              );
            }
          }
          if (change.type === "removed") {
            this.$objectItems[change.doc.id].unMount();
          }
        });
      });
  }

  renderModal() {
    this.$modal = document.createElement("div");
    this.$modal.classList.add("modal", "fade");
    this.$modal.setAttribute("id", "conversationModal");
    this.$modal.setAttribute("tabindex", "-1");
    this.$modal.setAttribute("aria-labelledby", "conversationModal");
    this.$modal.setAttribute("aria-hidden", "true");

    this.$modal.innerHTML = `
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
				<h5 class="modal-title" id="modalTittle">Create new conversation</h5>
				<button id="btn-icon-close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
				<div class="title">
					Name<span class="caution">*</span>
				</div>
				<div class="input-group mb-3">
					<input id="name-conversation" type="text" class="form-control modal-input " placeholder="New conversation" aria-label="new_conversation" aria-describedby="basic-addon1">
				</div>
				<div class="title">
					Image url
				</div>
				<div class="input-group mb-3">
					<input id="img-conversation" type="text" class="form-control modal-input " placeholder="Avatar..." aria-label="new_conversation" aria-describedby="basic-addon1">
				</div>
				</div>
				<button id="btn-close-modal" type="button" class="btn btn-secondary d-none" data-bs-dismiss="modal">Close</button>
				<div class="modal-footer" id="modal-footer">
					<button id="btn-create-converstation" type="button" class=" btn-linear">Save changes</button>
				</div>
			</div>
		</div>
		`;
  }

  handleClose = () => {
    const buttonClose = document.getElementById("btn-icon-close");
    const name = document.getElementById("name-conversation");
    const imageURL = document.getElementById("img-conversation");

    name.value = "";
    imageURL.value = "";

    this.$updateConversation = null;

    const titleModal = document.getElementById("modalTittle");
    const btnSubmitModal = document.getElementById("btn-create-converstation");

    titleModal.innerText = "Create New Conversation";
    if (btnSubmitModal.hasAttribute("id-update")) {
      btnSubmitModal.removeAttribute("id-update");
    }

    buttonClose.click(); //Here, we reset the titleModal to 'Create New Conversation' only when we click to the close button
    // While we need the titleModal resetting itself when we click outside the modal
  };

  handleSubmit = async () => {
    try {
      const name = document.getElementById("name-conversation");
      const imageURL = document.getElementById("img-conversation");
      const btnSubmitModal = document.getElementById(
        "btn-create-converstation"
      );

      const user = getCurrentUser();

      console.log(name.value, imageURL.value);

      if (checkName(name.value)) {
        _noti.warning("Conversation name", checkName(name.value));
        return;
      }

      if (btnSubmitModal.hasAttribute("id-update")) {
        await updateConversation(
          this.$updateConversation.id,
          name.value,
          imageURL.value,
          this.$updateConversation.users,
          this.$updateConversation.creator
        );
      } else {
        await createConversation(
          name.value,
          imageURL.value,
          [user.email],
          user.email
        );
      }

      this.handleClose();
    } catch (error) {
      _noti.error(error.code, error.message);
    }
  };

  render(parentContainer) {
    parentContainer.append(this.$container);
    this.$container.append(
      this.$title,
      this.$buttonCreate,
      this.$listContainer,
      this.$modal, //for this modal, we can put it anywhere in render
      this.$buttonLogOut
    );

    document
      .getElementById("btn-create-converstation")
      .addEventListener("click", this.handleSubmit);

    document
      .getElementById("btn-icon-close")
      .addEventListener("click", this.handleClose);
  }

  handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch(() => {});
  };
}
export default sideBarComponent;
