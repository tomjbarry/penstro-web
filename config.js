define([], function() {
	var APP_HTTP_PORT = 8081;
	var APP_HTTPS_PORT = 8082;
	//var APP_HOST = '24.56.24.36';
	var APP_HOST = '192.168.0.130';
	//var APP_HOST = 'localhost';
	
	//var API_PORT = 443;
	//var API_PORT = 8010;
	var API_PORT = 8010;
	//var API_HOST = 'api.penstro.com';
	//var API_HOST = '24.56.24.36';
	var API_HOST = '192.168.0.130';
	//var API_HOST = 'localhost';
	var API_BASEPATH = '';
	var API_PROTOCOL = 'https';
	var API_AUTHENTICATION_HEADER = 'Authentication-Token';
	var API_ANTICACHE_HEADER = 'AC-Timestamp';
	
	var INTERNAL_API_HOST = 'localhost';
	//var INTERNAL_API_HOST = 'api.penstro.com';
	
	return {
		app: {
			title: 'Penstro',
			host: APP_HOST,
			httpPort: APP_HTTP_PORT,
			httpsPort: APP_HTTPS_PORT,
			protocol: 'https'
		},
		// basePath should be '' in production
		api: {
			host: API_HOST,
			port: API_PORT,
			basePath: API_BASEPATH,
			protocol: API_PROTOCOL,
			authenticationHeader: API_AUTHENTICATION_HEADER,
			anticacheHeader: API_ANTICACHE_HEADER
		},
		
		security: {
			//certificateLocation: 'C:\\Users\\Administrator\\keys\\penstro-cert.cert',
			//keyLocation: 'C:\\Users\\Administrator\\keys\\penstro-key.pem'
			certificateLocation: '/etc/penstro/keys/webapp-cert.crt',
			keyLocation: '/etc/penstro/keys/webapp-key.pem',
			caLocations: ['/etc/penstro/keys/webapp-rootCA.crt', '/etc/penstro/keys/webapp-intCA1.crt', '/etc/penstro/keys/webapp-intCA2.crt']
		},
		
		// used in place when deployed in admin mode
		admin: {
			api: {
				host: API_HOST,
				port: API_PORT,
				basePath: API_BASEPATH,
				protocol: API_PROTOCOL,
				authenticationToken: API_AUTHENTICATION_HEADER,
				anticacheHeader: API_ANTICACHE_HEADER
			}
		},
		cache: {
			// ms
			ttl: 1000 * 60 * 15,
			maxSize: 200,
			enabled: true
		},
		logging: {
			directory: '/var/log/penstro',
			filename: '/webapp-%DATE%.log',
			frequency: 'daily',
			verbose: false,
			dateFormat: 'YYYY-MM-DD'
		},
		// this is what the server side connects to
		internal: {
			api: {
				host: INTERNAL_API_HOST,
				port: API_PORT,
				adminHost: INTERNAL_API_HOST,
				adminPort: API_PORT
			}
		}
	};
});