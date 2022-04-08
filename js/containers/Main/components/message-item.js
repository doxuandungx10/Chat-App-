class MessageItem {
	$container;

	$author;

	$subContainer;
	$content;
	$avatar;
	constructor(messageData) {
		this.$container = document.createElement('div');
		this.$container.classList.add('msg-item-container', 'd-flex');

		this.$author = document.createElement('div');
		this.$author.classList.add('author-item', 'd-flex');
		this.$author.innerText = messageData.sender;

		this.$subContainer = document.createElement('div');
		this.$subContainer.classList.add('msg-item-sub-container', 'd-flex');

		this.$content = document.createElement('div');
		this.$content.classList.add('content-item', 'd-flex');
		this.$content.innerText = messageData.content;

		this.$avatar = document.createElement('div');
		this.$avatar.classList.add('avatar-item', 'd-flex');

		this.$avatar.style.backgroundImage = messageData.avatar
			? `url(${messageData.avatar})` //this ? is equal to IF
			: `url(https://bonchon.com.vn/sites/all/themes/giaidieu/images/anonymous.jpg)`; // and this is ELSE

		if (messageData.isAuth) {
			this.$container.classList.add('msg-item-right');
			this.$content.classList.add('ngPink');
		}
	}
	render() {
		this.$container.append(
			this.$author,
			this.$subContainer,
			this.$avatar,
			this.$content
		);
		return this.$container;
	}
}
export default MessageItem;
