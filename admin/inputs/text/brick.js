import Brick from "zengular/core/brick";
import twig  from "./template.twig";
import "./style.less";
import Input from "../input";

@Brick.register('codex-input-text', twig)
@Brick.registerSubBricksOnRender()

export default class InputText extends Input {
	getDefaultOptions() { return {rows: 5}}
	getValue() { return this.$$("input").node.value;}
	setValue(value) {this.$$("input").node.value = value;}
}