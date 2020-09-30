import {Brick}                 from "zengular";
import twig                    from "./layout.twig";
import "./layout.less";
import CodexLayoutMenuBrick    from "./menu.brick";
import CodexLayoutContentBrick from "./content.brick";

@Brick.register('codex-layout', twig)
export default class CodexLayoutBrick extends Brick {

	onInitialize() {
	}

	createViewModel() {
		return {
			title: this.dataset.title ? this.dataset.title : "Eternity Codex II",
			icon: this.dataset.icon ? this.dataset.icon : "fas fa-infinity",
			user: this.dataset.user,
			avatar: this.dataset.avatar
		}
	}

	onRender() {
		this.menu = this.$(CodexLayoutMenuBrick.selector).node.controller;
		this.content = this.$(CodexLayoutContentBrick.selector).node.controller;
		this.fire('layout-rendered', {layout: this});
		this.listen('hide-overlay', () => this.hideOverlay());
		this.listen('show-overlay', () => this.showOverlay());
	}

	showOverlay() { this.$$('overlay').node.classList.add('visible');}
	hideOverlay() { this.$$('overlay').node.classList.remove('visible');}
}