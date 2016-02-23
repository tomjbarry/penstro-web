define(['js/util/utils', 'server_util/event-utils', 'server_util/markdown-converter', 'server_util/meta-data'],
        function(utils, eventUtils, markdownConverter, metaData) {
	return {
		utils: utils,
		eventUtils: eventUtils,
		markdownConverter: markdownConverter,
		metaData: metaData
	};
});