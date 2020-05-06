import Plugin from "../plugin";

export default class FormButtonPlugin extends Plugin {
	static get pluginType() {return "FormButtonPlugin"; }

	constructor(form){
		super();
		this.form = form;
	}

	createButton(){
		let button = document.createElement('span');
		button.classList.add(...this.icon.split(' '));
		button.dataset.label = this.label;
		if (this.color) button.style.color = this.color;
		button.addEventListener('click', event => this.action(event));
		return button;
	}

	get label() { return 'Button';}
	get icon() { return 'fas fa-infinity';}

	action(event){console.log('button pressed');}

}
