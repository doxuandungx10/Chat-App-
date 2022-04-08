import MessageItem from './message-item.js';
import { getCurrentUser } from '../../../fireBase/authentication.js';
import db from '../../../fireBase/fireBase.js';

class MessageList {
	$container;

	$title;

	$listItem;

	$activeConversation;
	constructor(cons) {
		this.$activeConversation = cons;

		this.$container = document.createElement('div');
		this.$container.classList.add('message-container', 'd-flex');

		this.$title = document.createElement('div');
		this.$title.classList.add('list-title');
		this.$title.innerText = cons.name;

		this.$listItem = document.createElement('div');
		this.$listItem.classList.add('list-container', 'd-flex');

		this.setUpConversationListener();
	}

	setUpConversationListener() {
		const user = getCurrentUser();
		db.collection('message')
			.where('conversationId', '==', this.$activeConversation.id)
			.orderBy('sendAt')
			.onSnapshot((snapshot) => {
				console.log(snapshot.docChanges());
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						const msgFb = change.doc.data();
						const msgEle = new MessageItem({
							...msgFb,
							isAuth: msgFb.sender === user.email,
						});
						this.$listItem.append(msgEle.render());
					} //We only need added change type to update messages
				});
			});
	}

	unMount = () => {
		this.$container.remove();
	};

	render() {
		// const item = new Array(10).fill(1).map(() => new MessageItem().render());
		// this.$listItem.append(...item);
		this.$container.append(this.$title, this.$listItem);
		return this.$container;
	}
}

export default MessageList;
