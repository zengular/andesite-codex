import {Brick} from "zengular";
import twig  from "./tab.twig";
import "./tab.less";

@Brick.register('codex-admin-tab', twig)
export default class CodexAdminTab extends Brick {

	onInitialize() {
		this.root.classList.add('closed');
	}

	createViewModel() {
		return {
			label: this.dataset.label,
			icon: this.dataset.icon,
			selected: this.dataset.selected
		};
	}
	@Brick.attr('data-label', 'data-icon', 'data-selected')
	onAttributeChange() {this.render();}

	onRender() {
		window.requestAnimationFrame(() => this.root.classList.remove('closed'));
		this.root.setAttribute('title', this.dataset.label);

		this.$$('close').listen('click', event => {
			this.close();
			event.stopPropagation();
		});

		this.$().listen('click', event => {
			if (this.dataset.selected !== 'yes') this.fire('TAB-SELECTED');
		});
	}

	close() {
		this.root.classList.add('closed');
		setTimeout(() => this.fire('TAB-CLOSED'), 300);
	}

}

