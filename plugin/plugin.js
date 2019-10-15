import pluginManager from "./plugin-manager";

export default class Plugin {
	static get type(){return null;}

	static register(){
		return target => {
			pluginManager.add(target);
		};
	}

}