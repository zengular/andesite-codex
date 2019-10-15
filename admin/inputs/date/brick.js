import Brick         from "zengular/core/brick";
import twig          from "./template.twig";
import "./style.less";
import Input         from "../input";
import datetimeLocal from "zengular/util/datetime-local";

@Brick.register('codex-input-date', twig)
@Brick.registerSubBricksOnRender()

export default class InputDate extends Input {
	getValue() { let value = this.$$('input-element').node.value;}
	setValue(value) { this.$$("input-element").node.value = value;}
}
