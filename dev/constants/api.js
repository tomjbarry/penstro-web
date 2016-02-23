define(['config'], function(config) {
	if(typeof(window) !== 'undefined' && typeof(window.pyGetClientConfig) !== 'undefined') {
		config = window.pyGetClientConfig();
	}
	var host = config.api.host;
	var port = config.api.port;
	
	var publicHost = host;
	var publicPort = port;
	
	if(typeof(config.internal) !== 'undefined') {
		if(typeof(config.internal.api.host) !== 'undefined') {
			host = config.internal.api.host;
		}
		if(typeof(config.internal.api.port) !== 'undefined') {
			port = config.internal.api.port;
		}
	}
	var basePath = config.api.basePath;
	var protocol = config.api.protocol;
	var protocolSeparator = '://';
	var authenticationHeader = config.api.authenticationHeader;
	var anticacheHeader = config.api.anticacheHeader;
	
	if(typeof(config.api.authenticationHeader) === 'undefined') {
		authenticationHeader = 'Authentication-Token';
	}
	
	if(typeof(config.api.anticacheHeader) === 'undefined') {
		anticacheHeader = 'AC-Timestamp';
	}
	
	if(typeof(config.admin) !== 'undefined') {
		if(typeof(config.admin.api.host) !== 'undefined') {
			host = config.admin.api.host;
		}
		if(typeof(config.admin.api.port) !== 'undefined') {
			port = config.admin.api.port;
		}
		if(typeof(config.internal) !== 'undefined') {
			if(typeof(config.internal.api.adminHost) !== 'undefined') {
				host = config.internal.api.adminHost;
			}
			if(typeof(config.internal.api.adminPort) !== 'undefined') {
				port = config.internal.api.adminPort;
			}
		}
		if(typeof(config.admin.api.basePath) !== 'undefined') {
			basePath = config.admin.api.basePath;
		}
		if(typeof(config.admin.api.protocol) !== 'undefined') {
			protocol = config.admin.api.protocol;
		}
		if(typeof(config.admin.api.protocolSeparator) !== 'undefined') {
			protocolSeparator = config.admin.api.protocolSeparator;
		}
	}
	
	var getBaseUrl = function() {
		return protocol + protocolSeparator + host + ':' + port + basePath;
	};
	
	var getPublicBaseUrl = function() {
		return protocol + protocolSeparator + publicHost + ':' + publicPort + basePath;
	};
	
	return {
		HOST: host,
		PORT: port,
		PUBLIC_HOST: publicHost,
		PUBLIC_PORT: publicPort,
		BASE_PATH: basePath,
		PROTOCOL: protocol,
		PROTOCOL_FULL: protocol + protocolSeparator,
		AUTHENTICATION_HEADER: authenticationHeader,
		ANTICACHE_HEADER: anticacheHeader,
		getBaseUrl: getBaseUrl,
		getPublicBaseUrl: getPublicBaseUrl
	};
});