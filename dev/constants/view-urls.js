define(['js/constants/path-variables'], function(pathVars) {
	
	var MESSAGES = '/messages';
	
	var POSTINGS = '/posts';
	var COMMENTS = '/comments';
	var USERS = '/users';
	var TAGS = '/tags';
	var FOLLOWERS = '/followers';
	var FOLLOWEES = '/following';
	var ACTIVITY = '/activity';
	var PV = '/:';
	var CURRENT = '/profile';
	var REPLIES = '/replies';
	var OFFEES = '/offersOutstanding';
	
	var PARTIALS = '/partials';
	var INFO = '/info';
	var SINGLE = '/single';
	var PAGE = '/page';
	
	var CREATE_POSTING = '/compose';
	var CREATE_COMMENT = '/reply';
	var APPRECIATION_RESPONSE = '/response';
	var DEFAULT = POSTINGS;
	var EMAIL = '/email';
	var CHANGE = '/change';
	var TITLE = '/t';
	var EDIT = '/edit';
	var HELP = '/help';
	
	var SELF = '/self';
	
	return {
		DEFAULT: DEFAULT,
		AUTHENTICATION: DEFAULT,
		LOGGED_OUT: '/securityLogout',
		NOT_FOUND: '/notFound',
		NO_CONTENT: '/noContent',
		RESET_PASSWORD: '/password/reset',
		INDEX: '/',
		INDEX_BLANK: '',
		SETTINGS: '/settings',
		SETTINGS_ERROR: '/settingsError',
		DELETED: '/deleted',
		TERMS: '/terms',
		EXTERNAL_URL: '/extUrl',
		
		// payment
		PAYMENT: '/payment',
		PAYMENT_SUCCESS: '/payment/success',
		PAYMENT_CANCEL: '/payment/cancel',
		
		// email token links
		EMAIL_CHANGE: EMAIL + CHANGE,
		PAYMENT_CHANGE: '/payment' + CHANGE,
		PASSWORD_CHANGE: '/password' + CHANGE,
		CONFIRMATION: '/confirmation',
		DELETION: '/deleted' + CHANGE,

		// profile
		CURRENT: CURRENT,
		//CURRENT_APPRECIATION_RESPONSE: CURRENT + APPRECIATION_RESPONSE,
		//CURRENT_CREATE_COMMENT: CURRENT + CREATE_COMMENT,
		CURRENT_REPLIES: CURRENT + REPLIES,
		CURRENT_POSTINGS: CURRENT + POSTINGS,
		CURRENT_COMMENTS: CURRENT + COMMENTS,
		CURRENT_SELF_POSTINGS: CURRENT + SELF + POSTINGS,
		CURRENT_SELF_COMMENTS: CURRENT + SELF + COMMENTS,
		// (default) CURRENT_ACTIVITY: CURRENT + ACTIVITY,
		
		// user options
		NOTIFICATIONS: '/notifications',
		FEED: '/feed',
		BACKERS: '/backers',
		BACKEES: '/backing',
		FOLLOWERS: FOLLOWERS,
		FOLLOWEES: FOLLOWEES,
		BLOCKED: '/blocked',
		OFFERS: '/offers',
		OFFEES: OFFEES,
		OFFEES_EMAIL: OFFEES + EMAIL,
		MESSAGES: MESSAGES,
		
		// content
		POSTINGS: POSTINGS,
		POSTINGS_CREATE: CREATE_POSTING,
		POSTINGS_ID: POSTINGS + PV + pathVars.POSTING,
		POSTINGS_ID_TITLE: POSTINGS + PV + pathVars.POSTING + TITLE + PV + pathVars.TITLE,
		//POSTINGS_ID_CREATE_COMMENT: POSTINGS + PV + pathVars.POSTING + CREATE_COMMENT,
		//POSTINGS_ID_EDIT: POSTINGS + PV + pathVars.POSTING + EDIT,
		// (default) POSTINGS_ID_REPLIES: POSTINGS + PV + pathVars.POSTING + REPLIES,
		COMMENTS: COMMENTS,
		COMMENTS_ID: COMMENTS + PV + pathVars.COMMENT,
		//COMMENTS_ID_CREATE_COMMENT: COMMENTS + PV + pathVars.COMMENT + CREATE_COMMENT,
		// (default) COMMENTS_ID_REPLIES: COMMENTS + PV + pathVars.COMMENT + REPLIES,
		TAGS: TAGS,
		TAGS_ID: TAGS + PV + pathVars.TAG,
		//TAGS_ID_CREATE_COMMENT: TAGS + PV + pathVars.TAG + CREATE_COMMENT,
		TAGS_ID_REPLIES: TAGS + PV + pathVars.TAG + REPLIES,
		// (default) TAGS_ID_POSTINGS: TAGS + PV + pathVars.TAG + POSTINGS,
		USERS: USERS,
		USERS_ID: USERS + PV + pathVars.USER,
		//USERS_ID_APPRECIATION_RESPONSE: USERS + PV + pathVars.USER + APPRECIATION_RESPONSE,
		//USERS_ID_CREATE_COMMENT: USERS + PV + pathVars.USER + CREATE_COMMENT,
		USERS_ID_REPLIES: USERS + PV + pathVars.USER + REPLIES,
		USERS_ID_FOLLOWERS: USERS + PV + pathVars.USER + FOLLOWERS,
		USERS_ID_FOLLOWEES: USERS + PV + pathVars.USER + FOLLOWEES,
		// (default) USERS_ID_ACTIVITY: USERS + PV + pathVars.USER + ACTIVITY,
		USERS_ID_POSTINGS: USERS + PV + pathVars.USER + POSTINGS,
		USERS_ID_COMMENTS: USERS + PV + pathVars.USER + COMMENTS,
		USERS_ID_MESSAGES: USERS + PV + pathVars.USER + MESSAGES,
		
		WELCOME: '/welcome',
		ACCOUNT: '/account',
		//ABOUT: '/about',
		CAREERS: '/careers',
		SUPPORT: '/support',
		HELP: HELP,
		HELP_ID: HELP + PV + pathVars.HELP,
		
		slashless: function(path) {
			if(typeof(path) !== 'undefined' && path.length > 0 && path.charAt(0) === '/') {
				return path.substring(1, path.length);
			}
			return path;
		}
	};
});