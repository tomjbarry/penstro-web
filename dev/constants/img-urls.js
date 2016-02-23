define([], function() {
	var IMG = '/resources/img/';
	return {
		FAVICON: IMG + 'favicon.ico',
		FAVICON_SHORTCUT: '/favicon.ico',
		FAVICON32: IMG + 'favicon-32.png',
		FAVICON57: IMG + 'favicon-57.png',
		FAVICON72: IMG + 'favicon-72.png',
		FAVICON96: IMG + 'favicon-96.png',
		FAVICON120: IMG + 'favicon-120.png',
		FAVICON128: IMG + 'favicon-128.png',
		FAVICON144: IMG + 'favicon-144.png',
		FAVICON152: IMG + 'favicon-152.png',
		FAVICON195: IMG + 'favicon-195.png',
		FAVICON228: IMG + 'favicon-228.png',
		
		BRAND: IMG + 'brand.png',
		BRAND_SMALL: IMG + 'shortbrand.png',
		//TIP_ICON: IMG + 'icon.svg',
		POST_ICON: IMG + 'quillpen.svg',
		POST_ICON_PNG: IMG + 'quillpen.png',
		
		OPEN_GRAPH: IMG + 'ogimg.jpg',
		
		PAYMENT_BUTTON: 'https://www.paypalobjects.com/en_US/i/btn/x-click-but6.gif',
		PAYMENT_LABEL: 'https://www.paypalobjects.com/en_US/i/logo/PayPal_mark_60x38.gif',
		
		getBaseUrl: function() {
			return IMG;
		}
	};
});