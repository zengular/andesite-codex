import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./checkbox.twig";
import "./checkbox.less";

@Brick.register('codex-input-checkbox', twig)
export default class InputCheckbox extends AbstractInputBrick {
	getValue() {return this.$$('input-element').node.checked;}
	setValue(value) {this.$$('input-element').node.checked = value;}
}