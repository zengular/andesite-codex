import pluginManager from "./plugin-manager";

export default class Plugin {
	static get type(){return null;}

	static register(name){
		return target => {
			pluginManager.add(name, target, target.name);
		};
	}

}