import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./fa-icon.twig";
import "./fa-icon.scss";

@Brick.register('codex-input-fa-icon', twig)
export default class InputString extends AbstractInputBrick {
	getValue() {
		let style = this.$$("style").node.value;
		let icon = 'fa-' + this.$$("input-element").node.value;
		return style + ' ' + icon;
	}

	setValue(value) {
		if (value) {
			value = value.split(' ');
			let style = value[0];
			let icon = value[1].substr(3);
			this.$$("style").node.value = style;
			this.$$("input-element").node.value = icon;
			this.setIcon();
		}
	}

	onRender() {
		this.$$("input-element").listen('input', () => this.setIcon());
		this.$$("style").listen('input', () => this.setIcon());
	}

	setIcon(data) {
		let classList = this.$$('icon').node.classList;
		while (classList.length > 0) {
			classList.remove(classList.item(0));
		}
		let style = this.$$('style').node.value;
		let icon = this.$$('input-element').node.value;
		classList.add(style);
		try {
			if (icon) classList.add('fa-' + icon);
		} catch (e) {}
	}
}