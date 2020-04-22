import {Application} from "zengular";
import CodexFormFrame from "./admin/frame.brick";
import {Ajax}         from "zengular-util";

import "./frame/layout.brick";
import "zengular-codex/admin/~loader";
import "zengular-codex/plugins/~loader";


export default class AdminApplication extends Application {

	constructor() {
		super(false, true);
	}

	initialize() {
		this.listen('layout-rendered', (event) => {
			this.layout = event.data.layout;
			this.run();
		});
		return Ajax.get('/menu').getJson
			.then((xhr) => this.menu = xhr.response);
	}

	run() {
		this.layout.menu.addMenu(this.menu);
		this.listen('SHOW-FORM', (event) => this.menuEventHandler(event));
	}

	addMenus(menu) {
		for (let option in menu) {
			let menuItem = menu[option];
			menuItem.option = option;
			this.layout.menu.addMenuItem(menuItem.label, option, menuItem.icon);
		}
	}

	menuEventHandler(event) {
		this.layout.content.show(CodexFormFrame, event.data);
	}

};
