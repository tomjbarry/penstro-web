define(['js/constants/states'], function(states) {
	
	return {
		content: [
			{
				label: 'shared:postings',
				state: states.POSTINGS,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:tags',
				state: states.TAGS,
				icon: 'fa-tags'
			},
			{
				label: 'shared:users',
				state: states.USERS,
				icon: 'fa-users'
			},
			{
				label: 'shared:comments',
				state: states.COMMENTS,
				icon: 'fa-comments'
			}
		],
		tag: [
			{
				label: 'shared:taggedPostings',
				state: states.TAGS_ID,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:replies',
				state: states.TAGS_ID_REPLIES,
				icon: 'fa-at'
			}
		],
		user: [
			{
				label: 'shared:activity',
				state: states.USERS_ID,
				icon: 'fa-star'
			},
			{
				label: 'shared:replies',
				state: states.USERS_ID_REPLIES,
				icon: 'fa-at'
			},
			{
				label: 'shared:followees',
				state: states.USERS_ID_FOLLOWEES,
				icon: 'fa-binoculars'
			},
			{
				label: 'shared:followers',
				state: states.USERS_ID_FOLLOWERS,
				icon: 'fa-child'
			},
			{
				label: 'shared:authoredPostings',
				state: states.USERS_ID_POSTINGS,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:authoredComments',
				state: states.USERS_ID_COMMENTS,
				icon: 'fa-comments'
			}
		],
		current: [
			{
				label: 'shared:activity',
				state: states.CURRENT,
				icon: 'fa-star'
			},
			{
				label: 'shared:replies',
				state: states.CURRENT_REPLIES,
				icon: 'fa-at'
			},
			{
				label: 'shared:followees',
				state: states.FOLLOWEES,
				icon: 'fa-binoculars'
			},
			{
				label: 'shared:followers',
				state: states.FOLLOWERS,
				icon: 'fa-child'
			},
			{
				label: 'shared:authoredPostings',
				state: states.CURRENT_POSTINGS,
				icon: 'fa-newspaper-o'
			},
			{
				label: 'shared:authoredComments',
				state: states.CURRENT_COMMENTS,
				icon: 'fa-comments'
			},
			{
				label: 'shared:blocked',
				state: states.BLOCKED,
				icon: 'fa-gavel'
			}
			/*,
			{
				label: 'shared:backers',
				state: states.BACKERS,
				icon: 'fa-bank'
			},
			{
				label: 'shared:offers',
				state: states.OFFERS,
				icon: 'fa-bank'
			},
			{
				label: 'shared:backees',
				state: states.BACKEES,
				icon: 'fa-gift'
			},
			{
				label: 'shared:offees',
				state: states.OFFEES,
				icon: 'fa-gift'
			},
			{
				label: 'shared:emailOffees',
				state: states.OFFEES_EMAIL,
				icon: 'fa-gift'
			}*/
		]
	};
});