import Brick from "zengular/core/brick";
import twig  from "./template.twig";
import "./style.less";
import Input from "../input";

@Brick.register('codex-input-select', twig)
@Brick.registerSubBricksOnRender()
@Brick.renderOnConstruct(false)

export default class InputSelect extends Input {

	getValue() { return this.$$("input-element").node.value;}
	setValue(value) { this.$$("input-element").node.value = value;}
	preprocessOptions(options) {
		if (!(options.options instanceof Array)) {
			let opts = [];
			for (let value in options.options) opts.push({value: value, label: options.options[value]});
			options.options = opts;
		}
		return options;
	}

}