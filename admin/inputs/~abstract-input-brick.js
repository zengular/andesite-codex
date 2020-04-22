import {Brick} from "zengular";

export default class AbstractInputBrick extends Brick {

	set value(value) { this.setValue(value);}
	get value() { return this.getValue();}
	set options(options) {this.setOptions(options);}
	get options() { return this._options;}

	setItemId(id){this.itemId = id;}
	onInitialize() {this.name = this.dataset.name;}
	createViewModel() { return {name: this.name, options: this._options};}
	getDefaultOptions() {return {}; }
	preprocessOptions(options) {return options;}
	setOptions(options) {
		this._options = this.preprocessOptions({...this.getDefaultOptions(), ...options});
		return this.render();
	}


}