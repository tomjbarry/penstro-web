define(['admin-js/module', 'jquery', 'js/util/route-utils', 'admin-js/constants/admin-view-urls', 'js/constants/partial-urls',
        'admin-js/constants/admin-partial-urls', 'admin-js/constants/admin-states', 'js/constants/content-types', 'js/constants/roles'],
	function(module, $, routeUtils, adminViewUrls, partialUrls, adminPartialUrls, adminStates, contentTypes, roles) {
		'use strict';
		return module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
			function($stateProvider, $urlRouterProvider, $locationProvider) {
			
				var url = routeUtils.funcs.url;
			
				var views = routeUtils.funcs.views;
				var info = routeUtils.funcs.info;
				var single = routeUtils.funcs.single;
				var page = routeUtils.funcs.page;
				var pageLoader = routeUtils.funcs.pageLoader;
			
				var r = roles.roles;
				
				var infoController = routeUtils.controllers.info;
				
				$stateProvider
					.state(adminStates.RESTRICTED_USERNAMES, {
						title: 'restricted',
						url: url(adminViewUrls.RESTRICTED_USERNAMES),
						//views: views(info(adminPartialUrls.RESTRICTED_ADD, infoController), undefined, page(adminPartialUrls.RESTRICTED), pageLoader('RestrictedUsernamesController')),
						views: views('RestrictedUsernamesController'),
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.RESTRICTED_PASSWORDS, {
						title: 'restricted',
						url: url(adminViewUrls.RESTRICTED_PASSWORDS),
						//views: views(info(adminPartialUrls.RESTRICTED_ADD, infoController), undefined, page(adminPartialUrls.RESTRICTED), pageLoader('RestrictedPasswordsController')),
						views: views('RestrictedPasswordsController'),
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.RESTRICTED_EMAILS, {
						title: 'restricted',
						url: url(adminViewUrls.RESTRICTED_EMAILS),
						//views: views(info(adminPartialUrls.RESTRICTED_ADD, infoController), undefined, page(adminPartialUrls.RESTRICTED), pageLoader('RestrictedEmailsController')),
						views: views('RestrictedEmailsController'),
						authenticated: true,
						roles: [r.ADMIN]
					});
				
				$stateProvider
					.state(adminStates.FLAGGED_USERS, {
						title: 'flagged',
						url: url(adminViewUrls.FLAGGED_USERS),
						//views: views(undefined, undefined, page(adminPartialUrls.FLAGGED), pageLoader('FlaggedUsersController')),
						views: views('FlaggedUsersController'),
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.FLAGGED_POSTINGS, {
						title: 'flagged',
						url: url(adminViewUrls.FLAGGED_POSTINGS),
						//views: views(undefined, undefined, page(adminPartialUrls.FLAGGED), pageLoader('FlaggedPostingsController')),
						views: views('FlaggedPostingsController'),
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.FLAGGED_COMMENTS, {
						title: 'flagged',
						url: url(adminViewUrls.FLAGGED_COMMENTS),
						//views: views(undefined, undefined, page(adminPartialUrls.FLAGGED), pageLoader('FlaggedCommentsController')),
						views: views('FlaggedCommentsController'),
						authenticated: true,
						roles: [r.ADMIN]
					});
				
				$stateProvider
					.state(adminStates.POSTINGS_ID, {
						title: 'postings',
						url: url(adminViewUrls.POSTINGS_ID),
						//views: views(undefined, single(adminPartialUrls.POSTING, 'AdminSinglePostingController'), page(partialUrls.COMMENT_VIEW), pageLoader('PostingCommentsController')),
						views: views('AdminSinglePostingController'),
						authenticated: true,
						roles: [r.ADMIN]
					});
				
				$stateProvider
					.state(adminStates.COMMENTS_ID, {
						title: 'comments',
						url: url(adminViewUrls.COMMENTS_ID),
						//views: views(undefined, single(adminPartialUrls.COMMENT, 'AdminSingleCommentController'), page(partialUrls.COMMENT_VIEW), pageLoader('CommentCommentsController')),
						views: views('AdminSingleCommentController'),
						authenticated: true,
						roles: [r.ADMIN]
					});
				
				$stateProvider
					.state(adminStates.USERS_ID, {
						title: 'users',
						url: url(adminViewUrls.USERS_ID),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.ACTIVITY), pageLoader('AdminUserActivityController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_REPLIES, {
						title: 'users',
						url: url(adminViewUrls.USERS_ID_REPLIES),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.COMMENT_VIEW), pageLoader('AdminUserRepliesController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_FOLLOWERS, {
						title: 'followers',
						url: url(adminViewUrls.USERS_ID_FOLLOWERS),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.FOLLOWER), pageLoader('AdminUserFollowersController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_FOLLOWEES, {
						title: 'followees',
						url: url(adminViewUrls.USERS_ID_FOLLOWEES),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.FOLLOWEE), pageLoader('AdminUserFolloweesController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_POSTINGS, {
						title: 'postings',
						url: url(adminViewUrls.USERS_ID_POSTINGS),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.POSTING_PREVIEW), pageLoader('AdminUserPostingsController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_COMMENTS, {
						title: 'comments',
						url: url(adminViewUrls.USERS_ID_COMMENTS),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.COMMENT_PREVIEW), pageLoader('AdminUserCommentsController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_NOTIFICATIONS, {
						title: 'notifications',
						url: url(adminViewUrls.USERS_ID_NOTIFICATIONS),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.NOTIFICATION), pageLoader('AdminUserNotificationsController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_FEED, {
						title: 'feed',
						url: url(adminViewUrls.USERS_ID_FEED),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(partialUrls.ACTIVITY), pageLoader('AdminUserFeedController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_BLOCKED, {
						title: 'blocked',
						url: url(adminViewUrls.USERS_ID_BLOCKED),
						//views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.BLOCKED), pageLoader('AdminUserBlockedController')),
						views: views('AdminSingleUserController'),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					/*
					.state(adminStates.USERS_ID_OFFERS, {
						title: 'offers',
						url: url(adminViewUrls.USERS_ID_OFFERS),
						views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.OFFER), pageLoader('AdminUserOffersController')),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_OFFEES, {
						title: 'offees',
						url: url(adminViewUrls.USERS_ID_OFFEES),
						views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.OFFEE), pageLoader('AdminUserOffeesController')),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_OFFEES_EMAIL, {
						title: 'offeesEmail',
						url: url(adminViewUrls.USERS_ID_OFFEES_EMAIL),
						views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.OFFEE_EMAIL), pageLoader('AdminUserOffeesEmailController')),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_BACKERS, {
						title: 'backers',
						url: url(adminViewUrls.USERS_ID_BACKERS),
						views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.BACKER), pageLoader('AdminUserBackersController')),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					.state(adminStates.USERS_ID_BACKEES, {
						title: 'backees',
						url: url(adminViewUrls.USERS_ID_BACKEES),
						views: views(undefined, single(adminPartialUrls.USER, 'AdminSingleUserController'), page(adminPartialUrls.BACKEE), pageLoader('AdminUserBackeesController')),
						single: contentTypes.USER_A,
						authenticated: true,
						roles: [r.ADMIN]
					})
					*/
					;
			}
		]);
	}
);