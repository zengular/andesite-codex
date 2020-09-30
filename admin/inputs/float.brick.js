import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./float.twig";
import "./float.less";

@Brick.register('codex-input-float', twig)
export default class InputInteger extends AbstractInputBrick {

	getValue() {
		let value = parseFloat(this.$$('input-element').node.value);
		if (isNaN(value)) value = 0;
		return value;
	}

	setValue(value) {
		value = parseFloat(value);
		if (isNaN(value)) value = 0;
		if (value % 1 === 0) value += '.0';
		this.$$("input-element").node.value = value;
	}

	onRender() {
		this.$$('input-element').listen('input', event => {
			let value = this.getValue();
			if (value % 1 === 0) value += '.0';
			event.target.value = value;
		})
	}
}