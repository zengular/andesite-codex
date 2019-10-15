import Brick         from "zengular/core/brick";
import twig          from "./template.twig";
import "./style.less";
import Input         from "../input";
import datetimeLocal from "zengular/util/datetime-local";


@Brick.register('codex-input-datetime', twig)
@Brick.registerSubBricksOnRender()

export default class InputDatetime extends Input {

	getValue() {
		let value = this.$$('input-element').node.value;
		return datetimeLocal(value, true, true);

	}
	setValue(value) {
		value = datetimeLocal(value, true);
		this.$$("input-element").node.value = value;
	}

}
