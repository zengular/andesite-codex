import AbstractInputBrick from "zengular-codex/admin/inputs/~abstract-input-brick";
import {Brick}            from "zengular";
import twig               from "./code.twig";
import "./code.less";
import * as  indentation  from 'indent-textarea';

@Brick.register('codex-input-code', twig)
export default class InputCode extends AbstractInputBrick {
	getDefaultOptions() { return {rows: 5}}
	getValue() { return this.$$("input").node.value;}
	setValue(value) {this.$$("input").node.value = value;}
	onRender() {
		indentation.watch(this.$$("input").node);
	}
}