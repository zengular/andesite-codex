import Brick from "zengular/core/brick";
import twig  from "./template.twig";
import "./style.less";
import Input from "../input";

@Brick.register('codex-input-float', twig)
@Brick.registerSubBricksOnRender()

export default class InputInteger extends Input {

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