define([], function() {
	// seconds that must elapse before cache is expired
	
	return {
		USER_USERNAME: 10,
		USER_INFO: 15,
		
		POSTING: 30,
		COMMENT: 30,
		TAG: 120,
		SUBSCRIPTION: 30,
		
		PAGED: 120,
		PAGED_REPLIES: 30
	};
});