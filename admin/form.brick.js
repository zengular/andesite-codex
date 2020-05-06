import {Brick} from "zengular";

import twig from "./form.twig";
import "./form.less";

import {Ajax} from "zengular-util";

import pluginManager    from "../plugin/plugin-manager";
import FormButtonPlugin from "../plugin/types/FormButtonPlugin";
import AjaxErrorHandler from "./ajax-error-handler";

@Brick.register('codex-admin-form', twig)
@Brick.registerSubBricksOnRender()
export default class CodexAdminForm extends Brick {

	onInitialize() {
		this.sections = [];
		this.plugins = [];
		this.data = {};
		this.id = null;
		this.attachmentCategories = [];
	}

	createViewModel() {
		return {
			sections: this.sections,
			label: this.label,
			icon: this.icon,
			id: this.data.id
		}
	}

	load(id = null, urlBase = null) {
		if (urlBase !== null) this.urlBase = urlBase;
		if (id !== null) this.id = id;

		this.fire('show-overlay');
		Ajax.get('/' + this.urlBase + '/get-form-item/' + (this.id === null ? 'new' : this.id)).getJson
			.then(xhr => AjaxErrorHandler.handle(xhr, () => {this.tab.close();}))
			.then(xhr => {
				let result = xhr.response;
				this.label = result.data.fields[result.descriptor.labelField];
				this.label = this.label ? this.label : 'new';
				this.icon = result.descriptor.formIcon;
				this.attachmentCategories = result.descriptor.attachmentCategories;
				this.plugins = result.descriptor.plugins ? result.descriptor.plugins : [];
				this.tab.root.dataset.icon = result.descriptor.tabIcon;
				this.tab.root.dataset.label = this.label;
				this.tab.root.dataset.id = this.id;
				this.data = result.data;
				this.sections = result.descriptor.sections;
				this.render();
			})
			.finally(() => {
				this.fire('hide-overlay');
			});
	}

	onRender() {
		let promises = [];
		this.sections.forEach(section => section.inputs.forEach(input => {
			promises.push(
				this.$$('input').filter(`[data-name=${input.field}`).node.controller.setOptions(input.options)
					.then(inputBrick => {
						if (this.data.fields.hasOwnProperty(input.field)) {
							inputBrick.setItemId(this.data.id);
							inputBrick.setValue(this.data.fields[input.field]);
						}
					})
			);
		}));
		Promise.all(promises)
			.then(() => {
				let plugins = pluginManager.get(this.plugins, FormButtonPlugin, this);
				plugins.forEach(plugin => {
					let button = plugin.createButton();
					if (button) this.$$('buttons').node.appendChild(button);
				});
			});
	}

	collectFieldData() {
		let data = {};
		this.$$('input').each(input => data[input.dataset.name] = input.controller.value);
		return data;
	}

	reloadList() { this.fire('RELOAD-LIST', {urlBase: this.urlBase});}

	showValidationMessages(errors) {
		errors.forEach(error => {
			let message = document.createElement('div');
			message.innerHTML = '<span class="field">' + error.field + '</span><span class="message">' + error.message + '</span>';
			if (this.$$('error').filter('[data-name="' + error.field + '"]').nodes.length) {
				this.$$('error').filter('[data-name="' + error.field + '"]').node.appendChild(message);
			}else{
				this.$$('common-error').node.appendChild(message);
			}
		});
	}

	removeValidationMessages(){
		this.$$('error').each(node=>{node.innerHTML = ''});
	}
}

