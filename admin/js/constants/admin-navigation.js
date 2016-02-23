define(['admin-js/constants/admin-states'], function(adminStates) {
	return {
		user: [
			{
				label: 'shared:activity',
				state: adminStates.USERS_ID,
				icon: 'fa-star'
			},
			{
				label: 'shared:replies',
				state: adminStates.USERS_ID__REPLIES,
				icon: 'fa-at'
			},
			{
				label: 'shared:followees',
				state: adminStates.USERS_ID_FOLLOWEES,
				icon: 'fa-binoculars'
			},
			{
				label: 'shared:followers',
				state: adminStates.USERS_ID_FOLLOWERS,
				icon: 'fa-child'
			},
			{
				label: 'shared:authoredPostings',
				state: adminStates.USERS_ID_POSTINGS,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:authoredComments',
				state: adminStates.USERS_ID_COMMENTS,
				icon: 'fa-comments'
			},
			{
				label: 'shared:notifications',
				state: adminStates.USERS_ID_NOTIFICATIONS,
				icon: 'fa-bell'
			},
			{
				label: 'shared:feed',
				state: adminStates.USERS_ID_FEED,
				icon: 'fa-bookmark'
			},
			{
				label: 'shared:blocked',
				state: adminStates.USERS_ID_BLOCKED,
				icon: 'fa-gavel'
			}
			/*,
			{
				label: 'shared:backers',
				state: adminStates.USERS_ID_BACKERS,
				icon: 'fa-bank'
			},
			{
				label: 'shared:offers',
				state: adminStates.USERS_ID_OFFERS,
				icon: 'fa-bank'
			},
			{
				label: 'shared:backees',
				state: adminStates.USERS_ID_BACKEES,
				icon: 'fa-gift'
			},
			{
				label: 'shared:offees',
				state: adminStates.USERS_ID_OFFEES,
				icon: 'fa-gift'
			},
			{
				label: 'shared:emailOffees',
				state: adminStates.USERS_ID_OFFEES_EMAIL,
				icon: 'fa-gift'
			}*/
		],
		tag: [
			{
				label: 'shared:taggedPostings',
				state: adminStates.TAGS_ID,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:replies',
				state: adminStates.TAGS_ID_REPLIES,
				icon: 'fa-at'
			}
		],
		restricted: [
			{
				label: 'shared:restrictedUsernames',
				state: adminStates.RESTRICTED_USERNAMES,
				icon: 'fa-at'
			},
			{
				label: 'shared:restrictedPasswords',
				state: adminStates.RESTRICTED_PASSWORDS,
				icon: 'fa-asterisk'
			},
			{
				label: 'shared:restrictedEmails',
				state: adminStates.RESTRICTED_EMAILS,
				icon: 'fa-laptop'
			}
		],
		flagged: [
			{
				label: 'shared:flaggedUsers',
				state: adminStates.FLAGGED_USERS,
				icon: 'fa-users'
			},
			{
				label: 'shared:flaggedPostings',
				state: adminStates.FLAGGED_POSTINGS,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:flaggedComments',
				state: adminStates.FLAGGED_COMMENTS,
				icon: 'fa-comments'
			}
		]
	};
});