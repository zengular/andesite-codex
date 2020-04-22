import ListButtonPlugin from "../plugin/types/ListButtonPlugin";

@ListButtonPlugin.register("ListButtonReload")
export default class ListButtonReload extends ListButtonPlugin {

	get label() { return 'Reload';}
	get icon() { return 'fas fa-recycle';}
	get color() { return 'orange';}
	action(event){this.list.reload();}
}
