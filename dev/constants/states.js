define(['js/constants/path-variables'], function(pathVars) {
	var MESSAGES = 'messages';
	
	var REPLIES = 'replies';
	var POSTINGS = 'posts';
	var COMMENTS = 'comments';
	var USERS = 'users';
	var TAGS = 'tags';
	var FOLLOWERS = 'followers';
	var FOLLOWEES = 'following';
	var ACTIVITY = 'activity';
	var OFFEES = 'offersOutstanding';
	
	var SUB = '.';
	var NOSUB = '-';
	var CHANGE = 'change';
	var EDIT = 'edit';
	var CREATE = 'create';
	var CURRENT = 'current';
	
	var PARTIALS = 'partials';
	var INFO = 'info';
	var SINGLE = 'single';
	var PAGE = 'page';
	
	var CREATE_COMMENT = 'createComment';
	var APPRECIATION_RESPONSE = 'response';
	var BACK = 'back';
	var EMAIL = 'email';
	var HELP = 'help';
	
	var BASE = 'base';
	
	var ROOT = 'root';
	
	var state = function(s) {
		return ROOT + SUB + s;
	};
	
	var id = function(s) {
		return s;
	};
	
	return {
		ROOT: ROOT,
		DEFAULT: state(POSTINGS),
		AUTHENTICATION: state(POSTINGS),
		LOGGED_OUT: state('loggedOut'),
		NOT_FOUND: state('notFound'),
		NO_CONTENT: state('noContent'),
		RESET_PASSWORD: state('resetPassword'),
		INVALID: state('invalid'),
		INDEX: state('index'),
		SETTINGS: state('settings'),
		SETTINGS_ERROR: state('settingsError'),
		DELETED: state('deleted'),
		TERMS: state('terms'),
		EXTERNAL_URL: state('externalUrl'),
		
		WELCOME: state('welcome'),
		ACCOUNT: state('account'),
		//ABOUT: state('about'),
		CAREERS: state('careers'),
		SUPPORT: state('support'),
		HELP: state(HELP),
		HELP_ID: state(HELP + NOSUB + id(pathVars.HELP)),
		
		// payment
		PAYMENT: state('payment'),
		PAYMENT_SUCCESS: state('payment' + NOSUB + 'success'),
		PAYMENT_CANCEL: state('payment' + NOSUB + 'cancel'),
		
		// email token links
		EMAIL_CHANGE: state(EMAIL + NOSUB + CHANGE),
		PAYMENT_CHANGE: state('payment' + NOSUB + CHANGE),
		PASSWORD_CHANGE: state('password' + NOSUB + CHANGE),
		CONFIRMATION: state('confirmation'),
		DELETION: state('deleted' + NOSUB + CHANGE),

		// self
		CURRENT: state(CURRENT),
		CURRENT_APPRECIATION_RESPONSE: state(CURRENT + NOSUB + APPRECIATION_RESPONSE),
		CURRENT_CREATE_COMMENT: state(CURRENT + NOSUB + CREATE_COMMENT),
		CURRENT_REPLIES: state(CURRENT + NOSUB + REPLIES),
		CURRENT_POSTINGS: state(CURRENT + NOSUB + POSTINGS),
		CURRENT_COMMENTS: state(CURRENT + NOSUB + COMMENTS),
		CURRENT_SELF_POSTINGS: state(CURRENT + NOSUB + 'self' + POSTINGS),
		CURRENT_SELF_COMMENTS: state(CURRENT + NOSUB + 'self' + COMMENTS),
		// (default) CURRENT_ACTIVITY: state(CURRENT + NOSUB + ACTIVITY),
		
		// user options
		NOTIFICATIONS: state(CURRENT + NOSUB + 'notifications'),
		FEED: state(CURRENT + NOSUB + 'feed'),
		BACKERS: state(CURRENT + NOSUB + 'backers'),
		BACKEES: state(CURRENT + NOSUB + 'backing'),
		FOLLOWERS: state(CURRENT + NOSUB + FOLLOWERS),
		FOLLOWEES: state(CURRENT + NOSUB + FOLLOWEES),
		BLOCKED: state(CURRENT + NOSUB + 'blocked'),
		OFFERS: state(CURRENT + NOSUB + 'offers'),
		OFFEES: state(CURRENT + NOSUB + OFFEES),
		OFFEES_EMAIL: state(CURRENT + NOSUB + OFFEES + NOSUB + EMAIL),
		MESSAGES: state(CURRENT + NOSUB + MESSAGES),
		
		// content
		POSTINGS: state(POSTINGS),
		POSTINGS_CREATE: state(POSTINGS + NOSUB + CREATE),
		POSTINGS_ID: state(POSTINGS + NOSUB + id(pathVars.POSTING)),
		POSTINGS_ID_TITLE: state(POSTINGS + NOSUB + id(pathVars.POSTING) + NOSUB + id(pathVars.TITLE)),
		POSTINGS_ID_CREATE_COMMENT: state(POSTINGS + NOSUB + id(pathVars.POSTING) + NOSUB + CREATE_COMMENT),
		POSTINGS_ID_EDIT: state(POSTINGS + NOSUB + id(pathVars.POSTING) + NOSUB + EDIT),
		// (default) POSTINGS_ID_REPLIES: state(POSTINGS + NOSUB + id(pathVars.POSTING) + NOSUB + REPLIES),
		
		COMMENTS: state(COMMENTS),
		COMMENTS_ID: state(COMMENTS + NOSUB + id(pathVars.COMMENT)),
		COMMENTS_ID_CREATE_COMMENT: state(COMMENTS + NOSUB + id(pathVars.COMMENT) + NOSUB + CREATE_COMMENT),
		// (default) COMMENTS_ID_REPLIES: state(COMMENTS + NOSUB + id(pathVars.COMMENT) + NOSUB + REPLIES),
		
		TAGS: state(TAGS),
		TAGS_ID: state(TAGS + NOSUB + id(pathVars.TAG)),
		TAGS_ID_CREATE_COMMENT: state(TAGS + NOSUB + id(pathVars.TAG) + NOSUB + CREATE_COMMENT),
		TAGS_ID_REPLIES: state(TAGS + NOSUB + id(pathVars.TAG) + NOSUB + REPLIES),
		// (default) TAGS_ID_POSTINGS: state(TAGS + NOSUB + id(pathVars.TAG) + NOSUB + POSTINGS),
		
		USERS: state(USERS),
		USERS_ID: state(USERS + NOSUB + id(pathVars.USER)),
		USERS_ID_APPRECIATION_RESPONSE: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + APPRECIATION_RESPONSE),
		USERS_ID_CREATE_COMMENT: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + CREATE_COMMENT),
		USERS_ID_REPLIES: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + REPLIES),
		USERS_ID_FOLLOWERS: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + FOLLOWERS),
		USERS_ID_FOLLOWEES: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + FOLLOWEES),
		// (default) USERS_ID_ACTIVITY: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + ACTIVITY),
		USERS_ID_POSTINGS: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + POSTINGS),
		USERS_ID_COMMENTS: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + COMMENTS),
		USERS_ID_MESSAGES: state(USERS + NOSUB + id(pathVars.USER) + NOSUB + MESSAGES),
		
		state: state,
		id: id
	};
});