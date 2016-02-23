define(['js/constants/view-urls'], function(viewUrls) {
	
	var PARTIALS = '/partials';
	var INFO = PARTIALS + '/info';
	var SINGLE = PARTIALS + '/single';
	var PAGE = PARTIALS + '/page';
	var SUBNAV = PARTIALS + '/subNav';
	
	var CREATE = '/create';
	var PREVIEW = '/preview';
	var APPRECIATION_RESPONSE = '/response';
	var SEARCH = '/search';
	var EMAIL = '/email';
	var MESSAGE = '/message';
	var CHANGE = '/change';
	
	return {
		// info
		LOGGED_OUT: INFO + viewUrls.LOGGED_OUT,
		NOT_FOUND: INFO + viewUrls.NOT_FOUND,
		REDIRECTING: INFO + viewUrls.NO_CONTENT,
		EXTERNAL_URL: INFO + viewUrls.EXTERNAL_URL,
		DELETED: INFO + viewUrls.DELETED,
		RESET_PASSWORD: INFO + viewUrls.RESET_PASSWORD,
		//CREATE_COMMENT: INFO + viewUrls.COMMENTS + CREATE,
		CREATE_POSTING: INFO + viewUrls.POSTINGS + CREATE,
		//EDIT_POSTING: INFO + viewUrls.POSTINGS + CHANGE,
		CREATE_MESSAGE: INFO + viewUrls.MESSAGES + CREATE,
		EMAIL_CHANGE: INFO + viewUrls.EMAIL_CHANGE,
		PASSWORD_CHANGE_UNAUTHED: INFO + viewUrls.PASSWORD_CHANGE,
		PAYMENT_CHANGE: INFO + viewUrls.PAYMENT_CHANGE,
		SETTINGS: INFO + viewUrls.SETTINGS,
		TERMS: INFO + viewUrls.TERMS,
		
		WELCOME: INFO + viewUrls.WELCOME,
		ACCOUNT: INFO + viewUrls.ACCOUNT,
		//ABOUT: INFO + viewUrls.ABOUT,
		CAREERS: INFO + viewUrls.CAREERS,
		SUPPORT: INFO + viewUrls.SUPPORT,
		HELP: INFO + viewUrls.HELP,
		
		/*
		// page
		ACTIVITY: PAGE + viewUrls.FEED,
		BACKEE: PAGE + viewUrls.BACKEES,
		BACKER: PAGE + viewUrls.BACKERS,
		BLOCKED: PAGE + viewUrls.BLOCKED,
		COMMENT_PREVIEW: PAGE + viewUrls.COMMENTS + PREVIEW,
		COMMENT_VIEW: PAGE + viewUrls.COMMENTS,
		CONVERSATION_PREVIEW: PAGE + viewUrls.MESSAGES + PREVIEW,
		FOLLOWEE: PAGE + viewUrls.FOLLOWEES,
		FOLLOWER: PAGE + viewUrls.FOLLOWERS,
		MESSAGE: PAGE + viewUrls.MESSAGES,
		NOTIFICATION: PAGE + viewUrls.NOTIFICATIONS,
		OFFEE: PAGE + viewUrls.OFFEES,
		OFFEE_EMAIL: PAGE + viewUrls.OFFEES + EMAIL,
		OFFER: PAGE + viewUrls.OFFERS,
		POSTING_PREVIEW: PAGE + viewUrls.POSTINGS + PREVIEW,
		TAG_PREVIEW: PAGE + viewUrls.TAGS + PREVIEW,
		USER_PREVIEW: PAGE + viewUrls.USERS + PREVIEW,
		
		// single
		CURRENT: SINGLE + viewUrls.CURRENT,
		CURRENT_APPRECIATION_RESPONSE: SINGLE + viewUrls.CURRENT_APPRECIATION_RESPONSE,
		COMMENT: SINGLE + viewUrls.COMMENTS,
		POSTING: SINGLE + viewUrls.POSTINGS,
		TAG: SINGLE + viewUrls.TAGS,
		USER: SINGLE + viewUrls.USERS,
		USER_APPRECIATION_RESPONSE: SINGLE + viewUrls.USERS + APPRECIATION_RESPONSE
		*/
		/*
		// subNav
		SUBNAV_CURRENT: SUBNAV + viewUrls.CURRENT,
		SUBNAV_COMMENT: SUBNAV + viewUrls.COMMENTS,
		SUBNAV_POSTING: SUBNAV + viewUrls.POSTINGS,
		SUBNAV_TAG: SUBNAV + viewUrls.TAGS,
		SUBNAV_USER: SUBNAV + viewUrls.USERS
		*/
	};
});