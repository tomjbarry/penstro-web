define([], function() {
	
	return {
		USERNAME_STRING: '[A-Za-z0-9_]*',
		TAG_STRING: '[A-Za-z0-9_]*',
		TITLE: /[^a-z0-9]+/g,
		EMAIL: /\S+@\S+\.\S+/,
		TAGS_DELIMITER_STRING: ' ',
		ROLES_DELIMITER_STRING: ' ',
		PENDING_ACTIONS_DELIMITER_STRING: ' ',
		PAYKEY_COOKIE_DELIMITER: ':',
		PAYKEY_COOKIE_DATA_DELIMITER: '+',
		
		ALIGN_CENTER_START_STRING: 'tacs',
		ALIGN_LEFT_START_STRING: 'tals',
		ALIGN_RIGHT_START_STRING: 'tars',
		ALIGN_JUSTIFY_START_STRING: 'tajs',
		ALIGN_END_STRING: 'tae',
		
		FONT_SIZE_XSMALL_START_STRING: 'tsxss',
		FONT_SIZE_SMALL_START_STRING: 'tsss',
		FONT_SIZE_MEDIUM_START_STRING: 'tsmds',
		FONT_SIZE_LARGE_START_STRING: 'tslgs',
		FONT_SIZE_XLARGE_START_STRING: 'tsxls',
		FONT_SIZE_END_STRING: 'tse',
		
		FONT_COLOR_RED_START_STRING: 'fcrs',
		FONT_COLOR_GREEN_START_STRING: 'fcgs',
		FONT_COLOR_BLUE_START_STRING: 'fcbs',
		FONT_COLOR_CYAN_START_STRING: 'fccs',
		FONT_COLOR_MAGENTA_START_STRING: 'fcms',
		FONT_COLOR_YELLOW_START_STRING: 'fcys',
		FONT_COLOR_END_STRING: 'fce'
	};
});