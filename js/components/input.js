class InputComponent {
	$container;
	$label;
	$input;

	$error;

	constructor(label, name, placeholder, type) {
		this.$container = document.createElement('div');
		this.$container.classList.add('text', 'd-flex', 'flex-wrap', 'mt-4');

		this.$label = document.createElement('label');
		this.$label.classList.add('col-4', 'label');
		this.$label.innerText = label;

		this.$input = document.createElement('input');
		this.$input.classList.add('input');
		this.$input.type = type;
		this.$input.placeholder = placeholder;
		this.$input.name = name;

		this.$error = document.createElement('div');
		this.$error.classList.add('error', 'mt-2', 'd-none');
	}
	setError(message) {
		this.$error.innerText = message;
		this.$error.classList.remove('d-none');
		this.$error.classList.add('d-block');
	}

	setAttribute(name, value) {
		this.$input.setAttribute(name, value);
	}

	setEventListener(event, callbackFunction) {
		this.$input.addEventListener(event, callbackFunction);
	}

	render() {
		this.$container.append(this.$input, this.$label, this.$error);

		return this.$container;
	}
}

export default InputComponent;
