define(['js/constants/param-values', 'js/constants/language-settings'], function(paramValues, languageSettings) {
	
	return {
		REFRESH: 60,
		MAX_DEFERS: 5,
		ACTIVE: 60,
		TIME: paramValues.TIME_OPTION_MONTH,
		TIME_REPLIES: paramValues.TIME_OPTION_YEAR,
		SORT: paramValues.SORT_OPTION_VALUE,
		LANGUAGE: languageSettings.DEFAULT_LANGUAGE,
		INTERFACE_LANGUAGE: languageSettings.DEFAULT_LANGUAGE,
		WARNING: false,
		//AUTO_PREVIEW: false,
		PAGE_SIZE: 12
	};
});