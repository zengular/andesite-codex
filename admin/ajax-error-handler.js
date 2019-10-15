import Modal from "zengular-ui/modal/modal";

export default class AjaxErrorHandler {
	static handle(xhr, callback = null) {
		if (xhr.status !== 200) {
			let message;
			if (typeof xhr.response?.message === "string") message = xhr.response?.message;
			else message = `Some unknown error occured: ${xhr.statusText} (${xhr.status})`;
			let modal = new Modal();
			modal.title = "ERROR";
			modal.body = message;
			modal.addButton('Ok', false, 'danger');
			modal.onClose = () => callback ? callback() : null;
			modal.show();
		}
		return xhr;
	}
}
