import FormButtonPlugin     from "../plugin/types/FormButtonPlugin";
import CodexAdminForm       from "../admin/form.brick";
import {Ajax}               from "zengular-util";
import AjaxErrorHandler     from "../admin/ajax-error-handler";
import Alert                from "../../../@src/mission.web/js/modals/alert.brick";
import ZengularNotification from "zengular-ui/bricks/zengular-notification.brick";

/**
 * @property {CodexAdminForm} form
 */
@FormButtonPlugin.register("FormButtonSave")
export default class FormButtonSave extends FormButtonPlugin {

	get label() { return 'Save';}
	get icon() { return 'fas fa-save';}
	get color() { return 'green';}
	action(event) {
		let form = this.form;
		let data = {
			id: form.id,
			fields: form.collectFieldData()
		};
		form.removeValidationMessages();
		form.fire('show-overlay');
		Ajax.json('/' + form.urlBase + '/save-item', data).getJson
			.then(xhr => {
				if (xhr.status !== 200) {
					if (xhr.response.error === 'validation') {
						form.showValidationMessages(xhr.response.message)
						ZengularNotification.show(ZengularNotification.style.danger, "fas fa-exclamation-triangle", "Validation error!");
					} else {
						Alert.modalify({title: 'Unkown error', icon: 'fas fa-exclamation-triangle', content: xhr.response.message});
						ZengularNotification.show(ZengularNotification.style.danger, "fas fa-exclamation-triangle", "Unkown error occured!<small>"+xhr.response.message+"</small>" );
					}
				} else {
					form.load(parseInt(xhr.response.id));
					ZengularNotification.show(ZengularNotification.style.success, "fal fa-thumbs-up", "Saved...");
				}
				return xhr;
			})
			.finally(() => {
				form.fire('hide-overlay');
				form.reloadList();
			})
		;
	}
}
