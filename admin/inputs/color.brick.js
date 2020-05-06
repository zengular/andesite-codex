import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./color.twig";
import "./color.scss";

@Brick.register('codex-input-color', twig)
@Brick.registerSubBricksOnRender()
export default class InputString extends AbstractInputBrick {
	getValue() { return this.$$('input-element').node.value;}
	setValue(value) { this.$$("input-element").node.value = value;}
}