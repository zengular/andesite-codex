import {Brick}    from "zengular";
import twig       from "./error.twig";
import "./error.scss";
import {modalify} from "zengular-ui";

@modalify()
@Brick.register('error', twig)
export default class ErrorModal extends Brick{

	beforeRender(args) {
		this.message = args.message;
	}

	createViewModel() {
		return {
			message: this.message
		}
	}

	onRender() {
		this.$$('close').listen('click', ()=>this.close());
	}
}