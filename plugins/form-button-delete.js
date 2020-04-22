import FormButtonPlugin from "../plugin/types/FormButtonPlugin";
//import Modal            from "zengular-ui/modal/modal";
import {Ajax}           from "zengular-util";
import AjaxErrorHandler from "../admin/ajax-error-handler";
import ConfirmModal     from "zengular-codex/frame/confirm.modal";

@FormButtonPlugin.register("FormButtonDelete")
export default class FormButtonDelete extends FormButtonPlugin {

	get label() { return 'Delete';}
	get icon() { return 'fas fa-times';}
	get color() { return 'red';}
	createButton() { return this.form.id ? super.createButton() : false; }
	action(event) {
		ConfirmModal.modalify(true, (result)=>{
			if(result){
				this.form.fire('show-overlay');
				Ajax.get('/' + this.form.urlBase + '/delete-item/' + this.form.id).get
					.then(xhr => AjaxErrorHandler.handle(xhr))
					.then((xhr) => this.form.tab.close())
					.finally(() => {
						this.form.fire('hide-overlay');
						this.form.reloadList();
					})
				;
			}
		});
	}
}
