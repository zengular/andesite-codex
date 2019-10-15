import Brick                      from "zengular/core/brick";
import twig                       from "./template.twig";
import "./style.less";
import Ajax                       from "zengular/core/ajax";
import Modal                      from "zengular-ui/modal/modal";
import ModalBrick                 from "zengular-ui/modal/modal-brick";
import {getClassNameForExtension} from "font-awesome-filetypes";
import Contextmenu                from "zengular-ui/contextmenu/contextmenu";
import AjaxErrorHandler           from "../ajax-error-handler";

@Brick.register('codex-admin-attachment-modal', twig)
@Brick.registerSubBricksOnRender()
@Brick.renderOnConstruct(false)
export default class CodexAdminAttachmentModal extends ModalBrick {

	initializeModal(modal) {
		super.initializeModal(modal);
		modal.title = "Files";
		modal.height = 'calc(100vh - 60px)';
		modal.width = 'calc(100vw - 60px)';
		modal.classList.add('frameless');
	}

	beforeRender(args) { if (args) this.form = args.form;}

	onInitialize() {
		this.menu = new Contextmenu();
		this.menu.add('Download', 'fas fa-cloud-download-alt').click(ctx => {
			this.openAttachment(ctx.dataset.url);
		});
//		this.menu.add('Rename', 'fas fa-edit').click(ctx => {
//			let category = ctx.dataset.category;
//			let filename = ctx.dataset.filename;
//			this.renameAttachment(filename, category);
//		});
		this.menu.add('Delete', 'fal fa-trash-alt').click(ctx => {
			let category = ctx.dataset.category;
			let filename = ctx.dataset.filename;
			this.deleteAttachment(filename, category);
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

		this.$$('attachment')
		.listen('contextmenu', (event, target) => {
			event.preventDefault();
			this.menu.show(event, target);
		})
		.listen('dragstart', (event, target) => {
			event.dataTransfer.setData('filename', target.dataset.filename);
			event.dataTransfer.setData('category', target.dataset.category);
			event.dataTransfer.setData('action', "copy");
		})
		.listen('dblclick', (event, target) => {
			if (target.dataset.url && event.target.tagName !== 'INPUT') {
				this.openAttachment(target.dataset.url)
			}
		});

		this.$$("category", node => node.overCounter = 0)
		.listen('dragover', (event) => {
			event.preventDefault();
		})
		.listen('dragenter', (event, target) => {
			target.overCounter++;
			target.classList.add('dragover');
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

	renameAttachment(filename, category) {}

}
