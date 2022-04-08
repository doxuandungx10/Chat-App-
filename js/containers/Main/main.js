import Composer from './components/composer.js';
import MessageList from './components/message-list.js';
import sideBarComponent from './components/sidebar.js';

export class MainScreen {
	$container;

	$paper;

	$sidebarComponent;

	$chatContainer;
	$messageList;
	$composer;

	$activeConversation = null;
	constructor() {
		this.$container = document.createElement('div');
		this.$container.classList.add('main', 'd-flex');

		this.$paper = document.createElement('div');
		this.$paper.classList.add('chat-paper');

		this.$chatContainer = document.createElement('div');
		this.$chatContainer.classList.add('chat-container', 'd-flex');

		this.$sidebarComponent = new sideBarComponent(this.setActiveConversation);
	}

	setActiveConversation = (conversation) => {
		if (
			this.$activeConversation &&
			this.$activeConversation.id === conversation.id
		) {
			return;
		}
		if (this.$messageList) {
			this.$messageList.unMount();
		}
		if (this.$composer) {
			this.$composer.unMount();
		}
		this.$activeConversation = conversation;

		this.$chatContainer.innerHTML = '';

		this.$messageList = new MessageList(conversation);
		this.$composer = new Composer(conversation);
		this.$chatContainer.append(
			this.$messageList.render(),
			this.$composer.render()
		); // We append msgList and Composer in here because we can not render this 2 component below
	}; // We render msgList and composer here so everytime we click on a conversation, it will re-render that chat data only

	render(appEle) {
		appEle.appendChild(this.$container);

		this.$container.append(this.$paper);
		this.$sidebarComponent.render(this.$paper);

		this.$paper.append(this.$chatContainer);
	}
}
