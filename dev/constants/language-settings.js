define([], function() {
	var resourcePath = 'locales/__lng__/__ns__.json';
	/*var LANGUAGES = {
			en: 'English',
			fr: 'French'
	};*/
	var LANGUAGES = {
			en: 'English'
	};
	var LANGUAGE_LIST = [];
	/*var INTERFACE_LANGUAGES = {
			en: 'English',
			fr: 'French'
	};*/
	var INTERFACE_LANGUAGES = LANGUAGES;
	var INTERFACE_LANGUAGE_LIST = [];
	for(var l in LANGUAGES) {
		if(LANGUAGES.hasOwnProperty(l)) {
			LANGUAGE_LIST.push(l);
		}
	}
	for(l in INTERFACE_LANGUAGES) {
		if(INTERFACE_LANGUAGES.hasOwnProperty(l)) {
			INTERFACE_LANGUAGE_LIST.push(l);
		}
	}
	return {
		RESOURCE_PATH: resourcePath,
		LANGUAGES: LANGUAGES,
		LANGUAGE_LIST: LANGUAGE_LIST,
		INTERFACE_LANGUAGES: INTERFACE_LANGUAGES,
		INTERFACE_LANGUAGE_LIST: INTERFACE_LANGUAGE_LIST,
		SERVER_NAMESPACES: ['translation', 'shared', 'titles', 'help', 'tour', 'terms'],
		SERVER_DEFAULT_NAMESPACE: 'translation',
		CLIENT_NAMESPACES: ['alerts', 'validation', 'shared', 'titles'],
		CLIENT_DEFAULT_NAMESPACE: 'alerts',
		DEFAULT_LANGUAGE: 'en',
		USE_COOKIE: true,
		SERVER_LOCAL_STORAGE_EXPIRATION: 86400000 * 30,
		CLIENT_LOCAL_STORAGE_EXPIRATION: 86400000 * 30
	};
});