define([], function() {
	// these are visible in the url
	return {
		ACCOUNT: {
			name: 'account',
			//overview: 'overview',
			sections: {
				REGISTER: 'register',
				LOGIN: 'login',
				USERNAME: 'username',
				EMAIL: 'email',
				PASSWORD: 'password',
				LOCKED: 'locked',
				IDLE: 'idle',
				THEFT: 'theft',
				DELETED: 'deleted',
				WARNING: 'warning',
				COMMENTS_DISABLED: 'commentsDisabled',
				PROMOTE_DISABLED: 'promoteDisabled',
				CACHE_DELAY: 'cacheDelay'
			}
		},
		CURRENT: {
			name: 'profile',
			//overview: 'overview',
			sections: {
				DESCRIPTION: 'description',
				APPRECIATION_RESPONSE: 'appreciationResponse',
				WARNING: 'warning'
				//,
				//BACKERS: 'backers'
			}
		},
		PAYMENT: {
			name: 'payment',
			sections: {
				COINS: 'coins',
				PROMOTION: 'promotion',
				APPRECIATION: 'appreciation',
				PAYMENT: 'payment',
				PROCESSING: 'processing'
			}
		},
		EDITOR: {
			name: 'editor',
			sections: {
				PREVIEW: 'preview',
				USER: 'user',
				TAG: 'tag',
				LINK: 'link',
				IMAGE: 'image',
				SECURE_IMAGE: 'secureImage'
			}
		},
		
		POSTINGS: {
			name: 'posts',
			//overview: 'overview',
			sections: {
				CREATE: 'create',
				EDIT: 'edit',
				TITLE: 'title',
				TAGS: 'tags',
				//BACKER: 'backer',
				WARNING: 'warning',
				PROMOTE: 'promote',
				APPRECIATE: 'appreciate',
				IMAGE: 'image',
				PREVIEW: 'preview',
				FLAG: 'flag'
			}
		},
		COMMENTS: {
			name: 'comments',
			//overview: 'overview',
			sections: {
				CREATE: 'reply',
				//BACKER: 'backer',
				WARNING: 'warning',
				PROMOTE: 'promote',
				APPRECIATE: 'appreciate',
				FLAG: 'flag'
			}
		},
		TAGS: {
			name: 'tags',
			//overview: 'overview',
			sections: {
				CREATE: 'tag',
				POSTINGS: 'postings',
				PROMOTE: 'promote'
			}
		},
		USERS: {
			name: 'users',
			//overview: 'overview',
			sections: {
				APPRECIATION_RESPONSE: 'appreciationResponse',
				MESSAGE: 'message',
				MESSAGE_FLAG: 'messageFlag',
				ACTIVITY: 'activity',
				FOLLOW: 'follow',
				//BACK: 'back',
				FLAG: 'flag'
			}
		}
	};
});