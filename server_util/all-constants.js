define(['js/constants/api-urls',
        'js/constants/api',
        'js/constants/cache-times',
        'js/constants/chained-keys',
        'js/constants/comment-types',
        'js/constants/content-types',
        'js/constants/cookies',
        'js/constants/defaults',
        'js/constants/events',
        'js/constants/forms',
        'js/constants/help-topics',
        'js/constants/img-urls',
        'js/constants/language-settings',
        'js/constants/model-attributes',
        'js/constants/navigation',
        'js/constants/params',
        'js/constants/param-values',
        'js/constants/partials',
        'js/constants/partial-urls',
        'js/constants/path-variables',
        'js/constants/premade-links',
        'js/constants/regexes',
        'js/constants/resources',
        'js/constants/response-codes',
        'js/constants/rich-snippets',
        'js/constants/roles',
        'js/constants/scope-variables',
        'js/constants/social-urls',
        'js/constants/states',
        'js/constants/terms-sections',
        'js/constants/time-values',
        'js/constants/tour-states',
        'js/constants/values',
        'js/constants/view-ids',
        'js/constants/view-urls',
        'js/constants/webapp',
        'js/constants/whitelist-urls'],
        function(apiUrls,
					api,
					cacheTimes,
					chainedKeys,
					commentTypes,
					contentTypes,
					cookies,
					defaults,
					events,
					forms,
					helpTopics,
					imgUrls,
					languageSettings,
					modelAttributes,
					navigation,
					params,
					paramValues,
					partials,
					partialUrls,
					pathVariables,
					premadeLinks,
					regexes,
					resources,
					responseCodes,
					richSnippets,
					roles,
					scopeVariables,
					socialUrls,
					states,
					termsSections,
					timeValues,
					tourStates,
					values,
					viewIds,
					viewUrls,
					webapp,
					whitelistUrls) {
	return {
		apiUrls: apiUrls,
		api: api,
		cacheTimes: cacheTimes,
		chainedKeys: chainedKeys,
		commentTypes: commentTypes,
		contentTypes: contentTypes,
		cookies: cookies,
		defaults: defaults,
		events: events,
		forms: forms,
		helpTopics: helpTopics,
		imgUrls: imgUrls,
		languageSettings: languageSettings,
		modelAttributes: modelAttributes,
		navigation: navigation,
		params: params,
		paramValues: paramValues,
		partials: partials,
		partialUrls: partialUrls,
		pathVariables: pathVariables,
		premadeLinks: premadeLinks,
		regexes: regexes,
		resources: resources,
		responseCodes: responseCodes,
		richSnippets: richSnippets,
		roles: roles,
		scopeVariables: scopeVariables,
		socialUrls: socialUrls,
		states: states,
		termsSections: termsSections,
		timeValues: timeValues,
		tourStates: tourStates,
		values: values,
		viewIds: viewIds,
		viewUrls: viewUrls,
		webapp: webapp,
		whitelistUrls: whitelistUrls
	};
});