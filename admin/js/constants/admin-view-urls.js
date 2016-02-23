define(['js/constants/view-urls', 'js/constants/path-variables'], function(viewUrls, pathVars) {
	var admin = '/admin';
	
	var RESTRICTED = '/restricted';
	var FLAGGED = '/flagged';
	return {
		// uses the express route method /admin* without having a slash at the end, such as /admin/* or /admin/**
		ALL_EXPRESS: admin + '*',
		POSTINGS_ID: admin + viewUrls.POSTINGS_ID,
		
		COMMENTS_ID: admin + viewUrls.COMMENTS_ID,
		
		USERS_ID: admin + viewUrls.USERS_ID,
		USERS_ID_REPLIES: admin + viewUrls.USERS_ID_REPLIES,
		USERS_ID_FOLLOWERS: admin + viewUrls.USERS_ID_FOLLOWERS,
		USERS_ID_FOLLOWEES: admin + viewUrls.USERS_ID_FOLLOWEES,
		USERS_ID_POSTINGS: admin + viewUrls.USERS_ID_POSTINGS,
		USERS_ID_COMMENTS: admin + viewUrls.USERS_ID_COMMENTS,
		USERS_ID_OFFERS: admin + viewUrls.USERS_ID + viewUrls.OFFERS,
		USERS_ID_OFFEES: admin + viewUrls.USERS_ID + viewUrls.OFFEES,
		USERS_ID_OFFEES_EMAIL: admin + viewUrls.USERS_ID + viewUrls.OFFEES_EMAIL,
		USERS_ID_BACKERS: admin + viewUrls.USERS_ID + viewUrls.BACKERS,
		USERS_ID_BACKEES: admin + viewUrls.USERS_ID + viewUrls.BACKEES,
		USERS_ID_BLOCKED: admin + viewUrls.USERS_ID + viewUrls.BLOCKED,
		USERS_ID_FEED: admin + viewUrls.USERS_ID + viewUrls.FEED,
		USERS_ID_NOTIFICATIONS: admin + viewUrls.USERS_ID + viewUrls.NOTIFICATIONS,
		
		RESTRICTED_USERNAMES: admin + RESTRICTED,
		RESTRICTED_PASSWORDS: admin + RESTRICTED + '/passwords',
		RESTRICTED_EMAILS: admin + RESTRICTED + '/emails',
		
		FLAGGED_POSTINGS: admin + FLAGGED + viewUrls.POSTINGS,
		FLAGGED_COMMENTS: admin + FLAGGED + viewUrls.COMMENTS,
		FLAGGED_USERS: admin + FLAGGED
	};
});