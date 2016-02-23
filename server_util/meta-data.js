define(['js/util/utils', 'js/constants/webapp', 'js/constants/img-urls', 'js/constants/values'], function(utils, webapp, imgUrls, values) {
	
	var keywordDelim = ', ';
	
	var tagify = utils.tagify;
	
	var getOpenGraph = function() {
		var ob = {
			t: {
				description: 'app.description'
			},
			p: {
				image: webapp.URL + imgUrls.OPEN_GRAPH
			}
		};
		ob.p['image '] = {
			width: values.OG_IMAGE_WIDTH,
			height: values.OG_IMAGE_HEIGHT	
		};
		return ob;
	};
	var getD = function() {
		return {
			t: {
				keywords: 'app.keywords'
			},
			p: {}
		};
	};
	
	var combineProperties = function(d, ob) {
		if(typeof(ob) === 'undefined') {
			return d;
		}
		var key;
		var t = ob.t;
		if(typeof(t) !== 'undefined') {
			for(key in t) {
				if(t.hasOwnProperty(key)) {
					d.t[key] = t[key];
				}
			}
		}
		var p = ob.p;
		if(typeof(p) !== 'undefined') {
			for(key in p) {
				if(p.hasOwnProperty(key)) {
					d.p[key] = p[key];
					delete d.t[key];
				}
			}
		}
		return d;
	};
	
	return {
		posting: function(p) {
			var tags = p.tags;
			if(typeof(tags) === 'undefined') {
				tags = [];
			}
			if(typeof(p) === 'undefined' || typeof(p.author) === 'undefined' || typeof(p.created) === 'undefined' || typeof(p.tally) === 'undefined') {
				return {};
			}
			var data = {
				openGraph: {
					t: {
						description: [{value: p.tally.appreciation, title: p.title, author: p.author.username, tags: tagify(tags), created: utils.getCalendarDate(p.created)}, 'openGraph.posting.description']
					},
					p: {
						type: 'article'
					}
				},
				d: {
					p: {
						article: {
							author: p.author.username,
							tag: p.tags,
							published_time: (new Date(p.created)).toISOString()
						},
						keywords: tags.join(keywordDelim)
					}
				}
			};
			if(typeof(p.imageLink) !== 'undefined') {
				data.openGraph.p.image = p.imageLink;
				var i = {};
				if(typeof(p.imageHeight) !== 'undefined') {
					i.height = p.imageHeight;
				}
				if(typeof(p.imageWidth) !== 'undefined') {
					i.width = p.imageWidth;
				}
				if(typeof(p.imageHeight) !== 'undefined' && typeof(p.imageWidth) !== 'undefined') {
					// "image " gets trimmed down
					data.openGraph.p['image '] = i;
				}
			}
			if(typeof(p.preview) !== 'undefined') {
				data.openGraph.t.description = p.preview;
			}
			return data;
		},
		comment: function(c) {
			if(typeof(c) === 'undefined' || typeof(c.author) === 'undefined' || typeof(c.created) === 'undefined' || typeof(c.tally) === 'undefined') {
				return {};
			}
			return {
				openGraph: {
					t: {
						description: [{value: c.tally.appreciation, author: c.author.username, created: utils.getCalendarDate(c.created)}, 'openGraph.comment.description']
					}
				}
			};
		},
		tag: function(t) {
			if(typeof(t) === 'undefined' || typeof(t.appreciation) === 'undefined' || typeof(t.name) === 'undefined') {
				return {};
			}
			return {
				openGraph: {
					t: {
						description: [{value: t.appreciation, tag: t.name}, 'openGraph.tag.description']
					}
				}
			};
		},
		user: function(u) {
			if(typeof(u) === 'undefined' || typeof(u.username) === 'undefined' || typeof(u.appreciation) === 'undefined' || u.contributedPostings === 'undefined') {
				return {};
			}
			return {
				openGraph: {
					t: {
						description: [{value: u.appreciation, postingsCount: u.contributedPostings}, 'openGraph.user.description']
					},
					p: {
						type: 'profile'
					}
				},
				d: {
					p: {
						profile: {
							username: u.username.username
						}
					}
				}
			};
		},
		generateMetaOpenGraph: function(ob) {
			if(typeof(ob) === 'undefined') {
				ob = {};
			}
			
			return combineProperties(getOpenGraph(), ob.openGraph);
		},
		generateMetaProperties: function(ob) {
			if(typeof(ob) === 'undefined') {
				ob = {};
			}
			return combineProperties(getD(), ob.d);
		}
	};
});