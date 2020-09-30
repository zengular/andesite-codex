import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./datetime.twig";
import "./datetime.less";
import {datetimeLocal}    from "zengular-util";


@Brick.register('codex-input-datetime', twig)
export default class InputDatetime extends AbstractInputBrick {

	getValue() {
		let value = this.$$('input-element').node.value;
		return datetimeLocal(value, true, true);

	}
	setValue(value) {
		value = datetimeLocal(value, true);
		this.$$("input-element").node.value = value;
	}

}
