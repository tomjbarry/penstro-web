define(['js/constants/webapp'], function(webapp) {
	var cookieOptions = {
		domain: webapp.DOMAIN,
		path: '/',
		secure: false,
		expires: 0
	};
	
	return {
		AUTHENTICATION_TOKEN: 'A-T',
		//AUTO_PREVIEW: 'aP',
		WARNING: 'w',
		LANGUAGE: 'l',
		INTERFACE_LANGUAGE: 'iL',
		TIME: 't',
		TIME_REPLIES: 'tR',
		SORT: 's',
		PAYKEYS: 'pk',
		TOUR: 'to',
		INDEX: 'i',
		TEST_COOKIES_ENABLED: 'tcd',
		BETA_ALERT: 'ba',
		getCookieOptions: function() {
			return cookieOptions;
		}
	};
});