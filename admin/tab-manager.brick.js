import {Brick}        from "zengular";
import twig           from "./tab-manager.twig";
import "./tab-manager.less";
import CodexAdminTab  from "./tab.brick";
import CodexAdminForm from "./form.brick";


@Brick.register('codex-admin-tab-manager', twig)
@Brick.registerSubBricksOnRender()
export default class CodexAdminTabManager extends Brick {

	onInitialize() {
		this.listen('TAB-SELECTED', event => { this.selectTab(event.source.controller);});
		this.listen('TAB-CLOSED', event => {this.removeTab(event.source);});
	}

	open(urlBase, id) {
		let tab = this.$(CodexAdminTab.selector + `[data-id="${id}"][data-type="${urlBase}"]`).node?.controller;
		if (!tab) {
			CodexAdminTab.create()
				.then(newTab => {
					tab = newTab;
					tab.root.dataset.id = id;
					tab.root.dataset.type = urlBase;
					tab.root.dataset.icon = 'fas fa-infinity';
					tab.root.dataset.label = '...';
					this.$$('tabs').node.appendChild(tab.root);
					return CodexAdminForm.create();
				})
				.then((form) => {
					tab.form = form;
					form.tab = tab;
					this.$$('forms').node.appendChild(form.root);
					form.load(id, urlBase);
					this.selectTab(tab);
				});
		} else this.selectTab(tab);
	}

	selectTab(tab) {
		this.$(CodexAdminTab.selector).filter('[data-selected=yes]', tab => tab.dataset.selected = 'no');
		tab.root.dataset.selected = 'yes';
		this.$(CodexAdminForm.selector).filter('.visible', element => element.classList.remove('visible'));
		tab.form.root.classList.add('visible');
	}

	removeTab(tab) {
		if (tab.dataset.selected === 'yes') {
			if (tab.nextElementSibling !== null) {
				this.selectTab(tab.nextElementSibling.controller);
			} else if (tab.previousElementSibling !== null) {
				this.selectTab(tab.previousElementSibling.controller);
			}
		}
		tab.controller.form.root.remove();
		tab.remove();
	}

}

