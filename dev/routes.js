define(['./app', 'jquery', 'jquery-cookie', 'js/util/route-utils', 'js/util/utils', 'js/constants/cookies', 'js/constants/view-urls',
        'js/constants/partial-urls', 'js/constants/states', 'js/constants/content-types', 'js/constants/roles',
        'js/constants/path-variables'],
	function(app, $, jqueryCookie, routeUtils, utils, cookies, viewUrls, partialUrls, states, contentTypes, roles, pathVars) {
		'use strict';
		return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
			function($stateProvider, $urlRouterProvider, $locationProvider) {
				
				var url = routeUtils.funcs.url;
			
				var views = routeUtils.funcs.views;
				var info = routeUtils.funcs.info;
				var single = routeUtils.funcs.single;
				var page = routeUtils.funcs.page;
				var pageLoader = routeUtils.funcs.pageLoader;
				
				var infoController = routeUtils.controllers.info;
				
				var helpTemplateFunc = function($stateParams) {
					return partialUrls.HELP + '/' + $stateParams[pathVars.HELP];
				};
				var helpTitleFunc = function(toParams) {
					var str = 'helpTopics';
					if(typeof(toParams) === 'undefined') {
						return str + '.default';
					}
					return str + '.' + toParams[pathVars.HELP];
				};
				
				var cookieDefaultOptions = cookies.getCookieOptions();
	
				var cookieOptions = {
					domain: cookieDefaultOptions.domain,
					path: cookieDefaultOptions.path,
					secure: cookieDefaultOptions.secure
				};
				
				var indexFunction = function() {
					return viewUrls.POSTINGS;
					/*
					if($.cookie()[cookies.INDEX] === 'p') {
						return viewUrls.POSTINGS;
					} else {
						$.cookie(cookies.INDEX, 'p', cookieOptions);
						return viewUrls.WELCOME;
					}*/
				};
				
				$urlRouterProvider
					.when(viewUrls.INDEX, indexFunction)
					.when(viewUrls.INDEX_BLANK, indexFunction)
					.otherwise(viewUrls.NOT_FOUND);
				
				// rewrites trailing slashes
				$urlRouterProvider
					.rule(function($injector, $location) {
						var url = $location.url().split('?');
						var path = url[0];
						var parameters = url[1];
						var hasTrailingSlash = path[path.length - 1] === '/';
						
						if(hasTrailingSlash) {
							var newPath = path.substr(0, path.length - 1);
							if(typeof(parameters) === 'undefined') {
								return newPath;
							} else {
								return newPath + '?' + parameters;
							}
						}
					});
				
				var overrideRoles = roles.overrideRoles;
				
				$stateProvider
					.state(states.ROOT, {
						abstract: true
					})
					.state(states.NOT_FOUND, {
						title: 'notFound',
						url: url(viewUrls.NOT_FOUND),
						views: views(undefined, info(partialUrls.NOT_FOUND, infoController))
					})
					.state(states.LOGGED_OUT, {
						title: 'loggedOut',
						url: url(viewUrls.LOGGED_OUT),
						views: views(undefined, info(partialUrls.LOGGED_OUT, infoController))
					})
					.state(states.RESET_PASSWORD, {
						title: 'resetPassword',
						url: url(viewUrls.RESET_PASSWORD),
						views: views(undefined, info(partialUrls.RESET_PASSWORD, 'ResetPasswordController')),
						authentication: false
					})
					.state(states.DELETED, {
						url: url(viewUrls.DELETED),
						views: views(undefined, info(partialUrls.DELETED, 'DeletedController'))
					})
					.state(states.EMAIL_CHANGE, {
						title: 'emailLink.email',
						url: url(viewUrls.EMAIL_CHANGE),
						views: views(undefined, info(partialUrls.EMAIL_CHANGE, 'EmailChangeController'))
					})
					.state(states.PAYMENT_CHANGE, {
						title: 'emailLink.payment',
						url: url(viewUrls.PAYMENT_CHANGE),
						views: views(undefined, info(partialUrls.PAYMENT_CHANGE, 'PaymentChangeController'))
					})
					.state(states.PASSWORD_CHANGE, {
						title: 'emailLink.password',
						url: url(viewUrls.PASSWORD_CHANGE),
						views: views(undefined, info(partialUrls.PASSWORD_CHANGE_UNAUTHED, 'PasswordChangeUnauthedController')),
						authentication: false
					})
					.state(states.CONFIRMATION, {
						url: url(viewUrls.CONFIRMATION),
						views: views(undefined, info(partialUrls.REDIRECTING, 'ConfirmationController'))
					})
					.state(states.DELETION, {
						url: url(viewUrls.DELETION),
						views: views(undefined, info(partialUrls.REDIRECTING, 'DeletionController'))
					})
					.state(states.SETTINGS, {
						title: 'settings',
						url: url(viewUrls.SETTINGS),
						views: views(undefined, info(partialUrls.SETTINGS, 'SettingsController'))
					})
					.state(states.SETTINGS_ERROR, {
						title: 'settings',
						url: url(viewUrls.SETTINGS_ERROR),
						views: views(undefined, info(partialUrls.REDIRECTING, 'SettingsErrorController'))
					})
					.state(states.TERMS, {
						title: 'terms',
						url: url(viewUrls.TERMS),
						views: views(undefined, info(partialUrls.TERMS, 'TermsController')),
						skipBack: true
					})
					.state(states.EXTERNAL_URL, {
						title: 'externalUrl',
						url: url(viewUrls.EXTERNAL_URL),
						views: views(undefined, info(partialUrls.EXTERNAL_URL, 'ExternalUrlController')),
						skipBack: true
					})
					.state(states.PAYMENT_SUCCESS, {
						url: url(viewUrls.PAYMENT_SUCCESS),
						views: views(undefined, info(partialUrls.REDIRECTING, 'PaymentSuccessController'))
					})
					.state(states.PAYMENT_CANCEL, {
						url: url(viewUrls.PAYMENT_CANCEL),
						views: views(undefined, info(partialUrls.REDIRECTING, 'PaymentCancelController'))
					})
					.state(states.POSTINGS_CREATE, {
						title: 'create.posting',
						url: url(viewUrls.POSTINGS_CREATE),
						views: views(undefined, info(partialUrls.CREATE_POSTING, 'CreatePostingController')),
						authentication: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					});
				
				// generic
				$stateProvider
					.state(states.WELCOME, {
						title: 'welcome',
						url: url(viewUrls.WELCOME),
						views: views(undefined, info(partialUrls.WELCOME, infoController))
					})
					.state(states.ACCOUNT, {
						title: 'account',
						url: url(viewUrls.ACCOUNT),
						views: views(undefined, info(partialUrls.ACCOUNT, infoController))
					})
					/*
					.state(states.RULES, {
						title: 'rules',
						url: url(viewUrls.RULES),
						views: views(info(partialUrls.RULES, infoController))
					})*/
					/*.state(states.ABOUT, {
						title: 'about',
						url: url(viewUrls.ABOUT),
						views: views(info(partialUrls.ABOUT, infoController))
					})*/
					/*
					.state(states.PRIVACY, {
						title: 'privacy',
						url: url(viewUrls.PRIVACY),
						views: views(info(partialUrls.PRIVACY, infoController))
					})*/
					.state(states.CAREERS, {
						title: 'careers',
						url: url(viewUrls.CAREERS),
						views: views(undefined, info(partialUrls.CAREERS, infoController))
					})
					.state(states.SUPPORT, {
						title: 'support',
						url: url(viewUrls.SUPPORT),
						views: views(undefined, info(partialUrls.SUPPORT, infoController))
					})
					.state(states.HELP, {
						title: 'help',
						url: url(viewUrls.HELP),
						views: views(undefined, info(partialUrls.HELP, infoController))
					})
					.state(states.HELP_ID, {
						title: 'help',
						url: url(viewUrls.HELP_ID),
						views: views(undefined, info(helpTemplateFunc, 'HelpController'))
					});
				
				/*
					.state(states.PAYMENT, {
						url: url(viewUrls.PAYMENT),
						views: views(info(partialUrls.PAYMENT, 'PaymentController'))
					})
					*/
				
				// postings
				$stateProvider
					.state(states.POSTINGS, {
						title: 'postings',
						url: url(viewUrls.POSTINGS),
						views: views('PostingsController')
					})
					.state(states.POSTINGS_ID, {
						title: 'postings',
						url: url(viewUrls.POSTINGS_ID),
						views: views('SinglePostingController'),
						single: contentTypes.POSTING
					})
					.state(states.POSTINGS_ID_TITLE, {
						title: 'postings',
						url: url(viewUrls.POSTINGS_ID_TITLE),
						views: views('SinglePostingController'),
						single: contentTypes.POSTING
					});
					/*.state(states.POSTINGS_ID_CREATE_COMMENT, {
						title: 'reply',
						url: url(viewUrls.POSTINGS_ID_CREATE_COMMENT),
						views: views(info(partialUrls.CREATE_COMMENT, 'CreateCommentController'), single(partialUrls.POSTING, 'SinglePostingController')),
						single: contentTypes.POSTING,
						authentication: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					})
					.state(states.POSTINGS_ID_EDIT, {
						title: 'authorsNote',
						url: url(viewUrls.POSTINGS_ID_EDIT),
						views: views(info(partialUrls.EDIT_POSTING, 'EditPostingController'), single(partialUrls.POSTING, 'SinglePostingController')),
						single: contentTypes.POSTING,
						authentication: true
					});*/
					/*.state(states.POSTINGS_ID_REPLIES, {
						title: 'replies',
						url: url(viewUrls.POSTINGS_ID_REPLIES),
						views: views(undefined, single(partialUrls.POSTING, 'SinglePostingController'), page(partialUrls.COMMENT_VIEW), pageLoader('PostingCommentsController')),
						single: contentTypes.POSTING
					});*/
				
				// comments
				$stateProvider
					.state(states.COMMENTS, {
						title: 'comments',
						url: url(viewUrls.COMMENTS),
						views: views('CommentsController')
					})
					.state(states.COMMENTS_ID, {
						title: 'comments',
						url: url(viewUrls.COMMENTS_ID),
						views: views('SingleCommentController'),
						single: contentTypes.COMMENT
					});
					/*.state(states.COMMENTS_ID_CREATE_COMMENT, {
						title: 'reply',
						url: url(viewUrls.COMMENTS_ID_CREATE_COMMENT),
						views: views(info(partialUrls.CREATE_COMMENT, 'CreateCommentController'), single(partialUrls.COMMENT, 'SingleCommentController')),
						single: contentTypes.COMMENT,
						authentication: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					});*/
					/*.state(states.COMMENTS_ID_REPLIES, {
						title: 'replies',
						url: url(viewUrls.COMMENTS_ID_REPLIES),
						views: views(undefined, single(partialUrls.COMMENT, 'SingleCommentController'), page(partialUrls.COMMENT_VIEW), pageLoader('CommentCommentsController')),
						single: contentTypes.COMMENT
					});*/
				
				// tags
				$stateProvider
					.state(states.TAGS, {
						title: 'tags',
						url: url(viewUrls.TAGS),
						views: views('TagsController')
					})
					.state(states.TAGS_ID, {
						title: 'tags',
						url: url(viewUrls.TAGS_ID),
						views: views('SingleTagController'),
						single: contentTypes.TAG
					})
					/*.state(states.TAGS_ID_CREATE_COMMENT, {
						title: 'reply',
						url: url(viewUrls.TAGS_ID_CREATE_COMMENT),
						views: views(info(partialUrls.CREATE_COMMENT, 'CreateCommentController'), single(partialUrls.TAG, 'SingleTagController')),
						single: contentTypes.TAG,
						authenticated: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					})*/
					.state(states.TAGS_ID_REPLIES, {
						title: 'replies',
						url: url(viewUrls.TAGS_ID_REPLIES),
						views: views('SingleTagController'),
						single: contentTypes.TAG
					});
					/*.state(states.TAGS_ID_POSTINGS, {
						title: 'postings',
						url: url(viewUrls.TAGS_ID_POSTINGS),
						views: views(undefined, single(partialUrls.TAG, 'SingleTagController'), page(partialUrls.POSTING_PREVIEW), pageLoader('PostingsByTagController')),
						single: contentTypes.TAG
					});*/
				
				// users
				$stateProvider
					.state(states.USERS, {
						title: 'users',
						url: url(viewUrls.USERS),
						views: views('UsersController')
					})
					.state(states.USERS_ID, {
						title: 'users',
						url: url(viewUrls.USERS_ID),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					/*.state(states.USERS_ID_APPRECIATION_RESPONSE, {
						title: 'appreciationResponse',
						url: url(viewUrls.USERS_ID_APPRECIATION_RESPONSE),
						views: views(undefined, single(partialUrls.USER_APPRECIATION_RESPONSE, 'SingleUserController')),
						single: contentTypes.USER,
						authenticated: true
					})*/
					/*.state(states.USERS_ID_CREATE_COMMENT, {
						title: 'reply',
						url: url(viewUrls.USERS_ID_CREATE_COMMENT),
						views: views(info(partialUrls.CREATE_COMMENT, 'CreateCommentController'), single(partialUrls.USER, 'SingleUserController')),
						single: contentTypes.USER,
						authenticated: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					})*/
					.state(states.USERS_ID_REPLIES, {
						title: 'replies',
						url: url(viewUrls.USERS_ID_REPLIES),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					.state(states.USERS_ID_POSTINGS, {
						title: 'postings',
						url: url(viewUrls.USERS_ID_POSTINGS),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					.state(states.USERS_ID_COMMENTS, {
						title: 'comments',
						url: url(viewUrls.USERS_ID_COMMENTS),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					.state(states.USERS_ID_FOLLOWERS, {
						title: 'followers',
						url: url(viewUrls.USERS_ID_FOLLOWERS),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					.state(states.USERS_ID_FOLLOWEES, {
						title: 'followees',
						url: url(viewUrls.USERS_ID_FOLLOWEES),
						views: views('SingleUserController'),
						single: contentTypes.USER
					})
					/*.state(states.USERS_ID_ACTIVITY, {
						title: 'activity',
						url: url(viewUrls.USERS_ID_ACTIVITY),
						views: views(undefined, single(partialUrls.USER, 'SingleUserController'), page(partialUrls.ACTIVITY), pageLoader('ActivityByUserController')),
						single: contentTypes.USER
					})*/
					.state(states.USERS_ID_MESSAGES, {
						title: 'messages',
						url: url(viewUrls.USERS_ID_MESSAGES),
						//views: views(info(partialUrls.CREATE_MESSAGE, 'CreateMessageController'), single(partialUrls.USER, 'SingleUserController'), page(partialUrls.MESSAGE), pageLoader('MessagesController')),
						//views: views(info(partialUrls.CREATE_MESSAGE, 'CreateMessageController'), single(undefined, 'SingleUserController'), page(partialUrls.MESSAGE), pageLoader('MessagesController')),
						views: views('MessagesController', info(partialUrls.CREATE_MESSAGE, 'CreateMessageController')),
						single: contentTypes.USER,
						authentication: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					});
				
				// current
				$stateProvider
					.state(states.CURRENT, {
						title: 'current',
						url: url(viewUrls.CURRENT),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					/*.state(states.CURRENT_APPRECIATION_RESPONSE, {
						title: 'appreciationResponse',
						url: url(viewUrls.CURRENT_APPRECIATION_RESPONSE),
						views: views(undefined, single(partialUrls.CURRENT_APPRECIATION_RESPONSE, 'SingleCurrentController')),
						single: contentTypes.CURRENT,
						authentication: true
					})*/
					/*.state(states.CURRENT_CREATE_COMMENT, {
						title: 'reply',
						url: url(viewUrls.CURRENT_CREATE_COMMENT),
						views: views(info(partialUrls.CREATE_COMMENT, 'CreateCommentController'), single(partialUrls.CURRENT, 'SingleCurrentController')),
						single: contentTypes.CURRENT,
						authenticated: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					})*/
					.state(states.CURRENT_REPLIES, {
						title: 'replies',
						url: url(viewUrls.CURRENT_REPLIES),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.CURRENT_POSTINGS, {
						title: 'postings',
						url: url(viewUrls.CURRENT_POSTINGS),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.CURRENT_COMMENTS, {
						title: 'comments',
						url: url(viewUrls.CURRENT_COMMENTS),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.CURRENT_SELF_POSTINGS, {
						title: 'postings',
						url: url(viewUrls.CURRENT_SELF_POSTINGS),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.CURRENT_SELF_COMMENTS, {
						title: 'comments',
						url: url(viewUrls.CURRENT_SELF_COMMENTS),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					/*.state(states.CURRENT_ACTIVITY, {
						title: 'activity',
						url: url(viewUrls.CURRENT_ACTIVITY),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.ACTIVITY), pageLoader('ActivityByCurrentController')),
						single: contentTypes.CURRENT,
						authentication: true
					})*/
					.state(states.FEED, {
						title: 'feed',
						url: url(viewUrls.FEED),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.ACTIVITY), pageLoader('FeedController')),
						//views: views(undefined, single(undefined, 'SingleCurrentController'), page(partialUrls.ACTIVITY), pageLoader('FeedController')),
						views: views('FeedController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.NOTIFICATIONS, {
						title: 'notifications',
						url: url(viewUrls.NOTIFICATIONS),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.NOTIFICATION), pageLoader('NotificationsController')),
						//views: views(undefined, single(undefined, 'SingleCurrentController'), page(partialUrls.NOTIFICATION), pageLoader('NotificationsController')),
						views: views('NotificationsController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.MESSAGES, {
						title: 'messages',
						url: url(viewUrls.MESSAGES),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.CONVERSATION_PREVIEW), pageLoader('ConversationsController')),
						//views: views(undefined, single(undefined, 'SingleCurrentController'), page(partialUrls.CONVERSATION_PREVIEW), pageLoader('ConversationsController')),
						views: views('ConversationsController'),
						single: contentTypes.CURRENT,
						authentication: true,
						overrideRoles: [overrideRoles.UNACCEPTED]
					})/*
					.state(states.OFFERS, {
						title: 'offers',
						url: url(viewUrls.OFFERS),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.OFFER), pageLoader('OffersController')),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.OFFEES, {
						title: 'offees',
						url: url(viewUrls.OFFEES),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.OFFEE), pageLoader('OffeesController')),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.OFFEES_EMAIL, {
						title: 'offeesEmail',
						url: url(viewUrls.OFFEES_EMAIL),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.OFFEE_EMAIL), pageLoader('OffeesEmailController')),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.BACKERS, {
						title: 'backers',
						url: url(viewUrls.BACKERS),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.BACKER), pageLoader('BackersController')),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.BACKEES, {
						title: 'backees',
						url: url(viewUrls.BACKEES),
						views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.BACKEE), pageLoader('BackeesController')),
						single: contentTypes.CURRENT,
						authentication: true
					})*/
					.state(states.FOLLOWERS, {
						title: 'followers',
						url: url(viewUrls.FOLLOWERS),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.FOLLOWER), pageLoader('FollowersController')),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.FOLLOWEES, {
						title: 'followees',
						url: url(viewUrls.FOLLOWEES),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.FOLLOWEE), pageLoader('FolloweesController')),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					})
					.state(states.BLOCKED, {
						title: 'blocked',
						url: url(viewUrls.BLOCKED),
						//views: views(undefined, single(partialUrls.CURRENT, 'SingleCurrentController'), page(partialUrls.BLOCKED), pageLoader('BlockedController')),
						views: views('SingleCurrentController'),
						single: contentTypes.CURRENT,
						authentication: true
					});
				
				$locationProvider.html5Mode(true);
			}
		]);
	}
);