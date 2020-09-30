import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./combobox.twig";
import "./combobox.scss";
import {Ajax}             from "zengular-util";

@Brick.register('codex-input-combobox', twig)
@Brick.renderOnConstruct(false)
export default class ComboBox extends AbstractInputBrick {

	getValue() {
		if (this.options.multi) {
			let value = [];
			this.$$('item').each((item) => value.push(item.dataset.id));
			return value;
		} else {
			let value = null;
			value = this.$$('item')?.node?.dataset.id;
			return value;
		}
	}

	setValue(value) {
		this._value = value;
		let items = this.getItems(value).then(items => {
			this.renderItems(items);
		})
	}

	renderItems(items) {
		let html = ''
		items.forEach(item => {
			html += `<div data-id="${item.key}" (item)>${item.value}<i data-id="${item.key}" class="fal fa-times"></i></div>`;
		});
		this.$$('items').node.innerHTML = html;
	}

	getDefaultOptions() {
		return {
			url: '/',
			minchars: 3,
			multi: false,
			max: true
		};
	}

	onRender() {
		this.$$('items').listen('click', (event) => {
			if (event.target.tagName === 'I') {
				this.$$('item').filter('[data-id="' + event.target.dataset.id + '"]').node.remove();
			}
		});
		this.$$('options').listen('click', (event) => {
			if (event.target.classList.contains('option')) {
				this.addValue(event.target.dataset.id, event.target.innerHTML);
			}
		});
		this.$$('search').listen('input', (event, target) => {
			if (target.value.length >= this.options.minchars) {
				Ajax.get(this.options.url + 'search/' + target.value).getJson.then(
					(xhr) => {
						let html = '';
						let items = xhr.response;
						items.forEach(item => {
							html += `<div class="option" data-id="${item.key}">${item.value}</div>`;
						});
						this.$$('options').node.innerHTML = html;
					}
				)
			}
		});
	}

	addValue(key, value) {
		if (this.$$('item').filter('[data-id="' + key + '"]').nodes.length === 0) {
			if (!this.options.multi) this.$$('items').node.innerHTML = '';
			else {
				if (this.options.max !== true && this.$$('item').nodes.length === this.options.max) return;
			}
			if (!this.options.max && this.options.multi && this.$$('item').nodes.length === this.options.max) return;
			this.$$('items').node.innerHTML += `<div data-id="${key}" (item)>${value}<i data-id="${key}" class="fal fa-times"></i></div>`
		}
	}

	getItems(value) {
		if (typeof value === "undefined" || value === null || value.length === 0) return Promise.resolve([]);
		if (!Array.isArray(value)) value = [value];
		return Ajax.get(this.options.url + value.join(',')).getJson.then(
			(xhr) => {
				return (xhr.response);
			}
		)
	}

}
/*
import CustomElement  from "phlex-custom-element";
import twig           from "./combobox.twig";
import css            from "./combobox.scss";
import InputDecorator from "./inputs/InputDecorator";
import Ajax           from "phlex-ajax";

@CustomElement.register('px-input-combobox', {twig, css})
@InputDecorator
export default class extends CustomElement {

	static options = {
		url: '/',
		minchars: 3,
		multi: false,
		max: true
	};

	data = [];

	render() {
		if (this.options.multi === false) this.options.max = 1;
		super.render(this.options);
		this.attachEventHandlers();
	}

	get value() {
		if (this.options.multi === false) return this.data[0];
		return this.data;
	}

	set value(data) {
		if (this.options.multi === false) data = [data];
		for (let i in data) {
			if (data[i] !== null)
				this.data.push(data[i].toString());
		}
		this.renderValue();
	}

	attachEventHandlers() {
		if (!this.options.readonly)
			this.attachEventHandler('input[type=text]', 'input', (event, target) => {
				let optionsdiv = this.shadowRoot.querySelector('div.options');
				while (optionsdiv.firstChild) optionsdiv.removeChild(optionsdiv.firstChild);

				if (target.value.length >= this.options.minchars) {
					let url = this.options.url.replace('{{search}}', target.value);
					Ajax.request(url).get().promise().then((result) => {
						result.json.forEach(item => {
							item.key = item.key.toString();
							let div = document.createElement('div');
							div.innerHTML = item.value;
							div.dataset.key = item.key;
							optionsdiv.appendChild(div);
							if (this.data.indexOf(item.key) !== -1) {
								div.classList.add('exists');
							}
							div.addEventListener('click', event => {
								if (this.options.multi) {
									if (this.options.max === true || this.options.max > this.data.length) {
										if (this.data.indexOf(event.target.dataset.key) === -1) {
											this.data.push(event.target.dataset.key);
											this.renderValue();
											event.target.classList.add('exists');
										}
									}
								} else {
									this.data[0] = event.target.dataset.key;
									this.renderValue();
									event.target.classList.add('exists');
								}
							});

						});
					});
				}
			});
	}

	renderValue() {
		let valuesdiv = this.shadowRoot.querySelector('div.values');
		//while(valuesdiv.firstChild) valuesdiv.removeChild(valuesdiv.firstChild);

		if (this.data.length) {
			let url = this.options.url.replace('{{search}}', 'get/' + this.data);
			valuesdiv.querySelectorAll('div').forEach(div => {
				div.dataset.updated = 0;
			});

			Ajax.request(url).get().promise().then((result) => {
				result.json.forEach(item => {
					var div = valuesdiv.querySelector('div[data-key="3"]');
					if (div === null) {
						div = document.createElement('div');
						div.innerHTML = item.value;
						div.dataset.key = item.key;
						if (!this.options.readonly) {
							let i = document.createElement('i');
							i.classList.add('fal', 'fa-times');
							div.appendChild(i);
							i.addEventListener('click', event => {
								let key = event.target.parentNode.dataset.key;
								let index = this.data.indexOf(key);
								if (index > -1) {
									this.data.splice(index, 1);
									valuesdiv.removeChild(event.target.parentNode);
									let optiondiv = this.shadowRoot.querySelector('div.options div[data-key="' + key + '"]');
									if (optiondiv) optiondiv.classList.remove('exists');
								}
							});
						}
						valuesdiv.appendChild(div);
						div.dataset.updated = 1;
					}
					valuesdiv.querySelectorAll('[data-updated="0"]').forEach(div => {
						valuesdiv.removeChild(div);
					});
				});
			});
		}
	}

}
*/