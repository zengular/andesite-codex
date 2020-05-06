//import Modal from "zengular-ui/modal/modal";

import ErrorModal from "../frame/error.modal";

export default class AjaxErrorHandler {
	static handle(xhr, callback = null) {
		if (xhr.status !== 200) {
			let message;
			if (typeof xhr.response?.message === "string") message = xhr.response?.message;
			else message = `Some unknown error occured: ${xhr.statusText} (${xhr.status})`;
			ErrorModal.modalify({message});
		}
		return xhr;
	}
}
