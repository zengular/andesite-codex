import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./string.twig";
import "./string.less";

@Brick.register('codex-input-string', twig)
@Brick.registerSubBricksOnRender()
export default class InputString extends AbstractInputBrick {
	getValue() { return this.$$('input-element').node.value;}
	setValue(value) { this.$$("input-element").node.value = value;}
}