import {Brick} from "zengular";
import twig  from "./content.twig";
import "./content.less";

@Brick.register('codex-layout-content', twig)
export default class CodexLayoutContentBrick extends Brick {

	onRender() {
		this.typeofBrick = null;
		this.brick = null;
	}

	show(typeofBrick, data) {
		if (this.typeofBrick !== typeofBrick) {
			this.typeofBrick = typeofBrick;
			this.clearContent();
			typeofBrick.create()
			.then(brick => {
				this.brick = brick;
				this.root.appendChild(this.brick.root);
				this.brick.route(data);
			})
		} else this.brick.route(data);
	}
}