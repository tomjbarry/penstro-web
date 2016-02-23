define(['js/constants/view-urls',
        'js/constants/partial-urls',
        'js/constants/help-topics',
        'admin-js/constants/admin-view-urls',
        'admin-js/constants/admin-partial-urls',
        'controllers/home',
        'controllers/comments',
        'controllers/postings',
        'controllers/tags',
        'controllers/users',
        'controllers/js-content',
        'server_util/partial'],
        function(views, partials, helpTopics, adminViews, adminPartials,
				homeController,
				commentsController,
				postingsController,
				tagsController,
				usersController,
				jsContentController,
				partial) {
	return function(app, adminMode) {
		// views
		// home
		app.route(views.INDEX).get(homeController.index);
		app.route(views.NOT_FOUND).get(jsContentController.jsc);
		app.route(views.LOGGED_OUT).get(jsContentController.jsc);
		app.route(views.NO_CONTENT).get(homeController.noContent);
		
		if(adminMode) {
			app.route(adminViews.ALL_EXPRESS).get(jsContentController.jsc);
		}
		
		app.route(views.WELCOME).get(homeController.welcome);
		app.route(views.ACCOUNT).get(jsContentController.jsc);
		app.route(views.TERMS).get(homeController.terms);
		app.route(views.EXTERNAL_URL).get(homeController.externalUrl);
		app.route(views.CAREERS).get(homeController.careers);
		app.route(views.SUPPORT).get(homeController.support);
		app.route(views.HELP).get(homeController.help);
		app.route(views.DELETED).get(jsContentController.jsc);
		app.route(views.SETTINGS).get(homeController.settings);
		app.route(views.SETTINGS_ERROR).get(jsContentController.jsc);
		app.route(views.RESET_PASSWORD).get(jsContentController.jsc);
		
		// email token links
		app.route(views.EMAIL_CHANGE).get(jsContentController.jsc);
		app.route(views.PAYMENT_CHANGE).get(jsContentController.jsc);
		app.route(views.PASSWORD_CHANGE).get(jsContentController.jsc);
		app.route(views.CONFIRMATION).get(jsContentController.jsc);
		app.route(views.DELETION).get(jsContentController.jsc);
		
		// current
		app.route(views.CURRENT).get(jsContentController.jsc);
		//app.route(views.CURRENT_APPRECIATION_RESPONSE).get(jsContentController.jsc);
		//app.route(views.CURRENT_CREATE_COMMENT).get(jsContentController.jsc);
		app.route(views.CURRENT_REPLIES).get(jsContentController.jsc);
		app.route(views.CURRENT_POSTINGS).get(jsContentController.jsc);
		app.route(views.CURRENT_COMMENTS).get(jsContentController.jsc);
		app.route(views.CURRENT_SELF_POSTINGS).get(jsContentController.jsc);
		app.route(views.CURRENT_SELF_COMMENTS).get(jsContentController.jsc);
		// (default) app.route(views.CURRENT_ACTIVITY).get(jsContentController.jsc);
		app.route(views.FEED).get(jsContentController.jsc);
		app.route(views.NOTIFICATIONS).get(jsContentController.jsc);
		app.route(views.MESSAGES).get(jsContentController.jsc);
		/*
		app.route(views.OFFERS).get(jsContentController.jsc);
		app.route(views.OFFEES).get(jsContentController.jsc);
		app.route(views.OFFEES_EMAIL).get(jsContentController.jsc);
		app.route(views.BACKERS).get(jsContentController.jsc);
		app.route(views.BACKEES).get(jsContentController.jsc);
		*/
		app.route(views.FOLLOWEES).get(jsContentController.jsc);
		app.route(views.FOLLOWERS).get(jsContentController.jsc);
		app.route(views.BLOCKED).get(jsContentController.jsc);
		
		// postings
		app.route(views.POSTINGS).get(postingsController.postings);
		app.route(views.POSTINGS_CREATE).get(jsContentController.jsc);
		app.route(views.POSTINGS_ID).get(postingsController.postingReplies);
		app.route(views.POSTINGS_ID_TITLE).get(postingsController.postingReplies);
		//app.route(views.POSTINGS_ID_CREATE_COMMENT).get(jsContentController.jsc);
		// app.route(views.POSTINGS_ID_EDIT).get(jsContentController.jsc);
		// (default) app.route(views.POSTINGS_ID_REPLIES).get(postingsController.posting);
		
		// comments
		app.route(views.COMMENTS).get(commentsController.comments);
		app.route(views.COMMENTS_ID).get(commentsController.commentReplies);
		//app.route(views.COMMENTS_ID_CREATE_COMMENT).get(jsContentController.jsc);
		// (default) app.route(views.COMMENTS_ID_REPLIES).get(commentsController.comment);

		// tags
		app.route(views.TAGS).get(tagsController.tags);
		app.route(views.TAGS_ID).get(tagsController.tagPostings);
		//app.route(views.TAGS_ID_CREATE_COMMENT).get(jsContentController.jsc);
		
		// TODO: fix these
		//app.route(views.TAGS_ID_REPLIES).get(tagsController.tag);
		//app.route(views.TAGS_ID_POSTINGS).get(tagsController.tagPostings);
		app.route(views.TAGS_ID_REPLIES).get(tagsController.tagReplies);
		// (default) app.route(views.TAGS_ID_POSTINGS).get(jsContentController.jsc);

		// users
		app.route(views.USERS).get(usersController.users);
		app.route(views.USERS_ID).get(usersController.userActivity);
		//app.route(views.USERS_ID_APPRECIATION_RESPONSE).get(jsContentController.jsc);
		//app.route(views.USERS_ID_CREATE_COMMENT).get(jsContentController.jsc);
		app.route(views.USERS_ID_REPLIES).get(usersController.userReplies);
		// (default) app.route(views.USERS_ID_ACTIVITY).get(usersController.userActivity);
		app.route(views.USERS_ID_FOLLOWEES).get(usersController.userFollowees);
		app.route(views.USERS_ID_FOLLOWERS).get(usersController.userFollowers);
		app.route(views.USERS_ID_POSTINGS).get(usersController.userPostings);
		app.route(views.USERS_ID_COMMENTS).get(usersController.userComments);
		app.route(views.USERS_ID_MESSAGES).get(jsContentController.jsc);
		
		// PARTIALS
		
		// info
		app.route(partials.LOGGED_OUT).get(partial.info('loggedOut'));
		app.route(partials.NOT_FOUND).get(partial.info('notFound'));
		app.route(partials.REDIRECTING).get(partial.info('redirecting'));
		app.route(partials.DELETED).get(partial.info('deleted'));
		app.route(partials.RESET_PASSWORD).get(partial.info('resetPassword'));
		app.route(partials.CREATE_POSTING).get(partial.info('createPosting'));
		//app.route(partials.EDIT_POSTING).get(partial.info('editPosting'));
		//app.route(partials.CREATE_COMMENT).get(partial.info('createComment'));
		//app.route(partials.CREATE_OFFER).get(partial.info('createOffer'));
		app.route(partials.CREATE_MESSAGE).get(partial.info('createMessage'));
		app.route(partials.EMAIL_CHANGE).get(partial.info('emailChange'));
		app.route(partials.PASSWORD_CHANGE_UNAUTHED).get(partial.info('passwordChangeUnauthed'));
		app.route(partials.PAYMENT_CHANGE).get(partial.info('paymentChange'));
		//app.route(partials.OFFEE_SELECT).get(partial.info('offeeSelect'));
		//app.route(partials.TAGS_SEARCH).get(partial.info('searchTags'));
		//app.route(partials.USERS_SEARCH).get(partial.info('searchUsers'));
		//app.route(partials.USERS_MESSAGE).get(partial.info('messageUsers'));
		app.route(partials.SETTINGS).get(partial.info('settings'));
		app.route(partials.TERMS).get(partial.info('terms'));
		app.route(partials.EXTERNAL_URL).get(partial.info('externalUrl'));
		
		app.route(partials.WELCOME).get(partial.info('welcome'));
		app.route(partials.ACCOUNT).get(partial.info('account'));
		app.route(partials.CAREERS).get(partial.info('careers'));
		app.route(partials.SUPPORT).get(partial.info('support'));
		app.route(partials.HELP).get(partial.info('help'));
		
		// page
		/*
		app.route(partials.BACKEE).get(partial.page('backee'));
		app.route(partials.BACKER).get(partial.page('backer'));
		*/
		/*
		app.route(partials.OFFEE).get(partial.page('offee'));
		app.route(partials.OFFEE_EMAIL).get(partial.page('offeeEmail'));
		app.route(partials.OFFER).get(partial.page('offer'));
		*/
		/*
		app.route(partials.ACTIVITY).get(partial.page('activity'));
		app.route(partials.BLOCKED).get(partial.page('blockedInfo'));
		app.route(partials.COMMENT_PREVIEW).get(partial.page('commentPreview'));
		app.route(partials.COMMENT_VIEW).get(partial.page('commentView'));
		app.route(partials.CONVERSATION_PREVIEW).get(partial.page('conversationPreview'));
		app.route(partials.FOLLOWEE).get(partial.page('followee'));
		app.route(partials.FOLLOWER).get(partial.page('followInfo'));
		app.route(partials.MESSAGE).get(partial.page('message'));
		app.route(partials.NOTIFICATION).get(partial.page('notification'));
		app.route(partials.POSTING_PREVIEW).get(partial.page('postingPreview'));
		app.route(partials.TAG_PREVIEW).get(partial.page('tagPreview'));
		app.route(partials.USER_PREVIEW).get(partial.page('userPreview'));
		
		// single
		app.route(partials.CURRENT).get(partial.single('current'));
		app.route(partials.CURRENT_APPRECIATION_RESPONSE).get(partial.single('currentAppreciationResponse'));
		app.route(partials.COMMENT).get(partial.single('comment'));
		app.route(partials.POSTING).get(partial.single('posting'));
		app.route(partials.TAG).get(partial.single('tag'));
		app.route(partials.USER).get(partial.single('user'));
		app.route(partials.USER_APPRECIATION_RESPONSE).get(partial.single('userAppreciationResponse'));
		*/
		
		// help views and partials
		for(var topic in helpTopics) {
			if(helpTopics.hasOwnProperty(topic)) {
				app.route(views.HELP + '/' + helpTopics[topic].name).get(homeController.helpTopic(helpTopics[topic].name));
				app.route(partials.HELP + '/' + helpTopics[topic].name).get(partial.help(helpTopics[topic].name));
			}
		}
		
		if(adminMode) {
			app.route(adminPartials.RESTRICTED_ADD).get(partial.admin.info('addRestricted'));
			/*
			app.route(adminPartials.POSTING).get(partial.admin.single('posting'));
			app.route(adminPartials.USER).get(partial.admin.single('user'));
			app.route(adminPartials.COMMENT).get(partial.admin.single('comment'));
			
			app.route(adminPartials.FOLLOWER).get(partial.admin.page('follower'));
			app.route(adminPartials.FOLLOWEE).get(partial.admin.page('followee'));
			app.route(adminPartials.BLOCKED).get(partial.admin.page('blocked'));
			app.route(adminPartials.OFFER).get(partial.admin.page('offer'));
			app.route(adminPartials.OFFEE).get(partial.admin.page('offee'));
			app.route(adminPartials.OFFEE_EMAIL).get(partial.admin.page('offeeEmail'));
			app.route(adminPartials.BACKER).get(partial.admin.page('backer'));
			app.route(adminPartials.BACKEE).get(partial.admin.page('backee'));
			
			app.route(adminPartials.RESTRICTED).get(partial.admin.page('restricted'));
			
			app.route(adminPartials.FLAGGED).get(partial.admin.page('flagged'));
			*/
		}
		
	};
});