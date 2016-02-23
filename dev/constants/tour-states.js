define(['js/constants/states'], function(states) {
	var ts = {
		GENERAL: {
			key: 'g',
			states: [states.WELCOME, states.TERMS, states.ABOUT, states.ACCOUNT],
			unauthed: {
				BRAND: 'brand',
				ACTION_BAR: 'actionBar',
				TOUR_AVAILABLE: 'tourAvailable',
				SETTINGS: 'settings',
				AUTHENTICATION: 'authentication'
			},
			authed: {
				CREATE_POSTING: 'createPosting',
				PAYMENT_PROCESSING: 'paymentProcessing',
				CACHE_DELAY: 'cacheDelay'
			}
		},
		CONTENT: {
			key: 'con',
			states: [states.POSTINGS, states.COMMENTS, states.TAGS, states.USERS],
			unauthed: {
				CONTENT_SELECT: 'contentSelect',
				TIME_SELECT: 'timeSelect',
				CONTENT: 'content'
			},
			authed: {
			}
		},
		POSTING: {
			key: 'p',
			states: [states.POSTINGS_ID, states.POSTINGS_ID_TITLE],
			unauthed: {
				TITLE: 'title',
				AUTHOR: 'author',
				TAGS: 'tags',
				APPRECIATION: 'appreciation',
				HELP: 'help'
			},
			authed: {
				APPRECIATE: 'appreciate',
				PROMOTE: 'promote',
				MORE: 'more',
				COMMENT: 'comment'
			}
		},
		COMMENT: {
			key: 'c',
			states: [states.COMMENTS_ID],
			unauthed: {
				AUTHOR: 'author',
				CONTEXT: 'context',
				APPRECIATION: 'appreciation',
				HELP: 'help'
			},
			authed: {
				APPRECIATE: 'appreciate',
				PROMOTE: 'promote',
				MORE: 'more',
				COMMENT: 'comment'
			}
		},
		TAG: {
			key: 't',
			states: [states.TAGS_ID],
			unauthed: {
				TAG: 'tag',
				PROMOTION: 'promotion',
				HELP: 'help'
			},
			authed: {
				COMMENT: 'comment'
			}
		},
		USER: {
			key: 'u',
			states: [states.USERS_ID],
			unauthed: {
				USERNAME: 'username',
				APPRECIATION: 'appreciation',
				HELP: 'help'
			},
			authed: {
				FOLLOW: 'follow',
				MESSAGE: 'message',
				MORE: 'more',
				COMMENT: 'comment'
			}
		},
		CURRENT: {
			key: 'cur',
			states: [states.CURRENT],
			unauthed: {
			},
			authed: {
				APPRECIATION: 'appreciation',
				DESCRIPTION: 'description',
				APPRECIATION_RESPONSE: 'appreciationResponse',
				VIEW_USER: 'viewUser',
				//MORE: 'more',
				COMMENT: 'comment'
			}
		}
	};
	ts.GENERAL.order = [ts.GENERAL.unauthed.BRAND,
                      ts.GENERAL.unauthed.ACTION_BAR,
                      ts.GENERAL.unauthed.TOUR_AVAILABLE,
                      ts.GENERAL.unauthed.SETTINGS,
                      ts.GENERAL.unauthed.AUTHENTICATION];
	ts.GENERAL.authedOrder = [ts.GENERAL.authed.CREATE_POSTING,
														ts.GENERAL.authed.PAYMENT_PROCESSING,
														ts.GENERAL.authed.CACHE_DELAY];
	
	ts.CONTENT.order = [ts.CONTENT.unauthed.CONTENT_SELECT,
											ts.CONTENT.unauthed.TIME_SELECT,
											ts.CONTENT.unauthed.CONTENT];
	ts.CONTENT.authedOrder = [];
	
	ts.POSTING.order = [ts.POSTING.unauthed.TITLE,
											ts.POSTING.unauthed.AUTHOR,
											ts.POSTING.unauthed.TAGS,
											ts.POSTING.unauthed.APPRECIATION,
											ts.POSTING.unauthed.HELP];
	ts.POSTING.authedOrder = [ts.POSTING.authed.APPRECIATE,
														ts.POSTING.authed.PROMOTE,
														ts.POSTING.authed.MORE,
														ts.POSTING.authed.COMMENT];
	
	ts.COMMENT.order = [ts.COMMENT.unauthed.AUTHOR,
											ts.COMMENT.unauthed.CONTEXT,
											ts.COMMENT.unauthed.APPRECIATION,
											ts.COMMENT.unauthed.HELP];
	ts.COMMENT.authedOrder = [ts.COMMENT.authed.APPRECIATE,
														ts.COMMENT.authed.PROMOTE,
														ts.COMMENT.authed.MORE,
														ts.COMMENT.authed.COMMENT];
	
	ts.TAG.order = [ts.TAG.unauthed.TAG,
									ts.TAG.unauthed.PROMOTION,
									ts.TAG.unauthed.HELP];
	ts.TAG.authedOrder = [ts.TAG.authed.COMMENT];
	
	ts.USER.order = [ts.USER.unauthed.USERNAME,
									ts.USER.unauthed.APPRECIATION,
									ts.USER.unauthed.HELP];
	ts.USER.authedOrder = [ts.USER.authed.FOLLOW,
												ts.USER.authed.MESSAGE,
												ts.USER.authed.MORE,
												ts.USER.authed.COMMENT];
	
	ts.CURRENT.order = [];
	ts.CURRENT.authedOrder = [ts.CURRENT.authed.APPRECIATION,
												ts.CURRENT.authed.DESCRIPTION,
												ts.CURRENT.authed.APPRECIATION_RESPONSE,
												ts.CURRENT.authed.VIEW_USER,
												//ts.CURRENT.authed.MORE,
												ts.CURRENT.authed.COMMENT];
	
	for(var i in ts) {
		if(ts.hasOwnProperty(i)) {
			ts[i].name = i;
		}
	}
	
	return ts;
});