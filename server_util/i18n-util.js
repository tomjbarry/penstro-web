define(['async', 'server_util/persist-util', 'js/util/utils', 'js/constants/language-settings'], function(async, persistUtil, utils, languageSettings) {
	var ob = {};
	var languagesHashes = {};
	var storedLanguages = {};
	var i18n;
	var i18nStamp;
	
	// based on i18next
	var fetch = function(lngs, ns, cb) {
		if(typeof(i18n) === 'undefined') {
			throw 'i18n is not defined!';
		}
		if(lngs.length === 0) {
			throw 'No languages specified!';
		}
		if(ns.length === 0) {
			throw 'No namespaces specified!';
		}
		var i, j, tasks = {};
		var makeFetch = function(l, n) {
			return function(callback) {
				i18n.sync.fetchOne(l, n, callback);
			};
		};
		for(i = 0; i < lngs.length; i++) {
			for(j = 0; j < ns.length; j++) {
				tasks[lngs[i] + ' ' + ns[j]] = makeFetch(lngs[i], ns[j]);
			}
		}
		async.series(tasks, function(err, results) {
			if(err) {
				cb(err);
			} else {
				var r = {};
				var s;
				for(var key in results) {
					if(results.hasOwnProperty(key)) {
						s = key.split(' ');
						if(typeof(r[s[0]]) === 'undefined') {
							r[s[0]] =  {};
						}
						r[s[0]][s[1]] = results[key];
					}
				}
				storedLanguages = r;
				cb(null, r);
			}
			
		});
	};
	
	ob.storeHashes = function(i) {
		// allow errors to propagate! should not start server if there are errors!
		i18n = i;
		var persistData = persistUtil.getData();
		var persistI18n = persistData.i18n;
		var save = false;
		var saveLang;
		fetch(languageSettings.INTERFACE_LANGUAGE_LIST, languageSettings.CLIENT_NAMESPACES, function(err, results) {
			if(err) {
				languagesHashes = {};
				return;
			}
			var languages = {};
			var hashes, l, h;
			for(var lang in results) {
				if(results.hasOwnProperty(lang)) {
					hashes = {};
					l = results[lang];
					saveLang = false;
					if(typeof(persistI18n) === 'undefined' || persistI18n[lang] === 'undefined') {
						saveLang = true;
					}
					for(var ns in l) {
						if(l.hasOwnProperty(ns)) {
							h = utils.getStringHash(JSON.stringify(l[ns]));
							hashes[ns] = h;
							if(!saveLang && persistI18n[lang][ns] !== h) {
								saveLang = true;
							}
						}
					}
					languages[lang] = hashes;
					if(saveLang) {
						save = true;
						languages[lang].i18nStamp = (new Date()).getTime();
					} else {
						languages[lang].i18nStamp = persistI18n[lang].i18nStamp;
					}
				}
			}
			languagesHashes = languages;
			if(save) {
				persistUtil.add('i18n', languagesHashes);
			}
		});
	};
	ob.getData = function() {
		var lang;
		if(typeof(i18n) !== 'undefined') {
			lang = i18n.lng();
		}
		if(typeof(languagesHashes) !== 'undefined' && typeof(lang) === 'string' && typeof(languagesHashes[lang]) !== 'undefined') {
			return {lng: lang, i18nStamp: languagesHashes[lang].i18nStamp};
		}
		return {};
	};
	
	return ob;
});