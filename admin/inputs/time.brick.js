import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./time.twig";
import "./time.less";

@Brick.register('codex-input-time', twig)
@Brick.registerSubBricksOnRender()
export default class InputTime extends AbstractInputBrick {
	getValue() {  return this.$$('input-element').node.value;}
	setValue(value) {
		//if(value === null) value = '00:00:00';
		if(typeof value === "string" && value.length === 5) value = value + ':00';
		this.$$("input-element").node.value = value;
	}
}
