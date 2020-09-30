import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./select.twig";
import "./select.less";

@Brick.register('codex-input-select', twig)
@Brick.renderOnConstruct(false)
export default class InputSelect extends AbstractInputBrick {

	getValue() { return this.$$("input-element").node.value;}

	setValue(value) {
		if(value === null) value = '';
		this.$$("input-element").node.value = value;
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