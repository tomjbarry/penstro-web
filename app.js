define(['express', 'serve-favicon', 'helmet', 'fs', 'file-stream-rotator', 'morgan', 'body-parser', 'compression',
        'method-override', 'cookie-parser', 'path', 'errorhandler', 'i18next',
        'pyMiddleware/cookieHandler', 'pyMiddleware/addRequestObject', 'pyMiddleware/rewrites', 'pyMiddleware/responseHeaders', 'pyMiddleware/cacheCheck',
        'routes/routes', 'server_util/app-settings', 'server_util/config-util', 'server_util/all-constants', 'server_util/all-utils',
        'server_util/js-partials-util', 'server_util/admin-constants', 'server_util/param-util', 'server_util/i18n-util',
        'js/constants/cookies', 'js/constants/params', 'js/constants/language-settings'],
		function(express, favicon, helmet, fs, fileStreamRotator, morgan, bodyParser, compression, methodOverride,
				cookieParser, path, errorhandler, i18n, cookieHandler, addRequestObject, rewrites, responseHeaders, cacheCheck,
				routes, appSettings, configUtil, allConstants, allUtils, jsPartialsUtil, adminConstants, paramUtil, i18nUtil, cookies, params, languageSettings) {
	var app = express();
	
	var isAdminMode = (appSettings.isAdminMode());
	var isDevMode = (appSettings.isDevMode());
	
	var logSettings = appSettings.getLogSettings();
	
	//if(!fs.existsSync(logSettings.directory)) {
	//	fs.mkdirSync(logSettings.directory);
	//}
	
	var accessLogStream = fileStreamRotator.getStream({
		filename: logSettings.directory + logSettings.filename,
		frequency: logSettings.frequency,
		verbose: logSettings.verbose,
		date_format: logSettings.dateFormat
	});
	var format = ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
	var logger = morgan(format, {format: format, stream: accessLogStream});
	
	// i18n
	var resGetPath = 'public/' + languageSettings.RESOURCE_PATH;
	var langOptions = {
		resGetPath: resGetPath,
		load: 'unspecific',
		supportedLngs: languageSettings.INTERFACE_LANGUAGE_LIST,
		//preload: languageSettings.DEFAULT_LANGUAGE,
		// preload all
		preload: languageSettings.INTERFACE_LANGUAGE_LIST,
		// caching
		//TODO: enable on util/i18n as well
		//useLocalStorage: true,
		//localStorageExpirationTime: 86400000,
		ns: {
			namespaces: languageSettings.SERVER_NAMESPACES,
			defaultNs: languageSettings.SERVER_DEFAULT_NAMESPACE
		},
		fallbackLng: languageSettings.DEFAULT_LANGUAGE,
		detectLngQS: params.INTERFACE_LANGUAGE,
		useCookie: languageSettings.USE_COOKIE,
		cookieName: cookies.INTERFACE_LANGUAGE,
		cookieDomain: cookies.getCookieOptions().domain
	};
	if(appSettings.getCacheSettings().enabled) {
		langOptions.useLocalStorage = true;
		langOptions.localStorageExpirationTime = languageSettings.SERVER_LOCAL_STORAGE_EXPIRATION;
	}
	i18n.init(langOptions, function(t, err) {
		i18nUtil.storeHashes(i18n);
		app.locals.i18nUtil = i18nUtil;
		app.locals.jsPartials = jsPartialsUtil(app, t, isAdminMode);
	});
	
	app.set('views', './views');
	app.set('view engine', 'jade');
	app.set('x-powered-by', false);
	// should be used for rewrites
	app.set('trust proxy', true);
	
	// only for https app!
	var ONE_YEAR = 31536000000;
	app.use(helmet.hsts({
		maxAge: ONE_YEAR,
		includeSubdomains: true,
		force: true
	}));
	
	// send to non-www domain first thing!
	// or eventually add a second server to deal with this
	app.use(rewrites());
	
	// cache-control
	app.use(responseHeaders());
	
	app.use(logger);

	// eliminate urls that are not paths
	app.use(function(req, res, next) {
		if(req.url[0] !== '/' || req.originalUrl[0] !== '/') {
			res.status(404).send('');
		} else {
			next();
		}
	});
	
	app.use(favicon(path.join('.', 'public','img','favicon.ico')));
	app.use(compression());
	
	// helmet security
	app.use(helmet.contentSecurityPolicy(appSettings.getContentSecurityPolicy()));
	app.use(helmet.xssFilter());
	app.use(helmet.frameguard('deny'));
	// disabled through express above
	//app.use(helmet.hidePoweredBy());
	app.use(helmet.noSniff());
	
	app.use(express.static(path.join('.', 'public', 'base')));
	app.use("/resources", express.static(path.join('.', 'public')));
	if(isDevMode) {
		app.use("/resources/js", express.static(path.join('.', 'dev')));
	}
	if(isAdminMode) {
		app.use("/resources/admin", express.static(path.join('.', 'admin')));
	}
	
	//app.use(bodyParser());
	app.use(i18n.handle);
	app.use(methodOverride());
	app.use(cookieParser());
	i18n.registerAppHelper(app);
	
	app.locals.constants = allConstants;
	if(isAdminMode) {
		app.locals.adminConstants = adminConstants;
	}
	app.locals.utils = allUtils;
	app.locals.utils.mode = {admin: isAdminMode, dev: isDevMode};
	app.locals.paramUtil = paramUtil;
	app.locals.config = configUtil;
	
	//development only
	//if (isDevMode) {
	//	app.use(errorhandler());
	//}
	
	// handle cookies
	app.use(cookieHandler());
	
	// pass request to view template to use for parsing paths and queries etc
	app.use(addRequestObject());
	
	// get from cache if present
	if(appSettings.getCacheSettings().enabled) {
		app.use(cacheCheck());
	}
	
	// routes
	routes(app, isAdminMode);
	
	// error handling
	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.status(500).render('500');
	});
	app.use(function(req, res, next) {
		res.status(404).render('404');
	});
	
	var ports = appSettings.getPorts();
	var httpsOptions = appSettings.getCertificateOptions();
	
	var httpApp = express();
	var httpFormat = 'nossl - :remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
	var httpLogger = morgan(httpFormat, {format: httpFormat, stream: accessLogStream});
	
	httpApp.use(httpLogger);
	var portString = '';
	if(ports.https !== 443) {
		portString = ':' + ports.https;
	}
	var host = appSettings.getHost();
	httpApp.get('*', function(req, res) {
		res.redirect(['https://', host, portString, req.url].join(''));
	});
	
	return {
		http: {
			app: httpApp,
			port: ports.http
		},
		https: {
			app: app,
			port: ports.https,
			options: httpsOptions
		}
	};
});
