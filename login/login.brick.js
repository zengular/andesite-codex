import {Brick} from "zengular";
import twig    from "./login.twig";
import "./login.less";
import {Ajax}    from "zengular-util";

@Brick.register('codex-login', twig)
export default class Todo extends Brick {

	createViewModel() {
		return {
			icon: this.dataset.icon ? this.dataset.icon : "far fa-user-shield",
			title: this.dataset.title ? this.dataset.title : "Login",
			loginPlaceholder: this.dataset.loginPlaceholder ? this.dataset.loginPlaceholder : "login"
		}
	}

	onRender() {
		this.$('button').listen('click', event => this.login());
		this.$('input').listen( 'keydown', event => {
			if (event.key === 'Enter' && !this.$('button').node.hasAttribute('disabled')) this.login()
		});
	}

	login() {
		this.$('button').node.setAttribute('disabled', true);

		const animtime = 500;
		let prewait = 0;
		if (this.$('footer.success.visible, footer.error.visible').nodes.length) {
			this.$('footer.success').node.classList.remove('visible');
			this.$('footer.error').node.classList.remove('visible');
			prewait = animtime;
		}

		this.sleep(prewait)
		.then(() => {
			this.$('footer.working').node.classList.add('visible');
		})
		.then(() => {
			return this.sleep(animtime);
		})
		.then(() => {
			let data = {
				login: this.$('input[name=login]').node.value,
				password: this.$('input[name=password]').node.value
			};
			return Ajax.post('/login',data).getJson;
		})
		.then(xhr => {
			this.$('footer.working').node.classList.remove('visible');
			return this.sleep(animtime).then(resolve => xhr)
		})
		.then(xhr => {
			if (xhr.status === 200) {
				this.$('footer.success').node.classList.add('visible');
				return this.sleep(animtime).then(() => {
					document.location.reload();
				})
			} else {
				this.$('footer.error').node.classList.add('visible');
				this.$('button').node.removeAttribute('disabled');
			}
		});
	}

	sleep(wait) {
		return new Promise((resolve) => setTimeout(resolve, wait));
	}

}
