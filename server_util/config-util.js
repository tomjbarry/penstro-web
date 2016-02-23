define(['config', 'server_util/app-settings'], function(config, appSettings) {
	var ob = {};
	ob.api = config.api;
	
	ob.app = config.app;
	
	var production = true;
	if(appSettings.isDevMode()) {
		production = false;
	}
	
	ob.getFrontEndConfig = function(admin) {
		var c = {
			app: config.app,
			api: config.api,
			cache: config.cache.enabled,
			production: production
		};
		if(admin) {
			c.admin = {
				api: config.admin.api
			};
		}
		return c;
	};
	
	var stringified = JSON.stringify(ob.getFrontEndConfig(false));
	var adminStringified = JSON.stringify(ob.getFrontEndConfig(true));
	
	ob.getFrontEndConfigStringified = function(admin) {
		if(admin) {
			return adminStringified;
		}
		return stringified;
	};
	return ob;
});