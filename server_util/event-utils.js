define(['js/util/utils', 'js/constants/view-urls', 'js/constants/path-variables'],
        function(utils, viewUrls, pathVars) {
	var links = {
		ANY: viewUrls.INDEX,
		POSTING: viewUrls.POSTINGS_ID,
		COMMENT: viewUrls.COMMENTS_ID,
		COMMENT_SUB: viewUrls.COMMENTS_ID,
		MESSAGE: viewUrls.CONVERSATION,
		APPRECIATION_POSTING: viewUrls.POSTINGS_ID,
		APPRECIATION_COMMENT: viewUrls.COMMENTS_ID,
		PROMOTION_POSTING: viewUrls.POSTINGS_ID,
		PROMOTION_COMMENT: viewUrls.COMMENTS_ID,
		OFFER: viewUrls.OFFERS,
		OFFER_ACCEPT: viewUrls.USERS_ID,
		OFFER_WITHDRAW: viewUrls.USERS_ID,
		OFFER_DENY: viewUrls.USERS_ID,
		BACKING_CANCEL: viewUrls.USERS_ID,
		BACKING_WITHDRAW: viewUrls.USERS_ID,
		FOLLOW_ADD: viewUrls.USERS_ID,
		FOLLOW_REMOVE: viewUrls.USERS_ID
	};
	return {
		constructEventLink: function(event) {
			var targetIds = event.targetIds;
			if(typeof(targetIds) === 'undefined') {
				return links.ANY;
			}
			if(typeof(targetIds[pathVars.USER]) === 'undefined') {
				targetIds[pathVars.USER] = targetIds[pathVars.TARGET];
			}
			
			return utils.formatUrl(links[event.type], targetIds);
		},
		constructEventTitle: function(event, i18n) {
			var targets = event.targets;
			
			if(targets.type === 'POSTING') {
				targets.typeRenamed = i18n('shared:typeRenamed.posting');
			} else if(targets.type === 'USER') {
				targets.typeRenamed = i18n('shared:typeRenamed.user');
			} else if(targets.type === 'TAG') {
				targets.typeRenamed = i18n('shared:typeRenamed.tag');
			}
			
			return i18n('shared:activityTypes.' + event.type, targets);
			
		}
	};
});