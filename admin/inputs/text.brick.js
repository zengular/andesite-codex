import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./text.twig";
import "./text.less";

@Brick.register('codex-input-text', twig)
@Brick.registerSubBricksOnRender()

export default class InputText extends AbstractInputBrick {
	getDefaultOptions() { return {rows: 5}}
	getValue() { return this.$$("input").node.value;}
	setValue(value) {this.$$("input").node.value = value;}
}