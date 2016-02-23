define(['js/constants/view-urls', 'admin-js/constants/admin-view-urls'], function(viewUrls, adminViewUrls) {
	var admin = '/partials/admin';
	var info = admin + '/info';
	var single = admin + '/single';
	var page = admin + '/page';
	
	var RESTRICTED = '/restricted';
	var FLAGGED = '/flagged';
	return {
		// info
		RESTRICTED_ADD: info + RESTRICTED,
		/*
		// single
		POSTING: single + viewUrls.POSTINGS,
		USER: single + viewUrls.USERS,
		COMMENT: single + viewUrls.COMMENTS,
		
		// pageable
		FOLLOWER: page + viewUrls.FOLLOWERS,
		FOLLOWEE: page + viewUrls.FOLLOWEES,
		BLOCKED: page + viewUrls.BLOCKED,
		OFFER: page + viewUrls.OFFERS,
		OFFEE: page + viewUrls.OFFEES,
		OFFEE_EMAIL: page + viewUrls.OFFEES_EMAIL,
		BACKER: page + viewUrls.BACKERS,
		BACKEE: page + viewUrls.BACKEES,
		
		RESTRICTED: page + RESTRICTED,
		FLAGGED: page + FLAGGED
		*/
	};
});