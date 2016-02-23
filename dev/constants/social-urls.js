define([], function() {
	
	var TITLE = '[TITLE]';
	var URL = '[URL]';
	var ALT_URL = '[ALT_URL]';
	var DESCRIPTION = '[DESCRIPTION]';
	var SOURCE = '[SOURCE]';
	var MEDIA = '[MEDIA]';
	
	var ABOUT = '[ABOUT]';
	
	return {
		TWITTER: 'https://twitter.com/intent/tweet?status=' + TITLE + '+' + URL,
		PINTEREST: 'https://pinterest.com/pin/create/bookmarklet/?media=' + MEDIA + '&url=' + URL + '&is_video=false&description=' + TITLE,
		FACEBOOK: 'https://www.facebook.com/sharer/sharer.php?u=' + URL + '&title=' + TITLE,
		GOOGLE_PLUS: 'https://plus.google.com/share?url=' + URL,
		REDDIT: 'https://www.reddit.com/submit?url=' + URL + '&title=' + TITLE,
		DELICIOUS: 'https://del.icio.us/post?url=' + URL + '&title=' + TITLE + '&notes=' + DESCRIPTION,
		STUMBLE_UPON: 'https://www.stumbleupon.com/submit?url=' + URL + '&title=' + TITLE,
		LINKEDIN: 'https://www.linkedin.com/shareArticle?mini=true&url=' + URL + '&title=' + TITLE + '&source=' + SOURCE,
		SLASHDOT: 'https://slashdot.org/bookmark.pl?url=' + URL + '&title=' + TITLE,
		TUMBLR: 'https://www.tumblr.com/share?v=3&u=' + URL + '&t=' + TITLE,
		TECHNORATI: 'https://technorati.com/faves?add=' + URL + '&title=' + TITLE,
		POSTEROUS: 'https://posterous.com/share?linkto=' + URL,
		GOOGLE_BOOKMARKS: 'https://www.google.com/bookmarks/mark?op=edit&bkmk=' + URL + '&title=' + TITLE + '&annotation=' + DESCRIPTION,
		NEWSVINE: 'https://www.newsvine.com/_tools/seed&save?u=' + URL + '&h=' + TITLE,
		PING_FM: 'https://ping.fm/ref/?link=' + URL + '&title=' + TITLE + '&body=' + DESCRIPTION,
		EVERNOTE: 'https://www.evernote.com/clip.action?url=' + URL + '&title=' + TITLE,
		FRIEND_FEED: 'https://www.friendfeed.com/share?url=' + URL + '&title=' + TITLE,
		constants: {
			TITLE: TITLE,
			URL: URL,
			ALT_URL: ALT_URL,
			DESCRIPTION: DESCRIPTION,
			SOURCE: SOURCE,
			MEDIA: MEDIA,
			ABOUT: ABOUT
		}
	};
});