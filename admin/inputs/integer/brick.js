import Brick from "zengular/core/brick";
import twig  from "./template.twig";
import "./style.less";
import Input from "../input";

@Brick.register('codex-input-integer', twig)
@Brick.registerSubBricksOnRender()

export default class InputInteger extends Input {

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