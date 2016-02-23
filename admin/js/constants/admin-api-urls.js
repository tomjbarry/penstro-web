define(['js/constants/api-urls'], function(apiUrls) {
	var admin = '/admin';
	var id = '/{0}';
	var id1 = '/{1}';

	var targetId = '/target' + id;
	
	var target = admin + targetId;
	var user = admin + '/users' + id;
	var posting = admin + '/postings' + id;
	var comment = admin + '/comments' + id;
	var tag = admin + '/tags' + id;
	
	var usersCurrent = target + '/current';
	var tallyChange = '/tally/change';
	var remove = '/remove';
	var flag = '/flag';
	var warning = '/warning';
	
	var enable = '/enable';
	var disable = '/disable';
	
	var appreciate = '/appreciate';
	var finances = '/finances';
	var add = '/add';
	var roles = '/roles';
	var pendingActions = '/pending';
	var email = '/email';
	var payment = '/payment';
	var lock = '/lock';
	var unlock = '/unlock';
	var withdraw = '/withdraw';
	
	var subscription = '/subscription';
	var followers = '/followers';
	var followees = '/followees';
	var blocked = '/blocked';
	var offers = '/offers';
	var offees = '/offers/outstanding';
	var backers = '/backings';
	var backees = '/backings/outstanding';
	
	var restricted = '/restricted';
	var flagged = '/flag';
	
	return {
		USERS_ID: user,
		USERS_ID_CURRENT: usersCurrent,
		USERS_ID_PROFILE: target + '/profile',
		USERS_ID_APPRECIATION_RESPONSE: target + '/response',
		USERS_ID_LOGIN_ATTEMPTS: user + '/loginAttempts',
		USERS_ID_CURRENT_ROLES: target + roles,
		USERS_ID_PENDING_ACTIONS: target + pendingActions,
		USERS_ID_ROLES: user + roles,
		
		USERS_ID_EMAIL_CHANGE: user + email + '/change',
		USERS_ID_EMAIL_CHANGE_REQUEST: target + email,
		USERS_ID_PAYMENT_CHANGE_REQUEST: target + payment + '/send',
		USERS_ID_CONFIRMATION: target + '/confirmation',
		USERS_ID_PASSWORD: user + '/password',
		USERS_ID_PASSWORD_RESET: target + '/password/reset',
		USERS_ID_LOCK: user + lock,
		USERS_ID_UNLOCK: user + unlock,
		USERS_ID_DELETE: usersCurrent + '/delete',
		USERS_ID_RENAME: user + '/rename',
		
		USERS_ID_FINANCES: target + finances,
		USERS_ID_FINANCES_ADD: user + finances + add,
		USERS_ID_FINANCES_REMOVE: user + finances + remove,
		
		USERS_ID_PAYMENT: target + payment,
		
		USERS_ID_NOTIFICATIONS: target + '/notifications',
		USERS_ID_FEED: target + '/feed',
		USERS_ID_SETTINGS: target + '/settings',
		
		USERS_ID_SUBSCRIPTION: target + subscription,
		USERS_ID_FOLLOWEES: target + followees,
		USERS_ID_FOLLOWEES_ID: target + followees + '/users' + id1,
		USERS_ID_FOLLOWERS: target + followers,
		USERS_ID_FOLLOWERS_ID: target + followers + '/users' + id1,
		
		USERS_ID_BLOCKED: target + blocked,
		USERS_ID_BLOCKED_ID: target + blocked + '/users' + id1,
		
		USERS_ID_OFFERS: target + offers,
		USERS_ID_OFFERS_ID: target + offers + '/users' + id1,
		USERS_ID_OFFEES: target + offees,
		USERS_ID_OFFEES_ID: target + offees + '/users' + id1,
		USERS_ID_OFFEES_ID_WITHDRAW: target + offees + '/users' + id1 + withdraw,
		USERS_ID_OFFEES_EMAIL: target + offees + email,
		USERS_ID_OFFEES_EMAIL_ID: target + offees + email + '/users' + id1,
		USERS_ID_OFFEES_EMAIL_ID_WITHDRAW: target + offees + email + id1 + withdraw,
		USERS_ID_BACKERS: target + backers,
		USERS_ID_BACKERS_ID: target + backers + '/users' + id1,
		USERS_ID_BACKEES: target + backees,
		USERS_ID_BACKEES_ID: target + backees + '/users' + id1,
		
		POSTINGS_ID: posting,
		POSTINGS_SELF: usersCurrent + apiUrls.POSTINGS,
		POSTINGS_ID_REMOVE: posting + remove,
		POSTINGS_ID_FLAG: posting + flag,
		POSTINGS_ID_WARNING: posting + warning,
		POSTINGS_ID_ENABLE: target + apiUrls.POSTINGS + id1 + enable,
		POSTINGS_ID_DISABLE: target + apiUrls.POSTINGS + id1 + disable,
		POSTINGS_ID_TALLY_CHANGE: posting + tallyChange,
		POSTINGS_ID_APPRECIATE: posting + '/target' + id1 + appreciate,
		
		COMMENTS_ID: comment,
		COMMENTS_SELF: usersCurrent + apiUrls.COMMENTS,
		COMMENTS_ID_REMOVE: comment + remove,
		COMMENTS_ID_FLAG: comment + flag,
		COMMENTS_ID_WARNING: comment + warning,
		COMMENTS_ID_ENABLE: target + apiUrls.COMMENTS + id1 + enable,
		COMMENTS_ID_DISABLE: target + apiUrls.COMMENTS + id1 + disable,
		COMMENTS_ID_TALLY_CHANGE: comment + tallyChange,
		COMMENTS_ID_APPRECIATE: comment + '/target' + id1 + appreciate,
		
		TAGS_ID_LOCK: tag + lock,
		TAGS_ID_UNLOCK: tag + unlock,
		
		RESTRICTEDS: admin + restricted,
		RESTRICTEDS_ID: admin + restricted + id,
		
		FLAGGED_POSTINGS: admin + flagged + '/postings',
		FLAGGED_POSTINGS_ID: admin + flagged + '/postings' + id,
		FLAGGED_COMMENTS: admin + flagged + '/comments',
		FLAGGED_COMMENTS_ID: admin + flagged + '/comments' + id,
		FLAGGED_USERS: admin + flagged + '/users',
		FLAGGED_USERS_ID: admin + flagged + '/users' + id
	};
});