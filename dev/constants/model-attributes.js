define([], function() {
	var SINGLE = 'single';
	var PAGE = 'page';
	
	var POSTING = 'p';
	var COMMENT = 'c';
	var USER = 'u';
	var TAG = 't';
	var FOLLOW_INFO = 'fi';
	
	var VIEW = 'V';
	return {
		COMMENT_VIEW: COMMENT + VIEW,
		
		POSTING: POSTING,
		COMMENT: COMMENT,
		USER: USER,
		TAG: TAG,
		
		
		SINGLE: SINGLE,
		PAGE: PAGE,
		constructModel: function(single, page) {
			var m = {};
			if(typeof(single) !== 'undefined' && single !== null) {
				m[SINGLE] = single;
			}
			if(typeof(page) !== 'undefined' && page !== null) {
				m[PAGE] = page;
			}
			return m;
		}
	};
});