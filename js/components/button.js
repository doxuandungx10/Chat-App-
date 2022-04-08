class ButtonComponent {
	$btn;

	constructor(text, type, classList, callBack) {
		this.$btn = document.createElement('button');
		this.$btn.classList.add(...classList);
		this.$btn.type = type;
		this.$btn.innerText = text;
		if (callBack) {
			this.$btn.addEventListener('click', callBack);
		}
	}
	render() {
		return this.$btn;
	}
}
export default ButtonComponent;
