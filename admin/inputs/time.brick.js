import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./time.twig";
import "./time.less";

@Brick.register('codex-input-time', twig)
@Brick.registerSubBricksOnRender()
export default class InputTime extends AbstractInputBrick {
	getValue() {  return this.$$('input-element').node.value;}
	setValue(value) {
		if(value.length === 5) value = value + ':00';
		console.log(value)
		this.$$("input-element").node.value = value;
	}
}
