import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./date.twig";
import "./date.less";

@Brick.register('codex-input-date', twig)
export default class InputDate extends AbstractInputBrick {
	getValue() { return  this.$$('input-element').node.value;}
	setValue(value) { this.$$("input-element").node.value = value;}
}
