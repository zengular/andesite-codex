import ListButtonPlugin from "../plugin/types/ListButtonPlugin";

@ListButtonPlugin.register()
export default class ListButtonAddNew extends ListButtonPlugin {

	get label() { return 'Add New';}
	get icon() { return 'fas fa-plus';}
	get color() { return 'green';}
	action(event) { this.list.addNew();}
}
