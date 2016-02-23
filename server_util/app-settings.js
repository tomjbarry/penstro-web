define(['config', 'fs'], function(config, fs) {
	
	var cacheEnabled = false;
	var cacheTTL = 1000 * 60;
	var cacheMaxSize = 100;
	var httpPort = process.env.PORT;
	var httpsPort = process.env.HTTPS_PORT;
	var certificate = {};
	var host = process.env.HOST;
	var logSettings = {
			directory: '.',
			filename: '/webapp-%DATE%.log',
			frequency: 'daily',
			verbose: false,
			dateFormat: 'YYYY-MM-DD'
	};
	if(typeof(config) !== 'undefined') {
		if(typeof(config.app) !== 'undefined') {
			if(typeof(config.app.host) !== 'undefined') {
				host = config.app.host;
			}
			if(typeof(config.app.httpPort) === 'number') {
				httpPort = config.app.httpPort;
			}
			if(typeof(config.app.httpsPort) === 'number') {
				httpsPort = config.app.httpsPort;
			}
		}
		if(typeof(config.security) !== 'undefined') {
			if(typeof(config.security.certificateLocation) !== 'undefined') {
				certificate.certificate = fs.readFileSync(config.security.certificateLocation);
			}
			if(typeof(config.security.keyLocation) !== 'undefined') {
				certificate.key = fs.readFileSync(config.security.keyLocation);
			}
			if(typeof(config.security.caLocations) !== 'undefined') {
				certificate.ca = [];
				var i;
				for(i = 0; i < config.security.caLocations.length; i++) {
					certificate.ca.push(fs.readFileSync(config.security.caLocations[i]));
				}
			}
		}
		if(typeof(config.cache) !== 'undefined') {
			if(config.cache.enabled) {
				cacheEnabled = true;
			}
			if(typeof(config.cache.ttl) === 'number') {
				cacheTTL = config.cache.ttl;
			}
			if(typeof(config.cache.maxSize) === 'number') {
				cacheMaxSize = config.cache.maxSize;
			}
		}
		//if(typeof(config.internal) !== 'undefined') {
		//}
		if(typeof(config.logging) !== 'undefined') {
			if(typeof(config.logging.directory) !== 'undefined') {
				logSettings.directory = config.logging.directory;
			}
			if(typeof(config.logging.filename) !== 'undefined') {
				logSettings.filename = config.logging.filename;
			}
			if(typeof(config.logging.frequency) !== 'undefined') {
				logSettings.frequency = config.logging.frequency;
			}
			if(typeof(config.logging.verbose) !== 'undefined') {
				logSettings.verbose = config.logging.verbose;
			}
			if(typeof(config.logging.dateFormat) !== 'undefined') {
				logSettings.dateFormat = config.logging.dateFormat;
			}
		}
	}
	
	var env = process.env.NODE_ENV || 'development';
	var subEnv = process.env.NODE_SUB_ENV || 'development';
	var isAdminMode = ('admin' === subEnv);
	var isDevMode = ('development' === env);


	if(isDevMode) {
		cacheEnabled = false;
	}
	
	console.log('Environment: ' + env);
	console.log('Sub Environment: ' + subEnv);
	
	if(cacheEnabled) {
		console.log('Cache Settings - Enabled, TTL: ' + cacheTTL + ', maxSize: ' + cacheMaxSize);
	} else {
		console.log('Cache Settings - Disabled');
	}
	
	return {
		isAdminMode: function() {
			return isAdminMode;
		},
		isDevMode: function() {
			return isDevMode;
		},
		getHost: function() {
			return host;
		},
		getPorts: function() {
			return {
				http: httpPort,
				https: httpsPort
			};
		},
		getLogSettings: function() {
			return logSettings;
		},
		getCertificateOptions: function() {
			return {
				key: certificate.key,
				cert: certificate.certificate,
				ca: certificate.ca,
				honorCipherOrder: true,
				ciphers: ['ECDHE-RSA-AES128-GCM-SHA256',
									'ECDHE-ECDSA-AES128-GCM-SHA256',
									'ECDHE-RSA-AES256-GCM-SHA384',
									'ECDHE-ECDSA-AES256-GCM-SHA25384',
									'DHE-RSA-AES128-GCM-SHA256',
									'ECDHE-RSA-AES128-SHA256',
									'DHE-RSA-AES128-SHA256',
									'ECDHE-RSA-AES256-SHA384',
									'DHE-RSA-AES256-SHA384',
									'ECDHE-RSA-AES256-SHA256',
									'DHE-RSA-AES256-SHA256',
									'HIGH',
									'!aNULL',
									'!eNULL',
									'!EXPORT',
									'!DES',
									'!RC4',
									'!MD5',
									'!PSK',
									'!SRP',
									'!CAMELLIA'].join(':')
				/*ciphers: ['ECDHE-RSA-AES256-SHA384',
									'DHE-RSA-AES256-SHA384',
									'ECDHE-RSA-AES256-SHA256',
									'DHE-RSA-AES256-SHA256',
									'ECDHE-RSA-AES128-SHA256',
									'DHE-RSA-AES128-SHA256',
									'HIGH',
									'!aNULL',
									'!eNULL',
									'!EXPORT',
									'!DES',
									'!RC4',
									'!MD5',
									'!PSK',
									'!SRP',
									'!CAMELLIA'].join(':')*/
			};
		},
		getContentSecurityPolicy: function() {
			return {
				//defaultSrc: ['*', "'unsafe-inline'"],
				//scriptSrc: ['*', "'unsafe-inline'"],
				styleSrc: ['*', "'unsafe-inline'"],
				imgSrc: ['*'],
				connectSrc: ['*'],
				fontSrc: ['*'],
				objectSrc: ['*'],
				mediaSrc: ["*"],
				frameSrc: ["*"],
				//sandbox: [],
				//reportUri: '/report-violation',
				//reportOnly: false,
				setAllErrors: false,
				disableAndroid: false,
				safari5: false
			};
		},
		getCacheSettings: function() {
			return {
				enabled: cacheEnabled,
				ttl: cacheTTL,
				maxSize: cacheMaxSize
			};
		}
	};
});