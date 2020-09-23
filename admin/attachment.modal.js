import {DragAndDrop, modalify} from "zengular-ui";
import {Brick}                 from "zengular";
import twig                    from "./attachment.twig";
import copy                    from "copy-text-to-clipboard";
import {Ajax}                  from "zengular-util";
import "./attachment.scss";

import {getClassNameForExtension} from "font-awesome-filetypes";
import Contextmenu                from "zengular-ui/contextmenu/contextmenu";
import AjaxErrorHandler           from "./ajax-error-handler";
import CodexImageEditor           from "zengular-codex/admin/image-editor.modal";


@modalify()
@Brick.register('codex-admin-attachment', twig)
@Brick.registerSubBricksOnRender()
@Brick.renderOnConstruct(false)
export default class CodexAdminAttachmentModal extends Brick {

	beforeRender(args) { if (args) this.form = args.form;}

	onInitialize() {
		this.menu = new Contextmenu();
		this.menu.add('Download', 'fas fa-cloud-download-alt').click(ctx => {
			this.openAttachment(ctx.dataset.url);
		});
		this.menu.add('Rename', 'fas fa-edit').click(ctx => {
			let category = ctx.dataset.category;
			let filename = ctx.dataset.filename;
			this.renameAttachment(filename, category);
		});
		this.menu.add('Delete', 'fal fa-trash-alt').click(ctx => {
			let category = ctx.dataset.category;
			let filename = ctx.dataset.filename;
			this.deleteAttachment(filename, category);
		});
		this.menu.add('Copy name', 'fal fa-copy').click(ctx => {
			let filename = ctx.dataset.filename;
			copy(filename);
		});
		this.menu.add('Copy path', 'far fa-copy').click(ctx => {
			let category = ctx.dataset.category;
			let filename = ctx.dataset.filename;
			copy(category + '/' + filename);
		});
		this.menu.add('Copy url', 'fas fa-copy').click(ctx => {
			let url = ctx.dataset.url;
			copy(url);
		});
		this.menu.add('Edit image', 'fas fa-image', 'image-edit').click(ctx => {
			let category = ctx.dataset.category;
			let filename = ctx.dataset.filename;
			let url = ctx.dataset.url;
			this.imageEdit(url, category, filename);
		});

	}

	createViewModel() {
		return Ajax.get(this.form.urlBase + '/attachment/get/' + this.form.data.id).getJson
			.then(attachments => {
				return {
					getClassNameForExtension: getClassNameForExtension,
					attachmentCategories: this.form.attachmentCategories,
					attachments: attachments.response
				}
			});
	}

	onRender() {

		this.$$('close').listen('click', () => {this.close()});

		this.$$('attachment')
			.listen('contextmenu', (event, target) => {
				event.preventDefault();
				if (target.dataset.type === 'image') {
					this.menu.enable('image-edit')
				} else {
					this.menu.disable('image-edit')
				}
				this.menu.show(event, target);
			})
			.listen('dragstart', (event, target) => {
				event.dataTransfer.setData('filename', target.dataset.filename);
				event.dataTransfer.setData('category', target.dataset.category);
				event.dataTransfer.setData('source:' + target.dataset.category, '');
				event.dataTransfer.setData('filename:' + target.dataset.filename, '');
				event.dataTransfer.setData('action', "copy");
			})
			.listen('dblclick', (event, target) => {
				if (target.dataset.url && event.target.tagName !== 'INPUT') {
					this.openAttachment(target.dataset.url)
				}
			});

		this.$$('trash')
			.listen('dragover', even => event.preventDefault())
			.listen('dragenter', (event, target) => {
				target.classList.remove('fal');
				target.classList.add('fas');
				event.preventDefault();
			})
			.listen('dragleave', (event, target) => {
				target.classList.remove('fas');
				target.classList.add('fal');
				event.preventDefault();
			})
			.listen('drop', (event, target) => {
				if (event.dataTransfer.getData('action') === 'copy') {
					this.deleteAttachment(event.dataTransfer.getData('filename'), event.dataTransfer.getData('category'));
				}
			});

		this.$$('attachment', node => node.overCounter = 0)
			.listen('dragover', (event) => event.preventDefault())
			.listen('dragenter', (event, target) => {
				target.overCounter++;
				console.log(event.dataTransfer.types);
				console.log()
				if (event.dataTransfer.types.indexOf('source:' + target.dataset.category) !== -1 &&
					event.dataTransfer.types.indexOf('filename:' + target.dataset.filename) === -1
				) {
					target.classList.add('dragover');
				}
				event.preventDefault();
			})
			.listen('dragleave', (event, target) => {
				target.overCounter--;
				if (target.overCounter === 0) target.classList.remove('dragover');
				event.preventDefault();
			})
			.listen('drop', (event, target) => {
				if (event.dataTransfer.types.indexOf('source:' + target.dataset.category) !== -1&&
					event.dataTransfer.types.indexOf('filename:' + target.dataset.filename) === -1) {
					event.preventDefault();
					event.stopImmediatePropagation();
					target.classList.remove('dragover');
					target.overCounter = 0;

					let filename = event.dataTransfer.getData('filename');
					let fileSource = event.dataTransfer.getData('category');

					this.reorderAttachment(filename, fileSource, target.dataset.ordinal);
				}
			});


		this.$$("category", node => node.overCounter = 0)
			.listen('dragover', (event) => event.preventDefault())
			.listen('dragenter', (event, target) => {
				target.overCounter++;
				if (event.dataTransfer.types.indexOf('source:' + target.dataset.category) === -1) {
					target.classList.add('dragover');
				}
				event.preventDefault();
			})
			.listen('dragleave', (event, target) => {
				target.overCounter--;
				if (target.overCounter === 0) target.classList.remove('dragover');
				event.preventDefault();
			})
			.listen('drop', (event, target) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				target.classList.remove('dragover');
				target.overCounter = 0;
				if (event.dataTransfer.getData('action') === 'copy') {
					let method = event.shiftKey ? 'copy' : 'move';
					let fileTarget = target.dataset.category;
					let filename = event.dataTransfer.getData('filename');
					let fileSource = event.dataTransfer.getData('category');
					if (fileTarget !== fileSource) this.copyAttachment(method, filename, fileSource, fileTarget);
				} else {
					let files = event.dataTransfer.files;
					let category = target.dataset.category;
					this.uploadAttachment(files, category);
				}
			});
	}


	openAttachment(url) {
		let win = window.open(url, '_blank');
		win.focus();
	}

	uploadAttachment(files, category) {
		this.fire('show-overlay');
		let uploads = [];
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			let upload = Ajax.upload(this.form.urlBase + '/attachment/upload/' + this.form.data.id, {category: category}, file).getJson
				.then(xhr => AjaxErrorHandler.handle(xhr));
			uploads.push(upload);
		}

		Promise.all(uploads).finally(() => {
			this.render()
				.then(() => this.fire('hide-overlay'));
		})
	}

	copyAttachment(method, filename, source, target) {
		this.fire('show-overlay');
		Ajax.json(`${this.form.urlBase}/attachment/${method}/${this.form.data.id}`, {target, source, filename}).getJson
			.then(xhr => AjaxErrorHandler.handle(xhr))
			.finally(() => {
				this.render();
				this.fire('hide-overlay')
			});
	}

	deleteAttachment(filename, category) {
		this.fire('show-overlay');
		Ajax.json(`${this.form.urlBase}/attachment/delete/${this.form.data.id}`, {filename, category}).getJson
			.then(xhr => AjaxErrorHandler.handle(xhr))
			.finally(() => {
				this.render();
				this.fire('hide-overlay')
			});
	}

	crop(category, filename, data) {
		this.fire('show-overlay');
		Ajax.json(`${this.form.urlBase}/attachment/crop/${this.form.data.id}`, {category, filename, data}).getJson
			.then(xhr => AjaxErrorHandler.handle(xhr))
			.finally(() => {
				this.render();
				this.fire('hide-overlay')
			});
	}

	renameAttachment(filename, category) {
		let newname = prompt('', filename);
		if (newname.trim() === '' || newname === filename) {
			return;
		} else {
			this.fire('show-overlay');
			Ajax.json(`${this.form.urlBase}/attachment/rename/${this.form.data.id}`, {category, filename, newname}).getJson
				.then(xhr => AjaxErrorHandler.handle(xhr))
				.finally(() => {
					this.render();
					this.fire('hide-overlay')
				});
		}
	}

	reorderAttachment(filename, category, ordinal){
		this.fire('show-overlay');
		Ajax.json(`${this.form.urlBase}/attachment/reorder/${this.form.data.id}`, {category, filename, sequence: ordinal}).getJson
			.then(xhr => AjaxErrorHandler.handle(xhr))
			.finally(() => {
				this.render();
				this.fire('hide-overlay')
			});
	}

	imageEdit(url, category, filename) {
		CodexImageEditor.modalify({
			url: url
		}, (data) => {
			if (data !== false) this.crop(category, filename, data);
		});
	}

}
