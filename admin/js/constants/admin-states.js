define(['js/constants/states'], function(states) {
	
	var RESTRICTED = 'restricted';
	var FLAGGED = 'flagged';
	var admin = 'admin';
	var NOSUB = '-';
	var SUB = '.';
	
	var state = states.state;
	var id = states.id;
	
	return {
		POSTINGS_ID: states.POSTINGS_ID + NOSUB + admin,
		
		COMMENTS_ID: states.COMMENTS_ID + NOSUB + admin,
		
		USERS_ID: states.USERS_ID + NOSUB + admin,
		USERS_ID_REPLIES: states.USERS_ID_REPLIES + NOSUB + admin,
		USERS_ID_FOLLOWERS: states.USERS_ID_FOLLOWERS + NOSUB + admin,
		USERS_ID_FOLLOWEES: states.USERS_ID_FOLLOWEES + NOSUB + admin,
		USERS_ID_POSTINGS: states.USERS_ID_POSTINGS + NOSUB + admin,
		USERS_ID_COMMENTS: states.USERS_ID_COMMENTS + NOSUB + admin,
		USERS_ID_OFFERS: states.USERS_ID + SUB + 'offers' + NOSUB + admin,
		USERS_ID_OFFEES: states.USERS_ID + SUB + 'offersOutstanding' + NOSUB + admin,
		USERS_ID_OFFEES_EMAIL: states.USERS_ID + SUB + 'offersOutstanding' + NOSUB + 'email' + NOSUB + admin,
		USERS_ID_BACKERS: states.USERS_ID + SUB + 'backers' + NOSUB + admin,
		USERS_ID_BACKEES: states.USERS_ID + SUB + 'backing' + NOSUB + admin,
		USERS_ID_BLOCKED: states.USERS_ID + SUB + 'blocked' + NOSUB + admin,
		USERS_ID_FEED: states.USERS_ID + SUB + 'feed' + NOSUB + admin,
		USERS_ID_NOTIFICATIONS: states.USERS_ID + SUB + 'notifications' + NOSUB + admin,
		
		RESTRICTED_USERNAMES: state(RESTRICTED + NOSUB + 'usernames'),
		RESTRICTED_PASSWORDS: state(RESTRICTED + NOSUB + 'passwords'),
		RESTRICTED_EMAILS: state(RESTRICTED + NOSUB + 'emails'),
		
		FLAGGED_POSTINGS: state(FLAGGED + NOSUB + 'postings'),
		FLAGGED_COMMENTS: state(FLAGGED + NOSUB + 'comments'),
		FLAGGED_USERS: state(FLAGGED + NOSUB + 'users')
	};
});