import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./show.twig";
import "./show.less";

@Brick.register('codex-input-show', twig)
export default class InputString extends AbstractInputBrick {
	getValue() { return this._value;}
	setValue(value) {
		this.$$('show').node.innerHTML = value;
		this._value = value;
	}
}