import ListButtonPlugin from "../plugin/types/ListButtonPlugin";

@ListButtonPlugin.register("ListButtonSearch")
export default class ListButtonSearch extends ListButtonPlugin {

	get label() { return 'Search';}
	get icon() { return 'fas fa-search';}
	get color() { return 'indigo';}
	action(event){}
}
