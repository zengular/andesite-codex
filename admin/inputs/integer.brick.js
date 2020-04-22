import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./integer.twig";
import "./integer.less";

@Brick.register('codex-input-integer', twig)
@Brick.registerSubBricksOnRender()

export default class InputInteger extends AbstractInputBrick {

	getValue() {
		let value = parseInt(this.$$('input-element').node.value);
		if (isNaN(value)) value = 0;
		return value;
	}

	setValue(value) {
		value = parseInt(value);
		if (isNaN(value)) value = 0;
		this.$$("input-element").node.value = value;
	}

	onRender() {
		this.$$('input-element').listen('input', event => {
			event.target.value = this.getValue();
		})
	}

}