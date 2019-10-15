import Brick from "zengular/core/brick";
import twig  from "./template.twig";
import "./style.less";

@Brick.register('codex-admin-tab', twig)
@Brick.registerSubBricksOnRender()
@Brick.observeAttributes(true, ['data-label', 'data-icon', 'data-selected'])
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

