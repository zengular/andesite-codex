import FormButtonPlugin from "../plugin/types/FormButtonPlugin";

@FormButtonPlugin.register()
export default class FormButtonReload extends FormButtonPlugin {

	get label() { return 'Reload';}
	get icon() { return 'fas fa-recycle';}
	get color() { return 'orange';}
	action(event){this.form.load();}
	createButton() { return this.form.id ? super.createButton() : false; }

}
