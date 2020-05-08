import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./checkboxes.twig";
import "./checkboxes.less";

@Brick.register('codex-input-checkboxes', twig)
@Brick.registerSubBricksOnRender()
@Brick.renderOnConstruct(false)

export default class InputCheckboxes extends AbstractInputBrick {

	getValue() {
		let checked = [];
		this.$$('input-element').nodes.forEach(input => this.checkInput(input, checked));
		return checked;
	}

	checkInput(input, array) {
		if (input.checked === true) {
			array.push(input.value);
		}
	}

	setValue(data) {
		//this.$$("input-element").each(input => input.removeAttribute("checked"));
		if(data instanceof Array) data.forEach(value=>{
			this.$$("input-element").filter('[value="'+value+'"]').node.checked = true;
		});
	}

	checkValue(input, line) {if (line.value === input) line.checked = true; }

	preprocessOptions(options) {
		if (!(options.options instanceof Array)) {
			let opts = [];
			for (let value in options.options) if (options.options.hasOwnProperty(value)) opts.push({
				value: value,
				label: options.options[value]
			});
			options.options = opts;
		}
		return options;
	}


}