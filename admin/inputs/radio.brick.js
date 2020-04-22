import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./radio.twig";
import "./radio.less";

@Brick.register('codex-input-radio', twig)
@Brick.registerSubBricksOnRender()
@Brick.renderOnConstruct(false)
export default class InputRadio extends AbstractInputBrick {

	getValue() {
		let value = null;
		return this.$$('input-element').filter(':checked').node?.value;
	}

	setValue(value) {
		this.$$("input-element").each(input => {input.removeAttribute("checked")});
		if (value) this.$$("input-element").filter(`[value=${value}]`).node.checked = true;
	}

	preprocessOptions(options) {
		if (!(options.options instanceof Array)) {
			let opts = [];
			for (let value in options.options) opts.push({value: value, label: options.options[value]});
			options.options = opts;
		}
		return options;
	}

}