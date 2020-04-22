import Plugin from "../plugin";

export default class ListPreprocessPlugin extends Plugin {
	static get pluginType() {return "ListPreprocessPlugin"; }
	static preprocess(row) {}
}
