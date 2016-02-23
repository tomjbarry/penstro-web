define(['i18next', 'config', 'js/util/utils', 'js/constants/language-settings', 'js/constants/params', 'js/constants/cookies'],
	function(i18next, config, utils, languageSettings, params, cookies) {

	var i18nData;
	
	if(typeof(window) !== 'undefined') {
		if(typeof(window.pyGetI18nData) !== 'undefined') {
			i18nData = window.pyGetI18nData();
		}
		
		if(typeof(window.pyGetClientConfig) !== 'undefined') {
			config = window.pyGetClientConfig();
		}
	}
	
	var callbacks = [];
	var langOptions = {
			resGetPath: '/resources/' + languageSettings.RESOURCE_PATH,
			load: 'unspecific',
			supportedLngs: languageSettings.INTERFACE_LANGUAGE_LIST,
			preload: languageSettings.DEFAULT_LANGUAGE,
			ns: {
				namespaces: languageSettings.CLIENT_NAMESPACES,
				defaultNs: languageSettings.CLIENT_DEFAULT_NAMESPACE
			},
			fallbackLng: languageSettings.DEFAULT_LANGUAGE,
			detectLngQS: params.INTERFACE_LANGUAGE,
			useCookie: languageSettings.USE_COOKIE,
			cookieName: cookies.INTERFACE_LANGUAGE,
			//setJqueryExt: true,
			cookieDomain: cookies.getCookieOptions().domain
	};
	if(config.cache) {
		langOptions.useLocalStorage = true;
		langOptions.localStorageExpriationTime = languageSettings.CLIENT_LOCAL_STORAGE_EXPIRATION;
	}
	
	var translate;
	var stored;
	var jOb;
	
	if(langOptions.useLocalStorage) {
		var remove = function() {
			try {
				window.localStorage.removeItem('res_' + i18nData.lng);
			} catch(err) {
				// do nothing
			}
		};
		if(window && typeof(window.localStorage) !== 'undefined') {
			if(typeof(i18nData) !== 'undefined' && typeof(i18nData.lng) !== 'undefined' && typeof(i18nData.i18nStamp) !== 'undefined') {
				try {
					stored = window.localStorage.getItem('res_' + i18nData.lng);
					if(typeof(stored) !== 'undefined') {
						jOb = JSON.parse(stored);
						if(jOb.i18nStamp < i18nData.i18nStamp) {
							remove();
						}
						/*
						for(var key in jOb) {
							if(jOb.hasOwnProperty(key) && typeof(jOb[key]) === 'object') {
								if(typeof(i18nHashes.hashes[key]) === 'undefined' || utils.getStringHash(JSON.stringify(jOb[key])) !== i18nHashes.hashes[key]) {
									remove();
								}
							}
						}
						*/
					}
				} catch(err) {
					remove();
				}
			} else {
				try {
					window.localStorage.clear();
				} catch(err) {
					// do nothing
				}
			}
		}
	}
	
	i18next.init(langOptions, function(t) {
		translate = t;
		var length = callbacks.length;
		// reverse order. shouldnt matter
		for(var i = 0; i < length; i++) {
			callbacks[i](translate);
		}
		callbacks = [];
	});
	
	return function(callback, options) {
		options = options || {};
		if(typeof(options.language) !== 'undefined') {
			translate = undefined;
			i18next.setLng(options.language, function(t) {
				translate = t;
			});
		}
		
		if(typeof(callback) !== 'undefined') {
			if(typeof(translate) === 'undefined') {
				callbacks.push(callback);
			} else {
				callback(translate);
			}
		}
	};
});