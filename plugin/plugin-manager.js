class PluginManager{

	constructor() {
		this.plugins = {};
	}


	add(plugin){
		this.plugins[plugin.name] = plugin;
	}

	get(pluginNames, type, ...args){
		let plugins = [];
		pluginNames.forEach(pluginName=>{
			if(typeof this.plugins[pluginName] === 'undefined') throw new Error('Plugin not found ' + pluginName);
			if(this.plugins[pluginName].pluginType === type.pluginType)plugins.push(new this.plugins[pluginName](...args));
		});
		return plugins;
	}

}

let pluginManager = new PluginManager();
export default pluginManager;


