define(['js/constants/api', 'js/constants/api-urls', 'js/constants/img-urls', 'js/constants/values'], function(api, apiUrls, imgUrls, values) {
	
	var LOCATION_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';
	
	var PATH_PREFIX = '/resources/';
	var FALLBACK_JS = PATH_PREFIX + 'libs/js/';
	var FALLBACK_CSS = PATH_PREFIX + 'libs/css/';

	var versionRequire = '2.1.11';
	var versionBootstrap = '3.2.0';
	//var versionAngularUiBootstrap = '0.10.0';
	var versionAngularUiBootstrap = '0.12.0';
	var versionFontAwesome = '4.2.0';
	var versionNormalizr = '3.0.1';
	var versionModernizr = '2.7.2';
	var versionRespond = '1.4.2';
	//var versionXdomain = '0.7.3';
	//var versionAngular = '1.2.16';
	var versionAngular = '1.3.3';
	var versionAngularUiRouter = '0.2.10';
	var versionJquery = '1.11.0';
	var versionJqueryCookie = '1.4.1';
	var versionI18next = '1.6.3';
	var versionMoment = '2.6.0';
	var versionZxcvbn = '4.2.0';
	
	var versionShowdown = '1.2.0';
	
	//var versionRangy = '1.3.0';
	
	//var versionES5Shim = '4.1.1';
	//var versionJson = '20140204';
	
	var versionAngulartics = '1.0.3';
	
	return {
		js: PATH_PREFIX + 'js',
		jsLibs: PATH_PREFIX + 'libs',
		
		versionRequire: versionRequire,
		versionBootstrap: versionBootstrap,
		versionAngularUiBootstrap: versionAngularUiBootstrap,
		versionFontAwesome: versionFontAwesome,
		versionNormalizr: versionNormalizr,
		versionModernizr: versionModernizr,
		versionRespond: versionRespond,
		//versionXdomain: versionXdomain,
		versionAngular: versionAngular,
		versionAngularUiRouter: versionAngularUiRouter,
		versionJquery: versionJquery,
		versionJqueryCookie: versionJqueryCookie,
		versionI18next: versionI18next,
		versionMoment: versionMoment,
		versionZxcvbn: versionZxcvbn,
		versionShowdown: versionShowdown,
		//versionRangy: versionRangy,
		//versionES5Shim: versionES5Shim,
		//versionJson: versionJson,
		versionAngulartics: versionAngulartics,

		cssBase: PATH_PREFIX + 'css/app.css',
		//cssContent: PATH_PREFIX + 'css/content.css',
		//cssEditor: PATH_PREFIX + 'css/content.css',
		//cssDeprecated: PATH_PREFIX + 'css/deprecated.css',
		imgIcon: imgUrls.MONEY_THUMB,
		
		//included inline and required ending in .js
		//jsRequire: LOCATION_CDN + 'require.js/' + versionRequire + '/require.min.js',
		jsRequire: LOCATION_CDN + 'require.js/' + versionRequire + '/require.js',
		jsModernizr: LOCATION_CDN + 'modernizr/' + versionModernizr + '/modernizr.min.js',
		jsRespond: LOCATION_CDN + 'respond.js/' + versionRespond + '/respond.min.js',
		jsXdomain: api.getPublicBaseUrl() + apiUrls.CORS_PROXY_JS,
		htmlXdomain: api.getPublicBaseUrl() + apiUrls.CORS_PROXY_HTML,
		jsRecaptcha: 'https://www.google.com/recaptcha/api.js?onload=' + values.RECAPTCHA_ONLOAD + '&render=explicit',
		jsBrowserFixes: PATH_PREFIX + 'inline/browser-fixes.js',
		jsBrowserFixesMin: PATH_PREFIX + 'inline/browser-fixes.min.js',
		
		//jsES5Shim: LOCATION_CDN + 'es5-shim/' + versionES5Shim + '/es5-shim.min.js',
		//jsES5Sham: LOCATION_CDN + 'es5-shim/' + versionES5Shim + '/es5-sham.min.js',
		//jsJson: LOCATION_CDN + 'json2/' + versionJson + '/json2.min.js',
		
		jsBootstrap: LOCATION_CDN + 'twitter-bootstrap/' + versionBootstrap + '/js/bootstrap.min',
		cssBootstrap: LOCATION_CDN + 'twitter-bootstrap/' + versionBootstrap + '/css/bootstrap.min.css',
		cssFontAwesome: LOCATION_CDN + 'font-awesome/' + versionFontAwesome + '/css/font-awesome.min.css',
		cssNormalizr: LOCATION_CDN + 'normalize/' + versionNormalizr + '/normalize.min.css',
		jsJquery: LOCATION_CDN + 'jquery/' + versionJquery + '/jquery.min',
		//jsJquery: LOCATION_CDN + 'jquery/' + versionJquery + '/jquery',
		jsJqueryCookie: LOCATION_CDN + 'jquery-cookie/' + versionJqueryCookie + '/jquery.cookie.min',
		jsAngular: LOCATION_CDN + 'angular.js/' + versionAngular + '/angular.min',
		//jsAngular: LOCATION_CDN + 'angular.js/' + versionAngular + '/angular',
		jsAngularSanitize: LOCATION_CDN + 'angular.js/' + versionAngular + '/angular-sanitize.min',
		//jsAngularSanitize: LOCATION_CDN + 'angular.js/' + versionAngular + '/angular-sanitize',
		jsAngularRoute: LOCATION_CDN + 'angular.js/' + versionAngular + '/angular-route.min',
		jsAngularUiRouter: LOCATION_CDN + 'angular-ui-router/' + versionAngularUiRouter + '/angular-ui-router.min',
		//jsAngularUiRouter: LOCATION_CDN + 'angular-ui-router/' + versionAngularUiRouter + '/angular-ui-router',
		jsAngularUiBootstrap: LOCATION_CDN + 'angular-ui-bootstrap/' + versionAngularUiBootstrap + '/ui-bootstrap-tpls.min',
		//jsAngularUiBootstrap: LOCATION_CDN + 'angular-ui-bootstrap/' + versionAngularUiBootstrap + '/ui-bootstrap-tpls',
		jsI18next: LOCATION_CDN + 'i18next/' + versionI18next + '/i18next.amd-' + versionI18next + '.min',
		//jsI18next: LOCATION_CDN + 'i18next/' + versionI18next + '/i18next.amd.withJQuery-' + versionI18next + '.min',
		jsMoment: LOCATION_CDN + 'moment.js/' + versionMoment + '/moment.min',
		//this is the min, but isn't a .min.js for some reason
		jsZxcvbn: LOCATION_CDN + 'zxcvbn/' + versionZxcvbn + '/zxcvbn',
		
		jsShowdown: LOCATION_CDN + 'showdown/' + versionShowdown + '/showdown.min',
		
		//jsWYSIHtml: FALLBACK_JS + 'wysihtml-toolbar.min',
		//jsWYSIHtml: FALLBACK_JS + 'wysihtml-toolbar',
		//jsWYSIHtml: FALLBACK_JS + 'wysihtml',
		//jsRangyCore: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-core.min',
		//jsRangySelectionsaverestore: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-selectionsaverestore.min',
		//jsRangyClassapplier: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-classapplier.min',
		//jsRangyHighlighter: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-highlighter.min',
		//jsRangySerializer: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-serializer.min',
		//jsRangyTextrange: LOCATION_CDN + 'rangy/' + versionRangy + '/rangy-textrange.min',
		
		jsAngulartics: LOCATION_CDN + 'angulartics/' + versionAngulartics + '/angulartics.min',
		jsAngularticsClicky: LOCATION_CDN + 'angulartics/' + versionAngulartics + '/angulartics-clicky.min',
		
		jsPayPal: 'https://www.paypalobjects.com/js/external/apdg',
		
		jsPyMin: PATH_PREFIX + 'py.min.js',
		jsPy: 'js/main',
		jsBlankAdmin: PATH_PREFIX + 'js/blank-admin',
		jsBlankDef: PATH_PREFIX + 'js/blank-def',
		
		fallback: {
			/* don't bother showing versions.
			* these should be loaded so rarely that its better to have small errors from version differences
			* than obvious ones from lacking the file completely if these arent kept up to date
			*/
			
			// just so that it has a second chance to load if, for whatever reason, it fails. one retry is all we need
			cssBase: PATH_PREFIX + 'css/app.css',
			//cssContent: PATH_PREFIX + 'css/content.css',
			//cssEditor: PATH_PREFIX + 'css/content.css',
			
			jsRequire: FALLBACK_JS + 'require.min.js',
			jsModernizr: FALLBACK_JS + 'modernizr.min.js',
			
			jsBootstrap: FALLBACK_JS + 'bootstrap.min',
			//cssBootstrap: FALLBACK_CSS + 'bootstrap.min.css',
			//cssFontAwesome: FALLBACK_CSS + 'font-awesome.min.css',
			//cssNormalizr: FALLBACK_CSS + 'normalize.min.css',
			jsJquery: FALLBACK_JS + 'jquery.min',
			jsJqueryCookie: FALLBACK_JS + 'jquery.cookie.min',
			jsAngular: FALLBACK_JS + 'angular.min',
			jsAngularSanitize: FALLBACK_JS + 'angular-sanitize.min',
			jsAngularRoute: FALLBACK_JS + 'angular-route.min',
			jsAngularUiRouter: FALLBACK_JS + 'angular-ui-router.min',
			jsAngularUiBootstrap: FALLBACK_JS + 'ui-bootstrap-tpls.min',
			jsI18next: FALLBACK_JS + 'i18next.amd.min',
			jsMoment: FALLBACK_JS + 'moment.min',
			// again, this is minified, but doesn't have a .min to match up with distributed version
			jsZxcvbn: FALLBACK_JS + 'zxcvbn',
			
			jsShowdown: FALLBACK_JS + 'showdown.min',
			//jsRangyCore: FALLBACK_JS + 'rangy-core.min',
			//jsRangySelectionsaverestore: FALLBACK_JS + 'rangy-selectionsaverestore.min',
			//jsRangyClassapplier: FALLBACK_JS + 'rangy-classapplier.min',
			//jsRangyHighlighter: FALLBACK_JS + 'rangy-highlighter.min',
			//jsRangySerializer: FALLBACK_JS + 'rangy-serializer.min',
			//jsRangyTextrange: FALLBACK_JS + 'rangy-textrange.min',
			jsAngulartics: FALLBACK_JS + 'angulartics.min',
			jsAngularticsClicky: FALLBACK_JS + 'angulartics-clicky.min',
			
			jsPayPal: FALLBACK_JS + 'apdg',
		}
	};
});